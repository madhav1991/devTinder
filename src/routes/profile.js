const express = require('express');
const { userAuth } = require("../middlewares/auth");

const profileRouter = express.Router();

profileRouter.get("/profile/create", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user)
    } catch (err) {
        res.status(400).send(err.message)
    }
})



profileRouter.post("/profile/edit", userAuth, async (req, res) => {
    // need be logged in - being checked by userAuth
    // need to check user entered fields are editable 

    try {
        const allowedFields = ["firstName", "lastName", "gender", "age"];

        const loggedInUser = req.user;

        const isEditAllowed = Object.keys(req.body).every((key) => allowedFields.includes(key));

        if (!isEditAllowed) {
            throw new Error("Not able to edit these fields")
        }

        Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key]);


        // if user has entered correct fields, grab user entered details and pass them for db call
        await loggedInUser.save();

        res.send(`Profile updated successfully! ${loggedInUser.firstName}`)
        // call db to save
    } catch (err) {
        res.status(400).send("Edit unsuccessful " + err.message)
    }




})

module.exports = profileRouter;