const express = require("express");
const router = new express.Router();
const messageController = require("../controllers/messageController");
const { handleError } = require("../utilities");
const validate = require("../utilities/message-validation");

router
  .get("/", handleError(messageController.buildInbox))

  .get("/archive",handleError(messageController.buildArchivedMessages))

  .get("/send", handleError(messageController.buildSendMessage))

  .post("/send",validate.messageRules(),validate.checkMessageData,handleError(messageController.sendMessage))

  .get("/view/:message_id", handleError(messageController.buildViewMessage))

  .get("/reply/:message_id", handleError(messageController.buildReplyMessage))

  .post("/reply",validate.replyRules(),validate.checkReplyData,handleError(messageController.replyMessage))
  
  .get("/read/:message_id", handleError(messageController.readMessage))
  
  .get("/archive/:message_id", handleError(messageController.archiveMessage))
  
  .get("/delete/:message_id", handleError(messageController.deleteMessage));

module.exports = router;
