import { EdgeSpeechTTS } from "@lobehub/tts";
import constants from "../constants";

const tts = new EdgeSpeechTTS({ locale: constants.LOCALE });

export default tts;
