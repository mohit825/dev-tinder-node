const express = require('express');
const userAuth = require('../middleware/auth');
const User = require('../models/user');
const { validateEditProfileData } = require('../utils/validation');
const profileRouter = express.Router();


profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        if (user) {
            res.send(user);
        } else {
            throw new Error("No user found");
        }
    } catch (error) {
        res.send("Something went Wrong...");
    }
});


//user API get user by email

profileRouter.get("/user", async (req, res) => {
    try {
        const { emailId } = req.body;

        const user = await User.find({ emailId: emailId });
        if (!isEmpty(user)) {
            res.send(user);
        } else {
            res.status(404).send(`No User found for given email --> ${emailId}`);
        }
    } catch (error) {
        res.status(400).send("Something went wrong");
    }
});

// Feed API to get all the user
profileRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const users = await User.find({});

        if (!isEmpty(users)) {
            res.send(users);
        } else {
            res.status(404).send("Collection is Empty");
        }
    } catch (error) {
        res.status(400).send("Something went wrong");
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid Edit Request");
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

        await loggedInUser.save();

        res.json({
            message: `${loggedInUser.firstName}, your profile updated successfuly`,
            data: loggedInUser,
        });
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});


module.exports = profileRouter