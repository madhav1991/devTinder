const express = require('express');
const mongoose = require('mongoose');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const userRouter = express.Router();

// get all the pending connections for a particualr user
userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", "firstName lastName age");

        res.json({
            message: "Data fetched successfully",
            data: connectionRequests
        })
    } catch (err) {
        return res.status(400).send("Error: " + err.message)
    }

})


userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        })

        res.json({ data: connectionRequests })

    } catch (err) {
        return res.status(400).send("Error: " + err.message)
    }
})
module.exports = userRouter;