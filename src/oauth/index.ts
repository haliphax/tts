import { authHeaders } from "../twitch";
import { hs } from "../util";

const headers = authHeaders("access_token");
const user = await fetch("https://api.twitch.tv/helix/users", { headers })
	.then((r) => r.json())
	.then((j) => j.data[0]);
const form = document.querySelector("form")!;
const voice = (document.getElementById("voice")! as HTMLInputElement).value;

form.action +=
	`#oauth=${hs.access_token}` +
	`&channel=${user.login}` +
	`&voice=${voice}` +
	"&reward=change-me";
