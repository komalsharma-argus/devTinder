const adminAuth = (req, res, next) => {
    console.log("Admin auth is being checked");
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if(!isAdminAuthorized){
        res.status(401).send("The request is not authorized");
    }else {
        next();
    }
}

const userAuth = (req, res, next) => {
    console.log("Admin auth is being checked");
    const token = "xyz";
    const isUserAuthorized = token === "xyz";
    if(!isUserAuthorized){
        res.status(401).send("The request is not authorized");
    }else {
        next();
    }
}

module.exports = {adminAuth, userAuth};