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
    membershipType: {
        type: String,
    },
    isPremium: {
        type: String,
        default: false,
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
    },
    photoUrl: {
        type: String,
        default: "https://geographyandyou.com/images/user-profile.png",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid Photo URL: " + value);
            }
        }
    },
    about: {
        type: String,
        default: "This is a default about of the user!"
    },
    skills: {
        type: [String],
    }
},
    {
        timestamps: true
    });


userSchema.methods.getJwtToken = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const isEnteredPasswordCorrect = await bcrypt.compare(passwordInputByUser, user.password);
    return isEnteredPasswordCorrect;

};
module.exports = mongoose.model("User", userSchema);