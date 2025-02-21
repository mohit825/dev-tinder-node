const express = require("express");
const userAuth = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const ConnectionRequestModel = require("../models/connectionRequest");

const requestRouter = express.Router();

requestRouter.post(
    "/request/send/:status/:toUserId",
    userAuth,
    async (req, res) => {
        try {
            const fromUserId = req.user._id;
            const toUserId = req.params.toUserId;
            const status = req.params.status;

            // validation for :status
            const allowedStatus = ["interested", "ignored"];
            if (!allowedStatus.includes(status)) {
                return res.status(400).json({
                    message: "Invalid Status Type: " + status,
                });
            }

            //validation for :toUserId
            const toUser = await User.findById(toUserId);

            if (!toUser) {
                return res.status(400).json({
                    message: 'toUser not Found'
                })
            }


            // Check if connection request is already exists or not either A to B, or B to A.
            const existingConnectionRequest = await ConnectionRequest.findOne({
                $or: [

                    { fromUserId, toUserId },
                    { fromUserId: toUserId, toUserId: fromUserId },
                ],
            });

            if (existingConnectionRequest) {
                return res.status(400).json({
                    message: "Connection Request Already Sent"
                })
            }

            const connectionRequestObj = {
                fromUserId,
                toUserId,
                status,
            };

            const connectionRequest = new ConnectionRequest(connectionRequestObj);
            const data = await connectionRequest.save();

            res.json({
                message: "Connection Request Sent Successfully",
                data,
            });
        } catch (error) {
            res.status(400).send("Err: " + error.message);
        }
    }
);

requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;

        //validate the status.
        const allowedStatus = ['accepted', 'rejected'];
        if (!allowedStatus.includes(status)) {
            res.status(400).json({
                message: "Invalid Status Type: " + status,
            })
        }

        // find requestId in DB;

        const connectionReq = await ConnectionRequestModel.findOne({
            // conditions to find appropraite item.
            fromUserId: requestId,
            toUserId: loggedInUser._id,
            status: 'interested'
        });

        if (!connectionReq) {
            res.status(404).json({
                message: "Connection Request not found",
            })
        }

        connectionReq.status = status;

        const modifiedData = await connectionReq.save();

        res.status(200).json({
            message: "Status changed successfuly",
            data: modifiedData
        })


    } catch (error) {
        res.status(400).send("Err: " + error.message);

    }
})

module.exports = requestRouter;
