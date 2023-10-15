<!-- backup -->
<script lang="ts">
    import type { AppItem } from "../data/apps";
    export let app: AppItem;
</script>

<a class="flex flex-col border border-gray-700 rounded p-4" href={app.link}>
    <div class="flex justify-between">
        <div class="text-ellipsis overflow-hidden">
            <h3 class="text-md text-gray-50 font-semibold">
                {app.name}
            </h3>
            <p class="text-xs" >{app.link}</p>
        </div>
        <img
            class="ml-2"
            width="48"
            height="48"
            src={app.icon}
            alt={app.name}
        />
    </div>
    <p class="flex-col flex-grow my-2 text-xs">
        <slot/>
    </p>
    <div class="flex justify-between">
        {#if app.docsUri}
            <a class="btn btn-neutral btn-xs" href={app.docsUri}
                >Docs</a
            >
        {:else}
            <span />
        {/if}
        <span class="flex gap-2 items-center">
            <span class="text-xs">Virtualization</span>
            <div
                class={`w-3 h-3 ${
                    app.color ?? ""
                } rounded-full`}
            />
        </span>
    </div>
</a>