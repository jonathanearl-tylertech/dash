<script>
    import { page } from "$app/stores";
</script>

<main class="flex flex-col max-w-4xl mx-auto box-border mt-10">
    <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <section>
            <h2 class="font-semibold text-xl text-gray-50 mb-2">Apps</h2>
            {#each $page.data.apps as app}
                <a
                    class="flex flex-col border border-gray-700 rounded p-4 mb-2 capitalize"
                    href={app.url}
                >
                    <div class="flex justify-between">
                        <div class="text-ellipsis overflow-hidden">
                            <h3 class="text-md text-gray-50 font-semibold mb-1">
                                {app.name}
                            </h3>
                            <p class="text-xs">
                                <span class="flex gap-2 items-center">
                                    <div
                                        class={`w-3 h-3 ${
                                            app.color ?? ""
                                        } rounded-full`}
                                    />
                                    <span class="text-xs" />
                                </span>
                                <slot />
                            </p>
                        </div>
                        {#if app.icon}
                            <img
                                class="ml-2"
                                width="48"
                                height="48"
                                src={app.icon}
                                alt={app.name}
                            />
                        {/if}
                    </div>
                </a>
            {/each}
        </section>
    </div>
</main>
