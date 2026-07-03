const mongoose = require('mongoose');

const connectMongose = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
}

module.exports = connectMongose;
