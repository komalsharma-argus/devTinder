const express = require("express");
const app = express();

//Request Handlers
app.use("/hello", (req, res) => {
    res.send("Hello page");
});

app.use("/test", (req, res) => {
    res.send("Test page");
});

app.use("/", (req, res) => {
    res.send("Root page");
});


app.listen(3000, () => {
    console.log("Server is successfully listening on port 3000");
});