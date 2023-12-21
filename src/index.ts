import { ChatUserstate } from "tmi.js";
import constants from "./constants";
import { hs } from "./util";
import { isBroadcaster, isModerator, twitchClient } from "./twitch";

for (let prop of ["channel", "oauth", "voice"]) {
	if (!hs.hasOwnProperty(prop)) {
		window.location.href = constants.OAUTH_URL;
		break;
	}
}

const voice = hs.voice;
const headers = {
	Accept: "application/json",
	"Content-Type": "application/json",
};

let timestamp = 0;
const audio = document.createElement("audio");

audio.autoplay = true;
audio.addEventListener("ended", async () => {
	await fetch("/", {
		body: JSON.stringify({ timestamp }),
		headers,
		method: "DELETE",
	});
});
document.body.appendChild(audio);

const twitch = twitchClient();
const commandRgx = /^(\![-_.a-z0-9]+)(?:\s+(.+))?$/i;

const speechText = (username: string, text: string) =>
	`${username} says: ${text}`;

const speak = async (text: string) => {
	await fetch("/", {
		body: JSON.stringify({ text, voice }),
		headers,
		method: "POST",
	})
		.then((v) => v.json())
		.then(async (j) => {
			timestamp = j.timestamp;
			audio.src = `/mp3/${timestamp}.mp3`;
			await audio.play();
		});
};

// Twitch chat listener
twitch.on(
	"message",
	async (
		channel: string,
		tags: ChatUserstate,
		message: string,
		self: boolean
	) => {
		if (self) return;

		const cmd = commandRgx.exec(message);

		if (cmd) {
			// command was used

			const command = cmd[1].toLowerCase().substring(1);
			const args = cmd[2];

			switch (command) {
				case "tts.echo":
					if (!isBroadcaster(tags) && !isModerator(tags)) {
						return;
					}

					twitch.say(hs.channel, tags["custom-reward-id"]);

					break;

				case "tts":
					if ((!isBroadcaster(tags) && !isModerator(tags)) || !args) {
						return;
					}

					speak(speechText(tags.username!, args));

					break;
			}
		} else if (
			hs.hasOwnProperty("reward") &&
			tags["custom-reward-id"] == hs.reward
		) {
			// reward redemption was used
			speak(speechText(tags.username!, message));
		}
	}
);

twitch
	.connect()
	.catch(() => {
		document.body.innerHTML = /*html*/ `
			<h1>TTS error</h1>
			<p>
				There was an error connecting to Twitch. You may need to
				<a href="/">generate a new authentication token</a>.
			</p>
			`;
	})
	.then(() =>
		setTimeout(() => document.body.setAttribute("style", "display:none"), 3000)
	);

// EventSource listener
const events = new EventSource("/cast");
events.addEventListener("message", (ev) => speak(ev.data));
