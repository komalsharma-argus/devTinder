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

module.exports = {
    validateSignUpData
};