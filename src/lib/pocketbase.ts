import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';

// import dotenv
import dotenv from 'dotenv';

// load environment variables
dotenv.config();

export const pb = new PocketBase(process.env.URL);

export const currentUser = writable(pb.authStore.model);

pb.authStore.onChange((auth) => {
    console.log('authStore.onChange', auth);
    currentUser.set(pb.authStore.model);
});