#!/bin/ash
variant="$1"
shift
espeak-ng -D -v "en+$variant" -z --stdout "$@" | paplay -p
