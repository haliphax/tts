#!/bin/ash
variant="$1"
shift
espeak-ng -D -k 20 -v "mb-en1+$variant" -z --stdout "$@" | paplay -p
