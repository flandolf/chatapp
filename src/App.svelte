<script lang="ts">
    import Login from "./lib/Login.svelte";
    import Messages from "./lib/Messages.svelte";
    import { writable } from "svelte/store";

    const isDarkMode = writable(false);

    function toggleDarkMode() {
        isDarkMode.update((value) => !value);
    }
</script>

<svelte:head>
    {#if $isDarkMode}
        <style>
            :root {
                --bg-color: #1a1a1a;
                --text-color: #f5f5f5;
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

<div style="text-align: center;">
    <h1>flandy's chat.</h1>
    <label class="dark-mode-switch">
        <input type="checkbox" on:change={toggleDarkMode} />
        <span class="slider" />
    </label>
</div>
<Login />
<Messages />

<footer style="font-size: 10pt;">
    (c) 2023 andy wang | backend on <a href="https://pocketbase.io"
        >pocketbase</a
    > | made with ❤️ in melbourne
</footer>

<style>
    :root {
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
        background-color: #ccc;
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
        background-color: white;
        transition: 0.4s;
        border-radius: 50%;
    }

    input:checked + .slider {
        background-color: #2196f3;
    }

    input:checked + .slider:before {
        transform: translateX(26px);
    }
</style>
