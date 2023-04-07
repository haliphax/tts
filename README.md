# tts

Text to speech overlay for OBS (using `espeak-ng`)

## Setup

### Generate a socket for sharing PulseAudio with the engine container

```shell
pactl load-module module-native-protocol-unix socket=/tmp/pulseaudio.socket
```

This command has been provided as a script, `socket.sh`.

### Build containers and start services

```shell
export COMPOSE_DOCKER_CLI_BUILD=1
export DOCKER_BUILDKIT=1
docker-compose build
docker-compose up
```

## Use

Visit http://localhost to go through the full OAuth round trip and get your
authorized URL for the browser source.

Create a reward in Twitch that requires a message. To determine the reward ID
for adding to the query string of the overlay, redeem the reward yourself and
enter `!tts.echo` as the message text. The overlay, if connected and
authorized, should respond with the internal ID of the reward. Add this ID as
the `reward` query string parameter for the overlay in OBS.

The command may also be executed directly by the broadcaster and moderators.

Example Twitch message command:

> !tts I'm a little teapot, short and stout

## Variants

The speech voice may be modified with a variant by providing the variant name
as the first word in the message, prefixed with a `+`. Underscores will be
converted to spaces before looking up the variant file in
`/usr/share/espeak-ng-data/voices/!v`.

Example Twitch message command with `Mr serious` variant:

> !tts +Mr_serious all your base are belong to us
