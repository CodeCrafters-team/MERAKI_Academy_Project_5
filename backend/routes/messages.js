const express = require("express");
const { sendMessage, listMessages } = require("../controllers/messages");

const authentication = require("../middleware/authentication");

 const messagesRouter = express.Router();



messagesRouter.post("/:id", authentication, sendMessage);
messagesRouter.get("/:id",authentication, listMessages);

module.exports = messagesRouter ;
