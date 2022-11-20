const path = require("path")
require("dotenv").config({path: path.resolve(__dirname, "../.env")})
const {
	BOT_TOKEN,
	DETA_PROJECT_KEY,
	IMAGE_SIZE,
	LINES,
} = process.env

module.exports = {
	BOT_TOKEN,
	DETA_PROJECT_KEY,
	IMAGE_SIZE: Number(IMAGE_SIZE),
	LINES: Number(LINES),
}
