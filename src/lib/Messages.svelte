<script lang="ts">
    import { onMount, onDestroy, afterUpdate } from "svelte";
    import { currentUser, pb } from "./pocketbase";
    import { writable } from "svelte/store";
    import "../styles/Messages.css";
    export const msgs = writable([]);

    let newMessage: string;
    let messagesContainer: HTMLElement;

    onMount(async () => {
        await getMessages();
        scrollToBottom();

        setInterval(getMessages, 3000);
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
                <div class="message w-full mb-3">
                    <div class="flex flex-col items-center mr-3">
                        <img
                            src={`https://avatars.dicebear.com/api/identicon/${message.expand?.user?.username}.svg`}
                            alt={message.user.name}
                            width="40px"
                        />
                        {message.expand?.user?.username}
                    </div>
                    <div class="message-text">{message.text}</div>
                    {#if $currentUser.id === message?.expand?.user?.id}
                        <button
                            class="btn"
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
            <div id="charCount" class="mr-3">{maxChars}</div>
            <button
                class="btn"
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
