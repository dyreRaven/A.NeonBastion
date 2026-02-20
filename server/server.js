import { createServer } from "http";
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import { extname, isAbsolute, normalize, relative, resolve } from "path";
import { WebSocketServer } from "ws";

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT || 8787);
const ROOM_CODE_LIMIT = 16;
const PEER_ID_LIMIT = 48;
const DISPLAY_NAME_LIMIT = 24;
const HEARTBEAT_MS = 25000;
const STATIC_ROOT = resolve(process.cwd(), "..");
const STATIC_DENY_PREFIXES = ["server/", ".git/"];
const STATIC_MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
};
const STATIC_ALLOWED_EXTENSIONS = new Set(Object.keys(STATIC_MIME_TYPES));

function sanitizeRoomCode(raw) {
  return String(raw || "")
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "")
    .slice(0, ROOM_CODE_LIMIT);
}

function sanitizePeerId(raw) {
  return String(raw || "")
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .slice(0, PEER_ID_LIMIT);
}

function sanitizeDisplayName(raw) {
  return String(raw || "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, DISPLAY_NAME_LIMIT) || "Commander";
}

function normalizeRole(raw) {
  return raw === "host" ? "host" : "client";
}

const rooms = new Map();
const socketMeta = new Map();

function makeRoom(roomCode) {
  if (!rooms.has(roomCode)) {
    rooms.set(roomCode, {
      hostPeerId: null,
      peers: new Map(),
      createdAt: Date.now(),
    });
  }
  return rooms.get(roomCode);
}

function getRoomPlayers(room) {
  if (!room) return [];
  const players = [];
  for (const [peerId, record] of room.peers.entries()) {
    players.push({
      peerId,
      role: room.hostPeerId === peerId ? "host" : normalizeRole(record.role),
      displayName: sanitizeDisplayName(record.displayName),
    });
  }
  players.sort((a, b) => {
    const aHost = a.peerId === room.hostPeerId;
    const bHost = b.peerId === room.hostPeerId;
    if (aHost !== bHost) return aHost ? -1 : 1;
    return a.displayName.localeCompare(b.displayName);
  });
  return players;
}

function sendPacket(socket, packet) {
  if (!socket || socket.readyState !== 1) return;
  try {
    socket.send(JSON.stringify(packet));
  } catch (_) {}
}

function broadcastToRoom(roomCode, packet, exceptSocket = null) {
  const room = rooms.get(roomCode);
  if (!room) return;
  for (const record of room.peers.values()) {
    if (!record || !record.socket) continue;
    if (record.socket === exceptSocket) continue;
    sendPacket(record.socket, packet);
  }
}

function leaveRoom(socket, reason = "leave") {
  const meta = socketMeta.get(socket);
  if (!meta) return;

  const room = rooms.get(meta.roomCode);
  socketMeta.delete(socket);
  if (!room) return;

  const peerRecord = room.peers.get(meta.peerId);
  const displayName = sanitizeDisplayName(meta.displayName || peerRecord?.displayName || "Player");
  room.peers.delete(meta.peerId);
  const players = getRoomPlayers(room);

  if (room.hostPeerId === meta.peerId) {
    room.hostPeerId = null;
    broadcastToRoom(meta.roomCode, {
      type: "hostLeft",
      roomCode: meta.roomCode,
      peerId: meta.peerId,
      displayName,
      reason,
      players,
    });
  }

  broadcastToRoom(meta.roomCode, {
    type: "peerLeft",
    roomCode: meta.roomCode,
    peerId: meta.peerId,
    role: normalizeRole(meta.role),
    displayName,
    hostPeerId: room.hostPeerId,
    reason,
    players,
  });

  if (room.peers.size === 0) {
    rooms.delete(meta.roomCode);
  }
}

function getPeerFromSocket(socket) {
  const meta = socketMeta.get(socket);
  return meta ? meta.peerId : "";
}

function isPathInside(basePath, targetPath) {
  const rel = relative(basePath, targetPath);
  return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel));
}

async function resolveStaticFilePath(pathname) {
  let decodedPath = "";
  try {
    decodedPath = decodeURIComponent(String(pathname || "/"));
  } catch (_) {
    return null;
  }

  let normalizedPath = normalize(decodedPath).replace(/\\/g, "/");
  if (!normalizedPath.startsWith("/")) normalizedPath = `/${normalizedPath}`;
  if (normalizedPath === "/") normalizedPath = "/index.html";
  if (normalizedPath.endsWith("/")) normalizedPath += "index.html";

  const relativePath = normalizedPath.slice(1);
  if (!relativePath) return null;
  for (const denied of STATIC_DENY_PREFIXES) {
    if (relativePath.startsWith(denied)) return null;
  }

  const extension = extname(relativePath).toLowerCase();
  if (!STATIC_ALLOWED_EXTENSIONS.has(extension)) return null;

  const fullPath = resolve(STATIC_ROOT, relativePath);
  if (!isPathInside(STATIC_ROOT, fullPath)) return null;

  try {
    const fileStat = await stat(fullPath);
    if (!fileStat.isFile()) return null;
  } catch (_) {
    return null;
  }
  return fullPath;
}

function getCacheControlHeader(filePath) {
  const extension = extname(filePath).toLowerCase();
  if (extension === ".html") return "no-cache";
  return "public, max-age=31536000, immutable";
}

async function tryServeStatic(req, res, pathname) {
  const filePath = await resolveStaticFilePath(pathname);
  if (!filePath) return false;

  const extension = extname(filePath).toLowerCase();
  const contentType = STATIC_MIME_TYPES[extension] || "application/octet-stream";
  const headers = {
    "Content-Type": contentType,
    "Cache-Control": getCacheControlHeader(filePath),
  };

  if (req.method === "HEAD") {
    res.writeHead(200, headers);
    res.end();
    return true;
  }

  res.writeHead(200, headers);
  const stream = createReadStream(filePath);
  stream.on("error", () => {
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    }
    res.end("Failed to load static asset.\n");
  });
  stream.pipe(res);
  return true;
}

const server = createServer(async (req, res) => {
  const method = String(req.method || "GET").toUpperCase();
  const requestUrl = new URL(req.url || "/", "http://localhost");
  const pathname = requestUrl.pathname;

  if (pathname === "/healthz") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, rooms: rooms.size }));
    return;
  }

  if (method !== "GET" && method !== "HEAD") {
    res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Method not allowed.\n");
    return;
  }

  const served = await tryServeStatic(req, res, pathname);
  if (served) return;

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not found.\n");
});

const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
  socket.isAlive = true;

  socket.on("pong", () => {
    socket.isAlive = true;
  });

  socket.on("message", (raw) => {
    let packet = null;
    try {
      packet = JSON.parse(String(raw || ""));
    } catch (_) {
      sendPacket(socket, {
        type: "roomError",
        message: "Invalid packet format.",
      });
      return;
    }

    if (!packet || typeof packet !== "object") return;

    if (packet.type === "joinRoom") {
      const roomCode = sanitizeRoomCode(packet.roomCode);
      const role = normalizeRole(packet.role);
      const peerId = sanitizePeerId(packet.peerId || `peer_${Math.random().toString(36).slice(2, 10)}`);
      const displayName = sanitizeDisplayName(packet.displayName || "Commander");
      if (!roomCode) {
        sendPacket(socket, {
          type: "roomError",
          message: "Invalid room code.",
        });
        return;
      }

      const existing = socketMeta.get(socket);
      if (existing) leaveRoom(socket, "switchRoom");

      const room = makeRoom(roomCode);
      if (role === "host" && room.hostPeerId && room.hostPeerId !== peerId) {
        sendPacket(socket, {
          type: "roomError",
          message: "This room already has a host.",
        });
        return;
      }

      if (room.peers.has(peerId) && room.peers.get(peerId)?.socket !== socket) {
        sendPacket(socket, {
          type: "roomError",
          message: "Peer ID already exists in this room.",
        });
        return;
      }

      room.peers.set(peerId, {
        socket,
        peerId,
        role,
        displayName,
      });
      if (role === "host") room.hostPeerId = peerId;
      socketMeta.set(socket, {
        roomCode,
        peerId,
        role,
        displayName,
      });

      const players = getRoomPlayers(room);

      sendPacket(socket, {
        type: "joinedRoom",
        roomCode,
        role,
        peerId,
        displayName,
        hostPeerId: room.hostPeerId,
        peerCount: room.peers.size,
        players,
      });

      broadcastToRoom(
        roomCode,
        {
          type: "peerJoined",
          roomCode,
          peerId,
          role,
          displayName,
          hostPeerId: room.hostPeerId,
          players,
        },
        socket
      );

      return;
    }

    if (packet.type === "leaveRoom") {
      leaveRoom(socket, "leaveRequest");
      return;
    }

    if (packet.type === "relay") {
      const meta = socketMeta.get(socket);
      if (!meta) {
        sendPacket(socket, {
          type: "roomError",
          message: "Join a room first.",
        });
        return;
      }

      const payload = packet.payload && typeof packet.payload === "object" ? packet.payload : {};
      const roomCode = sanitizeRoomCode(packet.roomCode || meta.roomCode || payload.roomCode);
      if (!roomCode || roomCode !== meta.roomCode) {
        sendPacket(socket, {
          type: "roomError",
          message: "Room mismatch.",
        });
        return;
      }

      const normalizedPayload = {
        ...payload,
        roomCode,
        from: sanitizePeerId(getPeerFromSocket(socket)),
        sentAt: Number.isFinite(payload.sentAt) ? payload.sentAt : Date.now(),
      };

      broadcastToRoom(
        roomCode,
        {
          type: "relay",
          roomCode,
          from: normalizedPayload.from,
          payload: normalizedPayload,
        },
        socket
      );
    }
  });

  socket.on("close", () => {
    leaveRoom(socket, "disconnect");
  });

  socket.on("error", () => {
    leaveRoom(socket, "socketError");
  });
});

const heartbeat = setInterval(() => {
  for (const socket of wss.clients) {
    if (socket.isAlive === false) {
      try {
        socket.terminate();
      } catch (_) {}
      continue;
    }
    socket.isAlive = false;
    try {
      socket.ping();
    } catch (_) {}
  }
}, HEARTBEAT_MS);

wss.on("close", () => {
  clearInterval(heartbeat);
});

server.listen(PORT, HOST, () => {
  console.log(`Neon Bastion multiplayer server listening on ws://${HOST}:${PORT}`);
});
