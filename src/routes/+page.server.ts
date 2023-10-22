import type { Actions } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => {
    const apps = db.all('SELECT rowid as id, * FROM apps');
    return {apps}
}

export const actions: Actions = {
    "add-link": () => {
        
    }
}