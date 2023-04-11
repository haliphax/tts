#!/usr/bin/env bash
pactl load-module module-native-protocol-unix socket=/tmp/pulseaudio.socket
docker-compose up

