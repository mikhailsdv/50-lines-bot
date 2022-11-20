const path = require("path")
require("dotenv").config({path: path.resolve(__dirname, "../.env")})
const {
	BOT_TOKEN,
	DETA_PROJECT_KEY,
	HEIGHT,
	LINES,
} = process.env

module.exports = {
	BOT_TOKEN,
	DETA_PROJECT_KEY,
	HEIGHT: Number(HEIGHT),
	LINES: Number(LINES),
}
