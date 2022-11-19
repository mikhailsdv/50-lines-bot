import env from "./env.js"
import {Bot, InlineKeyboard, InputFile, HttpError, GrammyError} from "https://deno.land/x/grammy/mod.ts"
import {trim} from "./utils.js"
import processImage from "./main.js"

const bot = new Bot(env.BOT_TOKEN)

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
				Я перерисовываю картиночки, используя всего 50 линий. 

				<a href="https://gist.github.com/u-ndefine/8e4bc21be4275f87fefe7b2a68487161">Оригинальный код</a>
				Переписано на JavaScript by @Loskir
				<a href="https://github.com/Loskir/50-lines-bot">Исходный код бота</a>, <a href="https://loskir.github.io/50-lines">веб-версия</a>
				Подписывайтесь на мой канал: @Loskirs
			`),
			parse_mode: "HTML",
			disable_web_page_preview: true,
		},
	)
})

bot.on("message:photo", async (ctx) => {
	console.log(ctx)
	const {file_path} = await bot.api.getFile(ctx.message.photo.at(-1).file_id)
	const buffer = await processImage(`https://api.telegram.org/file/bot${env.BOT_TOKEN}/${file_path}`)
	await ctx.replyWithPhoto(new InputFile(buffer))
})

export default bot
