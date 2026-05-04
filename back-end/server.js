import http from 'http';
import express from 'express';
import serveStatic from 'serve-static';
import path from 'path';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import { pathToFileURL } from 'url';

import { connectDB } from './db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import roomRoutes from './routes/rooms.js';
import messageRoutes from './routes/messages.js';
import fileRoutes from './routes/files.js';
import orgRoutes from './routes/orgs.js';
import { requireAuth } from './middleware/auth.js';
import { initRealtime } from './realtime.js';
import { getIceServers, initSignaling } from './signaling.js';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

export function createApp() {
  const ENVIRONMENT = process.env.ENV || 'dev';
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');

  const app = express();
  app.use(cors({
    origin: (origin, callback) => {
      // Dynamically allow any origin for the frontend deployment
      callback(null, true);
    },
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/csv'];

  const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      cb(null, ALLOWED_MIME_TYPES.includes(file.mimetype));
    },
  });

  if (ENVIRONMENT === 'dev') app.use(morgan('dev'));
  app.use(serveStatic(path.resolve(__dirname, 'public')));

  app.use('/auth', authRoutes);
  app.use('/users', userRoutes);
  app.use('/rooms', roomRoutes);
  app.use('/messages', messageRoutes);
  app.use('/files', fileRoutes);
  app.use('/orgs', orgRoutes);
  app.get('/ice-servers', requireAuth, getIceServers);

  app.get('/health-check', (_req, res) => res.status(200).send('OK'));

  app.post('/upload', requireAuth, upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded or file type not allowed.' });
    console.log(`[CipherNet] File received: ${req.file.originalname}`);
    return res.status(200).json({ message: 'File received successfully!', filename: req.file.filename });
  });

  app.use((err, _req, res, _next) => {
    if (err?.message === 'Not allowed by CORS') {
      return res.status(403).json({ error: err.message });
    }

    if (err instanceof SyntaxError && 'body' in err) {
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }

    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

export function createHttpServer(app = createApp()) {
  const httpServer = http.createServer(app);
  const agServer = initRealtime(httpServer);
  initSignaling(httpServer, agServer);
  return httpServer;
}

function colorText(message, color) {
  return color ? `\x1b[${color}m${message}\x1b[0m` : message;
}

export async function startServer() {
  const PORT = process.env.PORT || 8000;
  await connectDB();
  const httpServer = createHttpServer();
  return new Promise((resolve) => {
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`${colorText('[Active]', 32)} CipherNet Server is listening on port ${PORT}`);
      resolve(httpServer);
    });
  });
}

const isDirectRun = import.meta.url === pathToFileURL(process.argv[1] || '').href;

if (isDirectRun) {
  startServer().catch((err) => {
    console.error('Server failed to start:', err.message);
    process.exit(1);
  });
}
