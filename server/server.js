import { createServer } from "http";
import { WebSocketServer } from "ws";

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT || 8787);
const ROOM_CODE_LIMIT = 16;
const PEER_ID_LIMIT = 48;
const HEARTBEAT_MS = 25000;

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

function sendPacket(socket, packet) {
  if (!socket || socket.readyState !== 1) return;
  try {
    socket.send(JSON.stringify(packet));
  } catch (_) {}
}

function broadcastToRoom(roomCode, packet, exceptSocket = null) {
  const room = rooms.get(roomCode);
  if (!room) return;
  for (const socket of room.peers.values()) {
    if (socket === exceptSocket) continue;
    sendPacket(socket, packet);
  }
}

function leaveRoom(socket, reason = "leave") {
  const meta = socketMeta.get(socket);
  if (!meta) return;

  const room = rooms.get(meta.roomCode);
  socketMeta.delete(socket);
  if (!room) return;

  room.peers.delete(meta.peerId);

  if (room.hostPeerId === meta.peerId) {
    room.hostPeerId = null;
    broadcastToRoom(meta.roomCode, {
      type: "hostLeft",
      roomCode: meta.roomCode,
      peerId: meta.peerId,
      reason,
    });
  }

  broadcastToRoom(meta.roomCode, {
    type: "peerLeft",
    roomCode: meta.roomCode,
    peerId: meta.peerId,
    role: meta.role,
    reason,
  });

  if (room.peers.size === 0) {
    rooms.delete(meta.roomCode);
  }
}

function getPeerFromSocket(socket) {
  const meta = socketMeta.get(socket);
  return meta ? meta.peerId : "";
}

const server = createServer((req, res) => {
  if (req.url === "/healthz") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, rooms: rooms.size }));
    return;
  }

  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Neon Bastion multiplayer server is running.\n");
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
      const role = packet.role === "host" ? "host" : "client";
      const peerId = sanitizePeerId(packet.peerId || `peer_${Math.random().toString(36).slice(2, 10)}`);
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

      if (room.peers.has(peerId) && room.peers.get(peerId) !== socket) {
        sendPacket(socket, {
          type: "roomError",
          message: "Peer ID already exists in this room.",
        });
        return;
      }

      room.peers.set(peerId, socket);
      if (role === "host") room.hostPeerId = peerId;
      socketMeta.set(socket, { roomCode, peerId, role });

      sendPacket(socket, {
        type: "joinedRoom",
        roomCode,
        role,
        peerId,
        hostPeerId: room.hostPeerId,
        peerCount: room.peers.size,
      });

      broadcastToRoom(
        roomCode,
        {
          type: "peerJoined",
          roomCode,
          peerId,
          role,
          hostPeerId: room.hostPeerId,
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
        from: sanitizePeerId(payload.from || getPeerFromSocket(socket)),
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
