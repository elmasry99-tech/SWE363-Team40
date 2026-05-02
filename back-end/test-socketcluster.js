import { createServer } from 'http';
import socketClusterServer from 'socketcluster-server';
import { create } from 'socketcluster-client';

const httpServer = createServer();
const agServer = socketClusterServer.attach(httpServer, { path: '/socketcluster/' });

agServer.setMiddleware(agServer.MIDDLEWARE_INBOUND, async (middlewareStream) => {
  for await (const action of middlewareStream) {
    action.allow();
  }
});

(async () => {
  for await (const { socket } of agServer.listener('connection')) {
    console.log("Socket connection!");
    console.log("socket.handshake:", !!socket.handshake);
    console.log("socket.request.url:", socket.request.url);
    socket.disconnect();
    process.exit(0);
  }
})();

httpServer.listen(8081, () => {
  const client = create({
    hostname: 'localhost',
    port: 8081,
    path: '/socketcluster/',
    query: { token: '12345' },
  });
});
