const express = require("express");
 const { register, login
    ,getAllUsers,getUserById, verifyCode, updateUserInfo
 } = require("../controllers/users");

const authentication = require("../middleware/authentication");
const authorization = require("../middleware/authorization");

const usersRouter = express.Router();


usersRouter.post("/register", register);
usersRouter.post("/login", login);
// usersRouter.get("/", authentication,authorization("course.view"), getAllUsers);
usersRouter.get("/",  getAllUsers);

usersRouter.get("/:id", getUserById);

usersRouter.post('/verifyCode/:id', verifyCode);
usersRouter.post('/update-user/:id', updateUserInfo);

module.exports = usersRouter;