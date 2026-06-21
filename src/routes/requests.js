const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {

    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const allowedStatus = ["interested", "rejected"];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid status request: " + status
            })
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: "user not found" })
        }

        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })
        if (existingRequest) {
            return res.status(404).json({
                message: "Connection request already exists"
            })
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();
        res.json({
            message: "Connection Request sent succesfully",
            data
        })
    } catch (err) {
        res.status(400).send(err.message)
    }

})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {

        const loggedUser = req.user;
        const { status, requestId } = req.params;

        // check if entered status matches accepted or rejected
        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status request" });
        }
        // check if reqid belongs to logged in user
        // check if the api responds to only interested request which converts to accepted or rejected
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedUser._id,
            status: "interested"
        });
        if (!connectionRequest) {
            return res.status(404).json({ message: "connection request not found" })
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();
        return res.json({
            message: "Connection Request updated successfully",
            data
        })
    } catch (err) {
        res.status(400).json({ message: "Error updating request" + err.message })
    }
})
module.exports = requestRouter