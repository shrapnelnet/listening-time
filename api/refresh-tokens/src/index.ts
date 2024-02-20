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
	SPOTIFY_CLIENT_SECRET: string
	SPOTIFY_CLIENT_ID: string
}


interface tokenType {
	email: string
	refresh_token: string
}

interface tokenRefreshResponse {
	access_token: string
	token_type: "Bearer"
	expires_in: 3600
	scope: string
}

export default {
	// The scheduled handler is invoked at the interval set in our wrangler.toml's
	// [[triggers]] configuration.
	async scheduled(event, env) {
		const db = env.db
		// FETCH LIST OF TOKENS
		const tokenArray = await db
			.prepare("SELECT email, refresh_token FROM accounts")
			.all()
		for (const token: tokenType of tokenArray.results) {
			const headers = new Headers()
			let params = new URLSearchParams()
			const base64Auth = btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`)
			headers.set("Authorization", `Basic ${base64Auth}`)
			headers.set("Content-Type", "application/x-www-form-urlencoded")
			params.set("grant_type", "refresh_token")
			params.set("refresh_token", token.refresh_token)
			const res = await fetch("https://accounts.spotify.com/api/token", {
				method: "POST",
				headers: headers,
				body: params
			})
			// update refresh token in db
			const response: tokenRefreshResponse = await res.json()
			const dbResponse = await db
				.prepare("UPDATE accounts SET access_token = ? WHERE email = ?")
				.bind(response.access_token, token.email)
				.run()
			if (dbResponse.success) {
				console.log(`Success for email ${token.email}`)
				continue
			}
			console.log(`Failure for email ${token.email}`)
		}
	}
}
