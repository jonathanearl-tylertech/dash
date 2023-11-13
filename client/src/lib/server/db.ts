import { env } from "$env/dynamic/private";
import sqlite3 from "sqlite3";
import { open } from 'sqlite'
import { building } from "$app/environment";
import { logger } from "./logger";

export const db = await open({
    filename: env.DB as string ?? 'sqlite.db',
    driver: sqlite3.cached.Database
});

if (!building) {
    seed()
}


async function seed() {
    logger.info('DB:', env.DB)
    const { links } = await import('$lib/data/links');
    logger.info('DROP TABLE IF EXISTS apps')
    await db.exec('DROP TABLE IF EXISTS apps')

    logger.info('CREATE TABLE IF NOT EXISTS apps (name TEXT, description TEXT, url TEXT, icon TEXT, health TEXT)')
    await db.exec('CREATE TABLE IF NOT EXISTS apps (name TEXT, description TEXT, url TEXT, icon TEXT, health TEXT)');

    logger.info('INSERT INTO apps (rowid, name, description, url, icon) VALUES (?, ?, ?, ?, ?)', links);
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
