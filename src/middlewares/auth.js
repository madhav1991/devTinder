const jwt = require('jsonwebtoken');
const User = require("../models/user");

const adminAuth = (req, res, next) => {
    console.log("Admin auth is getting checked!!!")
    const token = "xyz";
    const isAdministorAuthorized = token === "xyz";
    if (!isAdministorAuthorized) {
        res.status(401).send("Unauthorized request")
    }
    else {
        next();
    }
}

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("User token is not present!")
        }
        const decodedObj = await jwt.verify(token, "MADHAV@tinder$1991");
        const { _id } = decodedObj;

        //get the user
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found!")
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(400).send(err.message)
    }
}

module.exports = {
    adminAuth,
    userAuth
}