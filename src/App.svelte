<script lang="ts">
    import Login from "./lib/Login.svelte";
    import Messages from "./lib/Messages.svelte";
    import { writable } from "svelte/store";
    import "./styles/app.css";
    import { onMount } from "svelte";
    const isDarkMode = writable(false);

    onMount(() => {
        const isDarkModeFromLocalStorage = JSON.parse(
            localStorage.getItem("isDarkMode")
        );
        if (isDarkModeFromLocalStorage) {
            isDarkMode.set(isDarkModeFromLocalStorage);
            // @ts-ignore
            document.getElementById("dark-mode-toggle").checked = true;
        }
    });

    function updateLocalStorage() {
        localStorage.setItem("isDarkMode", JSON.stringify($isDarkMode));
    }

    function toggleDarkMode() {
        isDarkMode.update((value) => !value);
        updateLocalStorage();
    }
</script>

<svelte:head>
    {#if $isDarkMode}
        <style>
            :root {
                --bg-color: #1a1c1e;
                --text-color: #e3e2e6;
            }
        </style>
    {:else}
        <style>
            :root {
                --bg-color: #f5f5f5;
                --text-color: #1a1a1a;
            }
        </style>
    {/if}
</svelte:head>

<div class="text-center text-xl mt-3">
    <h1>flandy's chat.</h1>
    <p class="text-xs mt-5">Dark Mode</p>
    <label class="dark-mode-switch mt-1">
        <input
            type="checkbox"
            on:change={toggleDarkMode}
            id="dark-mode-toggle"
        />
        <span class="slider" />
    </label>
</div>
<Login />
<Messages />

<footer class="text-s text-center">
    (c) 2023 andy wang | backend on <a href="https://pocketbase.io"
        >pocketbase</a
    > | made with ❤️ in melbourne
</footer>

<style>
    :root {
        --primary: #553f5c;
        --secondary: #f7d8fe;
        background-color: var(--bg-color);
        color: var(--text-color);
    }
    .dark-mode-switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px;
    }

    .dark-mode-switch input {
        display: none;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #553f5c;
        transition: 0.4s;
        border-radius: 34px;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: var(--secondary);
        transition: 0.4s;
        border-radius: 50%;
    }

    input:checked + .slider {
        background-color: var(--primary);
    }

    input:checked + .slider:before {
        transform: translateX(26px);
    }
</style>
