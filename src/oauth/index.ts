import { authHeaders } from "../twitch";
import { hs } from "../util";

const headers = authHeaders("access_token");
const user = await fetch("https://api.twitch.tv/helix/users", { headers })
	.then((r) => r.json())
	.then((j) => j.data[0]);
const form = document.querySelector("form")!;

form.addEventListener("submit", () => {
	const exclude = (document.getElementById("exclude")! as HTMLInputElement).value;
	const qsExclude = exclude.length > 0 ? `&exclude=${exclude}` : "";

	const readAll = (document.getElementById("all")! as HTMLInputElement).checked;

	form.action +=
		`#oauth=${hs.access_token}` +
		`&channel=${user.login}` +
		qsExclude +
		`${readAll ? "&all=1" : ""}` +
		"&reward=change-me";
});
