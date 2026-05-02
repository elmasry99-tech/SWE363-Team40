import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  name: { type: String, trim: true, default: null },
  role: { type: String, enum: ['host', 'participant', 'guest'], default: 'participant' },
  status: { type: String, enum: ['waiting', 'admitted', 'denied', 'left'], default: 'admitted' },
  joinedAt: { type: Date, default: Date.now },
}, { _id: false });

const roomSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', default: null },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participants: { type: [participantSchema], default: [] },
  status: { type: String, enum: ['open', 'closed', 'archived'], default: 'open' },
}, { timestamps: true });

export default mongoose.model('Room', roomSchema);
