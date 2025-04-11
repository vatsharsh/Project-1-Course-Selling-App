const { Router } = require("express");
const adminRouter = Router();
const { adminModel } = require("../db");
// bcrypt, zod, jsonwebtoken
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middleware/admin");

adminRouter.post("/signup", async function(req, res){
    const { email, password, firstName, lastName } = req.body; // TODO: adding zod validation
    // TODO: hash the password so plaintext pw is not stored in the DB

    // TODO: put inside a try catch block
    await adminModel.create({
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName
    })

    res.json({
        message: "Signup succeeded"
    })
});

adminRouter.post("/signin", async function(req, res){
    const { email, password } = req.body;

    const admin = await adminModel.findOne({
        email: email,
        password: password
    })

    if(admin){
        const token = jwt.sign({
            id: admin._id
        }, JWT_ADMIN_PASSWORD);
        
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

adminRouter.post("/course", adminMiddleware, async function(req, res){
    const adminId = req.adminId;

    const { title, description, imageUrl, price } = req.body;

    const course = await courseModel.create({
        title: title,
        description: description,
        imageUrl: imageUrl,
        creatorId: adminId
    })
    
    res.json({
        message: "Course created",
        courseId: course._id
    })
});

adminRouter.put("/course", function(req, res){
    res.json({
        message: "course endpoint"
    })
});

adminRouter.get("/course/bulk", function(req, res){
    res.json({
        message: "course endpoint"
    })
});

module.exports = {
    adminRouter: adminRouter
}