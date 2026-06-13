const mongoose = require('mongoose');

const userSchema = new mongoose.model({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    age: {
        type: Number,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    gender: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model("model", userSchema);