import { Express } from "express";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const unlink = promisify(fs.unlink);

const route = (app: Express) =>
	app.delete("/", async (req, res) => {
		console.log("Deleting audio file");
		console.log({ ...req.body });

		// only digits allowed
		if (/\D/.exec(req.body.timestamp)) {
			console.warn("Invalid input");

			return res.sendStatus(400);
		}

		const fn = path.resolve(`./mp3/${req.body.timestamp}.mp3`);

		await unlink(fn);

		return res.sendStatus(200);
	});

export default route;
