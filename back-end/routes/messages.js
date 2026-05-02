import express from 'express';
import Message from '../models/Message.js';
import Room from '../models/Room.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

async function canAccessRoom(user, roomId) {
  const room = await Room.findById(roomId);
  if (!room) return { allowed: false, room: null, status: 404 };
  const participant = room.participants.find((entry) => entry.userId?.toString() === user.id);
  const allowed = user.role === 'admin'
    || room.hostId?.toString() === user.id
    || participant?.status === 'admitted'
    || (user.role === 'oso' && user.orgId && room.orgId?.toString() === user.orgId);
  return { allowed, room, status: allowed ? 200 : 403 };
}

router.get('/:roomId', requireAuth, async (req, res) => {
  try {
    const { allowed, status } = await canAccessRoom(req.user, req.params.roomId);
    if (!allowed) return res.status(status).json({ error: status === 404 ? 'Room not found' : 'Not authorized' });

    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const messages = await Message.find({ roomId: req.params.roomId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('senderId', 'name email role');

    res.json({ messages: messages.reverse() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { roomId, content, type = 'text' } = req.body;
    if (!roomId || !content) return res.status(400).json({ error: 'roomId and content are required' });
    if (!['text', 'steg', 'system', 'file'].includes(type)) return res.status(400).json({ error: 'Invalid message type' });

    const { allowed, status } = await canAccessRoom(req.user, roomId);
    if (!allowed) return res.status(status).json({ error: status === 404 ? 'Room not found' : 'Not authorized' });

    const message = await Message.create({ roomId, senderId: req.user.id, content, type });
    const populated = await message.populate('senderId', 'name email role');
    res.status(201).json({ message: populated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
