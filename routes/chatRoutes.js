const express = require("express");
const chatRouter = express.Router(); //to serve the external connection of modules


// Implement ChatPage APIs here 

chatRouter.get("/", async (req, res) => {
    res.render("chatPage");
});

module.exports = chatRouter