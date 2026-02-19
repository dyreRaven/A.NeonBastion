# Neon Bastion (3D Tower Defense Starter)

A lightweight browser tower-defense prototype using plain HTML/CSS/JS + Three.js.

## Run

Open `index.html` in a browser.

## Controls

- Select a tower from the `Tower Shop` to arm build mode
- `Build ... (B)` button or `B` key: toggle build mode
- `Sell Tower (X)` button or `X` key: delete a placed tower for 40% refund
- Click/tap a valid tile: place selected tower (cost varies by type)
- `Start Wave` button or `Space`: start next wave
- `Auto Waves` button: auto-starts waves every 10 seconds when lane is clear

## Current mechanics

- Fixed enemy path
- Full 3D battlefield, towers, enemies, and projectiles
- Tower shop with multiple purchasable tower classes
- Sell mode with 40% tower refund
- Progressive waves with scaling stats and mixed enemy compositions
- Enemy archetypes with unique visuals and behavior profiles:
  - `Crawler`: baseline assault unit
  - `Blink`: fast scout
  - `Bulwark`: heavy armored unit
  - `Specter`: high-speed evasive unit
  - `Colossus`: late-wave siege threat
- Towers target enemies furthest along the path
- Credits for kills and wave clear bonus
- Core HP loss when enemies escape (heavier enemies deal more damage)

## Next upgrades

- Multiple tower types and upgrade trees
- Enemy abilities (splitters, shields, on-death effects)
- Start/restart menu and map selection
- Sound and particle effects
- Local save/progression
