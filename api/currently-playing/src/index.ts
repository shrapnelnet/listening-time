/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import type { D1Database } from "@cloudflare/workers-types"

export interface Env {
	db: D1Database
	TYLER: string
	ROSS: string
	SAM: string
}

interface ExternalUrls {
	spotify: string;
}

interface Artist {
	external_urls: ExternalUrls;
	href: string;
	id: string;
	name: string;
	type: string;
	uri: string;
}

interface Image {
	height: number;
	url: string;
	width: number;
}

interface Album {
	album_type: string;
	artists: Artist[];
	available_markets: string[];
	external_urls: ExternalUrls;
	href: string;
	id: string;
	images: Image[];
	name: string;
	release_date: string;
	release_date_precision: string;
	total_tracks: number;
	type: string;
	uri: string;
}

interface ItemArtist {
	external_urls: ExternalUrls;
	href: string;
	id: string;
	name: string;
	type: string;
	uri: string;
}

interface ItemExternalIds {
	isrc: string;
}

interface ItemExternalUrls {
	spotify: string;
}

interface Item {
	album: Album;
	artists: ItemArtist[];
	available_markets: string[];
	disc_number: number;
	duration_ms: number;
	explicit: boolean;
	external_ids: ItemExternalIds;
	external_urls: ItemExternalUrls;
	href: string;
	id: string;
	is_local: boolean;
	name: string;
	popularity: number;
	preview_url: string;
	track_number: number;
	type: string;
	uri: string;
}

interface Actions {
	disallows: {
		resuming: boolean;
	};
}

interface CurrentPlayback {
	timestamp: number;
	context: {
		external_urls: ExternalUrls;
		href: string;
		type: string;
		uri: string;
	};
	progress_ms: number;
	item: Item;
	currently_playing_type: string;
	actions: Actions;
	is_playing: boolean;
}

interface ExternalUrls {
	spotify: string;
}

interface Artist {
	external_urls: ExternalUrls;
	href: string;
	id: string;
	name: string;
	type: string;
	uri: string;
}

interface Image {
	height: number;
	url: string;
	width: number;
}

interface Album {
	album_type: string;
	artists: Artist[];
	available_markets: string[];
	external_urls: ExternalUrls;
	href: string;
	id: string;
	images: Image[];
	name: string;
	release_date: string;
	release_date_precision: string;
	total_tracks: number;
	type: string;
	uri: string;
}

interface TrackArtist {
	external_urls: ExternalUrls;
	href: string;
	id: string;
	name: string;
	type: string;
	uri: string;
}

interface TrackExternalIds {
	isrc: string;
}

interface TrackExternalUrls {
	spotify: string;
}

interface Track {
	album: Album;
	artists: TrackArtist[];
	available_markets: string[];
	disc_number: number;
	duration_ms: number;
	explicit: boolean;
	external_ids: TrackExternalIds;
	external_urls: TrackExternalUrls;
	href: string;
	id: string;
	is_local: boolean;
	name: string;
	popularity: number;
	preview_url: string;
	track_number: number;
	type: string;
	uri: string;
}

interface ContextExternalUrls {
	spotify: string;
}

interface Context {
	type: string;
	href: string;
	external_urls: ContextExternalUrls;
	uri: string;
}

interface RecentTracksItem {
	track: Track;
	played_at: string;
	context: Context;
}

interface Cursors {
	after: string;
	before: string;
}

interface RecentTracksResponse {
	items: RecentTracksItem[];
	next: string;
	cursors: Cursors;
	limit: number;
	href: string;
}


async function getRecentlyPlayed(headers: Headers) {
	return fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1", {headers})
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const all = [env.ROSS, env.TYLER, env.SAM]
		const db = env.db
		let tracks = []
		for (const email of all) {
			const res = await db
				.prepare("SELECT access_token FROM accounts WHERE email = ?")
				.bind(email)
				.first()
			if (!res) {
				tracks.push({})
				continue
			}
			const { access_token } = res
			const headers = new Headers()
			headers.set("Authorization", `Bearer ${access_token}`)
			const currentlyPlaying = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {headers})
			if (currentlyPlaying.status === 204) {
				// no currently playing track: get recent instead
				const recentlyPlayed = await getRecentlyPlayed(headers)
				const recentlyPlayedJSON: RecentTracksResponse = await recentlyPlayed.json()
				const prettyRecentlyPlayed = {
					cover: recentlyPlayedJSON.items[0].track.album.images[1].url,
					artist: recentlyPlayedJSON.items[0].track.artists[0].name,
					name: recentlyPlayedJSON.items[0].track.name
				}
				tracks.push(prettyRecentlyPlayed)
				continue
			}
			const currentlyPlayingJSON: CurrentPlayback = await currentlyPlaying.json()
			const prettyCurrentlyPlaying = {
				cover: currentlyPlayingJSON.item.album.images[1].url,
				artist: currentlyPlayingJSON.item.artists[0].name,
				name: currentlyPlayingJSON.item.name
			}
			tracks.push(prettyCurrentlyPlaying)
		}
		return new Response(JSON.stringify(tracks), {
			headers: {
				"Access-Control-Allow-Origin": "*"
			}
		});
	},
};
