import { env } from "$env/dynamic/private";
import sqlite3 from "sqlite3";
import { open } from 'sqlite'
import { building } from "$app/environment";

export const db = await open({
    filename: building ? './sqlite.db' : env.DB as string,
    driver: sqlite3.cached.Database
});

if (!building) {
    seed()
}


async function seed() {
    console.info('DB:', env.DB)
    const { links } = await import('$lib/data/links');
    console.log('DROP TABLE IF EXISTS apps')
    await db.exec('DROP TABLE IF EXISTS apps')

    console.log('CREATE TABLE IF NOT EXISTS apps (name TEXT, description TEXT, url TEXT, icon TEXT, health TEXT)')
    await db.exec('CREATE TABLE IF NOT EXISTS apps (name TEXT, description TEXT, url TEXT, icon TEXT, health TEXT)');

    console.log('INSERT INTO apps (rowid, name, description, url, icon) VALUES (?, ?, ?, ?, ?)', links);
    for (let i = 0; i < links.length; i++) {
        let app = links[i]
        await db.run(
            'INSERT INTO apps (rowid, name, description, url, icon) VALUES (?, ?, ?, ?, ?)',
            i,
            app.name,
            app.description,
            app.url,
            app.icon,
        )
    }
}
