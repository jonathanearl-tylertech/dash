<script>
    import { page } from "$app/stores";
    import LinkCard from "$lib/components/link-card.svelte";
</script>

<main class="flex flex-col max-w-4xl mx-auto box-border mt-10">
    <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <section>
            <h2 class="font-semibold text-xl text-gray-50 mb-2">Apps</h2>
            {#each $page.data.apps as app}
                <LinkCard link={app} />
            {/each}
        </section>
    </div>
</main>
