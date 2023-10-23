<script>
    import { page } from "$app/stores";
    import { superForm } from "sveltekit-superforms/client";
    const { form, constraints, enhance } = superForm($page.data.form, {
        onResult: ({ result }) => {
            if (result.status !== 200)
                return;
            const modal = document.querySelector("#add_app_modal");
            modal?.removeAttribute("open");
        },
    });
</script>

<button
    class="btn"
    on:click={() => {
        const modal = document.querySelector("#add_app_modal");
        modal?.setAttribute("open", "true");
    }}>Add Link</button
>
<dialog id="add_app_modal" class="modal">
    <div class="modal-box">
        <h3 class="font-bold text-lg">Add Application</h3>
        <form
            class="flex flex-col gap-2"
            method="POST"
            action="?/add-link"
            use:enhance
        >
            <div class="form-control w-full">
                <label class="label" for="name">
                    <span class="label-text">Name</span>
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={$form.name ?? ""}
                    class="input input-bordered w-full"
                    {...$constraints.name}
                />
            </div>
            <div class="form-control w-full">
                <label class="label" for="description">
                    <span class="label-text">Description</span>
                </label>
                <input
                    type="text"
                    id="description"
                    name="description"
                    value={$form.description ?? ""}
                    class="input input-bordered w-full"
                />
            </div>
            <div class="form-control w-full">
                <label class="label" for="url">
                    <span class="label-text">URL</span>
                </label>
                <input
                    type="text"
                    id="url"
                    name="url"
                    value={$form.url ?? ""}
                    class="input input-bordered w-full"
                />
            </div>
            <div class="form-control w-full">
                <label class="label" for="icon">
                    <span class="label-text">Icon</span>
                </label>
                <input
                    type="text"
                    id="icon"
                    name="icon"
                    value={$form.icon ?? ""}
                    class="input input-bordered w-full"
                />
            </div>
            <div class="form-control w-full">
                <label class="label" for="health">
                    <span class="label-text">Health</span>
                </label>
                <input
                    type="text"
                    id="health"
                    name="health"
                    value={$form.health ?? ""}
                    class="input input-bordered w-full"
                />
            </div>
            <button class="mt-2" type="submit">Save</button>
        </form>
    </div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>
