const express = require("express");
const { 
    createModule,
    getModulesByCourse,
    updateModule,
    deleteModule,
 } = require("../controllers/modules");

 const modulesRouter = express.Router();

modulesRouter.get("/:id", getModulesByCourse);
modulesRouter.post("/", createModule);
modulesRouter.put("/:id", updateModule);
modulesRouter.delete("/:id", deleteModule);

module.exports = modulesRouter;