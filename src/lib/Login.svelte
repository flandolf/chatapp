<script lang="ts">
  import { currentUser, pb } from "./pocketbase";
  let username: string;
  let password: string;
  let name: string;

  async function login() {
    await pb.collection("users").authWithPassword(username, password);
  }
  async function signUp() {
    try {
      const data = {
        name: name,
        username: username,
        password: password,
        passwordConfirm: password,
      };
      const createdUser = await pb.collection("users").create(data);
      await login();
    } catch (err) {
      console.log(err);
    }
  }

  async function logout() {
    await pb.authStore.clear();
    $currentUser = null;
  }
</script>

<style>
  .login-container {
    display: flex;
    flex-direction: row;
    height: 100%;
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
</style>

<div class="login-container">
  {#if $currentUser}
    <p class="logged-in">
      Logged in as <strong>{$currentUser.username}</strong>
    </p>
    <button class="logout-btn" on:click={logout}>Logout</button>
  {:else}
    <form on:submit|preventDefault class="buttons login-form">
      <input type="text" placeholder="Name" class="login-input" bind:value={name} />
      <input type="text" placeholder="Username" class="login-input" bind:value={username} />
      <input type="password" placeholder="Password" class="login-input" bind:value={password} />

      <button class="login-button" on:click={signUp}>Sign Up</button>
      <button class="login-button" on:click={login}>Login</button>
    </form>
  {/if}
</div>
