import { sequence } from "@sveltejs/kit/hooks";
import { useAuthHook } from "$lib/server/hooks/auth";

/** @type {import('@sveltejs/kit').Handle} */
export const handle = sequence(
    useAuthHook,
)