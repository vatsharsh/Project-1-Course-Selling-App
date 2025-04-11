const { Router } = require("express");
const adminRouter = Router();
const { adminModel, courseModel } = require("../db");
// bcrypt, zod, jsonwebtoken
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middleware/admin");
const admin = require("../middleware/admin");

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
    const adminId = req.userId;

    const { title, description, imageUrl, price } = req.body;

    const course = await courseModel.create({
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
        creatorId: adminId
    })
    
    res.json({
        message: "Course created",
        courseId: course._id
    })
});

adminRouter.put("/course", adminMiddleware, async function(req, res){
    const adminId = req.userId;

    const { title, description, imageUrl, price, courseId } = req.body;

    const course = await courseModel.updateOne({
        // The course will be updated, if and only if, both _id and creatorId will be matched
        // This prevents creators to alter courses of other creators
        _id: courseId,
        creatorId: adminId
    }, {
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price
    })
    
    res.json({
        message: "Course updated",
        courseId: course._id
    })
});

adminRouter.get("/course/bulk", adminMiddleware, async function(req, res){
    const adminId = req.userId;

    const courses = await courseModel.find({
        creatorId: adminId
    })
    
    res.json({
        message: "Course created",
        courses
    })
});

module.exports = {
    adminRouter: adminRouter
}