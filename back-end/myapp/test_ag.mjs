import socketClusterServer from 'socketcluster-server';
import http from 'http';

let httpServer = http.createServer();
let agServer = socketClusterServer.attach(httpServer);

console.dir(agServer.exchange, { depth: 1 });
process.exit(0);
