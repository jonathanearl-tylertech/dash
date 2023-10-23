<script>
    import AddLink from "$lib/components/add-link.svelte";
    import "../app.css";
    import { page } from "$app/stores";
    import { base } from "$app/paths";
    let path = $page.url.pathname;
</script>

{#if !path.includes(`${base}/auth/signin`)}
    <div class="navbar bg-base-100">
        <div class="navbar-start">
            <a class="btn btn-ghost normal-case text-xl" href="/">Dash</a>
        </div>
        <div class="navbar-end">
            <AddLink />
            {#if $page.data.user}
                <div class="dropdown dropdown-end">
                    <!-- svelte-ignore a11y-no-noninteractive-tabindex a11y-label-has-associated-control -->
                    <label tabindex="0" class="btn btn-ghost btn-circle avatar">
                        <div class="w-10 rounded-full">
                            <img
                                src={$page.data.user.picture}
                                alt={$page.data.user.name ?? "user image"}
                            />
                        </div>
                    </label>
                    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                    <ul
                        tabindex="0"
                        class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                    >
                        <li><a href={`${base}/auth/signout`}>Sign out</a></li>
                    </ul>
                </div>
            {/if}
        </div>
    </div>
{/if}

<slot />
