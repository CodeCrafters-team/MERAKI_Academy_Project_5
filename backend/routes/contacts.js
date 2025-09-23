const express = require("express");
const { 
  getAllContacts,
  createContact,
  deleteContactById
} = require("../controllers/contact");

const contactRouter = express.Router();

contactRouter.get("/", getAllContacts);
contactRouter.post("/", createContact);
contactRouter.delete("/:id", deleteContactById);

module.exports = contactRouter;
