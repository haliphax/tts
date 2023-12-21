import { authHeaders } from "../twitch";
import { hs } from "../util";

const headers = authHeaders("access_token");
const user = await fetch("https://api.twitch.tv/helix/users", { headers })
	.then((r) => r.json())
	.then((j) => j.data[0]);
const form = document.querySelector("form")!;
const localeInput = document.getElementById("locale")! as HTMLInputElement;

localeInput.value = window.navigator.language;

form.addEventListener("submit", () => {
	const voice = (document.getElementById("voice")! as HTMLInputElement).value;

	form.action +=
		`#oauth=${hs.access_token}` +
		`&channel=${user.login}` +
		`&voice=${localeInput.value}-${voice}` +
		"&reward=change-me";
});
