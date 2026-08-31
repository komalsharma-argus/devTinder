const express = require("express");
const authRouter = express.Router();

const validator = require("validator");
const bcrypt = require("bcrypt");

const {validateSignUpData} = require("../utils/validation");
const User = require('../models/user');

authRouter.post('/signup', async(req, res) => {
    //Validate the data 
    validateSignUpData(req);
    const {firstName, lastName, emailId, password} = req.body;

    //Encrypt the password 
    const passwordHash = await bcrypt.hash(password, 10);

    //Creating a new instance of User model
    const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash
    });

    try{
        await user.save();
        res.send("User added successfully!!");  
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
});

//POST - /login API
authRouter.post('/login', async(req, res) => {
    try{
        const {emailId, password} = req.body;

        if(!validator.isEmail(emailId)){
            res.send("Invalid emailId format!")
        }

        const user = await User.findOne({emailId: emailId});
        if(!user){
            res.send("Invalid credentials");
        }
        const isPasswordValid = await user.validatePassword(password);

        if(isPasswordValid){
            //Create a JWT token
            const token = await user.getJWT();

            //Add JWT token to cookie and send response back to the user
            res.cookie("token", token, {expires: new Date(Date.now() + 8 * 3600000)});
            res.send("Login Successfull!!");
        }else{
            res.send("Invalid credentials");
        }
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
});

module.exports = authRouter;