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
COPY --from=espeak /usr/lib/*espeak* /usr/lib/
COPY --from=espeak /usr/bin/espeak* /usr/bin/
COPY --from=espeak /usr/share/espeak-ng-data /usr/share/espeak-ng-data
RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" \
	>> /etc/apk/repositories
RUN --mount=type=cache,target=/var/cache/apk,sharing=locked \
	apk add mbrola mbrola-voices pulseaudio-utils
COPY ./pyproject.toml /app/
COPY ./engine /app/engine
RUN <<-EOF
	set -eo pipefail
	apk add pipewire pipewire-pulse pipewire-tools
	adduser -h /app -D -H -g '' -s /bin/false tts
	chown -R tts:tts /app
EOF
USER tts
RUN <<-EOF
	set -eo pipefail
	pip install -U pip
	pip install .
EOF
CMD ["python", "-m", "engine"]
