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
        const isPasswordValid = bcrypt.compare(password, user.password);

        if(isPasswordValid){
            //Create a JWT token
            const token = await jwt.sign({_id: user._id}, "DEV@Tinder$790");

            //Add JWT token to cookie and send response back to the user
            res.cookie("token", token);
            res.send("Login Successfull!!");
        }else{
            res.send("Invalid credentials");
        }
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
});

//GET profile 
app.get("/profile", async(req, res) => {
    try{
        const cookies = req.cookies;
        const { token } = cookies;

        if(!token){
            throw new Error("Invalid user token");
        }

        const decodedMessage = await jwt.verify(token, "DEV@Tinder$790");
        const { _id } = decodedMessage;
        const user = await User.findById(_id);

        if(!user){
            throw new Error("User not found");
        }
        res.send(user);
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
})

//GET user by email
app.get('/user', async(req, res) => {
    const userEmail = req.body.emailId;

    try{
        const users = await User.findOne({emailId: userEmail});
        if(users.length === 0){
            res.status(404).send("User Not Found!!");
        }else{
            res.send(users);
        }
    }catch(err){
        res.status(404).send("Something went wrong!!");
    }
});

//FEED API -GET all users from the db
app.get('/feed', async(req, res) => {
    try{
        const users = await User.find({});
        res.send(users);
    }catch(err){
        res.status(404).send("Something went wrong!");
    }
})

//DELETE API - Delete one user by id from db
app.delete('/user', async(req, res) => {
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    }catch(err){
        res.status(404).send("Something went wrong!");
    }
})

//UPDATE data of the user
app.patch('/user/:userId', async(req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    try{
        const ALLOWED_UPDATES = ["age", "gender", "photoUrl", "about", "skills"];
        const isUpdateAllowed = Object.keys(data).every(key => {ALLOWED_UPDATES.includes(key)});

        if(!isUpdateAllowed){
            throw new Error("Update not allowed");
        }

        if(data?.skills.length > 10){
            throw new Error("Skills cannot be more than 10");
        }

        const user = await User.findByIdAndUpdate({_id : userId}, data, {
            returnDocument: "after", 
            runValidators: true
        });
        console.log(user);
        res.send("User updated successfully");
    }catch(err){
        res.status(404).send("UPDATE Failed: " + err.message);
    }
})

//UPDATE data of user using emailId instead of _id
// app.patch('/user', async (req, res) => {
//     const emailId = req.body.emailId;
//     const data = req.body;
//     try{
//         const user = await User.findOneAndUpdate({emailId : emailId}, data, {returnDocument: "after"});
//         console.log(user);
//         res.send("User updated successfully");
//     }catch(err){
//         res.status(404).send("Something went wrong!");
//     }
// }) 

connectDB().then(() => {
    console.log("Database connected successfully!");
    app.listen(3000, () => {
        console.log("Server listening on port 3000......")
    });
}).catch((err) => {
    console.log("Database cannot be connected!!");
});
