<script>
    import "../app.css";
    import { page } from "$app/stores";
    import { base } from "$app/paths";
    let path = $page.url.pathname;
</script>

{#if !path.includes(`${base}/auth/signin`)}
    <div class="navbar bg-base-100">
        <div class="navbar-start">
            <!-- <div class="dropdown">
            <label tabindex="0" class="btn btn-ghost lg:hidden">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    ><path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 6h16M4 12h8m-8 6h16"
                    />
                </svg>
            </label>
            <ul
                tabindex="0"
                class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
                <li><a>Item 1</a></li>
                <li>
                    <a>Parent</a>
                    <ul class="p-2">
                        <li><a>Submenu 1</a></li>
                        <li><a>Submenu 2</a></li>
                    </ul>
                </li>
                <li><a>Item 3</a></li>
            </ul>
        </div> -->
            <a class="btn btn-ghost normal-case text-xl" href="/">Dash</a>
        </div>
        <div class="navbar-end">
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
