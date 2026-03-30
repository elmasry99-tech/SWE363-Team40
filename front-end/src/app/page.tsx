"use client";
import { useEffect, useState } from "react";
import socketClusterClient from "socketcluster-client";
import { FileUploader } from "./components/fileUpload";
export default function Home() {
  const [status, setStatus] = useState('Connecting...');

  useEffect(() => {
    const socket = socketClusterClient.create({
      hostname: 'localhost',
      port: 8000
    });

    (async () => {
      for await (let {error} of socket.listener('error')) {
        console.error('Socket Error:', error);
      }
    })();

    (async () => {
      for await (let event of socket.listener('connect')) {
        setStatus('Connected to CipherNet Backend! ✅');
      }
    })();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white">
      <h1 className="text-4xl font-bold">CipherNet Dashboard</h1>
      <p className="mt-4 text-xl text-green-400">{status}</p>
      <div className="mt-8 w-full flex justify-center">
        <FileUploader />
      </div>
    </main>
  );
}
