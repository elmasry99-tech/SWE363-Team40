import jwt from 'jsonwebtoken';
import socketClusterServer from 'socketcluster-server';

function socketUser(socket) {
  let token = null;
  if (socket.request && socket.request.url) {
    const url = new URL(socket.request.url, 'http://localhost');
    token = url.searchParams.get('token');
  }
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

function relay(agServer, event, user, payload) {
  const { roomId, targetUserId, ...signal } = payload || {};
  if (!roomId) return;

  agServer.exchange.transmitPublish(`room-${roomId}`, {
    event,
    roomId,
    fromUserId: user?.id || null,
    targetUserId: targetUserId || null,
    ...signal,
  });
}

export function getIceServers(_req, res) {
  const urls = (process.env.STUN_URLS || 'stun:stun.l.google.com:19302')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean);

  res.json({
    iceServers: urls.map((url) => ({ urls: url })),
  });
}

export function initSignaling(httpServer, agServer = null) {
  const server = agServer || socketClusterServer.attach(httpServer, {
    path: '/socketcluster/',
  });

  (async () => {
    for await (const { socket } of server.listener('connection')) {
      const user = socket.user || socketUser(socket);

      for (const event of ['call:offer', 'call:answer', 'call:ice-candidate', 'call:end']) {
        (async () => {
          for await (const data of socket.receiver(event)) {
            relay(server, event, user, data);
          }
        })();
      }
    }
  })();

  return server;
}
