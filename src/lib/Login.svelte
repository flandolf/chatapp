<script lang="ts">
    import { Button } from "@svelteuidev/core";
    import { currentUser, pb } from "./pocketbase";
    import "../styles/Login.css";
    let username: string;
    let password: string;

    async function login() {
        const user = await pb
            .collection("users")
            .authWithPassword(username, password);
    }

    async function signUp() {
        try {
            const data = {
                username: username,
                password: password,
                passwordConfirm: password,
            };
            const createdUser = await pb.collection("users").create(data);
            const user = await pb
                .collection("users")
                .authWithPassword(username, password);
        } catch (err) {
            console.log("Error: ", err);
            if (
                err.includes(
                    "ClientResponseError 400: Failed to create record."
                )
            ) {
                alert("Username already exists");
            } else {
                alert(
                    "Something went wrong. Please ensure you have entered a username and password and it is correct."
                );
            }
        }
    }

    async function logout() {
        await pb.authStore.clear();
        $currentUser = null;
    }
</script>

<div class="login-container">
    {#if $currentUser}
        <div class="flex flex-row pl-4 items-center">
            <p class="logged-i mr-5">
                Logged in as <strong>{$currentUser.username}</strong>
            </p>
            <button class="login-btn" on:click={logout}>Logout</button>
        </div>
    {:else}
        <form
            on:submit|preventDefault
            class="flex flex-col justify-center items-center w-screen m-0 p-0"
        >
            <div
                class="flex flex-row justify-center items-center m-3 pl-4 pr-4 w-full"
            >
                <input
                    type="text"
                    placeholder="Username"
                    class="login-input mr-2 p-3.5"
                    style="width: 50%;"
                    bind:value={username}
                />
                <input
                    type="password"
                    placeholder="Password"
                    class="login-input p-3.5"
                    style="width: 50%;"
                    bind:value={password}
                />
            </div>
            <div class="flex flex-row justify-center items-center p-0 w-full">
                <button class="login-btn mr-2" on:click={login}>Login</button>
                <button class="login-btn" on:click={signUp}>Sign Up</button>
            </div>
        </form>
    {/if}
</div>
