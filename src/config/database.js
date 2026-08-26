const mongoose = require("mongoose");

const connectDB = async () => {
    mongoose.connect("mongodb+srv://komalsharma_db_user:Ri4c0xCKuvLhEkMZ@namastenode.krunhjt.mongodb.net/devTinder");
}; 

module.exports = connectDB ;