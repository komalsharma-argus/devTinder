const mongoose = require("mongoose");

const connectDB = async () => {
    mongoose.connect(process.env.DB_CONNECTION_URL);
}; 

module.exports = connectDB ;