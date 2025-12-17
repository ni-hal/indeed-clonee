const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  employerId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const messageSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  chatId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Chat = mongoose.model('Chat', chatSchema);
const Message = mongoose.model('Message', messageSchema);

const runMigration = async () => {
  if (!global.DB) {
    return Promise.reject(new Error('please initialize DB'));
  }
  console.log('MongoDB models ready');
  return Promise.resolve(global.DB);
};

module.exports = { Chat, Message, runMigration };