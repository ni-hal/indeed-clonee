const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  isFeatured: {
    type: Boolean,
    required: true,
  },
  altText: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  companyId: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['APPROVED', 'REJECTED', 'PENDING'],
    default: 'PENDING',
  },
}, {
  timestamps: true,
});

const Photo = mongoose.model('Photo', photoSchema);

const runMigration = async () => {
  if (!global.DB) {
    return Promise.reject(new Error('please initialize DB'));
  }
  console.log('MongoDB models ready');
  return Promise.resolve(global.DB);
};

module.exports = { Photo, runMigration };