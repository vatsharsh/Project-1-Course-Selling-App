const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "asdasdasd";

const app = express();
app.use(express.json());

const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);



app.listen(3000, () => {
    console.log("Server is running on port http://localhost:3000");
});