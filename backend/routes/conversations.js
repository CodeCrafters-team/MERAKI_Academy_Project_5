const express = require("express");
const {
  createConversation,
  listMyConversations,
} = require("../controllers/conversations");

const authentication = require("../middleware/authentication");

 const conversationsRouter = express.Router();



conversationsRouter.post("/", authentication, createConversation);
conversationsRouter.get("/",authentication, listMyConversations);

module.exports = conversationsRouter;
