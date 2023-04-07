# stdlib
import logging
from os import listdir, path
from random import choice, seed
from subprocess import Popen
from time import sleep

# 3rd party
from obsws_python.events import EventClient

VARIANTS_PATH = "/usr/share/espeak-ng-data/voices/!v"

logging.basicConfig()
logger = logging.getLogger()
logger.setLevel(logging.INFO)
client = EventClient()
variants = [f for f in listdir(VARIANTS_PATH)]


def on_custom_event(data):
    """Handle custom event."""

    if data.event_type != "tts-text":
        return

    first = data.text.split(" ")[0]
    variant: str
    is_random: bool
    text: str

    if first[0] == "+":
        is_random = False
        variant = first[1:].replace("_", " ")
        text = data.text[len(first) + 1 :]
    else:
        is_random = True
        variant = choice(variants)
        text = data.text

    logger.info(
        f"Speak: {text} (variant: {variant}{' [random]' if is_random else ''})"
    )
    Popen((path.join("engine", "speak.sh"), variant, text)).communicate()


client.callback.register(on_custom_event)
logger.info(f"Variants: {variants!r}")

while True:
    sleep(0.1)
