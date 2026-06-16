const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


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


userSchema.methods.getJwtToken = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "MADHAV@tinder$1991");
    return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const isEnteredPasswordCorrect = await bcrypt.compare(passwordInputByUser, user.password);
    return isEnteredPasswordCorrect;

};
module.exports = mongoose.model("model", userSchema);