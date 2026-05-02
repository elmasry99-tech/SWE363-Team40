import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true, index: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['text', 'steg', 'system', 'file'], default: 'text' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Message', messageSchema);
