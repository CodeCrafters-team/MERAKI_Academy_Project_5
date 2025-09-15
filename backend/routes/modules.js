const express = require("express");
const { 
     createModule,
    getModulesByCourse
 } = require("../controllers/modules");

 const modulesRouter = express.Router();

modulesRouter.get("/:id", getModulesByCourse);
modulesRouter.post("/", createModule);

module.exports = modulesRouter;