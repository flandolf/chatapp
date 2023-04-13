# Svelte Chat Web App
This is a simple chat web application built with Svelte, allowing users to send and receive messages in real-time.

## Features
- Real-time messaging
- User authentication
- Auto-scroll to the bottom of the chat
- Character count for message input
- Delete messages (for the message author only)
Responsive design

## Requirements
Node.js 12.x or later
## Getting Started
1. Clone the repository:
```bash
git clone https://github.com/flandolf/chatapp.git
cd chatapp
```
2. Install dependencies:
```bash
yarn
```
3. Set up your pocketbase backend and edit the url in `src/lib/pocketbase.ts`.   

4. Start the development server:

```bash
npm run dev
```
or
```bash
yarn dev
```
This will open a new browser window, and the application should be running.

## Deployment
To deploy the application, follow these steps:

Build the production version of the application:

```bash
npm run build
```
or 
```bash
yarn build
```
This will create a `dist/` folder containing the optimized build files.

Deploy the public folder to your preferred hosting platform (e.g., Vercel, Netlify, Firebase Hosting, etc.). Follow the deployment instructions for the chosen platform.

## Contributing
We welcome contributions to improve the Svelte Chat Web App. Please feel free to submit issues, fork the repository and send pull requests!

## License
This project is licensed under the MIT License - see the LICENSE file for details.
