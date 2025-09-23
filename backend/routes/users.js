const express = require("express");
 const { register, login
   ,getAllUsers,getUserById,  forgotPassword, verifyResetCode, resetPassword
 } = require("../controllers/users");
 const { updateUser, deleteUser } = require("../controllers/users");

const authentication = require("../middleware/authentication");
const authorization = require("../middleware/authorization");

const usersRouter = express.Router();


usersRouter.post("/register", register);
usersRouter.post("/login", login);
// usersRouter.get("/", authentication,authorization("course.view"), getAllUsers);
usersRouter.get("/",  getAllUsers);

usersRouter.get("/:id", getUserById);
usersRouter.put("/:id",authentication, updateUser);        
usersRouter.delete("/:id",authentication, deleteUser);   

usersRouter.post("/forgot_password", forgotPassword);
usersRouter.post("/verify_reset_code", verifyResetCode);
usersRouter.put("/reset_password", resetPassword);
module.exports = usersRouter;