import PocketBase from 'pocketbase';

const pb = new PocketBase("https://pb.dumpy.gq")

// create new user

pb.collection("users").create({
    username: "test",
    password: "12345",
    passwordConfirm: "12345"
}).then((user) => {
    console.log("user", user)
});