import { authHeaders } from "../twitch.js";
import { hs } from "../util.js";

const headers = authHeaders("access_token");

const user = await fetch("https://api.twitch.tv/helix/users", { headers })
	.then((r) => r.json())
	.then((j) => j.data[0]);

const form = document.querySelector("form");
form.action += `#oauth=${hs.access_token}&channel=${user.login}`;
