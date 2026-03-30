'use client';
import { useEffect, useState } from 'react';
import socketClusterClient from 'socketcluster-client';
import { TrafficTable } from './TrafficTable'; 

export default function NetworkTraffic() {
  const [packets, setPackets] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState('Connecting...');

  useEffect(() => {
    const socket = socketClusterClient.create({
      hostname: 'localhost', 
      port: 8000,
      path: '/socketcluster/',
      autoReconnect: true,
      autoReconnectOptions: {
        initialDelay: 1000,
        randomness: 1000,
        multiplier: 2,
        maxDelay: 10000
      }
    });

    (async () => {
      for await (let event of socket.listener('connect')) {
        setIsConnected(true);
        setStatus('Connected');
        console.log('✅ Connected to CipherNet Sniffer!');
      }
    })();

    (async () => {
      try {
        const packetChannel = socket.subscribe('new-packet');
        console.log('Subscribed to new-packet channel');
        for await (let data of packetChannel) {
          console.log('📦 Received packet:', data);
          setPackets((prev) => [data, ...prev].slice(0, 40));
        }
      } catch (err) {
        console.error('Channel error:', err);
      }
    })();

    (async () => {
      for await (let event of socket.listener('error')) {
        console.error('❌ Socket error:', event.error);
        setStatus(`Error: ${event.error?.message || 'Connection error'}`);
      }
    })();

    (async () => {
      for await (let event of socket.listener('disconnect')) {
        setIsConnected(false);
        setStatus('Disconnected - Reconnecting...');
        console.log('⚠️ Disconnected from server');
      }
    })();

    return () => {
      socket.disconnect(); 
    };
  }, []);

  return (
    <div className="p-8 bg-slate-950 min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Network Analysis Feed</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">{status}</div>
          <div className={`px-3 py-1 rounded-full text-xs ${isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {isConnected ? '● LIVE' : '○ DISCONNECTED'}
          </div>
        </div>
      </div>

      <TrafficTable packets={packets} />
    </div>
  );
}