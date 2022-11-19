import * as path from "https://deno.land/std@0.165.0/path/posix.ts";
import { fromMeta } from "https://x.nest.land/dirname_deno@0.3.0/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
const { __dirname, __filename } = fromMeta(import.meta);

export default config({
	path: path.resolve(__dirname, "../.env")
})
