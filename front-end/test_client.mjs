import socketClusterClient from 'socketcluster-client';

const socket = socketClusterClient.create({
  hostname: 'localhost', 
  port: 8000,
  path: '/socketcluster/'
});

(async () => {
  for await (let event of socket.listener('connect')) {
    console.log('✅ Connected to CipherNet Sniffer!');
  }
})();

(async () => {
  try {
    const packetChannel = socket.subscribe('new-packet');
    console.log('Subscribed to new-packet channel');
    for await (let data of packetChannel) {
      console.log('📦 Received packet:', data);
    }
  } catch (err) {
    console.error('Channel error:', err);
  }
})();

(async () => {
  for await (let event of socket.listener('error')) {
    console.error('❌ Socket error:', event.error);
  }
})();
