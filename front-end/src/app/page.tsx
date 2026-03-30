"use client";
import { useEffect, useState } from "react";
import socketClusterClient from "socketcluster-client";
import { FileUploader } from "./components/fileUpload";
import { TrafficTable } from "./components/TrafficTable"; // تأكد من المسار الصح

export default function Home() {
  const [packets, setPackets] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    // 1. اتصال واحد فقط للسيرفر
    const socket = socketClusterClient.create({
      hostname: 'localhost',
      port: 8000,
      path: '/socketcluster/'
    });

    // 2. مراقبة الاتصال
    (async () => {
      for await (let event of socket.listener('connect')) {
        console.log('✅ Connected to CipherNet Server!');
        setIsConnected(true);
      }
    })();

    (async () => {
      for await (let event of socket.listener('disconnect')) {
        console.log('❌ Disconnected');
        setIsConnected(false);
      }
    })();

    // 3. استلام البيانات والاشتراك في القناة
    (async () => {
      const channel = socket.subscribe('new-packet');
      console.log("📡 Subscribed to: new-packet");

      for await (let data of channel) {
        // نحدث الـ state بالبيانات الجديدة
        setPackets((prev) => [data, ...prev].slice(0, 40));
      }
    })();

    return () => {
      socket.disconnect();
    };
  }, []);

  // دالة الفلترة (اختيارية لو عايز تستخدم الأزرار)
  const filteredPackets = packets.filter(p => 
    filter === 'ALL' ? true : p.protocol === filter
  );

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 text-white p-8">
      {/* Header Section */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter shadow-blue-500">
            CipherNet <span className="text-blue-500 underline decoration-2">Dashboard</span>
          </h1>
          <p className="text-slate-400 mt-1 text-sm">KFUPM Senior Project - Network Sniffer</p>
        </div>
        
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${
          isConnected ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-400'
        }`}>
          <span className="relative flex h-2 w-2">
            {isConnected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-widest">
            {isConnected ? 'System Live' : 'System Offline'}
          </span>
        </div>
      </div>

      {/* Main Content: التمرير المباشر للـ TrafficTable */}
      <div className="w-full max-w-6xl space-y-8">
        <section className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Real-time Traffic Feed
            </h2>
            {/* أزرار الفلترة السريعة */}
            <div className="flex space-x-2">
              {['ALL', 'TCP', 'UDP'].map(p => (
                <button 
                  key={p} 
                  onClick={() => setFilter(p)}
                  className={`px-3 py-1 text-[10px] rounded-md transition ${filter === p ? 'bg-blue-600' : 'bg-slate-800 hover:bg-slate-700'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          
          {/* تمرير الـ packets المستلمة هنا */}
          <TrafficTable packets={filteredPackets} />
        </section>

        {/* Upload Section */}
        <section className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
          <h2 className="text-lg font-semibold mb-4 text-slate-300">Analyze PCAP File</h2>
          <FileUploader />
        </section>
      </div>

      <footer className="mt-auto pt-10 text-slate-600 text-[10px]">
        © 2026 CipherNet Security Framework | Mazen Osama
      </footer>
    </main>
  );
}