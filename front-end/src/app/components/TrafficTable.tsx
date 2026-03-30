'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldAlert, Cpu } from 'lucide-react';

interface Packet {
  id: string;
  time: string;
  source: string;
  destination: string;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'HTTP';
  length: number;
  info: string;
}

export const TrafficTable = ({ packets }: { packets: Packet[] }) => {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-900/40">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-950/50 text-slate-500 uppercase sticky top-0">
            <tr>
              <th className="p-4 font-bold">Time</th>
              <th className="p-4 font-bold">Source</th>
              <th className="p-4 font-bold">Destination</th>
              <th className="p-4 font-bold">Protocol</th>
              <th className="p-4 font-bold">Length</th>
              <th className="p-4 font-bold text-right">Info</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            <AnimatePresence initial={false}>
              {packets.length > 0 ? (
                packets.map((pkt) => (
                  <motion.tr
                    key={pkt.id} // 👈 تأكد إن الـ id موجود وفريد
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="p-4 text-slate-400">{pkt.time}</td>
                    <td className="p-4 font-medium text-blue-400">{pkt.source}</td>
                    <td className="p-4 font-medium text-purple-400">{pkt.destination}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        pkt.protocol === 'TCP' ? 'bg-blue-500/10 text-blue-400' : 
                        pkt.protocol === 'UDP' ? 'bg-green-500/10 text-green-400' : 
                        'bg-slate-700 text-slate-300'
                      }`}>
                        {pkt.protocol}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">{pkt.length}</td>
                    <td className="p-4 text-slate-500 text-right truncate max-w-xs">{pkt.info}</td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-600 italic">
                    Waiting for network packets...
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};