<button
    class="btn"
    on:click={() => {
        // @ts-ignore
        add_app_modal.showModal();
    }}>Add Link</button
>
<dialog id="add_app_modal" class="modal">
    <div class="modal-box">
        <h3 class="font-bold text-lg">Add App</h3>
        <form class="flex flex-col gap-2" method="POST" action="?/add-link">
            <div class="form-control w-full">
                <label class="label" for="name">
                    <span class="label-text">Name</span>
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Type here"
                    class="input input-bordered w-full"
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
                    placeholder="Type here"
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
                    placeholder="Type here"
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
                    placeholder="Type here"
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
                    placeholder="Type here"
                    class="input input-bordered w-full"
                />
            </div>
            <button class="mt-2" type="submit">Save</button>
        </form>

        <!-- {
            name: "Proxmox",
            icon: proxmoxIcon,
            description: "Selfhost virtual machines on your server.",
            docsUri: "",
            link: "https://192.168.88.69:8006",
            color: "bg-green-400",
            time: "3s",
        }, -->
    </div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>
