<script>
    import { apps } from "./apps";
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
