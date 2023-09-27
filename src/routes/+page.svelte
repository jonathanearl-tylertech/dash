<script>
    import gruntIcon from "$lib/assets/grunt.svg";
    import gulpIcon from "$lib/assets/gulp.svg";
    import webpackIcon from "$lib/assets/webpack.svg";
    import proxmoxIcon from '$lib/assets/proxmox.svg';
    import cloudflare from '$lib/assets/cloudflare.svg';
    import googleDomainIcon from '$lib/assets/google-domains.png'
    const apps = [
        {
            name: "Proxmox",
            icon: proxmoxIcon,
            description: "Selfhost virtual machines on your server.",
            docsUri: "",
            uri: "https://192.168.88.69:8006",
            color: "bg-gray-400"
        },
        {
            name: "CloudFlare",
            icon: cloudflare,
            description: "CDN and Name Server host",
            docsUri: "",
            uri: "https://dash.cloudflare.com",
            color: "bg-gray-400"
        },
        {
            name: "Google Domains",
            icon: googleDomainIcon,
            description: "Registrar.",
            docsUri: "",
            uri: "https://domains.google.com/registrar",
            color: "bg-gray-400"
        },
        {
            name: "Webpack",
            icon: webpackIcon,
            description: "Build a NodeJS project with npm and webpack.",
            docsUri: "http://192.168.88.2",
            uri: "Javascript",
        },
        {
            name: "Grunt",
            icon: gruntIcon,
            description: "Build a NodeJS project with npm and grunt.",
            docsUri: "http://192.168.88.2",
            uri: "Javascript",
        },
        {
            name: "Gulp",
            icon: gulpIcon,
            description: "Build a NodeJS project with npm and gulp.",
            docsUri: "http://192.168.88.2",
            uri: "Javascript",
        },
        {
            name: "Webpack",
            icon: webpackIcon,
            description: "Build a NodeJS project with npm and webpack.",
            docsUri: "http://192.168.88.2",
            uri: "Javascript",
        },
        {
            name: "Grunt",
            icon: gruntIcon,
            description: "Build a NodeJS project with npm and grunt.",
            docsUri: "http://192.168.88.2",
            uri: "Javascript",
        },
        {
            name: "Gulp",
            icon: gulpIcon,
            description: "Build a NodeJS project with npm and gulp.",
            docsUri: "http://192.168.88.2",
            uri: "Javascript",
        },
        {
            name: "Webpack",
            icon: webpackIcon,
            description: "Build a NodeJS project with npm and webpack.",
            docsUri: "http://192.168.88.2",
            uri: "Javascript",
        },
        {
            name: "Grunt",
            icon: gruntIcon,
            description: "Build a NodeJS project with npm and grunt.",
            docsUri: "http://192.168.88.2",
            uri: "Javascript",
        },
        {
            name: "Gulp",
            icon: gulpIcon,
            description: "Build a NodeJS project with npm and gulp.",
            docsUri: "http://192.168.88.2",
            uri: "Javascript",
        },
        {
            name: "Webpack",
            icon: webpackIcon,
            description: "Build a NodeJS project with npm and webpack.",
            docsUri: "http://192.168.88.2",
            uri: "Javascript",
        },
    ];
</script>

<section class="flex flex-col max-w-4xl mx-auto box-border mt-10">
    <h1 class="font-semibold text-xl text-gray-50 mb-2">Apps</h1>
    <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {#each apps as app}
            <div class="flex flex-col border border-gray-700 rounded p-4">
                <div class="flex justify-between">
                    <div class="text-ellipsis overflow-hidden">
                        <h2 class="text-md text-gray-50 font-semibold">{app.name}</h2>
                        <a class="text-xs" href={app.uri}>{app.uri}</a>
                    </div>
                    <img class="ml-2" width='48' height='48' src={app.icon} alt={app.name} />
                </div>
                <p class="flex-col flex-grow my-2 text-xs">{app.description}</p>
                <div class="flex justify-between">
                    {#if app.docsUri}
                        <a class="btn btn-neutral btn-xs" href={app.docsUri}>Docs</a>
                    {:else}
                        <span></span>
                    {/if}
                    <span class="flex gap-2 items-center">
                        <span class="text-xs">Virtualization</span>
                        <div class={`w-3 h-3 ${app.color ?? ''} rounded-full`}></div>
                    </span>
                </div>
            </div>
        {/each}
    </div>
</section>
