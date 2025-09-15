const express = require("express");
const { 
getAllCategories,
getCategoryById,
createCategory,
updateCategory,
deleteCategory,
 } = require("../controllers/categories");

 const categoriesRouter = express.Router();

categoriesRouter.get("/", getAllCategories);
categoriesRouter.get("/:id", getCategoryById);
categoriesRouter.post("/", createCategory);
categoriesRouter.put("/:id", updateCategory);
categoriesRouter.delete("/:id", deleteCategory);

module.exports = categoriesRouter;