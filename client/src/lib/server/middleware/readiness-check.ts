import { base } from "$app/paths";
import type { Handle } from "@sveltejs/kit";

export const readinessCheck: Handle = async ({ event, resolve }) => {
    if (event.url.pathname == `${base ?? ''}/health`)
        return new Response('healthy', { status: 200 })
    
    return resolve(event);
}