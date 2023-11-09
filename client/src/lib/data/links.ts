import { z } from 'zod';

export const LinkSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3),
  description: z.string().optional(),
  url: z.string().url().optional(),
  icon: z.string().url().optional(),
  health: z.string().url().optional(),
});

export type Link = z.infer<typeof LinkSchema>;

export const links = [{
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
},]