import constants from "./constants.js";
import { hs } from "./util.js";
import { isBroadcaster, isModerator, twitchClient } from "./twitch.js";

for (let prop of ["channel", "oauth", "username"]) {
	if (!hs.hasOwnProperty(prop)) {
		window.location = constants.OAUTH_URL;
		break;
	}
}

const obs = new OBSWebSocket();
await obs.connect();

const twitch = twitchClient();
const commandRgx = /^(\![-_.a-z0-9]+)(?:\s+(.+))?$/i;

async function speak(text) {
	await obs.call("BroadcastCustomEvent", {
		eventData: {
			eventType: "tts-text",
			text: args,
		},
	});
}

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

				speak(args);

				break;
		}
	} else if (
		hs.hasOwnProperty("reward") &&
		tags["custom-reward-id"] == hs.reward
	) {
		// reward redemption was used
		speak(message);
	}
});

twitch.connect();
setTimeout(() => (document.body.style = "display:none"), 3000);
