const {BOT_TOKEN} = require("./src/env.js")
const bot = require("./src/bot")
const {webhookCallback} = require("grammy")
const express = require("express")
const expressApp = express()

expressApp.use(express.json())

expressApp.use(`/${BOT_TOKEN}`, webhookCallback(bot, "express"))

expressApp.get("/", (req, res) => {
	res.send("Hello World!")
})

module.exports = expressApp
