import { Express } from "express";
import { broadcast } from "./eventsource";

const route = (app: Express) =>
	app.post("/cast", (req, res) => {
		console.log("Received broadcast");
		console.log({ ...req.body });
		broadcast(req.body.text);
		res.sendStatus(200);
	});

export default route;
