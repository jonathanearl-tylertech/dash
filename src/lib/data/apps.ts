import proxmoxIcon from '$lib/assets/proxmox.svg';
import cloudflare from '$lib/assets/cloudflare.svg';
import googleDomainIcon from '$lib/assets/google-domains.png'

export type AppItem = {
    link: string;
    icon: string;
    name: string;
    description: string;
    docsUri: string;
    color: string;
    time: string;
}

export const apps: AppItem[] = [
    {
        name: "Proxmox",
        icon: proxmoxIcon,
        description: "Selfhost virtual machines on your server.",
        docsUri: "",
        link: "https://192.168.88.69:8006",
        color: "bg-green-400",
        time: "3s",
    },
    {
        name: "CloudFlare",
        icon: cloudflare,
        description: "CDN and Name Server host",
        docsUri: "",
        link: "https://dash.cloudflare.com",
        color: "bg-gray-400",
        time: "3h",
    },
    {
        name: "Google Domains",
        icon: googleDomainIcon,
        description: "Registrar.",
        docsUri: "",
        link: "https://domains.google.com/registrar",
        color: "bg-gray-400",
        time: "3h",
    },
];