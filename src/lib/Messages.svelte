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
</script>

{#if $currentUser}
  <div class="messages" bind:this={messagesContainer}>
    {#each $messages as message (message.id)}
      <div class="msg">
        <div class="msg__user">
          <img
            id="avatar"
            src={`https://avatars.dicebear.com/api/identicon/${message.expand?.user?.username}.svg`}
            alt={message.user.name}
            width="40px"
          />
        </div>
        <div class="msg__content">
          <div class="header">
            <small
              >Sent by <strong style="color:blue"
                >@{message.expand?.user?.username}</strong
              ></small
            >
            {#if message.expand?.user?.id === $currentUser.id}
              <div class="msg__content__delete">
                <button
                  class="delete-btn"
                  on:click={() => deleteMessage(message.id)}>Delete</button
                >
              </div>
            {/if}
          </div>
          <div class="msg__content__text">{message.text}</div>
        </div>
      </div>
    {/each}
  </div>
  <div class="input-container">
    <input
      id="sendMessage"
      type="text"
      bind:value={newMessage}
      placeholder="Type your message here..."
      maxlength={maxChars}
      on:input={updateCharCount}
    />
    <span id="charCount">{maxChars}</span>
    <button type="submit" on:click={sendMessage}>Send</button>
  </div>
{/if}

<style>
  .input-container {
    display: flex;
    align-items: center;
    margin-top: 8px;
  }

  #charCount {
    font-size: 18px;
    color: #666;
    margin-left: 8px;
  }

  .msg {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    border-radius: 8px;
    width: 100%;
    align-self: center;
    margin-bottom: 16px;
  }

  .msg__user {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
  }

  .msg__content {
    display: flex;
    flex-direction: column;
    padding: 8px;
    background-color: #f0f0f0;
    border-radius: 8px;
    width: 100%;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
  }

  .msg__content__delete {
    margin-left: auto;
  }

  .delete-btn {
    background: none;
    color: red;
    border: none;
    cursor: pointer;
  }

  .msg__content__text {
    overflow-wrap: break-word;
    word-wrap: break-word;
    white-space: pre-wrap;
  }

  input#sendMessage {
    flex-grow: 1;
    margin-right: 8px;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }

  button[type="submit"] {
    background-color: rgb(0, 153, 255);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    cursor: pointer;
  }
</style>
