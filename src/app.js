//crypto NodeJS module is required as MongoDB relies on the global crypto API. NodeJS v18 does not support it inherently.
if (!globalThis.crypto) {
    globalThis.crypto = require('crypto');
}

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDB().then(() => {
    console.log("Database connected successfully!");
    app.listen(3000, () => {
        console.log("Server listening on port 3000......")
    });
}).catch((err) => {
    console.log("Database cannot be connected!!");
});
