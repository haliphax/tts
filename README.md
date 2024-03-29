# tts

Twitch chat text-to-speech overlay for OBS (using [lobe-tts][])

## Setup

### Install dependencies

```shell
npm ci
```

### Build the overlay

```shell
npm run build
```

## Use

Start the server:

```shell
npm start
```

Visit http://localhost:3000 to go through the full OAuth round trip and get your
authorized URL for the browser source.

Create a reward in Twitch that requires a message. To determine the reward ID
for adding to the query string of the overlay, redeem the reward yourself and
enter `!tts.echo` as the (only) message text. The overlay, if connected and
authorized, should respond with the internal ID of the reward. Add this ID as
the `reward` query string parameter for the overlay in OBS.

The command may also be executed directly by the broadcaster and moderators.

Example Twitch message command:

> !tts I'm a little teapot, short and stout

### Advanced usage

The TTS trigger can be used without chat commands or reward redemptions by
sending a direct HTTP POST request:

```shell
curl -X POST \
	-H 'Content-Type: application/json' \
	-d '{"text":"hello, world"}' \
	http://localhost:3000/cast
```

[lobe-tts]: https://tts.lobehub.com
