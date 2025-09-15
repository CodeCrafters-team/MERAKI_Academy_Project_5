const express = require("express");
const { 
    createRole
    ,getAllRoles
 } = require("../controllers/roles");

 const rolesRouter = express.Router();

rolesRouter.get("/", getAllRoles);
rolesRouter.post("/", createRole);

module.exports = rolesRouter;