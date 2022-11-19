import { Application } from "https://deno.land/x/oak/mod.ts";
import {webhookCallback} from "https://deno.land/x/grammy/mod.ts"
import {BOT_TOKEN} from "./src/env.js"
import bot from "./src/bot.js"

const app = new Application()
app.use(webhookCallback(bot, "oak"));


