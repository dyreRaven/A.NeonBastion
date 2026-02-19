# Neon Bastion

## Play Online

- Live site: `https://dyreraven.github.io/A.NeonBastion/`

## Local Run

- Open `index.html` in a browser.

## Cross-Device Multiplayer Setup

The game UI now supports real network rooms through a WebSocket server.

1. Install Node.js 20+.
2. Start the server:
   - `cd server`
   - `npm install`
   - `npm start`
3. In the game menu: `Multiplayer`
4. Set `Server URL`:
   - Local same-PC testing: `ws://localhost:8787`
   - Same home network devices: `ws://<your-lan-ip>:8787`
   - Internet-hosted server: `wss://<your-server-domain>`
5. Use the same room code on all devices.

## Deploy Server (for Internet play)

Use Render/Railway/Fly.io and deploy the `server/` folder as a Node service.

- Render shortcut: this repo includes `render.yaml` (Blueprint deploy).
- Start command: `npm start`
- Environment:
  - `PORT` is provided by most hosts automatically
  - optional `HOST=0.0.0.0`
- After deploy, copy your `wss://...` URL into the game Multiplayer panel.

## Notes

- Host is authoritative (host controls wave flow/game speed).
- GitHub Pages hosts the game frontend, and the WebSocket server hosts multiplayer relay.
