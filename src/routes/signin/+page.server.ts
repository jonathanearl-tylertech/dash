import { getUser } from "$lib/server/oauth";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async (event) => {
    const user = await getUser(event);
    if (user)
        throw redirect(302, '/');
    return { };
}