import { getUser } from '$lib/server/oauth.js';
import { redirect } from '@sveltejs/kit';

export async function load(event) {
    const user = await getUser(event);
    if (!user)
        throw redirect(302, '/signin');
    return {
        user,
    }
}