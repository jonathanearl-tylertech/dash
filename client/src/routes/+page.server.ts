import type { Actions } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import type { PageServerLoad } from "./$types";
import { getUser } from '$lib/server/oauth.js';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { LinkSchema } from "$lib/data/links";

export const load: PageServerLoad = async (event) => {
    const user = await getUser(event);
    if (!user)
        throw redirect(302, '/signin');

    const apps = await db.all('SELECT rowid as id, * FROM apps');
    const form = await superValidate(LinkSchema);

    return {
        apps,
        user,
        form
    };
}

export const actions: Actions = {
    "add-link": async (event) => {
        const user = await getUser(event);
        if (!user)
            return fail(401);

        const form = await superValidate(event.request, LinkSchema);
        console.log({ form })
        if (!form.valid)
            return fail(400, { form })

        await db.run(
            'INSERT INTO apps (name, description, url, icon, health) VALUES (?, ?, ?, ?, ?)',
            form.data.name,
            form.data.description,
            form.data.url,
            form.data.icon,
            form.data.health,
        )

        const apps = await db.all('SELECT rowid as id, * FROM apps');
        console.log({ apps })

        return {
            apps,
            user,
            form
        }
    }
}