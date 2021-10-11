const qs = Object.fromEntries(
	window.location.href.split('?')[1].split('&').map(v => v.split('=')));
const twitch = new tmi.Client({
	channels: [qs.channel],
	identity: {
		username: qs.username,
		password: `oauth:${qs.oauth}`,
	},
});

const speech = new SpeechSynthesisUtterance();
speech.lang = qs.lang || 'en-US';

const isBroadcaster = (tags) => tags.badges.hasOwnProperty('broadcaster');
const isModerator = (tags) => tags.mod;

const commandRgx = /^(\![-_.a-z0-9]+)(?:\s+(.+))?$/i;

twitch.on('message', (channel, tags, message, self) => {
	const cmd = commandRgx.exec(message);

	if (self) return;

	if (cmd) {
		const command = cmd[1].toLowerCase().substring(1);
		const args = cmd[2];

		switch (command) {
			case 'ttsecho':
				if (!isBroadcaster && !isModerator(tags))
					return;

				twitch.say(qs.channel, tags['custom-reward-id']);
				break;
			case 'tts':
				if (!isBroadcaster && !isModerator(tags) || !args)
					return;

				speech.text = args;
				speechSynthesis.speak(speech);
				break;
		}
	}
	else if (qs.hasOwnProperty('reward')
		&& tags['custom-reward-id'] == qs.reward)
	{
		speech.text = message;
		speechSynthesis.speak(speech);
	}
});

twitch.connect();
