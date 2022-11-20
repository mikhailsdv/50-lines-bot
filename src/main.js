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
	console.log(imageURL)
	const start = Date.now()

	await loadImage(imageURL)
	const response = await axios({
		method: 'get',
		url: imageURL,
		responseType: "stream",
	});
	const img = await PImage.decodeJPEGFromStream(response.data)
	const HEIGHT = 750

	const imageWidth = Math.floor(img.width * HEIGHT / img.height)
	const imageHeight = HEIGHT

	const sourceCanvas = PImage.make(imageWidth, imageHeight)
	const resultCanvas = PImage.make(imageWidth, imageHeight)

	const sourceCtx = sourceCanvas.getContext("2d")
	const resultCtx = resultCanvas.getContext("2d")
	resultCtx.fillStyle = "white"
	resultCtx.fillRect(0, 0, imageWidth, imageHeight)

	sourceCtx.drawImage(img, 0, 0, imageWidth, imageHeight)

	resultCtx.fillStyle = "black"
	resultCtx.strokeStyle = "black"
	for (let y = 0; y < 50; y++) {
		resultCtx.beginPath()
		resultCtx.moveTo(0, 0)
		resultCtx.lineWidth = 2
		resultCtx.lineJoin = "round"

		let l = 0

		for (let x = 0; x < imageWidth; x++) {
			const c = grayscale(unit32toRGBA(sourceCanvas.getPixelRGBA(x, Math.floor(y * (imageHeight / 50)))))

			l += (255 - c) / 255

			const m = (255 - c) / 255

			resultCtx.lineTo(
				x,
				Math.round((y + 0.5) * imageHeight / 50 + Math.sin(l * Math.PI / 2) * 5 * decel(m)),
			)
		}
		resultCtx.stroke()
	}

	console.log(`done in ${Date.now() - start}ms`)
	await PImage.encodeJPEGToStream(resultCanvas, outputStream, 80)
	outputStream.end()
	return outputStream
}

module.exports = processImage
