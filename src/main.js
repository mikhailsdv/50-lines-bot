const {IMAGE_SIZE, LINES} = require("./env")
const axios = require("axios")
const PImage = require("pureimage")

const decel = (x) => 1 - (x - 1) * (x - 1) // easing

const unit32toRGBA = n => {
	const str16 = n.toString(16).padStart(8, "0")
	return [
		parseInt(str16.substring(0, 2), 16),
		parseInt(str16.substring(2, 4), 16),
		parseInt(str16.substring(4, 6), 16),
		parseInt(str16.substring(6, 8), 16),
	]
}

const grayscale = rgba => rgba[3] === 0 ? 255 : rgba[0] * .3 + rgba[1] * .59 + rgba[2] * .11

const processImage = async (imageURL, outputStream) => {
	const start = Date.now()

	const response = await axios({
		method: "get",
		url: imageURL,
		responseType: "stream",
	});
	const img = await PImage.decodeJPEGFromStream(response.data)

	let imageWidth, imageHeight, curveViolation
	if (img.height >= img.width) {
		curveViolation = 5
		imageWidth = Math.floor(img.width * IMAGE_SIZE / img.height)
		imageHeight = IMAGE_SIZE
	} else {
		curveViolation = 4
		imageWidth = IMAGE_SIZE
		imageHeight = Math.floor(img.height * IMAGE_SIZE / img.width)
	}


	const canvas = PImage.make(imageWidth, imageHeight)

	const ctx = canvas.getContext("2d")
	ctx.lineWidth = 2
	ctx.lineJoin = "round"
	ctx.imageSmoothingEnabled = true

	ctx.fillStyle = "white"
	ctx.fillRect(0, 0, imageWidth, imageHeight)

	ctx.fillStyle = "black"
	ctx.strokeStyle = "black"

	for (let y = 0; y < LINES; y++) {
		ctx.beginPath()
		ctx.moveTo(0, 0)

		let l = 0
		let prevLineX = 0, prevLineY = 0

		for (let x = 0; x < imageWidth; x++) {
			const c = grayscale(unit32toRGBA(img.getPixelRGBA(Math.floor(x / imageWidth * img.width), Math.floor(y * (img.height / LINES)))))

			l += (255 - c) / 255

			const m = (255 - c) / 255
			prevLineX = x
			prevLineY = (y + 0.5) * imageHeight / LINES + Math.sin(l * Math.PI / 2) * curveViolation * decel(m)

			ctx.lineTo(
				prevLineX,
				prevLineY,
			)
		}
		ctx.stroke()
	}

	const finishedIn = Date.now() - start
	console.log(`Done in ${finishedIn} ms`)
	await PImage.encodeJPEGToStream(canvas, outputStream, 95)
	return finishedIn
}

module.exports = processImage
