<script lang="ts">
    import type { AppItem } from "../data/apps";
    export let app: AppItem;
</script>

<a class="flex flex-col border border-gray-700 rounded p-4 mb-2" href={app.link}>
    <div class="flex justify-between">
        <div class="text-ellipsis overflow-hidden">
            <h3 class="text-md text-gray-50 font-semibold mb-1">
                {app.name}
            </h3>
            <p class="text-xs">
                <span class="flex gap-2 items-center">
                    <div class={`w-3 h-3 ${app.color ?? ""} rounded-full`} />
                    <span class="text-xs">{app.time}</span>
                </span><slot />
            </p>
        </div>
        <img
            class="ml-2"
            width="48"
            height="48"
            src={app.icon}
            alt={app.name}
        />
    </div>
</a>
