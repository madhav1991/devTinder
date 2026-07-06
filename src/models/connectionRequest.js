const mongoose = require('mongoose');


const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["ignored", "interested", "accepted", "rejected"],
                message: "{VALUE} is incorrect status type"
            }

        }
    },
    {
        timestamps: true
    }
);

// validation should be done at db level
connectionRequestSchema.pre("save", async function () {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself!")
    }
});

module.exports = mongoose.model("connectionRequest", connectionRequestSchema);