# stdlib
import logging
from os import path
from subprocess import Popen
from time import sleep

# 3rd party
from obsws_python.events import EventClient

logging.basicConfig()
logger = logging.getLogger()
logger.setLevel(logging.INFO)
client = EventClient()


def on_custom_event(data):
    """Handle custom event."""

    if data.event_type != "tts-text":
        return

    logger.info(f"Saying: {data.text}")
    Popen((path.join("engine", "speak.sh"), data.text)).communicate()


client.callback.register(on_custom_event)

while True:
    sleep(0.1)
