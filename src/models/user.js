const mongoose = require('mongoose');
const validator = require('validator');


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("not valid email" + value)
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
    }
},
    {
        timestamps: true
    });

module.exports = mongoose.model("model", userSchema);