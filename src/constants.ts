let win: Window | null = null;

try {
	win = window;
} catch (e) {}

const constants = {
	CLIENT_ID: "fr4ey52j8hnsxslodbb0dt0glob7gh",
	LOCALE: "en-US",
	OAUTH_REDIRECT_URI: "",
	OAUTH_URL: "",
};

constants.OAUTH_REDIRECT_URI = encodeURIComponent(
	win?.location.href.replace(/(?:\/index\.html)?$/i, "oauth") ?? ""
);

constants.OAUTH_URL =
	"https://id.twitch.tv/oauth2/authorize?response_type=token&scope=chat:read" +
	`&client_id=${constants.CLIENT_ID}` +
	`&redirect_uri=${constants.OAUTH_REDIRECT_URI}`;

export default constants;
