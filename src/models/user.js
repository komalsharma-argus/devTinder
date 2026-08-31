const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    emailId: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address " + value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password " + value);
            }
        }
    },
    age: {
        type: Number,
        min: 16
    },
    gender: {
        type: String,
        enum: {
            values: ['male', 'female', 'others'],
            message: `{VALUE} is not a valid gender type.`
        }
        // validate(value){
        //     if(!['male', 'female', 'others'].includes(value)){
        //         throw new Error("Gender data is not valid");
        //     }
        // }
    },
    photoUrl: {
        type: String,
        default: "https://geographyandyou.com/images/user-profile.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo URL " + value);
            }
        }
    },
    about: {
        type: String,
        default: "This is a default about of the user"
    },
    skills: {
        type: [String],
        maxLength: 10
    }
},
{
    timestamps: true
}
);

userSchema.methods.getJWT = async function(){
    const user = this;

    const token = await jwt.sign({_id: user._id}, "DEV@Tinder$790", {expiresIn: "7d"});
    return token;
};

userSchema.methods.validatePassword = async function(passwordByUser){
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(passwordByUser, passwordHash);

    return isPasswordValid;
}

module.exports = mongoose.model('User', userSchema);;