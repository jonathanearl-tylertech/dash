<script lang='ts'>
    export let link: any;
</script>

<a
    class="flex flex-col border border-gray-700 rounded p-4 mb-2 capitalize"
    href={link.url}
>
    <div class="flex justify-between">
        <div class="text-ellipsis overflow-hidden">
            <h3 class="text-md text-gray-50 font-semibold mb-1">
                {link.name}
            </h3>
            <p class="text-xs">
                <span class="flex gap-2 items-center">
                    <div class={`w-3 h-3 ${link.color ?? ""} rounded-full`} />
                    <span class="text-xs" />
                </span>
                <slot />
            </p>
        </div>
        {#if link.icon}
            <img
                class="ml-2"
                width="48"
                height="48"
                src={link.icon}
                alt={link.name}
            />
        {/if}
    </div>
</a>
