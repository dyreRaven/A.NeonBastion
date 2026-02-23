import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { setTimeout as delay } from "node:timers/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import net from "node:net";
import { WebSocket } from "ws";

const STARTUP_TIMEOUT_MS = 8000;
const MESSAGE_TIMEOUT_MS = 3000;

function getServerDir() {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  return resolve(currentDir, "..");
}

async function getFreePort() {
  return await new Promise((resolvePort, rejectPort) => {
    const probe = net.createServer();
    probe.unref();
    probe.once("error", rejectPort);
    probe.listen(0, "127.0.0.1", () => {
      const address = probe.address();
      const port = typeof address === "object" && address ? address.port : 0;
      probe.close((closeError) => {
        if (closeError) {
          rejectPort(closeError);
          return;
        }
        resolvePort(port);
      });
    });
  });
}

async function stopServer(child) {
  if (!child || child.exitCode !== null) return;
  child.kill("SIGTERM");
  const exited = await Promise.race([
    once(child, "exit").then(() => true).catch(() => true),
    delay(1500).then(() => false),
  ]);
  if (exited || child.exitCode !== null) return;
  child.kill("SIGKILL");
  await Promise.race([once(child, "exit").catch(() => {}), delay(1000)]);
}

async function waitForHealth(baseUrl, child, stderrBuffer) {
  const deadline = Date.now() + STARTUP_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Server exited during startup (code ${child.exitCode}). ${stderrBuffer.value}`.trim());
    }
    try {
      const response = await fetch(`${baseUrl}/healthz`);
      if (response.ok) return;
    } catch (_) {}
    await delay(100);
  }
  throw new Error(`Server did not become healthy in time. ${stderrBuffer.value}`.trim());
}

async function startServer(t) {
  const port = await getFreePort();
  const serverDir = getServerDir();
  const stderrBuffer = { value: "" };
  const child = spawn(process.execPath, ["server.js"], {
    cwd: serverDir,
    env: {
      ...process.env,
      HOST: "127.0.0.1",
      PORT: String(port),
      RENDER_GIT_COMMIT: "test-build",
    },
    stdio: ["ignore", "ignore", "pipe"],
  });

  child.stderr.on("data", (chunk) => {
    stderrBuffer.value += String(chunk || "");
  });

  t.after(async () => {
    await stopServer(child);
  });

  const baseUrl = `http://127.0.0.1:${port}`;
  await waitForHealth(baseUrl, child, stderrBuffer);
  return {
    baseUrl,
    wsUrl: `ws://127.0.0.1:${port}`,
  };
}

function sendPacket(ws, packet) {
  ws.send(JSON.stringify(packet));
}

async function connectSocket(wsUrl, t) {
  const ws = new WebSocket(wsUrl);
  const messages = [];

  ws.on("message", (raw) => {
    try {
      messages.push(JSON.parse(String(raw || "")));
    } catch (_) {}
  });

  await Promise.race([
    once(ws, "open"),
    delay(MESSAGE_TIMEOUT_MS).then(() => {
      throw new Error("Timed out waiting for websocket open.");
    }),
  ]);

  t.after(() => {
    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
      ws.close();
    }
  });

  return { ws, messages };
}

async function waitForMessage(connection, predicate, timeoutMs = MESSAGE_TIMEOUT_MS) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const index = connection.messages.findIndex(predicate);
    if (index >= 0) {
      const [message] = connection.messages.splice(index, 1);
      return message;
    }
    await delay(20);
  }
  throw new Error("Timed out waiting for expected websocket message.");
}

test("health and static manifest are served", async (t) => {
  const { baseUrl } = await startServer(t);

  const healthRes = await fetch(`${baseUrl}/healthz`);
  assert.equal(healthRes.status, 200);
  const healthBody = await healthRes.json();
  assert.equal(healthBody.ok, true);
  assert.equal(typeof healthBody.rooms, "number");

  const manifestRes = await fetch(`${baseUrl}/manifest.webmanifest`);
  assert.equal(manifestRes.status, 200);
  assert.match(manifestRes.headers.get("content-type") || "", /application\/manifest\+json/i);
  const manifestBody = await manifestRes.json();
  assert.equal(manifestBody.name, "Neon Bastion");
});

test("websocket room join and relay chat work", async (t) => {
  const { wsUrl } = await startServer(t);

  const host = await connectSocket(wsUrl, t);
  sendPacket(host.ws, {
    type: "joinRoom",
    roomCode: "alpha",
    role: "host",
    peerId: "host_1",
    displayName: "Host One",
  });
  const hostJoined = await waitForMessage(host, (message) => message.type === "joinedRoom");
  assert.equal(hostJoined.role, "host");
  assert.equal(hostJoined.roomCode, "ALPHA");

  const client = await connectSocket(wsUrl, t);
  sendPacket(client.ws, {
    type: "joinRoom",
    roomCode: "alpha",
    role: "client",
    peerId: "client_1",
    displayName: "Client One",
  });
  const clientJoined = await waitForMessage(client, (message) => message.type === "joinedRoom");
  assert.equal(clientJoined.role, "client");
  await waitForMessage(host, (message) => message.type === "peerJoined" && message.peerId === "client_1");

  sendPacket(client.ws, { type: "invalidType" });
  const invalidTypeError = await waitForMessage(client, (message) => message.type === "roomError");
  assert.match(invalidTypeError.message || "", /invalid packet type/i);

  sendPacket(client.ws, {
    type: "relay",
    roomCode: "alpha",
    payload: {
      type: "chat",
      name: "Client One",
      text: "  hello   world  ",
    },
  });
  const relayed = await waitForMessage(host, (message) => message.type === "relay" && message.payload?.type === "chat");
  assert.equal(relayed.payload.text, "hello world");
  assert.equal(relayed.payload.from, "client_1");

  sendPacket(client.ws, {
    type: "relay",
    roomCode: "alpha",
    payload: {},
  });
  const invalidPayloadError = await waitForMessage(client, (message) => message.type === "roomError");
  assert.match(invalidPayloadError.message || "", /payload type is required/i);
});

test("room peer limit rejects extra clients", async (t) => {
  const { wsUrl } = await startServer(t);

  const host = await connectSocket(wsUrl, t);
  sendPacket(host.ws, {
    type: "joinRoom",
    roomCode: "limit",
    role: "host",
    peerId: "host_limit",
    displayName: "Host Limit",
  });
  await waitForMessage(host, (message) => message.type === "joinedRoom");

  let accepted = 0;
  let roomFull = 0;

  for (let index = 0; index < 12; index += 1) {
    const peerId = `client_limit_${index}`;
    const client = await connectSocket(wsUrl, t);
    sendPacket(client.ws, {
      type: "joinRoom",
      roomCode: "limit",
      role: "client",
      peerId,
      displayName: `Client ${index}`,
    });

    const response = await waitForMessage(
      client,
      (message) => message.type === "joinedRoom" || message.type === "roomError",
      3500
    );
    if (response.type === "joinedRoom") accepted += 1;
    if (response.type === "roomError" && /room is full/i.test(response.message || "")) roomFull += 1;
  }

  assert.ok(accepted >= 1, "Expected at least one client to be accepted.");
  assert.ok(roomFull >= 1, "Expected extra clients to be rejected after room cap is reached.");
});
