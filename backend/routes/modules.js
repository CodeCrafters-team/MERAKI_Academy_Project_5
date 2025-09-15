const express = require("express");
const { 
     createModule,
    getModulesByCourse,
    updateModule
 } = require("../controllers/modules");

 const modulesRouter = express.Router();

modulesRouter.get("/:id", getModulesByCourse);
modulesRouter.post("/", createModule);
modulesRouter.put("/:id", updateModule);

module.exports = modulesRouter;