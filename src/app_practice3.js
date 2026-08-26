const express = require("express");
const app = express();

const {adminAuth, userAuth} = require("./middlewares/auth");

//Middlewares to handle admin auth for all GET, POST, PUT, PATCH & DELETE
app.use("/admin", adminAuth);

app.get("/user/login", (req, res) => {
    res.send("User logged in successfully");
});

app.get("/user/data", userAuth, (req, res) => {
    res.send("users data sent");
});

app.get("/admin/getAllData", (req, res) => {
    res.send("All data sent");
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});