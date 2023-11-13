import { env } from "$env/dynamic/private";
import { logger } from "$lib/server/logger";
import { useReadinessCheck } from "$lib/server/middleware/readiness-check";
import { useUserAuthorization } from "$lib/server/middleware/user-authorization";
import { sequence } from "@sveltejs/kit/hooks";

logger.info({ VERSION: env.VERSION })

/** @type {import('@sveltejs/kit').Handle} */
export const handle = sequence(
    useReadinessCheck,
    useUserAuthorization,
)