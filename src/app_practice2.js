const express = require('express');
const app = express();

app.use("/users", (req, res, next) => {
        console.log("Console Response 1");
        // res.send("Response 1 sent");
        next();
    }, 
    (req, res, next) => {
        console.log("Console Response 2");
        // res.send("Response 2 sent");
        next();
    }, 
    (req, res) => {
        console.log("Console Response 3");
        res.send("Response 3 sent");
    }
)

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});