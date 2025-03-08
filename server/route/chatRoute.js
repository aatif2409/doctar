const express = require("express");
const { Chat } = require("../model/chatModel");
const wsRouter = express.Router();
wsRouter.ws("/:appointmentId", (ws, req) => {
  console.log(req.params.appointmentId);
  ws.on("message", (k) => {
    console.log(k);
    const { userType, userId="", msg } = JSON.parse(k);
    putIntoChat({ userId, userType, msg }, req.params.appointmentId);
  });
  // ws.close();
});
const putIntoChat = async ({ userType, userId, msg }, appointmentId) => {
  try {
    let chat = await Chat.findOne({ appointmentChatId: appointmentId });
    if (chat) {
      chat.chat.push({
        userType,
        time: new Date(),
        userId,
        msg,
      });
      await chat.save();
    } else {
      chat = new Chat({
        appointmentChatId: appointmentId,
        chat: [
          {
            userType,
            userId,
            time: new Date(),
            msg,
          },
        ],
      });
      await chat.save();
    }
    console.log("new msg added into chat");
    return;
  } catch (error) {
    console.error("Error adding message to chat:", error);
    throw error;
  }
};

const restRouter = express.Router();
restRouter.get("/:id", async (req, res) => {
  const appointmentId = req.params.id;
  try {
    const appointment = await Chat.findOne({
      appointmentChatId: appointmentId,
    });
    if (appointment) {
      res.send(appointment.chat);
    } else {
      res.status(404).send("no appointment found");
    }
  } catch (error) {}
});
module.exports = { wsRouter, restRouter };
