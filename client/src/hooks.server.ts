import { readinessCheck } from "$lib/server/middleware/readiness-check";
import { useAuthHook } from "$lib/server/oauth";
import { sequence } from "@sveltejs/kit/hooks";

/** @type {import('@sveltejs/kit').Handle} */
export const handle = sequence(
    readinessCheck,
    useAuthHook,
)