# tts

Text to speech overlay for OBS

Note: This project has been overhauled to include a server component, as the
speech synthesis options within the provided version of CEF are unreliable on
Linux. As such, this project is now Linux-specific.

## Setup

### Generate a socket for sharing PulseAudio with the engine container

```shell
pactl load-module module-native-protocol-unix socket=/tmp/pulseaudio.socket
```

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
