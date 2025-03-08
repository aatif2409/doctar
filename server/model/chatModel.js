const mongoose = require("mongoose");
const chatChunkScema = new mongoose.Schema({
    userType: String,
    userId:String,
    time: Date,
    msg:String,
})
const chatSchema = new mongoose.Schema({
  appointmentChatId: String,
  chat: [chatChunkScema]

});
const Chat = mongoose.model("chats",chatSchema)
module.exports = {Chat}
