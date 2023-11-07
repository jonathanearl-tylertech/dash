import { env } from "$env/dynamic/private";
import sqlite3 from "sqlite3";
import { open } from 'sqlite'

export const db = await open({
    filename: env.DB,
    driver: sqlite3.cached.Database
})

seed();

async function seed() {
    const { apps } = await import('../../data/apps');
    console.log('DROP TABLE IF EXISTS apps')
    await db.exec('DROP TABLE IF EXISTS apps')

    console.log('CREATE TABLE IF NOT EXISTS apps (name TEXT, description TEXT, url TEXT, icon TEXT, health TEXT)')
    await db.exec('CREATE TABLE IF NOT EXISTS apps (name TEXT, description TEXT, url TEXT, icon TEXT, health TEXT)');

    console.log('INSERT INTO apps (rowid, name, description, url, icon) VALUES (?, ?, ?, ?, ?)', apps);
    for (let i = 0; i < apps.length; i++) {
        let app = apps[i]
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
