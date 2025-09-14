const express = require("express");
 const { register, login
    ,getAllUsers,getUserById
 } = require("../controllers/users");

const authentication = require("../middleware/authentication");

const usersRouter = express.Router();


usersRouter.post("/register", register);
usersRouter.post("/login", login);
usersRouter.get("/",authentication, getAllUsers);
usersRouter.get("/:id", getUserById);

module.exports = usersRouter;