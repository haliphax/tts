import express from "express";
import createMp3Route from "./routes/create-mp3";
import deleteMp3Route from "./routes/delete-mp3";
import eventSourceRoute from "./routes/eventsource";

const app = express();

app.use(express.json());
// static site
app.use("/", express.static("./html"));
// audio files
app.use("/mp3", express.static("./mp3"));

// add routes
[createMp3Route, deleteMp3Route, eventSourceRoute].map((fn) => fn(app));

const host = process.env.HOST ?? "localhost";
const port = parseInt(process.env.PORT ?? "3000");

console.log(`Listening @ http://${host}:${port}`);
app.listen(port, host);
