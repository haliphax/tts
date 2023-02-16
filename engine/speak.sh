#!/bin/ash
espeak -z --stdout "$@" | paplay -p
