const express = require('express');
const userAuth = require('../middleware/auth');
const User = require('../models/user');
const profileRouter = express.Router();


profileRouter.get("/profile", userAuth, async (req, res) => {
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
        const { email } = req.body;

        console.log(email);
        const user = await User.find({ email: email });
        if (!isEmpty(user)) {
            res.send(user);
        } else {
            res.status(404).send(`No User found for given email --> ${email}`);
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

module.exports = profileRouter