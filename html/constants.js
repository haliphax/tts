const constants = {
	CLIENT_ID: 'fr4ey52j8hnsxslodbb0dt0glob7gh',
	OAUTH_REDIRECT_URI: '',
	OAUTH_URL: '',
};

constants.OAUTH_REDIRECT_URI = encodeURIComponent(
	window.location.href.replace(/(?:\/index\.html)?$/i, 'oauth'));

constants.OAUTH_URL = `https://id.twitch.tv/oauth2/authorize`
	+ `?client_id=${constants.CLIENT_ID}`
	+ `&redirect_uri=${constants.OAUTH_REDIRECT_URI}`
	+ `&response_type=token`
	+ `&scope=chat:read%20chat:edit`;

export default constants;
