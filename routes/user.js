const { Router } = require("express");
const { userModel } = require("../db");
const jwt = require("jsonwebtoken");
const JWT_USER_PASSWORD = "ABCDABCD";

const userRouter = Router();

userRouter.post("/signup", async function(req, res){
    const { email, password, firstName, lastName } = req.body; // TODO: adding zod validation
    // TODO: hash the password so plaintext pw is not stored in the DB

    // TODO: put inside a try catch block
    await userModel.create({
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName
    })

    res.json({
        message: "Signup succeeded"
    })
});

userRouter.post("/signin", async function(req, res){
    const { email, password } = req.body;

    const user = await userModel.findOne({
        email: email,
        password: password
    })

    if(user){
        const token = jwt.sign({
            id: user._id
        }, JWT_USER_PASSWORD);
        
        // Do cookie logic
    
        res.json({
            token: token
        })
    } else{
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }

});

userRouter.get("/purchases", function(req, res){
    res.json({
        message: "purchased courses endpoint"
    })
});

module.exports = {
    userRouter: userRouter
}