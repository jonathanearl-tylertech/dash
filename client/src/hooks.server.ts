import { useAuthHook } from "$lib/server/oauth";
import { sequence } from "@sveltejs/kit/hooks";

/** @type {import('@sveltejs/kit').Handle} */
export const handle = sequence(
    useAuthHook
)