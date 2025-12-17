const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'employer'],
    required: true,
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

const runMigration = async () => {
  if (!global.DB) {
    return Promise.reject(new Error('please initialize DB'));
  }
  console.log('MongoDB models ready');
  return Promise.resolve(global.DB);
};

module.exports = { User, runMigration };