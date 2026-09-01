const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", //reference to User collection
            required: true
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        status: {
            type: String,
            enum: {
                values: ['ignored', 'interested', 'accepted', 'rejected'],
                message: `{VALUE} is not an accepted status type`
            }
        },
    },
    {
        timestamps: true
    }
);

connectionRequestSchema.index({fromUserId: 1, toUserId: 1});

connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;

    //Check if fromUserId and toUserId is same --> corner case
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself!!");
    }
    // next();
});

connectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = connectionRequestModel;