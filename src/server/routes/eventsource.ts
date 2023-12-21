import { Express, Response } from "express";

let response: Response;

export const broadcast = (text: string) => {
	response.write(`data: ${text}\n\n`);
	response.emit("drain");
};

const route = (app: Express) => {
	app.get("/cast", (req, res) => {
		console.log("EventSource client connected");

		response = res;

		res.set({
			"Cache-Control": "no-cache",
			"Content-Type": "text/event-stream",
			Connection: "keep-alive",
		});
		res.flushHeaders();
		res.on("close", () => console.log("EventSource client disconnected"));
	});

	app.post("/cast", (req, res) => {
		console.log("Received broadcast");
		console.log({ ...req.body });
		broadcast(req.body.text);
		res.sendStatus(200);
	});
};

export default route;
