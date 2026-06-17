const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    const user = new User(req.body);

    try {
        const { firstName, lastName, email, password } = req.body
        const bcryptHash = await bcrypt.hash(password, 10)
        const extractedUser = new User({
            firstName, lastName, email, password: bcryptHash
        })
        await extractedUser.save();
        res.send("User created successfully!");
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
})

authRouter.post("/login", async (req, res) => {
    // check email address first
    // check if entered password has correct hash in db

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("Invalid credentials! email")
        }
        const isenteredPasswordCorrect = await user.validatePassword(password);
        if (!isenteredPasswordCorrect) {
            throw new Error("Invalid credentials!")
        }
        else {
            const token = await user.getJwtToken();
            console.log(token);

            res.cookie("token", token);
            res.send("Login successfull!")
        }
    }
    catch (error) {
        res.status(400).send(error.message)
    }
})



module.exports = authRouter;