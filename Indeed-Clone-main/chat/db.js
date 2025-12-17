const mongoose = require('mongoose');

if (!global.gConfig.mongodb_url) {
  console.error('please provide mongodb_url in config file...');
}

const initDB = async () => {
  if (global.DB) {
    return Promise.resolve(global.DB);
  }
  
  try {
    global.DB = await mongoose.connect(global.gConfig.mongodb_url);
    console.log('Connected to MongoDB...');
    return Promise.resolve(global.DB);
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = {
  initDB,
};
