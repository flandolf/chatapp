<script lang="ts">
    import { currentUser, pb } from "./pocketbase";
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
        <p class="logged-in">
            Logged in as <strong>{$currentUser.username}</strong>
        </p>
        <button class="logout-btn" on:click={logout}>Logout</button>
    {:else}
        <form on:submit|preventDefault class="buttons login-form">
            <input
                type="text"
                placeholder="Username"
                class="login-input"
                bind:value={username}
            />
            <input
                type="password"
                placeholder="Password"
                class="login-input"
                bind:value={password}
            />
            <button class="login-button" on:click={login}>Login</button>
            <button class="login-button" on:click={signUp}>Sign Up</button>
        </form>
    {/if}
</div>

<style>
    .login-container {
        display: flex;
        flex-direction: row;
        height: 100%;
        background-color: var(--bg-color);
        color: var(--text-color);
    }

    .logout-btn {
        border: none;
        border-radius: 0.4rem;
        background-color: #ff3e00;
        color: white;
        font-size: 1rem;
        cursor: pointer;
        height: 1.5rem;
        align-self: center;
        margin: 0.3rem;
    }
    input {
        border: none;
        border-radius: 0.4rem;
        background-color: #f5f5f5;
        color: #333;
        font-size: 1rem;
        padding: 0.5rem;
        margin: 0.3rem;
        height: 1.5rem;
    }
    Button {
        border: none;
        border-radius: 0.4rem;
        background-color: #ff3e00;
        color: white;
        font-size: 1rem;
        cursor: pointer;
        height: 1.5rem;
        align-self: center;
        margin: 0.2rem;
    }
</style>
