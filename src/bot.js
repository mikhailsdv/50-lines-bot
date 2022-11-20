const {BOT_TOKEN} = require("./env")
const {Bot, InputFile, HttpError, GrammyError} = require("grammy")
const {trim} = require("./utils")
const processImage = require("./main")
const streamBuffers = require("stream-buffers");

const bot = new Bot(BOT_TOKEN)

bot.catch(err => {
	const ctx = err.ctx
	console.error(`Error while handling update ${ctx.update.update_id}:`)
	const e = err.error
	if (e instanceof GrammyError) {
		console.error("Error in request:", e.description)
	} else if (e instanceof HttpError) {
		console.error("Could not contact Telegram:", e)
	} else {
		console.error("Unknown error:", e)
	}
})

bot.command("start", async ctx => {
	await ctx.replyWithPhoto(
		new InputFile("./demo.jpg"),
		{
			caption: trim(`
				👋 Привет. Отправь мне фото, а я перерисую его, используя всего 50 линий.
				
				<a href="https://gist.github.com/u-ndefine/8e4bc21be4275f87fefe7b2a68487161">Оригинальный код</a>;
				Переписано на JavaScript by @Loskir (канал @Loskirs);
				Оптимизированно под Deta by @mikhailsdv (канал @FilteredInternet);
				<a href="https://github.com/Loskir/50-lines-bot">Исходный код</a> и <a href="https://loskir.github.io/50-lines">веб-версия</a> by @Loskir;
				<a href="https://github.com/mikhailsdv/50-lines-bot">Исходный код</a> by @mikhailsdv.
			`),
			parse_mode: "HTML",
			disable_web_page_preview: true,
		},
	)
})

bot.on("message:photo", async (ctx) => {
	//await ctx.reply("Генерирую...")
	const photos = ctx.message.photo.reverse()
	const {file_id} = photos[2] || photos[1] || photos[0]
	const {file_path} = await bot.api.getFile(file_id)
	try {
		const outputStream = new streamBuffers.WritableStreamBuffer()
		await processImage(`https://api.telegram.org/file/bot${BOT_TOKEN}/${file_path}`, outputStream, ctx)
		await ctx.replyWithPhoto(new InputFile(outputStream.getContents()))
	} catch (err) {
		console.log(err)
		await ctx.reply("Не удалось обработать эту фотографию")
	}
})

module.exports = bot
