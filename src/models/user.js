const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 16
    },
    gender: {
        type: String,
        validate(value){
            if(!['male', 'female', 'others'].includes(value)){
                throw new Error("Gender data is not valid");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://geographyandyou.com/images/user-profile.png",
    },
    about: {
        type: String,
        default: "This is a default about of the user"
    },
    skills: {
        type: [String]
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model('User', userSchema);;