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

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// تأكد من وجود مجلد الرفع
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const ENVIRONMENT = process.env.ENV || 'dev';
const PORT = process.env.PORT || 8000;

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

let httpServer = http.createServer(expressApp);

function colorText(message, color) {
  return color ? `\x1b[${color}m${message}\x1b[0m` : message;
}

httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`${colorText('[Active]', 32)} CipherNet Server is listening on port ${PORT}`);
});