import { Buffer } from "buffer";
import { Express } from "express";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import tts from "../tts";

const writeFile = promisify(fs.writeFile);

const route = (app: Express) =>
	app.post("/", async (req, res) => {
		console.log("Creating audio file");
		console.log({ ...req.body });

		const payload = {
			input: req.body.text,
			options: {
				voice: "en-US-AnaNeural",
			},
		};
		const resp = await tts.create(payload);
		const buff = Buffer.from(await resp.arrayBuffer());
		const fn = Date.now();

		console.log(`Timestamp: ${fn}`);

		const file = path.resolve(`./mp3/${fn}.mp3`);

		await writeFile(file, buff);

		if (req.body.hasOwnProperty("broadcast")) {
			res.sendStatus(200);
		} else {
			res.status(200).json({ timestamp: fn });
		}
	});

export default route;
