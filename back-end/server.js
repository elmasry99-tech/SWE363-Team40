import http from 'http';
import eetase from 'eetase';
import socketClusterServer from 'socketcluster-server';
import express from 'express';
import serveStatic from 'serve-static';
import path from 'path';
import morgan from 'morgan';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import capPkg from 'cap';
import fs from 'fs';

const { Cap } = capPkg;

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// تأكد من وجود مجلد الرفع
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const ENVIRONMENT = process.env.ENV || 'dev';
const SOCKETCLUSTER_PORT = process.env.SOCKETCLUSTER_PORT || 8000;

// إعدادات الـ SocketCluster
let agOptions = {
  wsEngine: 'ws',
  allowClientFrameCompression: false,
  httpServer: null // سيتم ربطه لاحقاً
};

let httpServer = eetase(http.createServer());
let agServer = socketClusterServer.attach(httpServer, agOptions);

let expressApp = express();
expressApp.use(cors());
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: 'uploads/' });

if (ENVIRONMENT === 'dev') {
  expressApp.use(morgan('dev'));
}
expressApp.use(serveStatic(path.resolve(__dirname, 'public')));

// Routes
expressApp.get('/health-check', (req, res) => res.status(200).send('OK'));

expressApp.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');
  console.log(`[CipherNet] File received: ${req.file.originalname}`);
  res.status(200).json({ message: 'File received successfully!', filename: req.file.filename });
});

// Middleware Loop
(async () => {
  for await (let requestData of httpServer.listener('request')) {
    expressApp.apply(null, requestData);
  }
})();

// Socket Handling
(async () => {
  for await (let { socket } of agServer.listener('connection')) {
    console.log(`[Socket] Connected: ${socket.id}`);
    
    // إرسال باكيت ترحيبي فور الاتصال للتأكد من القناة
    socket.transmit('new-direct-packet', {
      id: 'welcome-1',
      time: new Date().toLocaleTimeString(),
      source: 'SYSTEM',
      destination: 'USER',
      protocol: 'TCP',
      length: 0,
      info: 'Connection Established - Ready for Sniffing'
    });
  }
})();

httpServer.listen(SOCKETCLUSTER_PORT, '0.0.0.0');

// --- Network Sniffing Functions ---

function startMockData() {
  console.log("🚀 Broadcasting Mock Packets to 'new-packet' channel...");
  setInterval(() => {
    const mockPacket = {
      id: uuidv4(),
      time: new Date().toLocaleTimeString(),
      source: `192.168.1.${Math.floor(Math.random() * 255)}`,
      destination: '10.13.86.87',
      protocol: ['TCP', 'UDP', 'ICMP'][Math.floor(Math.random() * 3)],
      length: Math.floor(Math.random() * 1500),
      info: 'CipherNet: Simulated Traffic Feed'
    };
    
    agServer.exchange.transmitPublish('new-packet', mockPacket);
  }, 1000);
}

function printSmartError(errorMsg) {
  const os = process.platform;
  console.log(`\n❌ [CipherNet Sniffer Error] ${errorMsg}`);
  console.log('👇 HOW TO FIX THIS 👇');
  if (os === 'win32') {
    console.log('You are on Windows. The packet sniffer requires Npcap (or WinPcap).');
    console.log('👉 Please download and install it from: https://npcap.com/');
  } else if (os === 'darwin') {
    console.log('You are on macOS. Packet sniffing requires root privileges and BPF device access.');
    console.log('👉 Try running the server with: sudo node server.js');
    console.log('👉 If you STILL get this error with sudo, fix your Mac permissions by running:');
    console.log('   sudo chmod 644 /dev/bpf*');
  } else if (os === 'linux') {
    console.log('You are on Linux. You need libpcap installed and root privileges.');
    console.log('👉 1. Install libpcap: sudo apt-get install libpcap-dev');
    console.log('👉 2. Run server with: sudo node server.js');
  } else {
    console.log(`You are on ${os}. Please ensure your system has PCAP drivers installed and root privileges.`);
  }
  console.log('---------------------------------------------------\n');
  console.log('ℹ️ Falling back to Mock Data Mode for demonstration...\n');
}

const c = new Cap();
try {
  const devices = Cap.deviceList();
  // Prioritize en0 (macOS) or eth0 (Linux), then filter out virtual interfaces like utun or awdl.
  const activeDevice = devices.find(d => d.name === 'en0' || d.name === 'eth0') || 
    devices.find(d => 
      !d.name.startsWith('utun') && 
      !d.name.startsWith('awdl') && 
      !d.name.startsWith('llw') && 
      d.addresses.some(addr => addr.addr && !addr.addr.startsWith('127.'))
    );

  if (activeDevice) {
    console.log(`📡 CipherNet is trying to sniff on: ${activeDevice.name}`);
    const filter = 'tcp or udp';
    const bufSize = 10 * 1024 * 1024;
    const buffer = Buffer.alloc(65535);

    try {
      c.open(activeDevice.name, filter, bufSize, buffer);
      c.on('packet', (nbytes) => {
        agServer.exchange.transmitPublish('new-packet', {
          id: uuidv4(),
          time: new Date().toLocaleTimeString(),
          source: activeDevice.addresses[0]?.addr || 'Local',
          destination: 'External',
          protocol: nbytes > 100 ? 'TCP' : 'UDP',
          length: nbytes,
          info: `Real-time Capture on ${activeDevice.name}`
        });
      });
    } catch (e) {
      printSmartError(`Permission denied or device error when opening ${activeDevice.name}`);
      startMockData();
    }
  } else {
    console.log("ℹ️ No active network device found. Starting Mock Mode.");
    startMockData();
  }
} catch (err) {
  printSmartError("Failed to initialize Cap library or list devices.");
  startMockData();
}

function colorText(message, color) {
  return color ? `\x1b[${color}m${message}\x1b[0m` : message;
}

console.log(`${colorText('[Active]', 32)} CipherNet Server is listening on port ${SOCKETCLUSTER_PORT}`);