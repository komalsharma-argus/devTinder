const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = ["firstName", "lastName", "photoUrl", "age", "gender", "about", "skills"];

// Get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async(req, res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA);
        // .populate("fromUserId","firstName lastName photoUrl age gender about skills");

        res.json({message: "Data fetched successfully!", data: connectionRequests});

    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

userRouter.get("/user/connections", userAuth, async(req, res) => {
    try{
        const loggedInUser = req.user;

        const connections = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"}
            ]
        }).populate("toUserId", USER_SAFE_DATA).populate("fromUserId", USER_SAFE_DATA);

        const data = connections.map((row) => {
            if(loggedInUser._id.toString() === row.toUserId._id.toString()){
                return row.fromUserId;
            }
            return row.toUserId;
        });

        res.json({data});

    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

userRouter.get("/feed", userAuth, async(req, res) => {
    try{
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50? 50 : limit;
        const skip = (page-1)*limit;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id},
                {fromUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((request) => {
            hideUsersFromFeed.add(request.toUserId.toString());
            hideUsersFromFeed.add(request.fromUserId.toString());
        });

        const users = await User.find({
            $and: [
                { _id: {$nin: Array.from(hideUsersFromFeed)}},//Hidden users removed
                { _id: {$ne: loggedInUser._id}}//self removed
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.json({data: users});
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports = userRouter;