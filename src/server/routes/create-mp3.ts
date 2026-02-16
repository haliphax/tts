import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { Express } from "express";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import constants from "../../constants";

const writeFile = promisify(fs.writeFile);
const tts = new TextToSpeechClient();

const route = (app: Express) =>
	app.post("/", async (req, res) => {
		console.log("Creating audio file");
		console.log({ ...req.body });

		const [resp] = await tts.synthesizeSpeech({
			audioConfig: { audioEncoding: "MP3" },
			input: { text: req.body.text },
			voice: { languageCode: constants.LOCALE },
		});
		const fn = Date.now();

		console.log(`Timestamp: ${fn}`);

		const file = path.resolve(`./mp3/${fn}.mp3`);

		await writeFile(file, resp.audioContent!);

		if (req.body.hasOwnProperty("broadcast")) {
			res.sendStatus(200);
		} else {
			res.status(200).json({ timestamp: fn });
		}
	});

export default route;
