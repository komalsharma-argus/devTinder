//crypto NodeJS module is required as MongoDB relies on the global crypto API. NodeJS v18 does not support it inherently.
if (!globalThis.crypto) {
    globalThis.crypto = require('crypto');
}

const express = require("express");
const app = express();
const User = require('./models/user');

const connectDB = require("./config/database");
const { log } = require('console');

app.post('/signup', async(req, res) => {
    //Creating a new instance of User model
    const user = new User({
        firstName: 'Komal',
        lastname: 'Sharma',
        emailId: 'komal@yahoo.com',
        password: 'Komal@abc'
    });

    try{
        await user.save();
        res.send("User added successfully!!");  
    }catch(err){
        res.status(400).send("ERror saving the user: "+ err.message);
    }
});

connectDB().then(() => {
    console.log("Database connected successfully!");
    app.listen(3000, () => {
        console.log("Server listening on port 3000......")
    });
}).catch((err) => {
    console.log("Database cannot be connected!!");
});
