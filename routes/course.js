const { Router } = require("express");
const { courseModel, purchaseModel } = require("../db");
const { userMiddleware } = require("../middleware/user");
const courseRouter = Router();

courseRouter.post("/purchase", userMiddleware, async function(req, res){
    // You would expect the user to pay you money
    const userId = req.userId;
    const courseId = req.body.courseId;

    // Should be checked if the user has actually paid the price or not
    await purchaseModel.create({
        userId,
        courseId
    })

    res.json({
        message: "You have successfully bought the course"
    })
});

courseRouter.get("/preview", async function(req, res){
    const courses = await courseModel.find({});

    res.json({
        courses
    })
});

module.exports = {
    courseRouter: courseRouter
}