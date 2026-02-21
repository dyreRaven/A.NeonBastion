# Neon Bastion

## Play Online

- Live site (game + multiplayer server on one URL): `https://neon-bastion-multiplayer.onrender.com`
- Mirror site: `https://dyreraven.github.io/A.NeonBastion/`

## Install + Offline (PWA)

The web build is now installable on desktop and mobile as a PWA.

- Desktop (Chrome/Edge): open the site, then use `Install app` in the address bar/menu.
- Android Chrome: open the site, then `Add to Home screen`.
- iOS Safari: open the site, then Share -> `Add to Home Screen`.

Offline behavior:

- Single-player: available offline after first successful load.
- Multiplayer: requires internet connection.
- Cloud login/sync: requires internet; local progress still saves offline and sync can resume when back online.

## Local Run

- Open `index.html` in a browser.
- To test install/offline PWA behavior, serve over `http://localhost` or `https://` (service workers do not run from `file://`).

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

## Supabase Cloud Accounts (Email)

This build supports Supabase cloud login/sync for email accounts.

1. In Supabase Dashboard, open SQL Editor.
2. Run `supabase_setup.sql` from this repo.
3. In game menu, open `Account Setup`.
4. Create/Login using an email + password.
5. Keep `Require password each launch` turned off if you want auto-remembered login.

If SQL setup has not been run yet, login works but cloud save sync will show a setup warning.
