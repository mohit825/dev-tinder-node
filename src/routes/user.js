const express = require('express');
const userAuth = require('../middleware/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const User = require('../models/user');

const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

// user connections which are accepted
userRouter.get("/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequestModel.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" },
            ],
        })
            .populate("fromUserId", USER_SAFE_DATA)
            .populate("toUserId", USER_SAFE_DATA);

        console.log(connectionRequests);

        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({ data });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});


// Get all the pending requests for logged in user
userRouter.get('/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate('fromUserId', ['firstName', 'lastName', 'photoUrl', 'age'])// populate is used when ref is created from different collection

        if (!connectionRequests.length) {
            return res.status(200).json({
                message: 'No requests found',
                connectionRequests
            })
        }

        return res.status(200).json({
            message: 'Connection requests found',
            connectionRequests
        })
    } catch (error) {
        res.status(400).send("Err: " + error.message);

    }
})


userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const connectionRequests = await ConnectionRequestModel.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
        }).select("fromUserId  toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } },
            ],
        })
            .select(USER_SAFE_DATA)
            .skip(skip)
            .limit(limit);

        res.json({ data: users });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


module.exports = userRouter