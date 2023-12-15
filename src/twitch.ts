import { ChatUserstate, Client } from "tmi.js";
import constants from "./constants";
import { hs } from "./util";

/**
 * Twitch API auth headers
 * @param tokenKey Optional key to use when pulling the auth token from
 * the current URL's hash string; defaults to `oauth` if unset
 * @returns The HTTP headers to use for Twitch API authentication
 */
const authHeaders = (tokenKey?: string): Headers => {
	const token = tokenKey ? hs[tokenKey] : hs.oauth;

	return new Headers({
		Authorization: `Bearer ${token}`,
		"Client-ID": constants.CLIENT_ID,
	});
};

/** Twitch client */
const twitchClient = () =>
	new Client({
		channels: [hs.channel],
		identity: {
			username: hs.username,
			password: `oauth:${hs.oauth}`,
		},
	});

/** based on tags, is this user the broadcaster? */
const isBroadcaster = (tags: ChatUserstate) =>
	tags.badges?.hasOwnProperty("broadcaster") ?? false;
/** based on tags, is this user a moderator? */
const isModerator = (tags: ChatUserstate) => tags.mod;

export { authHeaders, isBroadcaster, isModerator, twitchClient };
