const express = require('express');
const validateSignUpData = require("../utils/validation");
const User = require('../models/user');
const bcrypt = require('bcrypt')



const authRouter = express.Router();

// login api
authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        //check if email is present
        const user = await User.findOne({ email: email });

        if (!user) {
            res.status(400).send("User not found");
        }

        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {
            const token = await user.getJWT();
            res.cookie("token", token);
            res.send("Login Successfull");
        } else {
            res.send("Wrong Password");
        }
    } catch (error) {
        res.send(`${error} :Something went Wrong...`);
    }
});


// SignUp API for user
authRouter.post("/signup", async (req, res) => {
    try {
        // Validation of data
        validateSignUpData(req);
        // Encrypt the data
        const { firstName, lastName, email, password } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);

        const userObj = {
            firstName,
            lastName,
            email,
            password: hashPassword,
        };

        // Creating new instance of user model.
        const user = new User(userObj);

        res.send("User Added successfully");
        await user.save();
    } catch (error) {
        res.status(400).send(error + " Something went wrong");
    }
});

module.exports = authRouter
