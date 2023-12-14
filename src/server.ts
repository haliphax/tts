// monkey patch
import WebSocket from "ws";
global.WebSocket = WebSocket;

import express from "express";
import { EdgeSpeechTTS } from "@lobehub/tts";
import { Buffer } from "buffer";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const unlink = promisify(fs.unlink);
const writeFile = promisify(fs.writeFile);
const tts = new EdgeSpeechTTS({ locale: "en-US" });
const app = express();
app.use(express.json());
app.use("/", express.static("./src/public"));
app.use("/mp3", express.static("./mp3"));

app.delete("/", async (req, res) => {
	// only digits allowed
	if (/\D/.exec(req.body.timestamp)) {
		return res.sendStatus(400);
	}

	const fn = path.resolve(`./mp3/${req.body.timestamp}.mp3`);
	await unlink(fn);
	return res.sendStatus(200);
});

app.post("/", async (req, res) => {
	const payload = {
		input: req.body.text,
		options: {
			voice: "en-US-AnaNeural",
		},
	};
	const resp = await tts.create(payload);
	const buff = Buffer.from(await resp.arrayBuffer());
	const fn = Date.now();
	const file = path.resolve(`./mp3/${fn}.mp3`);
	await writeFile(file, buff);
	res.status(200).json({ timestamp: fn });
});

const port = parseInt(process.env.PORT ?? "3000");
console.log(`Listening @ http://localhost:${port}`);
app.listen(port);
