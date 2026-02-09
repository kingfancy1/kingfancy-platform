import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  ticketNumber: { type: Number, required: true, index: true },
  userId: { type: String, required: true },
  channelId: { type: String, required: true },
  categoryKey: { type: String, required: true },
  status: { type: String, default: 'open' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Ticket', ticketSchema);
