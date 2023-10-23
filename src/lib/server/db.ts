import { env } from "$env/dynamic/private";
import sqlite3 from "sqlite3";
import { open } from 'sqlite'
import type { App } from "$lib/schemas/apps";

export const db = await open({
    filename: env.DB,
    driver: sqlite3.cached.Database
})

seed();

async function seed() {
    const apps: App[] = [
        {
            id: 0,
            name: "Proxmox",
            icon: "/icons/proxmox.svg",
            description: "Selfhost virtual machines on your server.",
            url: "https://192.168.88.69:8006",
        },
        {
            id: 1,
            name: "CloudFlare",
            icon: "/icons/cloudflare.svg",
            description: "CDN and Name Server host",
            url: "https://dash.cloudflare.com",
        },
        {
            id: 2,
            name: "Google Domains",
            icon: "/icons/google-domains.png",
            description: "Registrar.",
            url: "https://domains.google.com/registrar",
        },
    ];
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
