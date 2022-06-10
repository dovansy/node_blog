const mongoose = require('mongoose');
const URI = process.env.MONGODB_URL;
const connect = async () => {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connect db successfully!!!');
  } catch (error) {
    console.log('Connect db failed!!!');
    process.exit(1);
  }
};

module.exports = { connect };
