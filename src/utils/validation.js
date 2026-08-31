const validator = require('validator');

const validateSignUpData = (req) => {
    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Firstname & Lastname fields cannot be empty");
    }else if(!(firstName.length > 2 && firstName.length < 50)){
        throw new Error("Firstname is not valid. Should be between 3-50 characters")
    }else if(!(lastName.length > 2 && lastName.length < 50)){
        throw new Error("Firstname is not valid. Should be between 3-50 characters")
    }else if(!validator.isEmail(emailId)){
        throw new Error("Invalid emailId");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("PLease enter a Strong Password");
    }
};

const validateEditProfileData = (req) => {
    const allowedEditFields = [
        "lastName", "age", "gender", "photoUrl", "about", "skills"
    ];

    const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field));
    // return isEditAllowed;
    if(!isEditAllowed){
        throw new Error("The specified fields cannot be edited");
    }

    const {lastName, photoUrl, gender, age, skills } = req.body;
    if(lastName && !(lastName.length > 2 && lastName.length < 50)){
        throw new Error("Firstname is not valid. Should be between 3-50 characters")
    }
    if(age && !validator.isInt(String(age), {min: 16})){
        throw new Error("Enter a valid age!");
    }
    if(gender && !["male", "female", "other"].includes(gender.toLowerCase())){
        throw new Error("Enter a valid gender!");
    }
    if(photoUrl && !validator.isURL(photoUrl)){
        throw new Error("Enter a valid photo URL");
    }
    if(skills && !skills.length > 10){
        throw new Error("Minimum 10 skills allowed");
    }
    return true;
};

module.exports = {
    validateSignUpData,
    validateEditProfileData
};