import { env } from "$env/dynamic/private";
import { apps } from '$lib/data/apps';
import sqlite3 from "sqlite3";
import { open } from 'sqlite'

export const db = await open({
    filename: env.DB,
    driver: sqlite3.cached.Database
})
await db.exec('DROP TABLE IF EXISTS apps')
await db.exec('CREATE TABLE IF NOT EXISTS apps (name TEXT, description TEXT, url TEXT, icon TEXT, health TEXT)');
for (let i = 0; i < apps.length; i++) {
    let app = apps[i]
    console.log(app)
    await db.run(
        'INSERT INTO apps (rowid, name, description, url, icon, health) VALUES (?, ?, ?, ?, ?, ?)',
        i,
        app.name,
        app.description,
        app.link,
        app.link,
        app.link
    )
}