const mongoose = require('mongoose');

const connectMongose = async () => {
    await mongoose.connect('mongodb+srv://namastedev:nLXKuKoS9geUR08Q@namastenode.ncuqioy.mongodb.net/devTinder');
}

module.exports = connectMongose;
