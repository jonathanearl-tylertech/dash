import type { Actions } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import type { PageServerLoad } from "./$types";
import { getUser } from '$lib/server/oauth.js';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
    const user = await getUser(event);
    if (!user)
        throw redirect(302, '/signin');

    const apps = db.all('SELECT rowid as id, * FROM apps');
    return {
        apps,
        user,
    };
}

export const actions: Actions = {
    "add-link": () => {

    }
}