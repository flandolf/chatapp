<script lang="ts">
  import { onMount, onDestroy, afterUpdate } from "svelte";
  import { currentUser, pb } from "./pocketbase";
  import { writable } from "svelte/store";

  const messages = writable([]);

  let newMessage: string;
  let messagesContainer: HTMLElement;

  onMount(async () => {
    await getMessages();
    scrollToBottom();
  });

  async function getMessages() {
    const resultList = await pb.collection("messages").getList(1, 50, {
      sort: "created",
      expand: "user",
    });
    messages.set(resultList.items);
  }

  async function sendMessage() {
    const data = {
      text: newMessage,
      user: $currentUser.id,
    };
    const createdMessage = await pb.collection("messages").create(data);
    messages.update((items) => [...items, createdMessage]);
    scrollToBottom();
    await getMessages(); // call getMessages() to update the new message's user property
  }

  async function deleteMessage(messageId: string) {
    await pb.collection("messages").delete(messageId);
    messages.update((items) => items.filter((m) => m.id !== messageId));
  }

  afterUpdate(() => {
    scrollToBottom();
  });

  function scrollToBottom() {
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }
  let maxChars = 180; // set maximum number of characters

  function updateCharCount(event: Event) {
    const input = event.target as HTMLInputElement;
    const remainingChars = maxChars - input.value.length;
    const charCount = document.getElementById("charCount");
    if (charCount) {
      charCount.textContent = `${remainingChars}`;
    }
  }
  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }
</script>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap");
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 70vh;
    width: 100%;
    background-color: #f5f5f5;
  }

  .messages-container {
    flex: 1;
    overflow-y: scroll;
    padding: 10px;
  }

  .message {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    overflow: hidden;
    flex-wrap: wrap;
  }

  .message img {
    margin-right: 10px;
  }

  .username {
    font-weight: bold;
    margin-right: 10px;
  }

  .message-text {
    flex: 1;
  }

  .input-container {
    display: flex;
    padding: 10px;
  }

  .input-box {
    flex: 1;
    padding: 5px;
    border-radius: 15px;
    outline: none;
    border: none;
  }

  .send-btn {
    background-color: #2196f3;
    color: white;
    border: none;
    outline: none;
    cursor: pointer;
    margin-left: 5px;
    padding: 5px 10px;
    border-radius: 15px;
  }

  .delete-btn {
    background-color: #f44336;
    color: white;
    font-weight: bold;
    border: none;
    outline: none;
    cursor: pointer;
    margin-left: 5px;
    padding: 5px 10px;
    border-radius: 15px;
  }

  #charCount {
    display: flex;
    align-items: center;
    margin-left: 10px;
  }
</style>

<div class="chat-container">
  <div class="messages-container" bind:this={messagesContainer}>
    {#each $messages as message}
      <div class="message">
        <div>
          <img
          id="avatar"
          src={`https://avatars.dicebear.com/api/identicon/${message.expand?.user?.username}.svg`}
          alt={message.user.name}
          width="40px"
        />
        <div class="username">{message.expand?.user?.username}</div>
        </div>
        <div class="message-text">{message.text}</div>
        <button class="delete-btn" on:click={() => deleteMessage(message.id)}
          >Delete</button
        >
      </div>
    {/each}
  </div>
  <div class="input-container">
    <input
      class="input-box"
      placeholder="Type your message..."
      bind:value={newMessage}
      on:input={updateCharCount}
      maxlength={maxChars}
      on:keydown={handleKeyDown}
    />
    <div id="charCount">{maxChars}</div>
    <button
      class="send-btn"
      on:click={sendMessage}
      disabled={!newMessage || newMessage.trim() === ""}
    >
      Send
    </button>
  </div>
</div>
