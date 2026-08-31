//crypto NodeJS module is required as MongoDB relies on the global crypto API. NodeJS v18 does not support it inherently.
if (!globalThis.crypto) {
    globalThis.crypto = require('crypto');
}

const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const User = require('./models/user');

const connectDB = require("./config/database");
const {validateSignUpData} = require("./utils/validation");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());
app.post('/signup', async(req, res) => {
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
app.post('/login', async(req, res) => {
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

//GET profile 
app.get("/profile", userAuth ,async(req, res) => {
    try{
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
});

app.post("/sendConnectionRequest", userAuth, (req, res) => {
    const user = req.user;
    console.log("Sending a connection request");
});

connectDB().then(() => {
    console.log("Database connected successfully!");
    app.listen(3000, () => {
        console.log("Server listening on port 3000......")
    });
}).catch((err) => {
    console.log("Database cannot be connected!!");
});
