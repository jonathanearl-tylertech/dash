import { useReadinessCheck } from "$lib/server/middleware/readiness-check";
import { useUserAuthorization } from "$lib/server/middleware/user-authorization";
import { sequence } from "@sveltejs/kit/hooks";

/** @type {import('@sveltejs/kit').Handle} */
export const handle = sequence(
    useReadinessCheck,
    useUserAuthorization,
)