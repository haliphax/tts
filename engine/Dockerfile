# syntax = docker/dockerfile-upstream:1-labs

FROM alpine:latest AS espeak
WORKDIR /build
RUN --mount=type=cache,target=/var/cache/apk,sharing=locked \
<<-EOF
	set -eo pipefail
	apk add autoconf automake clang g++ git libtool make
	git clone --depth 1 --single-branch https://github.com/espeak-ng/espeak-ng
	cd espeak-ng
	./autogen.sh
	CC=clang ./configure --prefix=/usr
	make
	make LIBDIR=/usr/lib install
EOF

FROM python:3.11-alpine
LABEL author="haliphax"
WORKDIR /app
COPY ./pyproject.toml /app/
COPY ./engine /app/engine
COPY --from=espeak /usr/lib/*espeak* /usr/lib/
COPY --from=espeak /usr/bin/espeak* /usr/bin/
COPY --from=espeak /usr/share/espeak-ng-data /usr/share/espeak-ng-data
RUN  --mount=type=cache,target=/var/cache/apk,sharing=locked \
	apk add pulseaudio-utils
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
