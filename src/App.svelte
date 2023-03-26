<script lang="ts">
  import Login from "./lib/Login.svelte";
  import Messages from "./lib/Messages.svelte";
</script>

<h1>flandy's chat.</h1>

<Login />
<Messages />

<footer style="font-size: 10pt;">
  (c) 2023 andy wang | backend on pocketbase | made with ❤️ in melbourne
</footer>

<style>
  h1 {
    font-family: Arial, sans-serif;
    font-size: 3rem;
    background-image: linear-gradient(to right, blue, violet, rgb(146, 34, 226), rgb(28, 100, 255));
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    animation: rainbow 3s ease-in-out infinite;
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  }
  @keyframes rainbow {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
</style>
