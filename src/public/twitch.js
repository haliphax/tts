import constants from "./constants.js";
import { hs } from "./util.js";

/**
 * Twitch API auth headers
 * @param {string} tokenKey Optional key to use when pulling the auth token from
 * the current URL's hash string; defaults to `oauth` if unset
 * @returns {Headers} The HTTP headers to use for Twitch API authentication
 */
const authHeaders = (tokenKey) => {
	const token = tokenKey ? hs[tokenKey] : hs.oauth;

	return new Headers({
		Authorization: `Bearer ${token}`,
		"Client-ID": constants.CLIENT_ID,
	});
};

/** Twitch client */
const twitchClient = () =>
	new tmi.Client({
		channels: [hs.channel],
		identity: {
			username: hs.username,
			password: `oauth:${hs.oauth}`,
		},
	});

/** based on tags, is this user the broadcaster? */
const isBroadcaster = (tags) => tags.badges.hasOwnProperty("broadcaster");
/** based on tags, is this user a moderator? */
const isModerator = (tags) => tags.mod;

export { authHeaders, isBroadcaster, isModerator, twitchClient };
