import constants from './constants.js';
import { hs } from './util.js';
import { isBroadcaster, isModerator, twitchClient } from './twitch.js';

for (let prop of ['channel', 'oauth', 'username'])
	if (!hs.hasOwnProperty(prop))
		window.location = constants.OAUTH_URL;

const twitch = twitchClient();

speechSynthesis.onvoiceschanged = e => {
  speechSynthesis.getVoices();
};
speechSynthesis.getVoices();

const speech = new SpeechSynthesisUtterance();
speech.lang = hs.lang || 'en';

const commandRgx = /^(\![-_.a-z0-9]+)(?:\s+(.+))?$/i;

twitch.on('message', (channel, tags, message, self) => {
	const cmd = commandRgx.exec(message);

	if (self) return;

	if (cmd) {
		const command = cmd[1].toLowerCase().substring(1);
		const args = cmd[2];

		switch (command) {
			case 'ttsecho':
				if (!isBroadcaster(tags) && !isModerator(tags))
					return;

				twitch.say(hs.channel, tags['custom-reward-id']);
				break;
			case 'tts':
				if (!isBroadcaster(tags) && !isModerator(tags) || !args)
					return;

				speech.text = args;
				speechSynthesis.speak(speech);
				break;
		}
	}
	else if (hs.hasOwnProperty('reward')
		&& tags['custom-reward-id'] == hs.reward)
	{
		speech.text = message;
		speechSynthesis.speak(speech);
	}
});

twitch.connect();
setTimeout(() => document.body.style = 'display:none', 3000);
