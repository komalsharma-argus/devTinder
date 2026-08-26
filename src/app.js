//crypto NodeJS module is required as MongoDB relies on the global crypto API. NodeJS v18 does not support it inherently.
if (!globalThis.crypto) {
    globalThis.crypto = require('crypto');
}

const express = require("express");
const app = express();
const User = require('./models/user');

const connectDB = require("./config/database");
const { log } = require('console');

app.use(express.json());

app.post('/signup', async(req, res) => {
    //Creating a new instance of User model
    const user = new User(req.body);

    try{
        await user.save();
        res.send("User added successfully!!");  
    }catch(err){
        res.status(400).send("ERror saving the user: "+ err.message);
    }
});

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

//GET all users from the db
app.get('/feed', async(req, res) => {
    try{
        const users = await User.find({});
        res.send(users);
    }catch(err){
        res.status(404).send("SOmething went wrong!");
    }
})

connectDB().then(() => {
    console.log("Database connected successfully!");
    app.listen(3000, () => {
        console.log("Server listening on port 3000......")
    });
}).catch((err) => {
    console.log("Database cannot be connected!!");
});
