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

import { connectDB } from './db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import { requireAuth } from './middleware/auth.js';

// --- Y: import your route/realtime modules here when ready ---
// import roomRoutes    from './routes/rooms.js';
// import messageRoutes from './routes/messages.js';
// import fileRoutes    from './routes/files.js';
// import orgRoutes     from './routes/orgs.js';
// import { initRealtime }  from './realtime.js';
// import { initSignaling } from './signaling.js';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENVIRONMENT = process.env.ENV || 'dev';
const PORT = process.env.PORT || 8000;

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

await connectDB();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');

let app = express();
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, ALLOWED_MIME_TYPES.includes(file.mimetype));
  },
});

if (ENVIRONMENT === 'dev') app.use(morgan('dev'));
app.use(serveStatic(path.resolve(__dirname, 'public')));

// Routes — W
app.use('/auth',  authRoutes);
app.use('/users', userRoutes);

// Routes — Y (uncomment when Y's files are ready)
// app.use('/rooms',    roomRoutes);
// app.use('/messages', messageRoutes);
// app.use('/files',    fileRoutes);
// app.use('/orgs',     orgRoutes);

app.get('/health-check', (_req, res) => res.status(200).send('OK'));

app.post('/upload', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded or file type not allowed.' });
  console.log(`[CipherNet] File received: ${req.file.originalname}`);
  res.status(200).json({ message: 'File received successfully!', filename: req.file.filename });
});

let httpServer = http.createServer(app);

// Real-time — Y (uncomment when Y's files are ready)
// initRealtime(httpServer);
// initSignaling(httpServer);

function colorText(message, color) {
  return color ? `\x1b[${color}m${message}\x1b[0m` : message;
}

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`${colorText('[Active]', 32)} CipherNet Server is listening on port ${PORT}`);
});
