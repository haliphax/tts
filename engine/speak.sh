#!/bin/ash
variant="$1"
shift
espeak-ng -D -k20 -s150 -v"mb-en1+$variant" -z --stdout "$@" | pw-play --rate 8000 -
