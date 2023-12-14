import constants from "./constants.js";
import { hs } from "./util.js";
import { isBroadcaster, isModerator, twitchClient } from "./twitch.js";

for (let prop of ["channel", "oauth"]) {
	if (!hs.hasOwnProperty(prop)) {
		window.location = constants.OAUTH_URL;
		break;
	}
}

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

const speak = async (username, text) => {
	await fetch("/", {
		body: JSON.stringify({ text: `${username} says: ${text}` }),
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

twitch.on("message", async (channel, tags, message, self) => {
	if (self) return;

	const cmd = commandRgx.exec(message);

	if (cmd) {
		// command was used

		const command = cmd[1].toLowerCase().substring(1);
		const args = cmd[2];

		switch (command) {
			case "tts.echo":
				if (!isBroadcaster(tags) && !isModerator(tags)) return;

				twitch.say(hs.channel, tags["custom-reward-id"]);
				break;
			case "tts":
				if ((!isBroadcaster(tags) && !isModerator(tags)) || !args) return;

				speak(tags.username, args);

				break;
		}
	} else if (
		hs.hasOwnProperty("reward") &&
		tags["custom-reward-id"] == hs.reward
	) {
		// reward redemption was used
		speak(tags.username, message);
	}
});

twitch.connect();
setTimeout(() => (document.body.style = "display:none"), 3000);
