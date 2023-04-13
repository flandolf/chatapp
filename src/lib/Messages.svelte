<script lang="ts">
    import { onMount, onDestroy, afterUpdate } from "svelte";
    import { currentUser, pb } from "./pocketbase";
    import { writable } from "svelte/store";

    export const msgs = writable([]);

    let newMessage: string;
    let messagesContainer: HTMLElement;

    onMount(async () => {
        await getMessages();
        scrollToBottom();

        setInterval(getMessages, 5500);
    });

    async function getMessages() {
        const resultList = await pb.collection("messages").getList(1, 50, {
            sort: "created",
            expand: "user",
        });
        msgs.set(resultList.items);
    }

    async function sendMessage() {
        const data = {
            text: newMessage,
            user: $currentUser.id,
        };
        const createdMessage = await pb.collection("messages").create(data);
        msgs.update((items) => [...items, createdMessage]);
        scrollToBottom();
        await getMessages(); // call getMessages() to update the new message's user property
        newMessage = "";
    }

    async function deleteMessage(messageId: string) {
        await pb.collection("messages").delete(messageId);
        msgs.update((items) => items.filter((m) => m.id !== messageId));
    }

    afterUpdate(() => {
        scrollToBottom();
        if (!currentUser) {
            msgs.set([]);
        }
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
            // Clear the input field
            newMessage = "";
        }
    }
</script>

{#if $currentUser}
    <div class="chat-container">
        <div class="messages-container" bind:this={messagesContainer}>
            {#each $msgs as message}
                <div class="message">
                    <div class="avatar-username-container">
                        <img
                            id="avatar"
                            src={`https://avatars.dicebear.com/api/identicon/${message.expand?.user?.username}.svg`}
                            alt={message.user.name}
                            width="40px"
                        />
                        <div class="username">
                            {message.expand?.user?.username}
                        </div>
                    </div>
                    <div class="message-text">{message.text}</div>
                    {#if $currentUser.id === message?.expand?.user?.id}
                        <button
                            class="delete-btn"
                            on:click={() => deleteMessage(message.id)}
                            >Delete</button
                        >
                    {/if}
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
{:else}
    <div class="chat-container">
        <div class="messages-container" bind:this={messagesContainer}>
            <div class="message">
                <div class="message-text">Please login to see messages</div>
            </div>
        </div>
    </div>
{/if}

<style>
    @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap");
    .chat-container {
        display: flex;
        flex-direction: column;
        height: 70vh;
        width: 100%;
        background-color: var(--bg-color);
        color: var(--text-color);
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
        align-items: center;
        justify-content: center;
        flex-direction: row;
        padding: 10px;
    }

    .input-box {
        flex: 1;
        padding: 5px;
        border-radius: 15px;
        outline: none;
        border: none;
        background-color: var(--bg-color);
        color: var(--text-color);
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

    .avatar-username-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-right: 10px;
    }
</style>
