"use client";
import { FileUploader } from "./components/fileUpload";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 text-white p-8">
      {/* Header Section */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter shadow-blue-500">
            CipherNet <span className="text-blue-500 underline decoration-2">Dashboard</span>
          </h1>
          <p className="text-slate-400 mt-1 text-sm">KFUPM Senior Project - PCAP Analyzer</p>
        </div>
      </div>

      <div className="w-full max-w-6xl space-y-8">
        {/* Upload Section */}
        <section className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-2xl">
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