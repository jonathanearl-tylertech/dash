// See https://kit.svelte.dev/docs/types#app

import type { UserClaims } from "$lib/server/oauth";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: UserClaims | null
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
