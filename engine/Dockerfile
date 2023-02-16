# syntax = docker/dockerfile-upstream:1-labs

FROM python:3.11-alpine
LABEL author="haliphax"
WORKDIR /app
RUN  --mount=type=cache,target=/var/cache/apk,sharing=locked \
	apk add espeak pulseaudio-utils wget
COPY ./pyproject.toml /app/
COPY ./engine /app/engine
RUN <<-EOF
	set -eo pipefail
	adduser -h /app -D -H -g '' -s /bin/false tts
	addgroup tts audio
	addgroup root audio
	chown -R tts:tts /app
	cat >/tmp/pulseaudio.client.conf <<EOF1
default-server = unix:/tmp/pulseaudio.socket
autospawn = no
daemon-binary = /bin/true
enable-shm = false
EOF1
EOF
USER tts
RUN <<-EOF
	set -eo pipefail
	pip install -U pip
	pip install .
EOF
CMD ["python", "-m", "engine"]
