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
	SPOTIFY_CLIENT_ID: string
	SPOTIFY_CLIENT_SECRET: string
}

interface callback {
	code: string
}

interface callbackResponseSuccess {
	access_token: string
	token_type: string
	expires_in: number
	refresh_token: string
	scope: string
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		if (request.method != "POST")
			return new Response(null, { status: 405 })

		const db = env.db
		let redirect_uri = "https://music.shr4pnel.com/callback"
		const body: callback | null = await request.json()
		if (!body)
			return new Response(null, {
				status: 401,
				headers: {
					"Access-Control-Allow-Origin": "*"
				}
			})
		try {
			const params = new URLSearchParams()
			params.set("code", body.code)
			params.set("redirect_uri", redirect_uri)
			params.set("grant_type", "authorization_code")
			const res = await fetch("https://accounts.spotify.com/api/token", {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					"Authorization": `Basic ${btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`)}`
				},
				method: "POST",
				body: params
			})
			const callbackResponse: callbackResponseSuccess | null = await res.json()
			if (!callbackResponse)
				return new Response("No callback response found", {
					status: 400,
					headers: {
						"Access-Control-Allow-Origin": "*"
					}
				})

			const refresh = callbackResponse.refresh_token
			const access = callbackResponse.access_token
			console.log(refresh, access, callbackResponse)

			const me = await fetch("https://api.spotify.com/v1/me", {
				headers: {
					"Authorization": `Bearer ${access}`
				}
			})
			const meJSON = await me.json()
			const email = meJSON.email
			console.log(email, "email")
			const insertSuccess = await db
				.prepare("INSERT INTO accounts VALUES (?, ?, ?)")
				.bind(email, refresh, access)
				.run()
			if (insertSuccess.success) {
				return new Response("Created", {
					status: 201,
					headers: {
						"Access-Control-Allow-Origin": "*"
					}
				})
			} else {
				return new Response(null, {
					status: 500,
					headers: {
						"Access-Control-Allow-Origin": "*"
					}
				})
			}
		} catch (err) {
			console.log(err)
			return new Response(err, {
				status: 400,
				headers: {
					"Access-Control-Allow-Origin": "*"
				}
			})
		}
	},
}
