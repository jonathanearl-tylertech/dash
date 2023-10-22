<script>
    import AddLink from "$lib/components/add-link.svelte";
    import "../app.css";
</script>
<div class="flex justify-between p-4">
    <span class="font-black text-2xl">Dash</span>
    <AddLink />
</div>
<slot />
