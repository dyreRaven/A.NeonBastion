const canvas = document.getElementById("game");

const moneyEl = document.getElementById("money");
const shardsEl = document.getElementById("shards");
const livesEl = document.getElementById("lives");
const waveEl = document.getElementById("wave");
const multiplayerPlayersHudEl = document.getElementById("multiplayerPlayersHud");
const statusEl = document.getElementById("status");
const buildBtn = document.getElementById("buildBtn");
const sellBtn = document.getElementById("sellBtn");
const laneBtn = document.getElementById("laneBtn");
const loadoutBtn = document.getElementById("loadoutBtn");
const unlockBtn = document.getElementById("unlockBtn");
const menuBtn = document.getElementById("menuBtn");
const startWaveBtn = document.getElementById("startWaveBtn");
const pauseBtn = document.getElementById("pauseBtn");
const autoWaveBtn = document.getElementById("autoWaveBtn");
const shopEl = document.getElementById("shop");
const menuScreenEl = document.getElementById("menuScreen");
const menuCardEl = document.getElementById("menuCard");
const buildStampEl = document.getElementById("buildStamp");
const exitConfirmEl = document.getElementById("exitConfirm");
const confirmExitBtn = document.getElementById("confirmExitBtn");
const cancelExitBtn = document.getElementById("cancelExitBtn");
const levelClearPanelEl = document.getElementById("levelClearPanel");
const levelClearMenuBtn = document.getElementById("levelClearMenuBtn");
const levelClearTitleEl = document.getElementById("levelClearTitle");
const levelClearTextEl = document.getElementById("levelClearText");
const defeatPanelEl = document.getElementById("defeatPanel");
const defeatMenuBtn = document.getElementById("defeatMenuBtn");
const playBtn = document.getElementById("playBtn");
const mapPrevBtn = document.getElementById("mapPrevBtn");
const mapNextBtn = document.getElementById("mapNextBtn");
const mapPreviewEl = document.getElementById("mapPreview");
const mapPreviewIndexEl = document.getElementById("mapPreviewIndex");
const mapPreviewNameEl = document.getElementById("mapPreviewName");
const mapPreviewDescEl = document.getElementById("mapPreviewDesc");
const mapPreviewLockEl = document.getElementById("mapPreviewLock");
const openAccountBtn = document.getElementById("openAccountBtn");
const openUnlockShopBtn = document.getElementById("openUnlockShopBtn");
const openCreatureFromUnlockBtn = document.getElementById("openCreatureFromUnlockBtn");
const openLoadoutBtn = document.getElementById("openLoadoutBtn");
const openMultiplayerBtn = document.getElementById("openMultiplayerBtn");
const closeAccountBtn = document.getElementById("closeAccountBtn");
const closeUnlockShopBtn = document.getElementById("closeUnlockShopBtn");
const closeCreatureShopBtn = document.getElementById("closeCreatureShopBtn");
const closeLoadoutBtn = document.getElementById("closeLoadoutBtn");
const closeMultiplayerBtn = document.getElementById("closeMultiplayerBtn");
const menuAccountEl = document.getElementById("menuAccountList");
const menuAccountCurrentEl = document.getElementById("menuAccountCurrent");
const accountNameInputEl = document.getElementById("accountNameInput");
const createAccountBtn = document.getElementById("createAccountBtn");
const menuShopEl = document.getElementById("menuShop");
const menuShardsEl = document.getElementById("menuShards");
const menuCreatureShopEl = document.getElementById("menuCreatureShop");
const menuCreatureSummaryEl = document.getElementById("menuCreatureSummary");
const menuLoadoutEl = document.getElementById("menuLoadout");
const menuLoadoutCountEl = document.getElementById("menuLoadoutCount");
const menuLoadoutSearchEl = document.getElementById("menuLoadoutSearch");
const menuMultiplayerStateEl = document.getElementById("menuMultiplayerState");
const menuMultiplayerHintEl = document.getElementById("menuMultiplayerHint");
const multiplayerServerInputEl = document.getElementById("multiplayerServerInput");
const multiplayerRoomInputEl = document.getElementById("multiplayerRoomInput");
const hostMultiplayerBtn = document.getElementById("hostMultiplayerBtn");
const joinMultiplayerBtn = document.getElementById("joinMultiplayerBtn");
const leaveMultiplayerBtn = document.getElementById("leaveMultiplayerBtn");
const menuMultiplayerLogEl = document.getElementById("menuMultiplayerLog");
const menuMultiplayerPlayersEl = document.getElementById("menuMultiplayerPlayers");
const menuMultiplayerPlayerCountEl = document.getElementById("menuMultiplayerPlayerCount");
const bossBarWrapEl = document.getElementById("bossBarWrap");
const bossNameEl = document.getElementById("bossName");
const bossHpEl = document.getElementById("bossHp");
const bossBarFillEl = document.getElementById("bossBarFill");
const bossBarSplitEl = document.getElementById("bossBarSplit");
const bossBarFillLeftEl = document.getElementById("bossBarFillLeft");
const bossBarFillRightEl = document.getElementById("bossBarFillRight");
const commandToggleBtn = document.getElementById("commandToggleBtn");
const commandConsoleEl = document.getElementById("commandConsole");
const commandCloseBtn = document.getElementById("commandCloseBtn");
const commandInputEl = document.getElementById("commandInput");
const commandRunBtn = document.getElementById("commandRunBtn");
const settingsToggleBtn = document.getElementById("settingsToggleBtn");
const settingsPanelEl = document.getElementById("settingsPanel");
const settingsCloseBtn = document.getElementById("settingsCloseBtn");
const settingMusicBtn = document.getElementById("settingMusicBtn");
const settingSfxBtn = document.getElementById("settingSfxBtn");
const settingShotBtn = document.getElementById("settingShotBtn");
const settingShatterBtn = document.getElementById("settingShatterBtn");
const speedControlEl = document.getElementById("speedControl");
const speedDownBtn = document.getElementById("speedDownBtn");
const speedValueEl = document.getElementById("speedValue");
const speedUpBtn = document.getElementById("speedUpBtn");

if (!window.THREE) {
  statusEl.textContent = "3D engine failed to load. Check vendor/three.min.js.";
  statusEl.style.color = "#ff8f8f";
  throw new Error("THREE is not available");
}

const COLS = 16;
const ROWS = 9;
const CELL_SIZE = 4;
const AUTO_WAVE_INTERVAL = 10;
const SELL_REFUND_RATIO = 0.4;
const PROGRESS_STORAGE_KEY = "tower-defense-progress-v2";
const LEGACY_PROGRESS_STORAGE_KEY = "tower-defense-progress-v1";
const SHATTER_GRAVITY = -38;
const SHATTER_AIR_DRAG = 1.75;
const SHATTER_GROUND_DRAG = 8.5;
const HEALTH_BAR_SHOW_TIME = 1.5;
const GAME_SPEED_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const MULTIPLAYER_SNAPSHOT_INTERVAL = 0.12;
const MULTIPLAYER_CONNECT_TIMEOUT = 7000;
const MULTIPLAYER_SERVER_STORAGE_KEY = "tower-defense-mp-server-v1";
const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
const BUILD_ID = "2026-02-19-18";

if (buildStampEl) buildStampEl.textContent = `Build: ${BUILD_ID}`;
window.__NEON_BASTION_BUILD_ID__ = BUILD_ID;

const audioSystem = {
  musicBusVolume: 0.34,
  sfxBusVolume: 0.9,
  ctx: null,
  masterGain: null,
  sfxGain: null,
  musicGain: null,
  compressor: null,
  shotCooldownUntil: 0,
  glassNoiseBuffer: null,
  bossPulseTimer: null,
  bossMusicStartTimeout: null,
  bossBeatIndex: 0,
  bossChordIndex: 0,
  bossNodes: null,
  bossTrack: null,
  bossTrackFailed: false,
  fluteTrack: null,
  fluteTrackFailed: false,
  musicEnabled: true,
  sfxEnabled: true,
  shotSfxEnabled: true,
  shatterSfxEnabled: true,
  enemyShatterSample: null,
  enemyShatterSampleFailed: false,
  activeShatterClips: [],

  ensure() {
    if (!AudioContextCtor) return null;
    if (this.ctx) return this.ctx;

    const ctx = new AudioContextCtor();
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-14, ctx.currentTime);
    compressor.knee.setValueAtTime(14, ctx.currentTime);
    compressor.ratio.setValueAtTime(4.5, ctx.currentTime);
    compressor.attack.setValueAtTime(0.003, ctx.currentTime);
    compressor.release.setValueAtTime(0.22, ctx.currentTime);

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.62, ctx.currentTime);
    const sfxGain = ctx.createGain();
    sfxGain.gain.setValueAtTime(this.sfxEnabled ? this.sfxBusVolume : 0.0001, ctx.currentTime);
    const musicGain = ctx.createGain();
    musicGain.gain.setValueAtTime(this.musicEnabled ? this.musicBusVolume : 0.0001, ctx.currentTime);

    sfxGain.connect(masterGain);
    musicGain.connect(masterGain);
    masterGain.connect(compressor);
    compressor.connect(ctx.destination);

    this.ctx = ctx;
    this.compressor = compressor;
    this.masterGain = masterGain;
    this.sfxGain = sfxGain;
    this.musicGain = musicGain;
    return ctx;
  },

  unlock() {
    const ctx = this.ensure();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    const primeTrack = (track) => {
      if (!track) return;
      if (!track.paused || track.readyState >= 2) return;
      try {
        track.load();
      } catch (_) {}
    };

    const bossTrack = this.ensureBossTrack();
    primeTrack(bossTrack);
    const fluteTrack = this.ensureFluteTrack();
    primeTrack(fluteTrack);
    const enemyShatterSample = this.ensureEnemyShatterSample();
    primeTrack(enemyShatterSample);
  },

  ensureBossTrack() {
    if (this.bossTrackFailed) return null;
    if (this.bossTrack) return this.bossTrack;
    if (typeof Audio !== "function") return null;

    const track = new Audio("boss_alien_talk.mp3");
    track.loop = true;
    track.preload = "auto";
    track.volume = 0.86;
    track.playbackRate = 0.97;
    track.addEventListener("error", () => {
      this.bossTrackFailed = true;
      this.bossTrack = null;
    });
    this.bossTrack = track;
    return track;
  },

  ensureFluteTrack() {
    if (this.fluteTrackFailed) return null;
    if (this.fluteTrack) return this.fluteTrack;
    if (typeof Audio !== "function") return null;

    const track = new Audio("ambient_flute.mp3");
    track.loop = true;
    track.preload = "auto";
    track.volume = 0.76;
    track.addEventListener("error", () => {
      this.fluteTrackFailed = true;
      this.fluteTrack = null;
    });
    this.fluteTrack = track;
    return track;
  },

  setMusicEnabled(enabled) {
    this.musicEnabled = !!enabled;

    if (this.ctx && this.musicGain) {
      const now = this.ctx.currentTime;
      this.musicGain.gain.cancelScheduledValues(now);
      this.musicGain.gain.setTargetAtTime(this.musicEnabled ? this.musicBusVolume : 0.0001, now, 0.03);
    }

    if (this.bossTrack) this.bossTrack.muted = !this.musicEnabled;
    if (this.fluteTrack) this.fluteTrack.muted = !this.musicEnabled;

    if (!this.musicEnabled) {
      this.stopBossMusic();
      this.stopFluteMusic(true);
    }
  },

  setSfxEnabled(enabled) {
    this.sfxEnabled = !!enabled;
    if (this.ctx && this.sfxGain) {
      const now = this.ctx.currentTime;
      this.sfxGain.gain.cancelScheduledValues(now);
      this.sfxGain.gain.setTargetAtTime(this.sfxEnabled ? this.sfxBusVolume : 0.0001, now, 0.03);
    }
  },

  startFluteMusic() {
    if (!this.musicEnabled || this.fluteTrackFailed) return;

    const ctx = this.ensure();
    if (!ctx || ctx.state !== "running") return;

    const fluteTrack = this.ensureFluteTrack();
    if (!fluteTrack || !fluteTrack.paused) return;

    const playAttempt = fluteTrack.play();
    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch(() => {
        this.fluteTrackFailed = true;
        this.fluteTrack = null;
      });
    }
  },

  stopFluteMusic(reset = false) {
    if (!this.fluteTrack) return;
    try {
      this.fluteTrack.pause();
      if (reset) this.fluteTrack.currentTime = 0;
    } catch (_) {}
  },

  ensureEnemyShatterSample() {
    if (this.enemyShatterSampleFailed) return null;
    if (this.enemyShatterSample) return this.enemyShatterSample;
    if (typeof Audio !== "function") return null;

    const sample = new Audio("enemy_shatter.mp3");
    sample.preload = "auto";
    sample.volume = 1;
    sample.addEventListener("error", () => {
      this.enemyShatterSampleFailed = true;
      this.enemyShatterSample = null;
      this.activeShatterClips = [];
    });
    this.enemyShatterSample = sample;
    return sample;
  },

  playEnemyShatterSample(radius = 1, isBoss = false) {
    if (!this.sfxEnabled || !this.shatterSfxEnabled) return false;
    if (this.enemyShatterSampleFailed) return false;
    const sample = this.ensureEnemyShatterSample();
    if (!sample) return false;

    try {
      const oneShot = new Audio(sample.currentSrc || sample.src || "enemy_shatter.mp3");
      const size = Math.max(0.6, Math.min(2.6, radius));
      const volumeBase = isBoss ? 0.52 : 0.32;
      oneShot.volume = Math.max(0.08, Math.min(0.58, volumeBase * (0.4 + size * 0.26)));
      oneShot.playbackRate = isBoss ? 0.9 : 1;
      oneShot.preload = "auto";

      this.activeShatterClips.push(oneShot);
      const cleanup = () => {
        this.activeShatterClips = this.activeShatterClips.filter((clip) => clip !== oneShot);
      };
      oneShot.addEventListener("ended", cleanup, { once: true });
      oneShot.addEventListener("error", cleanup, { once: true });

      const playAttempt = oneShot.play();
      if (playAttempt && typeof playAttempt.catch === "function") {
        playAttempt.catch(() => cleanup());
      }
      return true;
    } catch (_) {
      return false;
    }
  },

  getGlassNoiseBuffer() {
    const ctx = this.ensure();
    if (!ctx) return null;
    if (this.glassNoiseBuffer) return this.glassNoiseBuffer;

    const length = Math.max(1, Math.floor(ctx.sampleRate * 0.55));
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) {
      const shape = 1 - i / length;
      data[i] = (Math.random() * 2 - 1) * (0.45 + shape * 0.55);
    }
    this.glassNoiseBuffer = buffer;
    return buffer;
  },

  playTowerShot(power = 25) {
    const ctx = this.ensure();
    if (!ctx || ctx.state !== "running" || !this.sfxGain || !this.sfxEnabled || !this.shotSfxEnabled) return;

    const now = ctx.currentTime;
    if (now < this.shotCooldownUntil) return;
    this.shotCooldownUntil = now + 0.02;

    const normPower = Math.max(8, Math.min(150, power));
    const duration = 0.06 + normPower * 0.00038;
    const startFreq = 1750 + normPower * 6.5 + Math.random() * 120;
    const endFreq = 220 + normPower * 0.9;
    const peak = Math.min(0.16, 0.048 + normPower * 0.0005);

    const laser = ctx.createOscillator();
    laser.type = "sawtooth";
    laser.frequency.setValueAtTime(startFreq, now);
    laser.frequency.exponentialRampToValueAtTime(Math.max(140, endFreq), now + duration);

    const laserBand = ctx.createBiquadFilter();
    laserBand.type = "bandpass";
    laserBand.Q.value = 2.9;
    laserBand.frequency.setValueAtTime(startFreq * 0.78, now);
    laserBand.frequency.exponentialRampToValueAtTime(Math.max(240, endFreq * 1.45), now + duration);

    const laserHigh = ctx.createBiquadFilter();
    laserHigh.type = "highpass";
    laserHigh.frequency.setValueAtTime(180, now);
    laserHigh.Q.value = 0.6;

    const laserGain = ctx.createGain();
    laserGain.gain.setValueAtTime(0.0001, now);
    laserGain.gain.exponentialRampToValueAtTime(peak, now + 0.0025);
    laserGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    laser.connect(laserBand);
    laserBand.connect(laserHigh);
    laserHigh.connect(laserGain);
    laserGain.connect(this.sfxGain);
    laser.start(now);
    laser.stop(now + duration + 0.02);

    const tail = ctx.createOscillator();
    tail.type = "triangle";
    tail.frequency.setValueAtTime(Math.max(220, endFreq * 1.2), now + 0.006);
    tail.frequency.exponentialRampToValueAtTime(Math.max(120, endFreq * 0.72), now + duration + 0.03);

    const tailGain = ctx.createGain();
    tailGain.gain.setValueAtTime(0.0001, now + 0.006);
    tailGain.gain.exponentialRampToValueAtTime(peak * 0.46, now + 0.02);
    tailGain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.03);
    tail.connect(tailGain);
    tailGain.connect(this.sfxGain);
    tail.start(now + 0.006);
    tail.stop(now + duration + 0.05);

    const noiseBuffer = this.getGlassNoiseBuffer();
    if (noiseBuffer) {
      const click = ctx.createBufferSource();
      click.buffer = noiseBuffer;

      const clickHigh = ctx.createBiquadFilter();
      clickHigh.type = "highpass";
      clickHigh.frequency.setValueAtTime(2800 + Math.random() * 600, now);

      const clickGain = ctx.createGain();
      clickGain.gain.setValueAtTime(0.0001, now);
      clickGain.gain.exponentialRampToValueAtTime(peak * 0.2, now + 0.0015);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.016);

      click.connect(clickHigh);
      clickHigh.connect(clickGain);
      clickGain.connect(this.sfxGain);
      click.start(now);
      click.stop(now + 0.02);
    }
  },

  playEnemyShatter(radius = 1, isBoss = false) {
    if (!this.sfxEnabled || !this.shatterSfxEnabled) return;
    const size = Math.max(0.6, Math.min(2.6, radius));
    const samplePlayed = this.playEnemyShatterSample(size, isBoss);
    if (samplePlayed && !isBoss) return;

    const ctx = this.ensure();
    if (!ctx || ctx.state !== "running" || !this.sfxGain) return;

    const now = ctx.currentTime;
    if (samplePlayed) {
      const thud = ctx.createOscillator();
      thud.type = "sine";
      thud.frequency.setValueAtTime(76, now);
      thud.frequency.exponentialRampToValueAtTime(44, now + 0.36);

      const thudGain = ctx.createGain();
      thudGain.gain.setValueAtTime(0.0001, now);
      thudGain.gain.exponentialRampToValueAtTime(0.055, now + 0.018);
      thudGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.36);
      thud.connect(thudGain);
      thudGain.connect(this.sfxGain);
      thud.start(now);
      thud.stop(now + 0.4);
      return;
    }

    const noiseBuffer = this.getGlassNoiseBuffer();
    if (!noiseBuffer) return;

    const burstCount = isBoss ? 3 : 2;

    for (let i = 0; i < burstCount; i += 1) {
      const burstStart = now + i * 0.014;
      const burstDuration = (isBoss ? 0.11 : 0.08) + i * 0.018;

      const source = ctx.createBufferSource();
      source.buffer = noiseBuffer;

      const highpass = ctx.createBiquadFilter();
      highpass.type = "highpass";
      highpass.frequency.setValueAtTime(
        (isBoss ? 720 : 980) + Math.random() * (isBoss ? 620 : 900),
        burstStart
      );

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.Q.value = 2.4 + Math.random() * 2.1;
      bandpass.frequency.setValueAtTime(
        (isBoss ? 1900 : 2400) + Math.random() * (isBoss ? 1300 : 1700),
        burstStart
      );

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, burstStart);
      gain.gain.exponentialRampToValueAtTime((isBoss ? 0.1 : 0.06) * size, burstStart + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, burstStart + burstDuration);

      source.connect(highpass);
      highpass.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(this.sfxGain);
      source.start(burstStart);
      source.stop(burstStart + burstDuration + 0.02);
    }

    const tinkleCount = isBoss ? 6 : 4;
    for (let i = 0; i < tinkleCount; i += 1) {
      const tinkleStart = now + 0.008 + i * 0.012 + Math.random() * 0.02;
      const tinkleDuration = (isBoss ? 0.26 : 0.18) + Math.random() * 0.06;
      const startFreq = (isBoss ? 920 : 1250) + Math.random() * (isBoss ? 1700 : 2200);
      const endFreq = Math.max(230, startFreq * (isBoss ? 0.62 : 0.54));

      const osc = ctx.createOscillator();
      osc.type = i % 2 === 0 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(startFreq, tinkleStart);
      osc.frequency.exponentialRampToValueAtTime(endFreq, tinkleStart + tinkleDuration);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, tinkleStart);
      gain.gain.exponentialRampToValueAtTime((isBoss ? 0.023 : 0.014) * size, tinkleStart + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, tinkleStart + tinkleDuration);

      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(isBoss ? 5600 : 6400, tinkleStart);

      osc.connect(lp);
      lp.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(tinkleStart);
      osc.stop(tinkleStart + tinkleDuration + 0.02);
    }

    // Delayed floor clatter layer: quick, bright hits like shards bouncing on tile.
    const clatterCount = isBoss ? 11 : 7;
    for (let i = 0; i < clatterCount; i += 1) {
      const hitStart = now + 0.055 + Math.random() * (isBoss ? 0.44 : 0.27);
      const hitDuration = 0.028 + Math.random() * 0.035;
      const hitFreq = 520 + Math.random() * 1850;

      const hitOsc = ctx.createOscillator();
      hitOsc.type = "triangle";
      hitOsc.frequency.setValueAtTime(hitFreq, hitStart);
      hitOsc.frequency.exponentialRampToValueAtTime(Math.max(260, hitFreq * 0.72), hitStart + hitDuration);

      const hitBand = ctx.createBiquadFilter();
      hitBand.type = "bandpass";
      hitBand.Q.value = 6.4;
      hitBand.frequency.setValueAtTime(hitFreq, hitStart);

      const hitGain = ctx.createGain();
      hitGain.gain.setValueAtTime(0.0001, hitStart);
      hitGain.gain.exponentialRampToValueAtTime((isBoss ? 0.015 : 0.009) * size, hitStart + 0.004);
      hitGain.gain.exponentialRampToValueAtTime(0.0001, hitStart + hitDuration);

      hitOsc.connect(hitBand);
      hitBand.connect(hitGain);
      hitGain.connect(this.sfxGain);
      hitOsc.start(hitStart);
      hitOsc.stop(hitStart + hitDuration + 0.012);

      const clickSource = ctx.createBufferSource();
      clickSource.buffer = noiseBuffer;
      const clickHigh = ctx.createBiquadFilter();
      clickHigh.type = "highpass";
      clickHigh.frequency.setValueAtTime(1900 + Math.random() * 1300, hitStart);

      const clickGain = ctx.createGain();
      clickGain.gain.setValueAtTime(0.0001, hitStart);
      clickGain.gain.exponentialRampToValueAtTime((isBoss ? 0.011 : 0.0065) * size, hitStart + 0.0025);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, hitStart + 0.025);

      clickSource.connect(clickHigh);
      clickHigh.connect(clickGain);
      clickGain.connect(this.sfxGain);
      clickSource.start(hitStart);
      clickSource.stop(hitStart + 0.03);
    }

    if (isBoss) {
      const thud = ctx.createOscillator();
      thud.type = "sine";
      thud.frequency.setValueAtTime(76, now);
      thud.frequency.exponentialRampToValueAtTime(44, now + 0.36);

      const thudGain = ctx.createGain();
      thudGain.gain.setValueAtTime(0.0001, now);
      thudGain.gain.exponentialRampToValueAtTime(0.055, now + 0.018);
      thudGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.36);
      thud.connect(thudGain);
      thudGain.connect(this.sfxGain);
      thud.start(now);
      thud.stop(now + 0.4);
    }
  },

  playBossPulse() {
    const ctx = this.ctx;
    if (!ctx || ctx.state !== "running" || !this.musicGain) return;

    const now = ctx.currentTime + 0.01;
    const progression = [
      [110.0, 138.59, 164.81],   // A minor
      [98.0, 123.47, 146.83],    // G major
      [130.81, 164.81, 196.0],   // C major
      [92.5, 123.47, 155.56],    // F-ish
    ];

    const chord = progression[this.bossChordIndex % progression.length];
    const note = chord[this.bossBeatIndex % chord.length];
    this.bossBeatIndex += 1;
    if (this.bossBeatIndex % 3 === 0) this.bossChordIndex = (this.bossChordIndex + 1) % progression.length;
    const accentBeat = this.bossBeatIndex % 4 === 0;

    if (this.bossNodes?.padRoot && this.bossNodes?.padFifth) {
      this.bossNodes.padRoot.frequency.setTargetAtTime(chord[0], now, 0.45);
      this.bossNodes.padFifth.frequency.setTargetAtTime(chord[2], now, 0.45);
    }

    const arp = ctx.createOscillator();
    arp.type = accentBeat ? "sawtooth" : "triangle";
    arp.frequency.setValueAtTime(note, now);
    arp.frequency.exponentialRampToValueAtTime(Math.max(120, note * 0.88), now + 0.34);

    const arpFilter = ctx.createBiquadFilter();
    arpFilter.type = "lowpass";
    arpFilter.frequency.setValueAtTime(1650, now);
    arpFilter.Q.value = 0.9;

    const arpGain = ctx.createGain();
    arpGain.gain.setValueAtTime(0.0001, now);
    arpGain.gain.exponentialRampToValueAtTime(accentBeat ? 0.09 : 0.068, now + 0.03);
    arpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);

    arp.connect(arpFilter);
    arpFilter.connect(arpGain);
    arpGain.connect(this.musicGain);
    arp.start(now);
    arp.stop(now + 0.38);

    const kick = ctx.createOscillator();
    kick.type = "triangle";
    kick.frequency.setValueAtTime(128, now);
    kick.frequency.exponentialRampToValueAtTime(72, now + 0.23);

    const kickBand = ctx.createBiquadFilter();
    kickBand.type = "bandpass";
    kickBand.frequency.setValueAtTime(118, now);
    kickBand.frequency.exponentialRampToValueAtTime(95, now + 0.22);
    kickBand.Q.value = 1.1;

    const kickGain = ctx.createGain();
    kickGain.gain.setValueAtTime(0.0001, now);
    kickGain.gain.exponentialRampToValueAtTime(accentBeat ? 0.082 : 0.064, now + 0.012);
    kickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
    kick.connect(kickBand);
    kickBand.connect(kickGain);
    kickGain.connect(this.musicGain);
    kick.start(now);
    kick.stop(now + 0.28);

    const bass = ctx.createOscillator();
    bass.type = accentBeat ? "triangle" : "sine";
    bass.frequency.setValueAtTime(chord[0] * 0.95, now);
    bass.frequency.exponentialRampToValueAtTime(chord[0] * 0.74, now + 0.36);

    const bassHigh = ctx.createBiquadFilter();
    bassHigh.type = "highpass";
    bassHigh.frequency.setValueAtTime(64, now);
    bassHigh.Q.value = 0.7;

    const bassLow = ctx.createBiquadFilter();
    bassLow.type = "lowpass";
    bassLow.frequency.setValueAtTime(340, now);
    bassLow.Q.value = 0.6;

    const bassGain = ctx.createGain();
    bassGain.gain.setValueAtTime(0.0001, now);
    bassGain.gain.exponentialRampToValueAtTime(accentBeat ? 0.078 : 0.06, now + 0.02);
    bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);
    bass.connect(bassHigh);
    bassHigh.connect(bassLow);
    bassLow.connect(bassGain);
    bassGain.connect(this.musicGain);
    bass.start(now);
    bass.stop(now + 0.4);

    if (accentBeat) {
      const stab = ctx.createOscillator();
      stab.type = "square";
      stab.frequency.setValueAtTime(note * 2.5, now + 0.015);
      stab.frequency.exponentialRampToValueAtTime(note * 2.0, now + 0.11);

      const stabGain = ctx.createGain();
      stabGain.gain.setValueAtTime(0.0001, now + 0.015);
      stabGain.gain.exponentialRampToValueAtTime(0.026, now + 0.03);
      stabGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      stab.connect(stabGain);
      stabGain.connect(this.musicGain);
      stab.start(now + 0.015);
      stab.stop(now + 0.15);
    }
  },

  startBossMusic() {
    const ctx = this.ensure();
    if (!this.musicEnabled || !ctx || ctx.state !== "running" || !this.musicGain) return;
    this.stopFluteMusic(true);

    if (!this.bossTrackFailed) {
      const bossTrack = this.ensureBossTrack();
      if (bossTrack) {
        if (!bossTrack.paused) return;
        bossTrack.currentTime = 0;
        const playAttempt = bossTrack.play();
        if (playAttempt && typeof playAttempt.catch === "function") {
          playAttempt.catch(() => {
            this.bossTrackFailed = true;
            this.bossTrack = null;
            this.startBossMusic();
          });
        }
        return;
      }
    }

    if (this.bossPulseTimer || this.bossMusicStartTimeout) return;

    const now = ctx.currentTime;
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = "lowpass";
    padFilter.frequency.setValueAtTime(520, now);
    padFilter.Q.setValueAtTime(0.6, now);

    const padGain = ctx.createGain();
    padGain.gain.setValueAtTime(0.0001, now);
    padGain.gain.exponentialRampToValueAtTime(0.022, now + 0.58);
    padGain.gain.exponentialRampToValueAtTime(0.06, now + 1.45);

    const padRoot = ctx.createOscillator();
    padRoot.type = "triangle";
    padRoot.frequency.setValueAtTime(110, now);

    const padFifth = ctx.createOscillator();
    padFifth.type = "sine";
    padFifth.frequency.setValueAtTime(164.81, now);

    padRoot.connect(padGain);
    padFifth.connect(padGain);
    padGain.connect(padFilter);
    padFilter.connect(this.musicGain);
    padRoot.start(now);
    padFifth.start(now);

    const riser = ctx.createOscillator();
    riser.type = "sawtooth";
    riser.frequency.setValueAtTime(145, now);
    riser.frequency.exponentialRampToValueAtTime(590, now + 1.55);

    const riserFilter = ctx.createBiquadFilter();
    riserFilter.type = "lowpass";
    riserFilter.frequency.setValueAtTime(760, now);
    riserFilter.frequency.exponentialRampToValueAtTime(3100, now + 1.55);

    const riserGain = ctx.createGain();
    riserGain.gain.setValueAtTime(0.0001, now);
    riserGain.gain.exponentialRampToValueAtTime(0.026, now + 0.8);
    riserGain.gain.exponentialRampToValueAtTime(0.047, now + 1.34);
    riserGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.63);

    riser.connect(riserFilter);
    riserFilter.connect(riserGain);
    riserGain.connect(this.musicGain);
    riser.start(now);
    riser.stop(now + 1.68);

    const buildNoiseBuffer = this.getGlassNoiseBuffer();
    let buildNoise = null;
    let buildNoiseHigh = null;
    let buildNoiseBand = null;
    let buildNoiseGain = null;
    if (buildNoiseBuffer) {
      buildNoise = ctx.createBufferSource();
      buildNoise.buffer = buildNoiseBuffer;

      buildNoiseHigh = ctx.createBiquadFilter();
      buildNoiseHigh.type = "highpass";
      buildNoiseHigh.frequency.setValueAtTime(240, now);
      buildNoiseHigh.frequency.exponentialRampToValueAtTime(2200, now + 1.52);

      buildNoiseBand = ctx.createBiquadFilter();
      buildNoiseBand.type = "bandpass";
      buildNoiseBand.Q.value = 1.2;
      buildNoiseBand.frequency.setValueAtTime(760, now);
      buildNoiseBand.frequency.exponentialRampToValueAtTime(3100, now + 1.52);

      buildNoiseGain = ctx.createGain();
      buildNoiseGain.gain.setValueAtTime(0.0001, now);
      buildNoiseGain.gain.exponentialRampToValueAtTime(0.015, now + 0.62);
      buildNoiseGain.gain.exponentialRampToValueAtTime(0.038, now + 1.3);
      buildNoiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.65);

      buildNoise.connect(buildNoiseHigh);
      buildNoiseHigh.connect(buildNoiseBand);
      buildNoiseBand.connect(buildNoiseGain);
      buildNoiseGain.connect(this.musicGain);
      buildNoise.start(now);
      buildNoise.stop(now + 1.68);
    }

    this.bossNodes = {
      padFilter,
      padGain,
      padRoot,
      padFifth,
      riser,
      riserFilter,
      riserGain,
      buildNoise,
      buildNoiseHigh,
      buildNoiseBand,
      buildNoiseGain,
    };
    this.bossBeatIndex = 0;
    this.bossChordIndex = 0;
    this.bossMusicStartTimeout = setTimeout(() => {
      this.bossMusicStartTimeout = null;
      if (!this.ctx || this.ctx.state !== "running" || !this.musicGain) return;
      this.playBossPulse();
      this.bossPulseTimer = setInterval(() => this.playBossPulse(), 320);
    }, 1120);
  },

  stopBossMusic() {
    if (this.bossTrack) {
      try {
        this.bossTrack.pause();
        this.bossTrack.currentTime = 0;
      } catch (_) {}
    }

    if (this.bossMusicStartTimeout) {
      clearTimeout(this.bossMusicStartTimeout);
      this.bossMusicStartTimeout = null;
    }

    if (this.bossPulseTimer) {
      clearInterval(this.bossPulseTimer);
      this.bossPulseTimer = null;
    }

    const ctx = this.ctx;
    if (!ctx || !this.bossNodes) return;

    const now = ctx.currentTime;
    const {
      padGain,
      padRoot,
      padFifth,
      padFilter,
      riser,
      riserFilter,
      riserGain,
      buildNoise,
      buildNoiseHigh,
      buildNoiseBand,
      buildNoiseGain,
    } = this.bossNodes;
    const currentGain = Math.max(0.0001, padGain.gain.value || 0.0001);
    padGain.gain.cancelScheduledValues(now);
    padGain.gain.setValueAtTime(currentGain, now);
    padGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);
    if (buildNoiseGain) {
      const currentBuildGain = Math.max(0.0001, buildNoiseGain.gain.value || 0.0001);
      buildNoiseGain.gain.cancelScheduledValues(now);
      buildNoiseGain.gain.setValueAtTime(currentBuildGain, now);
      buildNoiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    }
    if (riserGain) {
      const currentRiserGain = Math.max(0.0001, riserGain.gain.value || 0.0001);
      riserGain.gain.cancelScheduledValues(now);
      riserGain.gain.setValueAtTime(currentRiserGain, now);
      riserGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    }

    try {
      padRoot.stop(now + 0.38);
      padFifth.stop(now + 0.38);
      if (riser) riser.stop(now + 0.22);
      if (buildNoise) buildNoise.stop(now + 0.22);
    } catch (_) {}

    setTimeout(() => {
      try {
        padRoot.disconnect();
        padFifth.disconnect();
        padGain.disconnect();
        padFilter.disconnect();
        if (riser) riser.disconnect();
        if (riserFilter) riserFilter.disconnect();
        if (riserGain) riserGain.disconnect();
        if (buildNoise) buildNoise.disconnect();
        if (buildNoiseHigh) buildNoiseHigh.disconnect();
        if (buildNoiseBand) buildNoiseBand.disconnect();
        if (buildNoiseGain) buildNoiseGain.disconnect();
      } catch (_) {}
    }, 460);

    this.bossNodes = null;
  },
};

const TOWER_UNLOCKS = {
  ion: { shardCost: 56 },
  frost: { shardCost: 28 },
  quarry: { shardCost: 44 },
  rift: { shardCost: 32 },
  volt: { shardCost: 36 },
  bastion: { shardCost: 48 },
  photon: { shardCost: 52 },
  citadel: { shardCost: 72 },
};

const MENU_UNLOCK_TOWER_IDS = ["ion", "frost", "quarry", "rift", "volt", "bastion", "photon", "citadel"];
const BASE_LOADOUT_SLOTS = 6;
const MAX_LOADOUT_SLOTS = 10;
const BASE_TOWER_PLACE_CAPS = {
  pulse: 4,
  swarm: 4,
  lance: 2,
  ember: 3,
  nova: 2,
  sentinel: 1,
  volt: 3,
  frost: 3,
  ion: 1,
  quarry: 1,
  rift: 2,
  bastion: 1,
  photon: 2,
  citadel: 1,
};
const SPAWNER_TOWER_PLACE_CAPS = {
  crawler: 3,
  blink: 3,
  skitter: 3,
  minion: 2,
  bulwark: 2,
  raider: 2,
  specter: 2,
  warden: 1,
  colossus: 1,
  leviathan: 1,
  monolith: 1,
  icosahedron: 1,
  star: 1,
  rhombus: 1,
  rhombusMinus: 2,
};
const TOWER_CAP_HARD_LIMIT = 8;
const TOWER_CAP_UPGRADE_MAX_LEVEL = 3;
const TOWER_DAMAGE_UPGRADE_MAX_LEVEL = 6;
const TOWER_ATTACK_SPEED_UPGRADE_MAX_LEVEL = 6;
const TOWER_RANGE_UPGRADE_MAX_LEVEL = 6;
const SPAWNER_COOLDOWN_UPGRADE_MAX_LEVEL = 6;
const TOWER_DAMAGE_UPGRADE_STEP = 0.22;
const TOWER_ATTACK_SPEED_UPGRADE_STEP = 0.12;
const TOWER_RANGE_UPGRADE_STEP = 0.1;
const SPAWNER_COOLDOWN_UPGRADE_STEP = 0.1;

const HALF_COLS = (COLS - 1) / 2;
const HALF_ROWS = (ROWS - 1) / 2;

const TOWER_TYPES = {
  pulse: {
    name: "Pulse",
    cost: 130,
    range: 9.6,
    damage: 24,
    fireInterval: 0.52,
    turnSpeed: 5.2,
    projectileSpeed: 32,
    projectileRadius: 0.22,
    projectileColor: "#fff8a5",
    bodyColor: "#58f8d6",
    coreColor: "#0f3b43",
    summary: "Balanced",
  },
  swarm: {
    name: "Swarm",
    cost: 245,
    range: 8.8,
    damage: 14,
    fireInterval: 0.165,
    turnSpeed: 6.6,
    projectileSpeed: 37,
    projectileRadius: 0.16,
    projectileColor: "#ffe38f",
    bodyColor: "#ffd166",
    coreColor: "#5a3b13",
    summary: "Rapid fire",
  },
  lance: {
    name: "Lance",
    cost: 390,
    range: 17.8,
    damage: 122,
    fireInterval: 1.02,
    turnSpeed: 3.2,
    projectileSpeed: 48,
    projectileRadius: 0.2,
    projectileColor: "#b6ddff",
    bodyColor: "#8dbdff",
    coreColor: "#1a2f57",
    summary: "Long range",
  },
  ember: {
    name: "Ember",
    cost: 460,
    range: 12.2,
    damage: 68,
    fireInterval: 0.4,
    turnSpeed: 4.3,
    projectileSpeed: 29,
    projectileRadius: 0.28,
    projectileColor: "#ffd1a5",
    bodyColor: "#ff9d67",
    coreColor: "#5a2612",
    summary: "Heavy burst",
  },
  nova: {
    name: "Nova",
    cost: 740,
    range: 11.6,
    damage: 64,
    fireInterval: 0.2,
    turnSpeed: 5.8,
    projectileSpeed: 41,
    projectileRadius: 0.21,
    projectileColor: "#ffd4f2",
    bodyColor: "#ff82cc",
    coreColor: "#5a1f4f",
    summary: "Plasma storm",
  },
  sentinel: {
    name: "Sentinel",
    cost: 1180,
    range: 22.5,
    damage: 468,
    fireInterval: 1.75,
    turnSpeed: 2.7,
    projectileSpeed: 68,
    projectileRadius: 0.22,
    projectileColor: "#c9f0ff",
    bodyColor: "#81d7ff",
    coreColor: "#1a3b56",
    summary: "Apex cannon",
  },
  volt: {
    name: "Volt",
    cost: 540,
    range: 11.2,
    damage: 36,
    fireInterval: 0.21,
    turnSpeed: 6.1,
    projectileSpeed: 40,
    projectileRadius: 0.18,
    projectileColor: "#b3f8ff",
    bodyColor: "#64d9ff",
    coreColor: "#16394f",
    summary: "Arc burst",
  },
  frost: {
    name: "Frost",
    cost: 500,
    range: 10,
    damage: 31,
    fireInterval: 0.19,
    turnSpeed: 5.9,
    projectileSpeed: 33,
    projectileRadius: 0.2,
    projectileColor: "#d7f7ff",
    bodyColor: "#8ecfff",
    coreColor: "#25486a",
    summary: "Steady stream",
  },
  ion: {
    name: "Ion",
    cost: 760,
    range: 20.8,
    damage: 258,
    fireInterval: 1.2,
    turnSpeed: 3.4,
    projectileSpeed: 62,
    projectileRadius: 0.18,
    projectileColor: "#dfd8ff",
    bodyColor: "#b39fff",
    coreColor: "#2d2157",
    summary: "Hyper sniper",
  },
  quarry: {
    name: "Quarry",
    cost: 920,
    range: 15.4,
    damage: 342,
    fireInterval: 1.45,
    turnSpeed: 2.8,
    projectileSpeed: 30,
    projectileRadius: 0.31,
    projectileColor: "#ffd8bf",
    bodyColor: "#dcb48e",
    coreColor: "#4f341f",
    summary: "Siege impact",
  },
  rift: {
    name: "Rift",
    cost: 680,
    range: 7.8,
    damage: 80,
    fireInterval: 0.25,
    turnSpeed: 5.1,
    projectileSpeed: 34,
    projectileRadius: 0.27,
    projectileColor: "#ffc8ff",
    bodyColor: "#ff8ce7",
    coreColor: "#5a2458",
    summary: "Close burst",
  },
  bastion: {
    name: "Bastion",
    cost: 980,
    range: 13.2,
    damage: 236,
    fireInterval: 0.72,
    turnSpeed: 3.6,
    projectileSpeed: 36,
    projectileRadius: 0.26,
    projectileColor: "#ffe0bd",
    bodyColor: "#ffb67d",
    coreColor: "#5c361a",
    summary: "Heavy platform",
  },
  photon: {
    name: "Photon",
    cost: 720,
    range: 13.6,
    damage: 58,
    fireInterval: 0.16,
    turnSpeed: 6.8,
    projectileSpeed: 46,
    projectileRadius: 0.17,
    projectileColor: "#fff2a6",
    bodyColor: "#d8ff70",
    coreColor: "#4a5b12",
    summary: "Laser stream",
  },
  citadel: {
    name: "Citadel",
    cost: 1420,
    range: 19.6,
    damage: 684,
    fireInterval: 2.05,
    turnSpeed: 2.3,
    projectileSpeed: 64,
    projectileRadius: 0.34,
    projectileColor: "#ffe1b6",
    bodyColor: "#ffc38a",
    coreColor: "#5e361c",
    summary: "Fortress cannon",
  },
};

const BASE_UNLOCKED_TOWERS = new Set(Object.keys(TOWER_TYPES).filter((id) => !TOWER_UNLOCKS[id]));

const ENEMY_TYPES = {
  crawler: {
    name: "Crawler",
    hp: 70,
    speed: 3.95,
    reward: 11,
    radius: 0.85,
    coreDamage: 1,
    hpGrowth: 0.2,
    speedGrowth: 0.012,
    rewardGrowth: 1.2,
    colorA: "#ff8f63",
    colorB: "#ffcc84",
    hoverHeight: 0.95,
  },
  blink: {
    name: "Blink",
    hp: 50,
    speed: 6.45,
    reward: 12,
    radius: 0.72,
    coreDamage: 1,
    hpGrowth: 0.16,
    speedGrowth: 0.022,
    rewardGrowth: 1.3,
    colorA: "#72e8ff",
    colorB: "#f2fff9",
    hoverHeight: 0.95,
  },
  skitter: {
    name: "Skitter",
    hp: 38,
    speed: 8.2,
    reward: 10,
    radius: 0.62,
    coreDamage: 1,
    hpGrowth: 0.14,
    speedGrowth: 0.028,
    rewardGrowth: 1.1,
    colorA: "#9dff7a",
    colorB: "#ecffc8",
    hoverHeight: 0.86,
  },
  minion: {
    name: "Icosahedron Minion",
    hp: 14,
    speed: 11.8,
    reward: 2,
    radius: 0.5,
    coreDamage: 1,
    hpGrowth: 0.03,
    speedGrowth: 0.004,
    rewardGrowth: 0.05,
    colorA: "#ff2d2d",
    colorB: "#ffc2c2",
    hoverHeight: 0.82,
  },
  bulwark: {
    name: "Bulwark",
    hp: 188,
    speed: 3.02,
    reward: 25,
    radius: 1.15,
    coreDamage: 2,
    hpGrowth: 0.28,
    speedGrowth: 0.008,
    rewardGrowth: 1.9,
    colorA: "#ffa354",
    colorB: "#ffd88f",
    hoverHeight: 1.05,
  },
  raider: {
    name: "Raider",
    hp: 122,
    speed: 5.25,
    reward: 20,
    radius: 0.88,
    coreDamage: 1,
    hpGrowth: 0.22,
    speedGrowth: 0.015,
    rewardGrowth: 1.6,
    colorA: "#95a9ff",
    colorB: "#e7ebff",
    hoverHeight: 1,
  },
  specter: {
    name: "Specter",
    hp: 96,
    speed: 7.35,
    reward: 21,
    radius: 0.78,
    coreDamage: 1,
    hpGrowth: 0.19,
    speedGrowth: 0.025,
    rewardGrowth: 1.7,
    colorA: "#5cf7d7",
    colorB: "#d9fff4",
    hoverHeight: 1.06,
  },
  warden: {
    name: "Warden",
    hp: 248,
    speed: 3.35,
    reward: 31,
    radius: 1.05,
    coreDamage: 2,
    hpGrowth: 0.3,
    speedGrowth: 0.009,
    rewardGrowth: 2.1,
    colorA: "#ffc379",
    colorB: "#fff0c8",
    hoverHeight: 1.08,
  },
  prism: {
    name: "Prism",
    hp: 310,
    speed: 4.25,
    reward: 34,
    radius: 1.02,
    coreDamage: 2,
    hpGrowth: 0.28,
    speedGrowth: 0.012,
    rewardGrowth: 2.2,
    colorA: "#7de4ff",
    colorB: "#e3fcff",
    hoverHeight: 1.08,
  },
  colossus: {
    name: "Colossus",
    hp: 390,
    speed: 2.72,
    reward: 44,
    radius: 1.35,
    coreDamage: 3,
    hpGrowth: 0.34,
    speedGrowth: 0.009,
    rewardGrowth: 2.8,
    colorA: "#ff6c6c",
    colorB: "#ffe9b8",
    hoverHeight: 1.15,
  },
  leviathan: {
    name: "Leviathan",
    hp: 520,
    speed: 2.25,
    reward: 56,
    radius: 1.45,
    coreDamage: 4,
    hpGrowth: 0.38,
    speedGrowth: 0.007,
    rewardGrowth: 3.1,
    colorA: "#ff5b8e",
    colorB: "#ffd9e7",
    hoverHeight: 1.2,
  },
  monolith: {
    name: "Monolith",
    hp: 960,
    speed: 2.78,
    reward: 80,
    radius: 1.58,
    coreDamage: 7,
    hpGrowth: 0.44,
    speedGrowth: 0.009,
    rewardGrowth: 3.6,
    colorA: "#7b62ff",
    colorB: "#f2ddff",
    hoverHeight: 1.24,
  },
  icosahedron: {
    name: "Icosahedron",
    hp: 1120,
    speed: 2.15,
    reward: 88,
    radius: 1.95,
    coreDamage: 20,
    hpGrowth: 0.48,
    speedGrowth: 0.006,
    rewardGrowth: 3.8,
    colorA: "#9a0008",
    colorB: "#ff2b2b",
    hoverHeight: 1.38,
  },
  star: {
    name: "Star",
    hp: 77508,
    speed: 0.42,
    reward: 900,
    radius: 2.4,
    coreDamage: 36,
    hpGrowth: 0,
    speedGrowth: 0,
    rewardGrowth: 0,
    colorA: "#ffe100",
    colorB: "#fff7b8",
    hoverHeight: 1.62,
  },
  rhombus: {
    name: "Rhombus",
    hp: 7424,
    speed: 2.95,
    reward: 220,
    radius: 2.15,
    coreDamage: 28,
    hpGrowth: 0.52,
    speedGrowth: 0.006,
    rewardGrowth: 6.4,
    colorA: "#7c31ff",
    colorB: "#d194ff",
    hoverHeight: 1.52,
  },
  rhombusMinus: {
    name: "Rhombus Minion",
    hp: 1320,
    speed: 2.95,
    reward: 118,
    radius: 1.38,
    coreDamage: 12,
    hpGrowth: 0.12,
    speedGrowth: 0.006,
    rewardGrowth: 2.6,
    colorA: "#d793ff",
    colorB: "#ffd4ff",
    hoverHeight: 1.18,
  },
};

const SPAWNER_TOWER_PREFIX = "spawner_";
const ALLY_COLOR_A = "#2cff72";
const ALLY_COLOR_B = "#2cff72";
const ALLY_UNIT_CAP = 96;

const CREATURE_SPAWNER_UNLOCKS = {
  crawler: { killRequirement: 200, towerCost: 260, spawnInterval: 2.3 },
  blink: { killRequirement: 190, towerCost: 280, spawnInterval: 2.1 },
  skitter: { killRequirement: 180, towerCost: 300, spawnInterval: 1.9 },
  minion: { killRequirement: 240, towerCost: 190, spawnInterval: 1.6 },
  bulwark: { killRequirement: 160, towerCost: 430, spawnInterval: 4.1 },
  raider: { killRequirement: 150, towerCost: 420, spawnInterval: 3.5 },
  specter: { killRequirement: 140, towerCost: 460, spawnInterval: 3.3 },
  warden: { killRequirement: 120, towerCost: 560, spawnInterval: 4.5 },
  colossus: { killRequirement: 90, towerCost: 720, spawnInterval: 5.8 },
  leviathan: { killRequirement: 70, towerCost: 860, spawnInterval: 6.6 },
  monolith: { killRequirement: 80, towerCost: 1220, spawnInterval: 7.8 },
  icosahedron: { killRequirement: 6, towerCost: 1620, spawnInterval: 8.4 },
  star: { killRequirement: 2, towerCost: 2450, spawnInterval: 11.8 },
  rhombus: { killRequirement: 6, towerCost: 1780, spawnInterval: 9.2, spawnCount: 2 },
  rhombusMinus: { killRequirement: 36, towerCost: 920, spawnInterval: 5.2 },
};

const CREATURE_SHOP_ENEMY_IDS = Object.keys(ENEMY_TYPES).filter((enemyTypeId) =>
  Object.prototype.hasOwnProperty.call(CREATURE_SPAWNER_UNLOCKS, enemyTypeId)
);

function spawnerTowerIdForEnemy(enemyTypeId) {
  return `${SPAWNER_TOWER_PREFIX}${enemyTypeId}`;
}

function getAllTowerTypeIds() {
  const allIds = new Set(Object.keys(TOWER_TYPES));
  for (const enemyTypeId of CREATURE_SHOP_ENEMY_IDS) {
    allIds.add(spawnerTowerIdForEnemy(enemyTypeId));
  }
  return allIds;
}

function enemyTypeFromSpawnerTowerId(towerTypeId) {
  if (typeof towerTypeId !== "string") return null;
  if (!towerTypeId.startsWith(SPAWNER_TOWER_PREFIX)) return null;
  const enemyTypeId = towerTypeId.slice(SPAWNER_TOWER_PREFIX.length);
  return Object.prototype.hasOwnProperty.call(ENEMY_TYPES, enemyTypeId) ? enemyTypeId : null;
}

function isSpawnerTowerId(towerTypeId) {
  return !!enemyTypeFromSpawnerTowerId(towerTypeId);
}

function getSpawnerTowerType(towerTypeId) {
  const enemyTypeId = enemyTypeFromSpawnerTowerId(towerTypeId);
  if (!enemyTypeId) return null;
  const enemyType = ENEMY_TYPES[enemyTypeId];
  const unlock = CREATURE_SPAWNER_UNLOCKS[enemyTypeId];
  if (!enemyType || !unlock) return null;
  const spawnInterval = unlock.spawnInterval * 2;

  return {
    name: `${enemyType.name} Spawner`,
    cost: unlock.towerCost,
    range: 1.7,
    damage: enemyType.hp,
    fireInterval: spawnInterval,
    turnSpeed: 2.4,
    projectileSpeed: 0,
    projectileRadius: 0.2,
    projectileColor: "#7dffb0",
    bodyColor: enemyType.colorA,
    coreColor: enemyType.colorB,
    summary:
      (unlock.spawnCount || 1) > 1
        ? `Spawns ${(unlock.spawnCount || 1)} green ${enemyType.name} allies`
        : `Spawns green ${enemyType.name} ally`,
    spawnerEnemyTypeId: enemyTypeId,
    spawnInterval,
    spawnCount: Math.max(1, Math.floor(unlock.spawnCount || 1)),
  };
}

function getTowerDamageUpgradeMaxLevel(towerTypeId) {
  return isSpawnerTowerId(towerTypeId) ? 0 : TOWER_DAMAGE_UPGRADE_MAX_LEVEL;
}

function getTowerAttackSpeedUpgradeMaxLevel(towerTypeId) {
  return isSpawnerTowerId(towerTypeId) ? 0 : TOWER_ATTACK_SPEED_UPGRADE_MAX_LEVEL;
}

function getTowerRangeUpgradeMaxLevel(towerTypeId) {
  return isSpawnerTowerId(towerTypeId) ? 0 : TOWER_RANGE_UPGRADE_MAX_LEVEL;
}

function getSpawnerCooldownUpgradeMaxLevel(towerTypeId) {
  return isSpawnerTowerId(towerTypeId) ? SPAWNER_COOLDOWN_UPGRADE_MAX_LEVEL : 0;
}

function getTowerDamageUpgradeLevel(towerTypeId) {
  const maxLevel = getTowerDamageUpgradeMaxLevel(towerTypeId);
  const rawLevel = Number(game.towerDamageUpgrades?.[towerTypeId] || 0);
  if (!Number.isFinite(rawLevel)) return 0;
  return Math.max(0, Math.min(maxLevel, Math.floor(rawLevel)));
}

function getTowerAttackSpeedUpgradeLevel(towerTypeId) {
  const maxLevel = getTowerAttackSpeedUpgradeMaxLevel(towerTypeId);
  const rawLevel = Number(game.towerAttackSpeedUpgrades?.[towerTypeId] || 0);
  if (!Number.isFinite(rawLevel)) return 0;
  return Math.max(0, Math.min(maxLevel, Math.floor(rawLevel)));
}

function getTowerRangeUpgradeLevel(towerTypeId) {
  const maxLevel = getTowerRangeUpgradeMaxLevel(towerTypeId);
  const rawLevel = Number(game.towerRangeUpgrades?.[towerTypeId] || 0);
  if (!Number.isFinite(rawLevel)) return 0;
  return Math.max(0, Math.min(maxLevel, Math.floor(rawLevel)));
}

function getSpawnerCooldownUpgradeLevel(towerTypeId) {
  const maxLevel = getSpawnerCooldownUpgradeMaxLevel(towerTypeId);
  const rawLevel = Number(game.spawnerCooldownUpgrades?.[towerTypeId] || 0);
  if (!Number.isFinite(rawLevel)) return 0;
  return Math.max(0, Math.min(maxLevel, Math.floor(rawLevel)));
}

function getTowerDamageMultiplier(towerTypeId) {
  return 1 + getTowerDamageUpgradeLevel(towerTypeId) * TOWER_DAMAGE_UPGRADE_STEP;
}

function getTowerFireIntervalMultiplier(towerTypeId) {
  const level = getTowerAttackSpeedUpgradeLevel(towerTypeId);
  return Math.max(0.35, 1 - level * TOWER_ATTACK_SPEED_UPGRADE_STEP);
}

function getTowerRangeMultiplier(towerTypeId) {
  return 1 + getTowerRangeUpgradeLevel(towerTypeId) * TOWER_RANGE_UPGRADE_STEP;
}

function getSpawnerCooldownMultiplier(towerTypeId) {
  const level = getSpawnerCooldownUpgradeLevel(towerTypeId);
  return Math.max(0.4, 1 - level * SPAWNER_COOLDOWN_UPGRADE_STEP);
}

function getTowerDamageUpgradeCost(towerTypeId, nextLevel) {
  const baseTower = TOWER_TYPES[towerTypeId];
  if (!baseTower) return 0;
  const level = Math.max(1, Math.floor(nextLevel || 1));
  return Math.max(8, Math.round(12 + baseTower.cost * 0.045 + baseTower.damage * 0.08 + level * 14));
}

function getTowerAttackSpeedUpgradeCost(towerTypeId, nextLevel) {
  const baseTower = TOWER_TYPES[towerTypeId];
  if (!baseTower) return 0;
  const level = Math.max(1, Math.floor(nextLevel || 1));
  const speedWeight = Math.max(1, 1 / Math.max(0.08, baseTower.fireInterval));
  return Math.max(8, Math.round(14 + baseTower.cost * 0.05 + speedWeight * 3 + level * 15));
}

function getTowerRangeUpgradeCost(towerTypeId, nextLevel) {
  const baseTower = TOWER_TYPES[towerTypeId];
  if (!baseTower) return 0;
  const level = Math.max(1, Math.floor(nextLevel || 1));
  return Math.max(8, Math.round(12 + baseTower.cost * 0.042 + baseTower.range * 5.2 + level * 13));
}

function getSpawnerCooldownUpgradeCost(towerTypeId, nextLevel) {
  const spawnerType = getSpawnerTowerType(towerTypeId);
  if (!spawnerType) return 0;
  const level = Math.max(1, Math.floor(nextLevel || 1));
  return Math.max(8, Math.round(12 + spawnerType.cost * 0.048 + spawnerType.spawnCount * 6 + level * 13));
}

function getTowerType(towerTypeId) {
  const baseTower = TOWER_TYPES[towerTypeId];
  if (baseTower) {
    const damageMultiplier = getTowerDamageMultiplier(towerTypeId);
    const fireIntervalMultiplier = getTowerFireIntervalMultiplier(towerTypeId);
    const rangeMultiplier = getTowerRangeMultiplier(towerTypeId);
    const damage = Math.max(1, Math.round(baseTower.damage * damageMultiplier));
    const fireInterval = Math.max(0.05, Number((baseTower.fireInterval * fireIntervalMultiplier).toFixed(3)));
    const range = Math.max(1.2, Number((baseTower.range * rangeMultiplier).toFixed(2)));
    if (damage === baseTower.damage && fireInterval === baseTower.fireInterval && range === baseTower.range) return baseTower;
    return {
      ...baseTower,
      damage,
      fireInterval,
      range,
    };
  }

  const spawnerTower = getSpawnerTowerType(towerTypeId);
  if (spawnerTower) {
    const cooldownMultiplier = getSpawnerCooldownMultiplier(towerTypeId);
    const spawnInterval = Math.max(0.35, Number((spawnerTower.spawnInterval * cooldownMultiplier).toFixed(2)));
    if (spawnInterval === spawnerTower.spawnInterval) return spawnerTower;
    return {
      ...spawnerTower,
      fireInterval: spawnInterval,
      spawnInterval,
    };
  }

  return TOWER_TYPES.pulse;
}

function getTowerBasePlaceCap(towerTypeId) {
  const spawnerEnemyTypeId = enemyTypeFromSpawnerTowerId(towerTypeId);
  if (spawnerEnemyTypeId) {
    const cap = SPAWNER_TOWER_PLACE_CAPS[spawnerEnemyTypeId];
    return Math.max(1, Math.min(TOWER_CAP_HARD_LIMIT, Number.isFinite(cap) ? cap : 2));
  }
  const cap = BASE_TOWER_PLACE_CAPS[towerTypeId];
  return Math.max(1, Math.min(TOWER_CAP_HARD_LIMIT, Number.isFinite(cap) ? cap : 2));
}

function getTowerCapUpgradeMaxLevel(towerTypeId) {
  const baseCap = getTowerBasePlaceCap(towerTypeId);
  const roomUntilHardLimit = Math.max(0, TOWER_CAP_HARD_LIMIT - baseCap);
  return Math.max(0, Math.min(TOWER_CAP_UPGRADE_MAX_LEVEL, roomUntilHardLimit));
}

function getTowerCapUpgradeLevel(towerTypeId) {
  const maxLevel = getTowerCapUpgradeMaxLevel(towerTypeId);
  const rawLevel = Number(game.towerCapUpgrades?.[towerTypeId] || 0);
  if (!Number.isFinite(rawLevel)) return 0;
  return Math.max(0, Math.min(maxLevel, Math.floor(rawLevel)));
}

function getTowerPlaceCap(towerTypeId) {
  const baseCap = getTowerBasePlaceCap(towerTypeId);
  const upgradeLevel = getTowerCapUpgradeLevel(towerTypeId);
  return Math.max(1, Math.min(TOWER_CAP_HARD_LIMIT, baseCap + upgradeLevel));
}

function getTowerCapUpgradeCost(towerTypeId, nextLevel) {
  const towerType = getTowerType(towerTypeId);
  const baseCap = getTowerBasePlaceCap(towerTypeId);
  const level = Math.max(1, Math.floor(nextLevel || 1));
  const spawnerTax = isSpawnerTowerId(towerTypeId) ? 8 : 0;
  return Math.max(8, Math.round(6 + baseCap * 4 + level * 10 + towerType.cost * 0.035 + spawnerTax));
}

function normalizeTowerCapUpgrades(rawUpgrades) {
  const normalized = {};
  const knownTowerIds = getAllTowerTypeIds();
  if (!rawUpgrades || typeof rawUpgrades !== "object") return normalized;
  for (const towerTypeId of knownTowerIds) {
    const maxLevel = getTowerCapUpgradeMaxLevel(towerTypeId);
    if (maxLevel <= 0) continue;
    const rawLevel = Number(rawUpgrades[towerTypeId]);
    if (!Number.isFinite(rawLevel)) continue;
    const level = Math.max(0, Math.min(maxLevel, Math.floor(rawLevel)));
    if (level > 0) normalized[towerTypeId] = level;
  }
  return normalized;
}

function normalizeTowerDamageUpgrades(rawUpgrades) {
  const normalized = {};
  const knownTowerIds = Object.keys(TOWER_TYPES);
  if (!rawUpgrades || typeof rawUpgrades !== "object") return normalized;
  for (const towerTypeId of knownTowerIds) {
    const maxLevel = getTowerDamageUpgradeMaxLevel(towerTypeId);
    if (maxLevel <= 0) continue;
    const rawLevel = Number(rawUpgrades[towerTypeId]);
    if (!Number.isFinite(rawLevel)) continue;
    const level = Math.max(0, Math.min(maxLevel, Math.floor(rawLevel)));
    if (level > 0) normalized[towerTypeId] = level;
  }
  return normalized;
}

function normalizeTowerAttackSpeedUpgrades(rawUpgrades) {
  const normalized = {};
  const knownTowerIds = Object.keys(TOWER_TYPES);
  if (!rawUpgrades || typeof rawUpgrades !== "object") return normalized;
  for (const towerTypeId of knownTowerIds) {
    const maxLevel = getTowerAttackSpeedUpgradeMaxLevel(towerTypeId);
    if (maxLevel <= 0) continue;
    const rawLevel = Number(rawUpgrades[towerTypeId]);
    if (!Number.isFinite(rawLevel)) continue;
    const level = Math.max(0, Math.min(maxLevel, Math.floor(rawLevel)));
    if (level > 0) normalized[towerTypeId] = level;
  }
  return normalized;
}

function normalizeTowerRangeUpgrades(rawUpgrades) {
  const normalized = {};
  const knownTowerIds = Object.keys(TOWER_TYPES);
  if (!rawUpgrades || typeof rawUpgrades !== "object") return normalized;
  for (const towerTypeId of knownTowerIds) {
    const maxLevel = getTowerRangeUpgradeMaxLevel(towerTypeId);
    if (maxLevel <= 0) continue;
    const rawLevel = Number(rawUpgrades[towerTypeId]);
    if (!Number.isFinite(rawLevel)) continue;
    const level = Math.max(0, Math.min(maxLevel, Math.floor(rawLevel)));
    if (level > 0) normalized[towerTypeId] = level;
  }
  return normalized;
}

function normalizeSpawnerCooldownUpgrades(rawUpgrades) {
  const normalized = {};
  if (!rawUpgrades || typeof rawUpgrades !== "object") return normalized;
  for (const enemyTypeId of CREATURE_SHOP_ENEMY_IDS) {
    const towerTypeId = spawnerTowerIdForEnemy(enemyTypeId);
    const maxLevel = getSpawnerCooldownUpgradeMaxLevel(towerTypeId);
    if (maxLevel <= 0) continue;
    const rawLevel = Number(rawUpgrades[towerTypeId]);
    if (!Number.isFinite(rawLevel)) continue;
    const level = Math.max(0, Math.min(maxLevel, Math.floor(rawLevel)));
    if (level > 0) normalized[towerTypeId] = level;
  }
  return normalized;
}

function countPlacedTowersByType(towerTypeId) {
  let count = 0;
  for (const tower of game.towers) {
    if (tower.towerTypeId === towerTypeId) count += 1;
  }
  return count;
}

function getTowerPlacementStats(towerTypeId) {
  const cap = getTowerPlaceCap(towerTypeId);
  const placed = countPlacedTowersByType(towerTypeId);
  return {
    cap,
    placed,
    remaining: Math.max(0, cap - placed),
    atCap: placed >= cap,
  };
}

function getTowerCapBreakdown(towerTypeId) {
  const baseCap = getTowerBasePlaceCap(towerTypeId);
  const upgradeLevel = getTowerCapUpgradeLevel(towerTypeId);
  const cap = getTowerPlaceCap(towerTypeId);
  const maxUpgradeLevel = getTowerCapUpgradeMaxLevel(towerTypeId);
  return {
    baseCap,
    cap,
    upgradeLevel,
    maxUpgradeLevel,
  };
}

function formatPlacementCapLine(towerTypeId, placement = null, includeMaxTag = true) {
  const effectivePlacement = placement || getTowerPlacementStats(towerTypeId);
  const capInfo = getTowerCapBreakdown(towerTypeId);
  const maxTag = includeMaxTag && effectivePlacement.atCap ? " (MAX)" : "";
  return `Cap ${capInfo.cap} (Base ${capInfo.baseCap} +${capInfo.upgradeLevel}) | Placed ${effectivePlacement.placed}/${effectivePlacement.cap}${maxTag}`;
}

function applyTowerTypeConfigToPlacedTower(tower) {
  if (!tower || !tower.towerTypeId) return;
  const config = getTowerType(tower.towerTypeId);
  tower.name = config.name;
  tower.isSpawner = !!config.spawnerEnemyTypeId;
  tower.spawnEnemyTypeId = config.spawnerEnemyTypeId || null;
  tower.spawnInterval = config.spawnInterval || config.fireInterval;
  tower.spawnCount = Math.max(1, Math.floor(config.spawnCount || 1));
  tower.range = config.range;
  tower.damage = config.damage;
  tower.turnSpeed = config.turnSpeed ?? tower.turnSpeed;
  tower.fireInterval = config.fireInterval;
  tower.projectileSpeed = config.projectileSpeed;
  tower.projectileRadius = config.projectileRadius;
  tower.projectileColor = config.projectileColor;
}

function refreshPlacedTowerStats(towerTypeId = null) {
  for (const tower of game.towers) {
    if (!tower) continue;
    if (towerTypeId && tower.towerTypeId !== towerTypeId) continue;
    applyTowerTypeConfigToPlacedTower(tower);
  }
}

function weightedChoice(weightEntries) {
  let total = 0;
  for (const entry of weightEntries) total += entry.weight;
  if (total <= 0) return "crawler";

  let threshold = Math.random() * total;
  for (const entry of weightEntries) {
    threshold -= entry.weight;
    if (threshold <= 0) return entry.id;
  }
  return weightEntries[weightEntries.length - 1].id;
}

function getLevelDifficultyProfile(level = game.currentLevel) {
  if (level >= 2) {
    return {
      effectiveWaveOffset: 2,
      spawnMultiplier: 1.36,
      spawnFlatBonus: 1,
      hpMultiplier: 1.26,
      speedMultiplier: 1.12,
      coreDamageMultiplier: 1.16,
      rewardMultiplier: 1,
      spawnStartDelay: 0.18,
      spawnIntervalScale: 0.9,
      minSpawnInterval: 0.15,
      startingCredits: 220,
      startingLives: 19,
    };
  }

  return {
    effectiveWaveOffset: 0,
    spawnMultiplier: 1,
    spawnFlatBonus: 0,
    hpMultiplier: 1,
    speedMultiplier: 1,
    coreDamageMultiplier: 1,
    rewardMultiplier: 1,
    spawnStartDelay: 0.22,
    spawnIntervalScale: 1,
    minSpawnInterval: 0.18,
    startingCredits: 220,
    startingLives: 20,
  };
}

function enemyWeightsForWave(wave, level = game.currentLevel) {
  const profile = getLevelDifficultyProfile(level);
  const moonLevel = level >= 2;
  const effectiveWave = Math.max(1, wave + profile.effectiveWaveOffset);
  const bulwarkStartWave = level >= 2 ? 5 : 4;
  const raiderStartWave = level >= 2 ? 6 : 5;
  return [
    { id: "crawler", weight: Math.max(70 - effectiveWave * 4, 14) },
    { id: "blink", weight: effectiveWave >= 2 ? Math.min(8 + effectiveWave * 2.5, 22) : 0 },
    { id: "skitter", weight: effectiveWave >= 3 ? Math.min(9 + (effectiveWave - 2) * 2.8, 24) : 0 },
    { id: "bulwark", weight: effectiveWave >= bulwarkStartWave ? Math.min((effectiveWave - (bulwarkStartWave - 1)) * 4.4, 24) : 0 },
    { id: "raider", weight: effectiveWave >= raiderStartWave ? Math.min((effectiveWave - (raiderStartWave - 1)) * 4, 23) : 0 },
    { id: "specter", weight: effectiveWave >= 6 ? Math.min((effectiveWave - 5) * 3.8, 21) : 0 },
    { id: "warden", weight: effectiveWave >= 8 ? Math.min((effectiveWave - 7) * 3.4, 20) : 0 },
    { id: "prism", weight: moonLevel && effectiveWave >= 9 ? Math.min((effectiveWave - 8) * 3.6, 20) : 0 },
    { id: "colossus", weight: effectiveWave >= 9 ? Math.min((effectiveWave - 8) * 2.8, 16) : 0 },
    { id: "leviathan", weight: effectiveWave >= 12 ? Math.min((effectiveWave - 11) * 2.3, 14) : 0 },
    { id: "monolith", weight: moonLevel && wave >= 21 ? Math.min((effectiveWave - 22) * 2.4, 11) : 0 },
  ].filter((entry) => entry.weight > 0);
}

function buildWaveSpawnQueue(wave, count, level = game.currentLevel) {
  if (level === 1 && wave === 20) return ["icosahedron", ...Array(12).fill("minion")];
  if (level >= 3 && wave === 40) return ["star"];
  if (level === 2 && wave === 30) {
    const escortBlock = Array(4).fill("rhombusMinus");
    return [...escortBlock, "rhombus", ...escortBlock, "rhombus", ...escortBlock];
  }

  const profile = getLevelDifficultyProfile(level);
  const effectiveWave = Math.max(1, wave + profile.effectiveWaveOffset);
  const weights = enemyWeightsForWave(wave, level);
  const queue = [];

  for (let i = 0; i < count; i += 1) {
    let forcedType = null;
    const slot = i + 1;

    if (level >= 2 && wave >= 21 && slot % 19 === 0) forcedType = Math.random() < 0.7 ? "monolith" : "leviathan";
    else if (effectiveWave >= 12 && slot % 17 === 0) {
      if (level >= 2 && wave >= 21 && Math.random() < 0.35) forcedType = "monolith";
      else forcedType = Math.random() < 0.55 ? "leviathan" : "colossus";
    }
    else if (effectiveWave >= 9 && slot % 13 === 0) forcedType = Math.random() < 0.5 ? "colossus" : "warden";
    else if (level >= 2 && effectiveWave >= 9 && slot % 12 === 0) forcedType = Math.random() < 0.62 ? "prism" : "specter";
    else if (effectiveWave >= 7 && slot % 11 === 0) forcedType = Math.random() < 0.5 ? "specter" : "raider";
    else if (effectiveWave >= (level >= 2 ? 6 : 5) && slot % 9 === 0) forcedType = Math.random() < 0.55 ? "raider" : "bulwark";
    else if (effectiveWave >= 3 && slot % 7 === 0) forcedType = Math.random() < 0.5 ? "skitter" : "blink";

    queue.push(forcedType || weightedChoice(weights));
  }

  if (level >= 2) {
    if (wave <= 1) queue[0] = "crawler";
    else if (wave <= 3) queue[0] = "skitter";
    else queue[0] = effectiveWave >= 6 ? "raider" : "skitter";
  } else {
    queue[0] = "crawler";
  }

  // Ensure Monolith is always seen immediately once Moon reaches its unlock wave.
  if (level >= 2 && wave >= 21 && queue.length > 0) {
    queue[0] = "monolith";
    if (queue.length > 5) {
      const secondIndex = Math.min(queue.length - 1, Math.max(2, Math.floor(queue.length * 0.45)));
      queue[secondIndex] = "monolith";
    }
  }
  return queue;
}

function createEnemyStats(typeId, wave, level = game.currentLevel) {
  const profile = getLevelDifficultyProfile(level);
  const type = ENEMY_TYPES[typeId] || ENEMY_TYPES.crawler;
  const effectiveWave = Math.max(1, wave + profile.effectiveWaveOffset);
  const waveFactor = Math.max(0, effectiveWave - 1);
  const baseReward = type.reward + type.rewardGrowth * waveFactor;
  const rewardScaled = (typeId === "crawler" ? baseReward : baseReward / 3) * profile.rewardMultiplier;
  const scaledHp = Math.round(type.hp * (1 + type.hpGrowth * waveFactor) * profile.hpMultiplier);
  let hp = typeId === "rhombus" ? 7424 : typeId === "rhombusMinus" ? 1320 : typeId === "star" ? 77508 : scaledHp;
  if (level === 1 && typeId === "icosahedron") hp = Math.max(1, Math.round(hp * 2));

  return {
    typeId,
    name: type.name,
    hp,
    speed: type.speed * (1 + type.speedGrowth * waveFactor) * profile.speedMultiplier,
    reward: Math.max(1, Math.round(rewardScaled)),
    radius: type.radius,
    coreDamage: Math.max(1, Math.round(type.coreDamage * profile.coreDamageMultiplier)),
    colorA: type.colorA,
    colorB: type.colorB,
    hoverHeight: type.hoverHeight,
  };
}

function waveThreatLabel(wave, level = game.currentLevel) {
  if (level >= 3) {
    if (wave === 40) return "Ember threat: Star-class apex boss detected. Massive HP, extremely slow advance.";
    if (wave >= 21) return "Ember threat: Monolith command cores entering the rift lane.";
    if (wave >= 10) return "Ember threat: Leviathan siege wave under volcanic pressure.";
    if (wave >= 9) return "Ember threat: Colossus and Warden heat-shield column advancing.";
    if (wave >= 7) return "Ember threat: Prism assault casters with Raider and Specter support.";
    if (wave >= 5) return "Ember threat: Heavy assault units entering the rift.";
    if (wave >= 3) return "Ember threat: Fast Skitter packs igniting the lane.";
    if (wave >= 2) return "Ember threat: Blink scouts and mixed pressure detected.";
    return "Ember threat: Enemy probes gathering heat in the rift.";
  }
  if (level === 2) {
    if (wave === 30) return "Lunar threat: Twin Rhombus apex bosses with Rhombus Minion escorts.";
    if (wave >= 21) return "Lunar threat: Monolith command units escalating to apex intensity.";
    if (wave >= 10) return "Lunar threat: Leviathan-class siege swarm under low gravity.";
    if (wave >= 9) return "Lunar threat: Colossus and Warden phalanx advancing.";
    if (wave >= 7) return "Lunar threat: Prism assault casters surging with Raider and Specter packs.";
    if (wave >= 5) return "Lunar threat: Heavy assault units entering from multiple vectors.";
    if (wave >= 3) return "Lunar threat: Fast Skitter packs saturating the route.";
    if (wave >= 2) return "Lunar threat: Blink scouts and mixed pressure detected.";
    return "Lunar threat: Enemy probes already intensified.";
  }
  if (wave === 20) return "Threat level: Icosahedron apex entity with high-speed minions breaching the lane.";
  if (wave >= 12) return "Threat level: Leviathan-class entities detected.";
  if (wave >= 9) return "Threat level: Colossus and Warden armor columns incoming.";
  if (wave >= 7) return "Threat level: Raider and Specter assault patterns detected.";
  if (wave >= 5) return "Threat level: Raider strike units entering the lane.";
  if (wave >= 3) return "Threat level: Skitter packs swarming the route.";
  if (wave >= 2) return "Threat level: Blink scouts spotted.";
  return "Threat level: Standard crawler swarm.";
}

function noise2d(x, y, seed = 0) {
  let value = Math.imul(x + 1, 374761393);
  value = (value + Math.imul(y + 1, 668265263)) | 0;
  value = (value + Math.imul(seed + 1, 1274126177)) | 0;
  value = (value ^ (value >>> 13)) | 0;
  value = Math.imul(value, 2246822519) | 0;
  return ((value ^ (value >>> 15)) >>> 0) / 4294967295;
}

function cellToWorld(cellX, cellY) {
  return new THREE.Vector3((cellX - HALF_COLS) * CELL_SIZE, 0, (cellY - HALF_ROWS) * CELL_SIZE);
}

function worldToCell(worldX, worldZ) {
  const cellX = Math.floor(worldX / CELL_SIZE + COLS / 2);
  const cellY = Math.floor(worldZ / CELL_SIZE + ROWS / 2);
  return { cellX, cellY };
}

const LANE_START = { x: 0, y: 4 };
const LANE_END = { x: 15, y: 3 };
const LANE_START_KEY = `${LANE_START.x},${LANE_START.y}`;
const LANE_END_KEY = `${LANE_END.x},${LANE_END.y}`;

const DEFAULT_PATH_WAYPOINTS = [
  { x: 0, y: 4 },
  { x: 3, y: 4 },
  { x: 3, y: 1 },
  { x: 8, y: 1 },
  { x: 8, y: 6 },
  { x: 12, y: 6 },
  { x: 12, y: 3 },
  { x: 15, y: 3 },
];

const LEVEL2_PATH_WAYPOINTS = [
  { x: 0, y: 4 },
  { x: 0, y: 1 },
  { x: 5, y: 1 },
  { x: 5, y: 7 },
  { x: 10, y: 7 },
  { x: 10, y: 2 },
  { x: 15, y: 2 },
  { x: 15, y: 3 },
];

const LEVEL3_PATH_WAYPOINTS = [
  { x: 0, y: 4 },
  { x: 2, y: 4 },
  { x: 2, y: 7 },
  { x: 7, y: 7 },
  { x: 7, y: 2 },
  { x: 11, y: 2 },
  { x: 11, y: 6 },
  { x: 14, y: 6 },
  { x: 14, y: 3 },
  { x: 15, y: 3 },
];

const MAP_CATALOG = [
  {
    level: 1,
    name: "Level 1 - Neon Bastion",
    description: "Classic defense route with balanced pressure.",
  },
  {
    level: 2,
    name: "Level 2 - Moonfall",
    description: "Harder lunar map with sharper early pressure and tighter survivability.",
  },
  {
    level: 3,
    name: "Level 3 - Ember Rift",
    description: "Lava-forged battleground with volatile lighting and high-contrast shadows.",
  },
];

let mapPreviewSwapTimer = null;
let mapPreviewResetTimer = null;

function cellKey(cellX, cellY) {
  return `${cellX},${cellY}`;
}

function parseCellKey(key) {
  const [xText, yText] = key.split(",");
  return { x: Number(xText), y: Number(yText) };
}

function inBounds(cellX, cellY) {
  return cellX >= 0 && cellY >= 0 && cellX < COLS && cellY < ROWS;
}

function isLaneEndpoint(cellX, cellY) {
  return (cellX === LANE_START.x && cellY === LANE_START.y) || (cellX === LANE_END.x && cellY === LANE_END.y);
}

function buildLaneSetFromWaypoints(waypoints) {
  const laneSet = new Set();
  for (let i = 0; i < waypoints.length - 1; i += 1) {
    const a = waypoints[i];
    const b = waypoints[i + 1];
    if (a.x === b.x) {
      const [start, end] = a.y < b.y ? [a.y, b.y] : [b.y, a.y];
      for (let y = start; y <= end; y += 1) laneSet.add(cellKey(a.x, y));
    } else {
      const [start, end] = a.x < b.x ? [a.x, b.x] : [b.x, a.x];
      for (let x = start; x <= end; x += 1) laneSet.add(cellKey(x, a.y));
    }
  }
  laneSet.add(LANE_START_KEY);
  laneSet.add(LANE_END_KEY);
  return laneSet;
}

function getDefaultWaypointsForLevel(level) {
  if (level >= 3) return LEVEL3_PATH_WAYPOINTS;
  if (level === 2) return LEVEL2_PATH_WAYPOINTS;
  return DEFAULT_PATH_WAYPOINTS;
}

function buildPathRoute(cellSet) {
  if (!cellSet.has(LANE_START_KEY) || !cellSet.has(LANE_END_KEY)) return null;

  const queue = [{ x: LANE_START.x, y: LANE_START.y }];
  const visited = new Set([LANE_START_KEY]);
  const parent = new Map();
  const dirs = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];

  while (queue.length > 0) {
    const current = queue.shift();
    if (current.x === LANE_END.x && current.y === LANE_END.y) break;

    for (const [dx, dy] of dirs) {
      const nx = current.x + dx;
      const ny = current.y + dy;
      if (!inBounds(nx, ny)) continue;
      const key = cellKey(nx, ny);
      if (!cellSet.has(key) || visited.has(key)) continue;
      visited.add(key);
      parent.set(key, cellKey(current.x, current.y));
      queue.push({ x: nx, y: ny });
    }
  }

  if (!visited.has(LANE_END_KEY)) return null;

  const route = [];
  let cursor = LANE_END_KEY;
  while (cursor) {
    route.push(parseCellKey(cursor));
    cursor = parent.get(cursor);
  }
  route.reverse();
  return route;
}

let pathCellSet = buildLaneSetFromWaypoints(DEFAULT_PATH_WAYPOINTS);
let pathCells = [];
let pathPoints = [];
let pathSegments = [];
let totalPathLength = 0;

function simplifyRouteCells(route) {
  if (route.length <= 2) return route.slice();

  const simplified = [route[0]];
  let prevDx = route[1].x - route[0].x;
  let prevDy = route[1].y - route[0].y;

  for (let i = 1; i < route.length - 1; i += 1) {
    const dx = route[i + 1].x - route[i].x;
    const dy = route[i + 1].y - route[i].y;
    if (dx !== prevDx || dy !== prevDy) {
      simplified.push(route[i]);
    }
    prevDx = dx;
    prevDy = dy;
  }

  simplified.push(route[route.length - 1]);
  return simplified;
}

function rebuildPathDataFromRoute(route) {
  pathCells = simplifyRouteCells(route);
  pathPoints = pathCells.map((cell) => cellToWorld(cell.x, cell.y));
  pathSegments = [];
  totalPathLength = 0;

  for (let i = 0; i < pathPoints.length - 1; i += 1) {
    const a = pathPoints[i];
    const b = pathPoints[i + 1];
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const length = Math.hypot(dx, dz);
    if (length <= 1e-6) continue;
    pathSegments.push({
      a,
      b,
      dx,
      dz,
      dirX: dx / length,
      dirZ: dz / length,
      length,
      start: totalPathLength,
    });
    totalPathLength += length;
  }
}

function commitLaneCellSet(newLaneSet) {
  const route = buildPathRoute(newLaneSet);
  if (!route || route.length < 2) return false;
  pathCellSet = newLaneSet;
  rebuildPathDataFromRoute(route);
  return true;
}

function resetLaneToLevelDefaults(level) {
  const laneSet = buildLaneSetFromWaypoints(getDefaultWaypointsForLevel(level));
  const route = buildPathRoute(laneSet);
  if (!route || route.length < 2) return false;
  pathCellSet = laneSet;
  rebuildPathDataFromRoute(route);
  return true;
}

const initialRoute = buildPathRoute(pathCellSet);
if (!initialRoute) throw new Error("Initial lane route is invalid");
rebuildPathDataFromRoute(initialRoute);

function pointOnPath(distance, out = new THREE.Vector3()) {
  if (pathSegments.length === 0 || totalPathLength <= 0) {
    if (pathPoints.length > 0) {
      out.set(pathPoints[0].x, 0, pathPoints[0].z);
      return out;
    }
    out.set(0, 0, 0);
    return out;
  }

  const wrapped = ((distance % totalPathLength) + totalPathLength) % totalPathLength;
  for (const segment of pathSegments) {
    if (wrapped <= segment.start + segment.length) {
      const t = (wrapped - segment.start) / segment.length;
      out.set(segment.a.x + segment.dx * t, 0, segment.a.z + segment.dz * t);
      return out;
    }
  }
  const last = pathPoints[pathPoints.length - 1];
  out.set(last.x, 0, last.z);
  return out;
}

function shortestAngleDelta(from, to) {
  const twoPi = Math.PI * 2;
  let delta = (to - from + Math.PI) % twoPi;
  if (delta < 0) delta += twoPi;
  return delta - Math.PI;
}

function rotateYawTowards(current, target, maxStep) {
  const delta = shortestAngleDelta(current, target);
  if (Math.abs(delta) <= maxStep) return target;
  return current + Math.sign(delta) * maxStep;
}

const scene = new THREE.Scene();
scene.background = new THREE.Color("#081524");
scene.fog = new THREE.FogExp2(0x081524, 0.012);

const camera = new THREE.PerspectiveCamera(52, 16 / 9, 0.1, 280);
const BATTLE_CAMERA_TARGET = new THREE.Vector3(0, 0, 0);
const BATTLE_CAMERA_VIEW_DIR = new THREE.Vector3(0, 42, 35).normalize();
const BATTLE_CAMERA_FRAME_NDC_LIMIT = 0.96;
const BOARD_FRAME_HALF_WIDTH = (COLS * CELL_SIZE) / 2 + 1.2;
const BOARD_FRAME_HALF_HEIGHT = (ROWS * CELL_SIZE) / 2 + 1.2;
const BOARD_FRAME_TOP_Y = 2.8;
const CAMERA_FRAME_SAMPLE_POINTS = [
  new THREE.Vector3(-BOARD_FRAME_HALF_WIDTH, 0, -BOARD_FRAME_HALF_HEIGHT),
  new THREE.Vector3(BOARD_FRAME_HALF_WIDTH, 0, -BOARD_FRAME_HALF_HEIGHT),
  new THREE.Vector3(-BOARD_FRAME_HALF_WIDTH, 0, BOARD_FRAME_HALF_HEIGHT),
  new THREE.Vector3(BOARD_FRAME_HALF_WIDTH, 0, BOARD_FRAME_HALF_HEIGHT),
  new THREE.Vector3(-BOARD_FRAME_HALF_WIDTH, BOARD_FRAME_TOP_Y, -BOARD_FRAME_HALF_HEIGHT),
  new THREE.Vector3(BOARD_FRAME_HALF_WIDTH, BOARD_FRAME_TOP_Y, -BOARD_FRAME_HALF_HEIGHT),
  new THREE.Vector3(-BOARD_FRAME_HALF_WIDTH, BOARD_FRAME_TOP_Y, BOARD_FRAME_HALF_HEIGHT),
  new THREE.Vector3(BOARD_FRAME_HALF_WIDTH, BOARD_FRAME_TOP_Y, BOARD_FRAME_HALF_HEIGHT),
];
const cameraFrameProbe = new THREE.Vector3();

function setBattleCameraDistance(distance) {
  camera.position.copy(BATTLE_CAMERA_TARGET).addScaledVector(BATTLE_CAMERA_VIEW_DIR, distance);
  camera.lookAt(BATTLE_CAMERA_TARGET);
  camera.updateMatrixWorld();
}

function measureBattleCameraCoverage(distance) {
  setBattleCameraDistance(distance);
  let maxAbsNdc = 0;
  for (const point of CAMERA_FRAME_SAMPLE_POINTS) {
    cameraFrameProbe.copy(point).project(camera);
    maxAbsNdc = Math.max(maxAbsNdc, Math.abs(cameraFrameProbe.x), Math.abs(cameraFrameProbe.y));
  }
  return maxAbsNdc;
}

function fitBattleCameraToViewport() {
  const limit = BATTLE_CAMERA_FRAME_NDC_LIMIT;
  let nearDistance = 10;
  let farDistance = 120;

  while (measureBattleCameraCoverage(farDistance) > limit && farDistance < 420) {
    farDistance *= 1.3;
  }

  for (let i = 0; i < 24; i += 1) {
    const midDistance = (nearDistance + farDistance) * 0.5;
    const coverage = measureBattleCameraCoverage(midDistance);
    if (coverage > limit) nearDistance = midDistance;
    else farDistance = midDistance;
  }

  setBattleCameraDistance(farDistance);
}

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
if ("outputColorSpace" in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
else if ("outputEncoding" in renderer) renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.5));

const hemiLight = new THREE.HemisphereLight(0x8ec8ff, 0x1a100a, 0.58);
scene.add(hemiLight);

const sunLight = new THREE.DirectionalLight(0xffefd4, 1.08);
sunLight.position.set(18, 32, 12);
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(1024, 1024);
sunLight.shadow.camera.left = -42;
sunLight.shadow.camera.right = 42;
sunLight.shadow.camera.top = 38;
sunLight.shadow.camera.bottom = -38;
scene.add(sunLight);

const tealRim = new THREE.PointLight(0x63f5d4, 0.9, 140, 2);
tealRim.position.set(-22, 11, -18);
scene.add(tealRim);

const emberRim = new THREE.PointLight(0xffa65a, 0.74, 120, 2);
emberRim.position.set(25, 9, 18);
scene.add(emberRim);

const prismKeyLight = new THREE.PointLight(0xbbefff, 0.82, 150, 2);
prismKeyLight.position.set(0, 16, -6);
scene.add(prismKeyLight);

const prismFillLight = new THREE.PointLight(0xffd7b4, 0.66, 140, 2);
prismFillLight.position.set(-14, 12, 14);
scene.add(prismFillLight);

function applyLevelLightingTheme(level) {
  const moonLevel = level === 2;
  const emberLevel = level >= 3;

  if (emberLevel) {
    scene.background.set("#090e1c");
    scene.fog.color.set("#0b1020");
    scene.fog.density = 0.012;
    renderer.toneMappingExposure = 1.0;

    hemiLight.color.set("#9cb4de");
    hemiLight.groundColor.set("#10090e");
    hemiLight.intensity = 0.54;

    sunLight.color.set("#ffd8be");
    sunLight.intensity = 0.9;
    sunLight.position.set(22, 30, -12);

    tealRim.color.set("#5fb9ff");
    tealRim.intensity = 0.7;
    tealRim.position.set(-24, 11, -18);

    emberRim.color.set("#ff6e5c");
    emberRim.intensity = 0.44;
    emberRim.position.set(21, 9, 17);

    prismKeyLight.color.set("#8faeff");
    prismKeyLight.intensity = 0.56;
    prismKeyLight.position.set(1, 15, -10);

    prismFillLight.color.set("#b58dff");
    prismFillLight.intensity = 0.46;
    prismFillLight.position.set(-13, 10, 16);
  } else if (moonLevel) {
    scene.background.set("#060913");
    scene.fog.color.set("#060913");
    scene.fog.density = 0.01;
    renderer.toneMappingExposure = 0.96;

    hemiLight.color.set("#90aedf");
    hemiLight.groundColor.set("#090d17");
    hemiLight.intensity = 0.5;

    sunLight.color.set("#d9e7ff");
    sunLight.intensity = 0.84;
    sunLight.position.set(-22, 31, -14);

    tealRim.color.set("#9dc2ff");
    tealRim.intensity = 0.62;
    tealRim.position.set(-24, 10, -14);

    emberRim.color.set("#8098c6");
    emberRim.intensity = 0.32;
    emberRim.position.set(24, 8, 16);

    prismKeyLight.color.set("#cfe1ff");
    prismKeyLight.intensity = 0.58;
    prismKeyLight.position.set(0, 16, -10);

    prismFillLight.color.set("#91a5cc");
    prismFillLight.intensity = 0.46;
    prismFillLight.position.set(-16, 11, 16);
  } else {
    scene.background.set("#081524");
    scene.fog.color.set("#081524");
    scene.fog.density = 0.012;
    renderer.toneMappingExposure = 1.08;

    hemiLight.color.set("#8ec8ff");
    hemiLight.groundColor.set("#1a100a");
    hemiLight.intensity = 0.58;

    sunLight.color.set("#ffefd4");
    sunLight.intensity = 1.08;
    sunLight.position.set(18, 32, 12);

    tealRim.color.set("#63f5d4");
    tealRim.intensity = 0.9;
    tealRim.position.set(-22, 11, -18);

    emberRim.color.set("#ffa65a");
    emberRim.intensity = 0.74;
    emberRim.position.set(25, 9, 18);

    prismKeyLight.color.set("#bbefff");
    prismKeyLight.intensity = 0.82;
    prismKeyLight.position.set(0, 16, -6);

    prismFillLight.color.set("#ffd7b4");
    prismFillLight.intensity = 0.66;
    prismFillLight.position.set(-14, 12, 14);
  }
}

const worldGroup = new THREE.Group();
scene.add(worldGroup);

const mapState = {
  pulseOrbs: [],
  starField: null,
  mapLights: [],
  cellTopY: Array.from({ length: ROWS }, () => Array(COLS).fill(0)),
};

function getCellTopY(cellX, cellY) {
  if (cellX < 0 || cellY < 0 || cellX >= COLS || cellY >= ROWS) return 0;
  return mapState.cellTopY[cellY][cellX];
}

function getLaneSurfaceY(worldX, worldZ) {
  const { cellX, cellY } = worldToCell(worldX, worldZ);
  return getCellTopY(cellX, cellY);
}

function rebuildWorld() {
  const geometries = new Set();
  const materials = new Set();

  worldGroup.traverse((node) => {
    if (node.geometry) geometries.add(node.geometry);
    if (node.material) {
      if (Array.isArray(node.material)) {
        for (const mat of node.material) materials.add(mat);
      } else {
        materials.add(node.material);
      }
    }
  });

  while (worldGroup.children.length > 0) {
    worldGroup.remove(worldGroup.children[0]);
  }

  for (const geometry of geometries) geometry.dispose();
  for (const material of materials) material.dispose();

  mapState.pulseOrbs = [];
  mapState.starField = null;
  mapState.mapLights = [];
  mapState.cellTopY = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  applyLevelLightingTheme(game.currentLevel);
  buildMap();

  for (const tower of game.towers) {
    tower.y = getCellTopY(tower.cellX, tower.cellY);
    tower.mesh.position.y = tower.y + 0.02;
  }
}

function buildMap() {
  const boardWidth = COLS * CELL_SIZE;
  const boardHeight = ROWS * CELL_SIZE;
  const moonLevel = game.currentLevel === 2;
  const emberLevel = game.currentLevel >= 3;
  applyLevelLightingTheme(game.currentLevel);

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(boardWidth + 14, 1.9, boardHeight + 14),
    new THREE.MeshPhysicalMaterial({
      color: emberLevel ? "#151824" : moonLevel ? "#121620" : "#0a1624",
      roughness: 0.82,
      metalness: 0.18,
      clearcoat: 0.3,
      clearcoatRoughness: 0.48,
      emissive: emberLevel ? "#0d101b" : moonLevel ? "#0b0f18" : "#050e19",
      emissiveIntensity: emberLevel ? 0.56 : moonLevel ? 0.58 : 0.66,
      envMapIntensity: 1.05,
    })
  );
  base.position.y = -1.26;
  base.receiveShadow = true;
  worldGroup.add(base);

  const deck = new THREE.Mesh(
    new THREE.BoxGeometry(boardWidth + 5.2, 0.18, boardHeight + 5.2),
    new THREE.MeshStandardMaterial({
      color: emberLevel ? "#1f2436" : moonLevel ? "#1a202d" : "#102538",
      roughness: 0.72,
      metalness: 0.26,
      emissive: emberLevel ? "#141a2a" : moonLevel ? "#101722" : "#08192a",
      emissiveIntensity: emberLevel ? 0.28 : moonLevel ? 0.26 : 0.34,
    })
  );
  deck.position.y = -0.06;
  deck.receiveShadow = true;
  worldGroup.add(deck);

  const boardRadius = Math.max(boardWidth, boardHeight) * 0.78;
  const vignette = new THREE.Mesh(
    new THREE.RingGeometry(boardRadius * 0.58, boardRadius * 0.96, 72),
    new THREE.MeshBasicMaterial({
      color: emberLevel ? "#080812" : moonLevel ? "#04070e" : "#01060c",
      transparent: true,
      opacity: emberLevel ? 0.5 : moonLevel ? 0.56 : 0.48,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  vignette.rotation.x = -Math.PI / 2;
  vignette.position.y = 0.02;
  worldGroup.add(vignette);

  const shadowWash = new THREE.Mesh(
    new THREE.PlaneGeometry(boardWidth + 4.8, boardHeight + 4.8),
    new THREE.MeshBasicMaterial({
      color: emberLevel ? "#0a0b15" : moonLevel ? "#02050a" : "#01050a",
      transparent: true,
      opacity: emberLevel ? 0.26 : moonLevel ? 0.26 : 0.2,
      depthWrite: false,
    })
  );
  shadowWash.rotation.x = -Math.PI / 2;
  shadowWash.position.y = 0.03;
  worldGroup.add(shadowWash);

  const mapLightA = new THREE.PointLight(
    emberLevel ? 0x6aaeff : moonLevel ? 0x8ab5ff : 0x58c6ff,
    emberLevel ? 0.42 : moonLevel ? 0.38 : 0.46,
    boardWidth * 1.4,
    2
  );
  mapLightA.position.set(-boardWidth * 0.34, 6.2, -boardHeight * 0.26);
  worldGroup.add(mapLightA);

  const mapLightB = new THREE.PointLight(
    emberLevel ? 0xff8164 : moonLevel ? 0x8aa0d8 : 0xff9f57,
    emberLevel ? 0.32 : moonLevel ? 0.3 : 0.38,
    boardWidth * 1.4,
    2
  );
  mapLightB.position.set(boardWidth * 0.36, 6.8, boardHeight * 0.3);
  worldGroup.add(mapLightB);

  const mapLightC = new THREE.PointLight(
    emberLevel ? 0xb493ff : moonLevel ? 0xd4e0ff : 0x63f2d3,
    emberLevel ? 0.26 : moonLevel ? 0.22 : 0.28,
    boardWidth * 1.2,
    2
  );
  mapLightC.position.set(0, 7.5, 0);
  worldGroup.add(mapLightC);
  mapState.mapLights.push(mapLightA, mapLightB, mapLightC);

  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      const world = cellToWorld(x, y);
      const key = `${x},${y}`;
      const onPath = pathCellSet.has(key);
      const n = noise2d(x, y, 7);
      const craterNoise = noise2d(x * 2 + 11, y * 2 + 7, 61);
      const craterFactor = moonLevel && !onPath ? Math.max(0, (craterNoise - 0.76) / 0.24) : 0;
      const heightBase = onPath ? 0.72 : 0.62 + n * 1.3;
      const height = Math.max(0.38, heightBase - craterFactor * 0.24);
      const topY = height - 0.12;
      mapState.cellTopY[y][x] = topY;
      const edgeBlend = Math.max(
        Math.abs((x - HALF_COLS) / Math.max(HALF_COLS, 1)),
        Math.abs((y - HALF_ROWS) / Math.max(HALF_ROWS, 1))
      );

      const tileColor = new THREE.Color();
      if (emberLevel) {
        if (onPath) tileColor.setHSL(0.03 + n * 0.018, 0.66, 0.22 + n * 0.04 - edgeBlend * 0.05);
        else tileColor.setHSL(0.64 + n * 0.024, 0.26, 0.13 + n * 0.06 - edgeBlend * 0.08);
      } else if (moonLevel) {
        if (onPath) tileColor.setHSL(0.6 + n * 0.01, 0.24, 0.26 + n * 0.05 - edgeBlend * 0.05);
        else tileColor.setHSL(0.62 + n * 0.01, 0.12, 0.2 + n * 0.08 - edgeBlend * 0.07 - craterFactor * 0.08);
      } else {
        if (onPath) tileColor.setHSL(0.08 + n * 0.03, 0.72, 0.22 + n * 0.05 - edgeBlend * 0.06);
        else tileColor.setHSL(0.57 + n * 0.03, 0.52, 0.14 + n * 0.07 - edgeBlend * 0.08);
      }

      const tileMaterial = new THREE.MeshPhysicalMaterial({
        color: tileColor,
        roughness: onPath
          ? emberLevel
            ? 0.28
            : moonLevel
              ? 0.36
              : 0.3
          : emberLevel
            ? 0.74 - n * 0.08
            : moonLevel
              ? 0.86 - n * 0.08
              : 0.79 - n * 0.1,
        metalness: onPath ? (emberLevel ? 0.3 : moonLevel ? 0.18 : 0.34) : emberLevel ? 0.1 : moonLevel ? 0.05 : 0.14,
        clearcoat: onPath ? (emberLevel ? 0.68 : moonLevel ? 0.48 : 0.76) : emberLevel ? 0.14 : moonLevel ? 0.08 : 0.16,
        clearcoatRoughness: onPath ? (emberLevel ? 0.16 : moonLevel ? 0.3 : 0.14) : emberLevel ? 0.52 : moonLevel ? 0.62 : 0.56,
        emissive: onPath ? (emberLevel ? "#7c2a24" : moonLevel ? "#2f486c" : "#7b3212") : emberLevel ? "#1a1d3e" : moonLevel ? "#111926" : "#0a2d4f",
        emissiveIntensity: onPath
          ? emberLevel
            ? 0.88
            : moonLevel
              ? 0.72
              : 1.06
          : emberLevel
            ? 0.2 + (1 - edgeBlend) * 0.1
            : moonLevel
              ? 0.16 + (1 - edgeBlend) * 0.08
              : 0.34 + (1 - edgeBlend) * 0.12,
        envMapIntensity: 1.16,
      });

      const tile = new THREE.Mesh(
        new THREE.BoxGeometry(CELL_SIZE * 0.95, height, CELL_SIZE * 0.95),
        tileMaterial
      );
      tile.position.set(world.x, height / 2 - 0.12, world.z);
      tile.receiveShadow = true;
      tile.castShadow = !onPath;
      worldGroup.add(tile);

      const glaze = new THREE.Mesh(
        new THREE.PlaneGeometry(CELL_SIZE * 0.84, CELL_SIZE * 0.84),
        new THREE.MeshBasicMaterial({
          color: onPath ? (emberLevel ? "#ffb09a" : moonLevel ? "#b7cdff" : "#ffae60") : emberLevel ? "#8ea6ff" : moonLevel ? "#8ea6d6" : "#5cbfff",
          transparent: true,
          opacity: onPath ? (emberLevel ? 0.22 : moonLevel ? 0.22 : 0.24) : emberLevel ? 0.12 : moonLevel ? 0.1 : 0.12,
          depthWrite: false,
        })
      );
      glaze.rotation.x = -Math.PI / 2;
      glaze.position.set(world.x, topY + 0.016, world.z);
      worldGroup.add(glaze);

      if (onPath) {
        const inlay = new THREE.Mesh(
          new THREE.CylinderGeometry(CELL_SIZE * 0.2, CELL_SIZE * 0.2, 0.06, 14),
          new THREE.MeshPhysicalMaterial({
            color: emberLevel ? "#ffd4c8" : moonLevel ? "#d7e4ff" : "#ffd5a0",
            emissive: emberLevel ? "#cf5f6f" : moonLevel ? "#8ea6d8" : "#ff9750",
            emissiveIntensity: emberLevel ? 1.02 : moonLevel ? 0.92 : 1.18,
            metalness: emberLevel ? 0.46 : moonLevel ? 0.36 : 0.5,
            roughness: emberLevel ? 0.2 : moonLevel ? 0.24 : 0.18,
            transmission: emberLevel ? 0.18 : moonLevel ? 0.14 : 0.22,
            clearcoat: emberLevel ? 0.9 : moonLevel ? 0.78 : 0.9,
            clearcoatRoughness: emberLevel ? 0.1 : moonLevel ? 0.2 : 0.12,
          })
        );
        inlay.position.set(world.x, 0.28, world.z);
        worldGroup.add(inlay);
      } else {
        const panelSeed = noise2d(x, y, 33);
        if (panelSeed > 0.72) {
          const panel = new THREE.Mesh(
            new THREE.BoxGeometry(CELL_SIZE * 0.42, 0.12, CELL_SIZE * 0.22),
            new THREE.MeshStandardMaterial({
              color: emberLevel ? "#3d3048" : moonLevel ? "#3a4457" : "#294a63",
              emissive: emberLevel ? "#1d1428" : moonLevel ? "#1a2230" : "#0f2638",
              emissiveIntensity: emberLevel ? 0.3 : moonLevel ? 0.22 : 0.4,
              metalness: emberLevel ? 0.45 : moonLevel ? 0.34 : 0.52,
              roughness: emberLevel ? 0.56 : moonLevel ? 0.62 : 0.42,
            })
          );
          panel.position.set(
            world.x + (noise2d(x, y, 19) - 0.5) * CELL_SIZE * 0.25,
            height + 0.04,
            world.z + (noise2d(x, y, 21) - 0.5) * CELL_SIZE * 0.25
          );
          panel.rotation.y = noise2d(x, y, 39) * Math.PI;
          worldGroup.add(panel);
        }
      }
    }
  }

  buildPathRails();
  buildPathPulseOrbs();
  buildSkyBits(boardWidth, boardHeight);
  buildPerimeterBeacons(boardWidth, boardHeight);
}

function buildPathRails() {
  const moonLevel = game.currentLevel === 2;
  const emberLevel = game.currentLevel >= 3;
  const railMaterial = new THREE.MeshPhysicalMaterial({
    color: emberLevel ? "#d7c4ff" : moonLevel ? "#c8d8ff" : "#ffb873",
    emissive: emberLevel ? "#6b4ca8" : moonLevel ? "#5e78a8" : "#8c3714",
    emissiveIntensity: emberLevel ? 0.82 : moonLevel ? 0.9 : 1.12,
    metalness: emberLevel ? 0.5 : moonLevel ? 0.42 : 0.56,
    roughness: emberLevel ? 0.24 : moonLevel ? 0.28 : 0.2,
    clearcoat: emberLevel ? 0.86 : moonLevel ? 0.8 : 0.88,
    clearcoatRoughness: emberLevel ? 0.14 : moonLevel ? 0.2 : 0.12,
    transmission: emberLevel ? 0.1 : moonLevel ? 0.08 : 0.15,
  });

  const laneMaterial = new THREE.MeshPhysicalMaterial({
    color: emberLevel ? "#3d3258" : moonLevel ? "#3c4f73" : "#874822",
    emissive: emberLevel ? "#201838" : moonLevel ? "#1f2d47" : "#5f260f",
    emissiveIntensity: emberLevel ? 0.72 : moonLevel ? 0.74 : 0.94,
    metalness: emberLevel ? 0.36 : moonLevel ? 0.24 : 0.32,
    roughness: emberLevel ? 0.3 : moonLevel ? 0.44 : 0.33,
    clearcoat: emberLevel ? 0.7 : moonLevel ? 0.54 : 0.66,
    clearcoatRoughness: emberLevel ? 0.16 : moonLevel ? 0.25 : 0.18,
  });

  for (const segment of pathSegments) {
    const midX = (segment.a.x + segment.b.x) / 2;
    const midZ = (segment.a.z + segment.b.z) / 2;
    const yaw = Math.atan2(segment.dirZ, segment.dirX);
    const normalX = -segment.dirZ;
    const normalZ = segment.dirX;

    const lane = new THREE.Mesh(
      new THREE.BoxGeometry(segment.length + 0.18, 0.12, 1.58),
      laneMaterial
    );
    lane.position.set(midX, 0.34, midZ);
    lane.rotation.y = -yaw;
    lane.receiveShadow = true;
    worldGroup.add(lane);

    const laneGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(segment.length + 0.1, 0.46),
      new THREE.MeshBasicMaterial({
        color: emberLevel ? "#a8bbff" : moonLevel ? "#b9d0ff" : "#ffb870",
        transparent: true,
        opacity: emberLevel ? 0.26 : moonLevel ? 0.24 : 0.3,
        depthWrite: false,
      })
    );
    laneGlow.rotation.x = -Math.PI / 2;
    laneGlow.rotation.y = -yaw;
    laneGlow.position.set(midX, 0.415, midZ);
    worldGroup.add(laneGlow);

    for (const side of [-1, 1]) {
      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(segment.length + 0.18, 0.22, 0.28),
        railMaterial
      );
      rail.position.set(midX + normalX * side * 0.77, 0.55, midZ + normalZ * side * 0.77);
      rail.rotation.y = -yaw;
      rail.castShadow = true;
      worldGroup.add(rail);
    }
  }
}

function buildPathPulseOrbs() {
  const moonLevel = game.currentLevel === 2;
  const emberLevel = game.currentLevel >= 3;
  const orbMaterial = new THREE.MeshStandardMaterial({
    color: emberLevel ? "#d6dcff" : moonLevel ? "#d6e3ff" : "#ffe7ba",
    emissive: emberLevel ? "#8b6bff" : moonLevel ? "#92aee8" : "#ffb169",
    emissiveIntensity: emberLevel ? 1.06 : moonLevel ? 0.95 : 1.1,
    metalness: emberLevel ? 0.36 : moonLevel ? 0.24 : 0.32,
    roughness: emberLevel ? 0.24 : moonLevel ? 0.34 : 0.28,
  });

  const count = 9;
  for (let i = 0; i < count; i += 1) {
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 12), orbMaterial.clone());
    orb.castShadow = false;
    orb.receiveShadow = false;
    worldGroup.add(orb);
    mapState.pulseOrbs.push({ mesh: orb, offset: (totalPathLength / count) * i });
  }
}

function buildSkyBits(boardWidth, boardHeight) {
  const moonLevel = game.currentLevel === 2;
  const emberLevel = game.currentLevel >= 3;
  const count = emberLevel ? 340 : moonLevel ? 560 : 420;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * (boardWidth + 18);
    positions[i * 3 + 1] = 9 + Math.random() * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * (boardHeight + 18);
  }

  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const starMaterial = new THREE.PointsMaterial({
    color: emberLevel ? "#c6d7ff" : moonLevel ? "#d6e7ff" : "#a8dcff",
    size: emberLevel ? 0.28 : moonLevel ? 0.24 : 0.22,
    transparent: true,
    opacity: emberLevel ? 0.34 : moonLevel ? 0.42 : 0.34,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  mapState.starField = new THREE.Points(starGeometry, starMaterial);
  worldGroup.add(mapState.starField);
}

function buildPerimeterBeacons(boardWidth, boardHeight) {
  const moonLevel = game.currentLevel === 2;
  const emberLevel = game.currentLevel >= 3;
  const positions = [
    [-boardWidth / 2 - 3.4, -boardHeight / 2 - 3.2],
    [boardWidth / 2 + 3.4, -boardHeight / 2 - 3.2],
    [-boardWidth / 2 - 3.4, boardHeight / 2 + 3.2],
    [boardWidth / 2 + 3.4, boardHeight / 2 + 3.2],
  ];

  for (const [x, z] of positions) {
    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.45, 2.2, 12),
      new THREE.MeshStandardMaterial({
        color: emberLevel ? "#4a3850" : moonLevel ? "#465270" : "#355670",
        roughness: 0.52,
        metalness: emberLevel ? 0.52 : moonLevel ? 0.48 : 0.6,
      })
    );
    post.position.set(x, 0.95, z);
    post.castShadow = true;
    worldGroup.add(post);

    const lamp = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 12, 12),
      new THREE.MeshStandardMaterial({
        color: emberLevel ? "#dccbff" : moonLevel ? "#d2e4ff" : "#a2ffe9",
        emissive: emberLevel ? "#9072ff" : moonLevel ? "#8eaee8" : "#63f5d4",
        emissiveIntensity: emberLevel ? 1.08 : moonLevel ? 1.05 : 1.2,
        roughness: emberLevel ? 0.24 : moonLevel ? 0.36 : 0.3,
        metalness: emberLevel ? 0.46 : moonLevel ? 0.38 : 0.5,
      })
    );
    lamp.position.set(x, 2.15, z);
    worldGroup.add(lamp);
  }
}

const previewBaseMat = new THREE.MeshStandardMaterial({
  color: "#63f5d4",
  emissive: "#1f655a",
  emissiveIntensity: 0.7,
  transparent: true,
  opacity: 0.72,
  roughness: 0.36,
  metalness: 0.52,
});

const previewRingMat = new THREE.MeshBasicMaterial({
  color: "#63f5d4",
  transparent: true,
  opacity: 0.34,
  side: THREE.DoubleSide,
});

const previewGroup = new THREE.Group();
const previewBase = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.05, 1.2, 18), previewBaseMat);
previewBase.position.y = 0.66;
const previewRing = new THREE.Mesh(new THREE.RingGeometry(0.97, 1, 64), previewRingMat);
previewRing.rotation.x = -Math.PI / 2;
previewRing.position.y = 0.06;
previewGroup.add(previewBase);
previewGroup.add(previewRing);
previewGroup.visible = false;
scene.add(previewGroup);

function setPreviewColor(valid, sellingMode = false) {
  if (sellingMode) {
    if (valid) {
      previewBaseMat.color.set("#ffbf6a");
      previewBaseMat.emissive.set("#6c3a12");
      previewRingMat.color.set("#ffb15a");
      previewRingMat.opacity = 0.36;
    } else {
      previewBaseMat.color.set("#ff7d7d");
      previewBaseMat.emissive.set("#632121");
      previewRingMat.color.set("#ff6f6f");
      previewRingMat.opacity = 0.24;
    }
    return;
  }

  if (valid) {
    previewBaseMat.color.set("#63f5d4");
    previewBaseMat.emissive.set("#1f655a");
    previewRingMat.color.set("#63f5d4");
    previewRingMat.opacity = 0.34;
  } else {
    previewBaseMat.color.set("#ff7d7d");
    previewBaseMat.emissive.set("#632121");
    previewRingMat.color.set("#ff6f6f");
    previewRingMat.opacity = 0.24;
  }
}

function setLanePreviewColor(valid, removing) {
  if (!valid) {
    previewBaseMat.color.set("#ff7d7d");
    previewBaseMat.emissive.set("#632121");
    previewRingMat.color.set("#ff6f6f");
    previewRingMat.opacity = 0.24;
    return;
  }

  if (removing) {
    previewBaseMat.color.set("#ffbf6a");
    previewBaseMat.emissive.set("#6c3a12");
    previewRingMat.color.set("#ffb15a");
    previewRingMat.opacity = 0.35;
  } else {
    previewBaseMat.color.set("#78ddff");
    previewBaseMat.emissive.set("#154864");
    previewRingMat.color.set("#78ddff");
    previewRingMat.opacity = 0.35;
  }
}

const raycaster = new THREE.Raycaster();
const pointerNdc = new THREE.Vector2();
const boardPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const hitPoint = new THREE.Vector3();
const PROJECTILE_FORWARD = new THREE.Vector3(0, 0, 1);

const game = {
  started: false,
  menuOpen: true,
  menuView: "home",
  menuSelectedLevel: 1,
  accountId: null,
  accountName: "Commander",
  maxLevelUnlocked: 1,
  currentLevel: 1,
  exitConfirmOpen: false,
  levelClearOpen: false,
  defeatOpen: false,
  levelClearTimer: null,
  levelClearTitle: "Level Cleared",
  levelClearText: "Victory confirmed. New map access awarded.",
  settingsOpen: false,
  money: 220,
  shards: 0,
  lives: 20,
  wave: 0,
  inWave: false,
  waveCreditsEarned: 0,
  spawnLeft: 0,
  spawnTimer: 0,
  spawnQueue: [],
  selectedTowerType: "pulse",
  unlockedTowers: new Set(BASE_UNLOCKED_TOWERS),
  towerCapUpgrades: {},
  towerDamageUpgrades: {},
  towerAttackSpeedUpgrades: {},
  towerRangeUpgrades: {},
  spawnerCooldownUpgrades: {},
  loadoutUpgradeTargetId: null,
  maxLoadoutSlots: BASE_LOADOUT_SLOTS,
  activeLoadout: new Set(Array.from(BASE_UNLOCKED_TOWERS).slice(0, BASE_LOADOUT_SLOTS)),
  unlockedSpawnerTowers: new Set(),
  enemyKillCounts: {},
  placing: false,
  selling: false,
  editingLane: false,
  paused: false,
  speedStepIndex: GAME_SPEED_STEPS.indexOf(1),
  speedMultiplier: 1,
  autoWaveEnabled: false,
  autoWaveInterval: AUTO_WAVE_INTERVAL,
  autoWaveCountdown: AUTO_WAVE_INTERVAL,
  towers: [],
  enemies: [],
  allies: [],
  debris: [],
  projectiles: [],
  hoverCell: null,
  over: false,
  levelOneDefeated: false,
  bossEnemy: null,
  time: 0,
};

const multiplayer = {
  supported: typeof WebSocket === "function",
  role: "solo",
  roomCode: "",
  peerId: `peer_${Math.random().toString(36).slice(2, 10)}`,
  hostId: null,
  connected: false,
  peers: new Set(),
  roster: new Map(),
  socket: null,
  serverUrl: "",
  connecting: false,
  intentionalClose: false,
  snapshotTimer: 0,
  lastLaneSignature: "",
  lastStatusLine: "",
  lastShopSignature: "",
};

function sanitizeRoomCode(rawCode) {
  return String(rawCode || "")
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "")
    .slice(0, 16);
}

function normalizeMultiplayerServerUrl(rawUrl) {
  const text = String(rawUrl || "").trim();
  if (!text) return "";
  try {
    const parsed = new URL(text);
    if (parsed.protocol !== "ws:" && parsed.protocol !== "wss:") return "";
    parsed.hash = "";
    return parsed.href.replace(/\/+$/, "");
  } catch (_) {
    return "";
  }
}

function getDefaultMultiplayerServerUrl() {
  const host = window.location?.hostname || "";
  const isLocalHost = host === "localhost" || host === "127.0.0.1";
  if (!isLocalHost) return "";
  const secure = window.location?.protocol === "https:";
  return `${secure ? "wss" : "ws"}://${host}:8787`;
}

function loadPreferredMultiplayerServerUrl() {
  let stored = "";
  try {
    stored = window.localStorage.getItem(MULTIPLAYER_SERVER_STORAGE_KEY) || "";
  } catch (_) {}
  return normalizeMultiplayerServerUrl(stored) || getDefaultMultiplayerServerUrl();
}

function persistPreferredMultiplayerServerUrl(serverUrl) {
  try {
    if (serverUrl) window.localStorage.setItem(MULTIPLAYER_SERVER_STORAGE_KEY, serverUrl);
    else window.localStorage.removeItem(MULTIPLAYER_SERVER_STORAGE_KEY);
  } catch (_) {}
}

multiplayer.serverUrl = loadPreferredMultiplayerServerUrl();

function isMultiplayerHost() {
  return multiplayer.role === "host";
}

function isMultiplayerClient() {
  return multiplayer.role === "client";
}

function isMultiplayerActive() {
  return multiplayer.role !== "solo" && !!multiplayer.roomCode;
}

function getMultiplayerLabel() {
  if (!multiplayer.supported) return "Unavailable";
  if (multiplayer.connecting) return "Connecting";
  if (!isMultiplayerActive()) return "Solo";
  if (isMultiplayerHost()) return `Host ${multiplayer.roomCode}`;
  if (isMultiplayerClient()) return `Joined ${multiplayer.roomCode}`;
  return "Solo";
}

function appendMultiplayerLog(message) {
  if (!menuMultiplayerLogEl) return;
  const entry = `
    <div class="menu-account-item">
      <div><strong>${escapeHtml(message)}</strong></div>
    </div>
  `;
  menuMultiplayerLogEl.innerHTML = entry + menuMultiplayerLogEl.innerHTML;
  const cards = menuMultiplayerLogEl.querySelectorAll(".menu-account-item");
  for (let i = 12; i < cards.length; i += 1) cards[i].remove();
}

function sanitizeMultiplayerDisplayName(name) {
  return sanitizeAccountName(name) || "Commander";
}

function getLocalMultiplayerDisplayName() {
  return sanitizeMultiplayerDisplayName(game.accountName || "Commander");
}

function parseMultiplayerRole(role) {
  if (role === "host") return "host";
  if (role === "client") return "client";
  return "player";
}

function getMultiplayerRosterEntries() {
  const entries = [];
  multiplayer.roster.forEach((value, peerId) => {
    if (!peerId) return;
    const displayName = sanitizeMultiplayerDisplayName(value?.displayName || "Player");
    const role = parseMultiplayerRole(value?.role);
    entries.push({ peerId, displayName, role });
  });
  entries.sort((a, b) => {
    const aHost = a.peerId === multiplayer.hostId;
    const bHost = b.peerId === multiplayer.hostId;
    if (aHost !== bHost) return aHost ? -1 : 1;
    const aSelf = a.peerId === multiplayer.peerId;
    const bSelf = b.peerId === multiplayer.peerId;
    if (aSelf !== bSelf) return aSelf ? -1 : 1;
    return a.displayName.localeCompare(b.displayName);
  });
  return entries;
}

function getMultiplayerRosterPayload() {
  return getMultiplayerRosterEntries().map((entry) => ({
    peerId: entry.peerId,
    displayName: entry.displayName,
    role: entry.role,
  }));
}

function getMultiplayerDisplayNameForPeer(peerId, fallback = "Player") {
  if (!peerId) return sanitizeMultiplayerDisplayName(fallback);
  const player = multiplayer.roster.get(peerId);
  return sanitizeMultiplayerDisplayName(player?.displayName || fallback);
}

function upsertMultiplayerRosterPlayer(peerId, displayName, role = "player") {
  if (!peerId) return false;
  const normalizedName = sanitizeMultiplayerDisplayName(displayName || "Player");
  const normalizedRole = parseMultiplayerRole(role);
  const existing = multiplayer.roster.get(peerId);
  const changed =
    !existing || existing.displayName !== normalizedName || parseMultiplayerRole(existing.role) !== normalizedRole;
  multiplayer.roster.set(peerId, {
    displayName: normalizedName,
    role: normalizedRole,
  });
  return changed;
}

function removeMultiplayerRosterPlayer(peerId) {
  if (!peerId) return false;
  return multiplayer.roster.delete(peerId);
}

function setMultiplayerRosterFromPacket(players, hostPeerId = null) {
  const list = Array.isArray(players) ? players : [];
  const next = new Map();
  for (let i = 0; i < list.length; i += 1) {
    const player = list[i];
    if (!player || typeof player !== "object") continue;
    const peerId = typeof player.peerId === "string" ? player.peerId : "";
    if (!peerId) continue;
    const displayName = sanitizeMultiplayerDisplayName(player.displayName || "Player");
    const role = parseMultiplayerRole(player.role);
    next.set(peerId, { displayName, role });
  }

  if (next.size > 0) multiplayer.roster = next;
  if (typeof hostPeerId === "string" && hostPeerId) multiplayer.hostId = hostPeerId;
}

function getMultiplayerHudRosterText() {
  if (!isMultiplayerActive()) return "Players: Solo";
  const entries = getMultiplayerRosterEntries();
  if (entries.length === 0) return "Players: Connecting...";
  const labels = entries.map((entry) => {
    const tags = [];
    if (entry.peerId === multiplayer.peerId) tags.push("You");
    if (entry.peerId === multiplayer.hostId) tags.push("Host");
    if (tags.length === 0) return entry.displayName;
    return `${entry.displayName} (${tags.join(" / ")})`;
  });
  if (labels.length <= 3) return `Players: ${labels.join(", ")}`;
  return `Players: ${labels.slice(0, 2).join(", ")} +${labels.length - 2}`;
}

function renderMultiplayerRoster() {
  const entries = getMultiplayerRosterEntries();

  if (menuMultiplayerPlayerCountEl) {
    if (isMultiplayerActive()) menuMultiplayerPlayerCountEl.textContent = String(entries.length);
    else menuMultiplayerPlayerCountEl.textContent = "0";
  }

  if (menuMultiplayerPlayersEl) {
    if (!isMultiplayerActive()) {
      menuMultiplayerPlayersEl.innerHTML = `
        <div class="menu-account-item">
          <div><strong>Not in a room</strong><span>Create or join a room to see players.</span></div>
        </div>
      `;
    } else if (entries.length === 0) {
      menuMultiplayerPlayersEl.innerHTML = `
        <div class="menu-account-item">
          <div><strong>Connecting...</strong><span>Waiting for player list.</span></div>
        </div>
      `;
    } else {
      const fragments = [];
      for (const entry of entries) {
        const tags = [];
        if (entry.peerId === multiplayer.peerId) tags.push("You");
        if (entry.peerId === multiplayer.hostId) tags.push("Host");
        const tagText = tags.length > 0 ? tags.join(" / ") : entry.role === "client" ? "Guest" : "Player";
        fragments.push(`
          <div class="menu-account-item">
            <div>
              <strong>${escapeHtml(entry.displayName)}</strong>
              <span>${escapeHtml(tagText)}</span>
            </div>
          </div>
        `);
      }
      menuMultiplayerPlayersEl.innerHTML = fragments.join("");
    }
  }

  if (multiplayerPlayersHudEl) multiplayerPlayersHudEl.textContent = getMultiplayerHudRosterText();
}

function refreshMultiplayerPanel() {
  const supported = multiplayer.supported;
  const active = isMultiplayerActive();
  const connecting = multiplayer.connecting;
  const host = isMultiplayerHost();
  const client = isMultiplayerClient();
  if (active) {
    if (host && !multiplayer.hostId) multiplayer.hostId = multiplayer.peerId;
    if (!multiplayer.roster.has(multiplayer.peerId)) {
      upsertMultiplayerRosterPlayer(multiplayer.peerId, getLocalMultiplayerDisplayName(), host ? "host" : "client");
    }
  }
  const rawServerUrl = multiplayerServerInputEl?.value || multiplayer.serverUrl || "";
  const hasServerUrl = !!normalizeMultiplayerServerUrl(rawServerUrl);
  if (menuMultiplayerStateEl) menuMultiplayerStateEl.textContent = getMultiplayerLabel();
  if (multiplayerServerInputEl) {
    if (!multiplayerServerInputEl.value && multiplayer.serverUrl) multiplayerServerInputEl.value = multiplayer.serverUrl;
    multiplayerServerInputEl.disabled = !supported || active || connecting;
  }
  if (multiplayerRoomInputEl) {
    if (!multiplayerRoomInputEl.value && multiplayer.roomCode) multiplayerRoomInputEl.value = multiplayer.roomCode;
    multiplayerRoomInputEl.disabled = !supported || active || connecting;
  }
  if (hostMultiplayerBtn) {
    hostMultiplayerBtn.textContent = host ? "Hosting" : "Create Room";
    hostMultiplayerBtn.disabled = !supported || active || connecting || !hasServerUrl;
  }
  if (joinMultiplayerBtn) {
    joinMultiplayerBtn.textContent = client ? "Joined" : "Join Room";
    joinMultiplayerBtn.disabled = !supported || active || connecting || !hasServerUrl;
  }
  if (leaveMultiplayerBtn) {
    leaveMultiplayerBtn.textContent = connecting ? "Cancel" : "Leave Room";
    leaveMultiplayerBtn.disabled = !supported || (!active && !connecting);
  }
  if (menuMultiplayerHintEl) {
    if (!supported) {
      menuMultiplayerHintEl.textContent = "Multiplayer is unavailable in this browser.";
    } else if (connecting) {
      menuMultiplayerHintEl.textContent = "Connecting to multiplayer server...";
    } else if (!hasServerUrl) {
      menuMultiplayerHintEl.textContent = "Enter a multiplayer server URL first (ws:// or wss://).";
    } else if (host) {
      menuMultiplayerHintEl.textContent = `Room ${multiplayer.roomCode} live. Share this code to invite players.`;
    } else if (client) {
      menuMultiplayerHintEl.textContent = `Connected to ${multiplayer.roomCode}. Host controls waves and speed.`;
    } else {
      menuMultiplayerHintEl.textContent = "Enter a room code, then Create or Join.";
    }
  }
  renderMultiplayerRoster();
}

function closeMultiplayerSocket() {
  if (!multiplayer.socket) return;
  multiplayer.intentionalClose = true;
  try {
    multiplayer.socket.close();
  } catch (_) {}
  multiplayer.socket = null;
  multiplayer.connecting = false;
}

function sendMultiplayerTransportPacket(packet) {
  if (!multiplayer.socket) return false;
  if (multiplayer.socket.readyState !== WebSocket.OPEN) return false;
  try {
    multiplayer.socket.send(JSON.stringify(packet));
    return true;
  } catch (_) {
    return false;
  }
}

function postMultiplayerMessage(payload) {
  if (!isMultiplayerActive()) return;
  sendMultiplayerTransportPacket({
    type: "relay",
    roomCode: multiplayer.roomCode,
    payload: {
      ...payload,
      roomCode: multiplayer.roomCode,
      from: multiplayer.peerId,
      sentAt: Date.now(),
    },
  });
}

function serializeLaneSignature() {
  return Array.from(pathCellSet).sort().join("|");
}

function leaveMultiplayerSession(announce = true) {
  if (announce && isMultiplayerActive()) {
    postMultiplayerMessage({ type: "leave", name: getLocalMultiplayerDisplayName() });
  }
  closeMultiplayerSocket();
  multiplayer.role = "solo";
  multiplayer.roomCode = "";
  multiplayer.hostId = null;
  multiplayer.connected = false;
  multiplayer.peers.clear();
  multiplayer.roster.clear();
  multiplayer.snapshotTimer = 0;
  multiplayer.lastLaneSignature = "";
  multiplayer.lastShopSignature = "";
  refreshMultiplayerPanel();
}

function onMultiplayerMessage(message) {
  if (!message || typeof message !== "object") return;
  if (!isMultiplayerActive()) return;
  if (message.roomCode !== multiplayer.roomCode) return;
  if (message.from === multiplayer.peerId) return;

  if (isMultiplayerHost()) {
    if (message.type === "hello") {
      const playerName = sanitizeMultiplayerDisplayName(message.name || "Player");
      const wasKnown = multiplayer.peers.has(message.from) || multiplayer.roster.has(message.from);
      multiplayer.peers.add(message.from);
      upsertMultiplayerRosterPlayer(message.from, playerName, "client");
      multiplayer.connected = multiplayer.peers.size > 0;
      postMultiplayerMessage({
        type: "welcome",
        to: message.from,
        name: getLocalMultiplayerDisplayName(),
        players: getMultiplayerRosterPayload(),
      });
      sendMultiplayerSnapshot(true);
      if (!wasKnown) appendMultiplayerLog(`${playerName} joined your room.`);
      refreshMultiplayerPanel();
      return;
    }

    if (message.type === "leave") {
      const playerName = sanitizeMultiplayerDisplayName(message.name || getMultiplayerDisplayNameForPeer(message.from, "Player"));
      const wasKnown = multiplayer.peers.has(message.from) || multiplayer.roster.has(message.from);
      multiplayer.peers.delete(message.from);
      removeMultiplayerRosterPlayer(message.from);
      multiplayer.connected = multiplayer.peers.size > 0;
      if (wasKnown) appendMultiplayerLog(`${playerName} left your room.`);
      refreshMultiplayerPanel();
      return;
    }

    if (message.type === "action") {
      handleIncomingMultiplayerAction(message.action, message.payload, message.from);
      return;
    }
  }

  if (isMultiplayerClient()) {
    if (message.type === "welcome") {
      if (message.to && message.to !== multiplayer.peerId) return;
      multiplayer.hostId = message.from;
      upsertMultiplayerRosterPlayer(message.from, message.name || "Host", "host");
      upsertMultiplayerRosterPlayer(multiplayer.peerId, getLocalMultiplayerDisplayName(), "client");
      if (Array.isArray(message.players)) setMultiplayerRosterFromPacket(message.players, message.from);
      multiplayer.connected = true;
      appendMultiplayerLog("Connected to host.");
      refreshMultiplayerPanel();
      return;
    }

    if (message.type === "snapshot") {
      if (multiplayer.hostId && message.from !== multiplayer.hostId) return;
      multiplayer.hostId = message.from;
      multiplayer.connected = true;
      applyMultiplayerSnapshot(message.snapshot);
      refreshMultiplayerPanel();
      return;
    }

    if (message.type === "leave" && multiplayer.hostId && message.from === multiplayer.hostId) {
      appendMultiplayerLog(`${getMultiplayerDisplayNameForPeer(message.from, "Host")} left room.`);
      leaveMultiplayerSession(false);
      setStatus("Host left multiplayer room.", true);
      return;
    }
  }
}

function openMultiplayerConnection(roomCode, role, serverUrl) {
  closeMultiplayerSocket();
  if (!multiplayer.supported) {
    return Promise.reject(new Error("Multiplayer unavailable in this browser."));
  }
  return new Promise((resolve, reject) => {
    let settled = false;
    const socket = new WebSocket(serverUrl);
    multiplayer.socket = socket;
    multiplayer.connecting = true;
    multiplayer.intentionalClose = false;
    refreshMultiplayerPanel();

    const timeoutId = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      multiplayer.connecting = false;
      multiplayer.intentionalClose = true;
      try {
        socket.close();
      } catch (_) {}
      refreshMultiplayerPanel();
      reject(new Error("Multiplayer server timed out."));
    }, MULTIPLAYER_CONNECT_TIMEOUT);

    socket.addEventListener("open", () => {
      const sent = sendMultiplayerTransportPacket({
        type: "joinRoom",
        roomCode,
        role,
        peerId: multiplayer.peerId,
        displayName: getLocalMultiplayerDisplayName(),
      });
      if (sent || settled) return;
      settled = true;
      multiplayer.connecting = false;
      window.clearTimeout(timeoutId);
      refreshMultiplayerPanel();
      reject(new Error("Failed to send multiplayer join request."));
    });

    socket.addEventListener("message", (event) => {
      let packet = null;
      try {
        packet = JSON.parse(typeof event.data === "string" ? event.data : "");
      } catch (_) {
        return;
      }
      if (!packet || typeof packet !== "object") return;

      if (packet.type === "joinedRoom") {
        if (packet.roomCode !== roomCode) return;
        if (typeof packet.peerId === "string" && packet.peerId) multiplayer.peerId = packet.peerId;
        if (typeof packet.hostPeerId === "string" && packet.hostPeerId) multiplayer.hostId = packet.hostPeerId;
        if (Array.isArray(packet.players)) setMultiplayerRosterFromPacket(packet.players, packet.hostPeerId || multiplayer.hostId);
        if (!multiplayer.roster.has(multiplayer.peerId)) {
          upsertMultiplayerRosterPlayer(multiplayer.peerId, packet.displayName || getLocalMultiplayerDisplayName(), role);
        }
        multiplayer.connecting = false;
        refreshMultiplayerPanel();
        if (settled) return;
        settled = true;
        window.clearTimeout(timeoutId);
        resolve(packet);
        return;
      }

      if (packet.type === "roomError") {
        const message = typeof packet.message === "string" ? packet.message : "Multiplayer room error.";
        multiplayer.connecting = false;
        appendMultiplayerLog(message);
        refreshMultiplayerPanel();
        if (!settled) {
          settled = true;
          window.clearTimeout(timeoutId);
          reject(new Error(message));
        }
        multiplayer.intentionalClose = true;
        try {
          socket.close();
        } catch (_) {}
        return;
      }

      if (packet.type === "relay") {
        onMultiplayerMessage(packet.payload);
        return;
      }

      if (packet.type === "peerJoined") {
        const peerId = typeof packet.peerId === "string" ? packet.peerId : "";
        if (!peerId || peerId === multiplayer.peerId) return;
        const playerName = sanitizeMultiplayerDisplayName(packet.displayName || "Player");
        const knownBefore = multiplayer.roster.has(peerId);
        upsertMultiplayerRosterPlayer(peerId, playerName, packet.role || "player");
        if (typeof packet.hostPeerId === "string" && packet.hostPeerId) multiplayer.hostId = packet.hostPeerId;
        if (Array.isArray(packet.players)) setMultiplayerRosterFromPacket(packet.players, packet.hostPeerId || multiplayer.hostId);
        if (isMultiplayerHost()) {
          multiplayer.peers.add(peerId);
          multiplayer.connected = multiplayer.peers.size > 0;
        }
        if (!knownBefore) appendMultiplayerLog(`${playerName} joined the room.`);
        refreshMultiplayerPanel();
        return;
      }

      if (packet.type === "peerLeft") {
        const peerId = typeof packet.peerId === "string" ? packet.peerId : "";
        if (!peerId || peerId === multiplayer.peerId) return;
        const playerName = sanitizeMultiplayerDisplayName(packet.displayName || getMultiplayerDisplayNameForPeer(peerId, "Player"));
        const knownBefore = multiplayer.roster.has(peerId) || multiplayer.peers.has(peerId);
        if (isMultiplayerClient() && multiplayer.hostId && peerId === multiplayer.hostId) return;
        multiplayer.peers.delete(peerId);
        if (isMultiplayerHost()) multiplayer.connected = multiplayer.peers.size > 0;
        removeMultiplayerRosterPlayer(peerId);
        if (typeof packet.hostPeerId === "string" && packet.hostPeerId) multiplayer.hostId = packet.hostPeerId;
        if (Array.isArray(packet.players)) setMultiplayerRosterFromPacket(packet.players, packet.hostPeerId || multiplayer.hostId);
        if (knownBefore) appendMultiplayerLog(`${playerName} left the room.`);
        refreshMultiplayerPanel();
        return;
      }

      if (packet.type === "hostLeft" && isMultiplayerClient()) {
        appendMultiplayerLog(`${getMultiplayerDisplayNameForPeer(multiplayer.hostId, "Host")} left room.`);
        leaveMultiplayerSession(false);
        setStatus("Host left multiplayer room.", true);
      }
    });

    socket.addEventListener("close", () => {
      const wasActive = isMultiplayerActive();
      const wasHost = isMultiplayerHost();
      const intentional = multiplayer.intentionalClose;
      multiplayer.connecting = false;
      multiplayer.intentionalClose = false;
      if (multiplayer.socket === socket) multiplayer.socket = null;
      if (!settled) {
        settled = true;
        window.clearTimeout(timeoutId);
        refreshMultiplayerPanel();
        reject(new Error("Unable to connect to multiplayer server."));
        return;
      }
      if (wasActive && !intentional) {
        leaveMultiplayerSession(false);
        appendMultiplayerLog("Disconnected from multiplayer server.");
        setStatus(wasHost ? "Server connection lost. Room closed." : "Disconnected from multiplayer server.", true);
      } else {
        refreshMultiplayerPanel();
      }
    });

    socket.addEventListener("error", () => {
      if (settled) return;
      multiplayer.connecting = false;
      refreshMultiplayerPanel();
    });
  });
}

async function hostMultiplayerSession() {
  if (!multiplayer.supported) {
    setStatus("Multiplayer unavailable in this browser.", true);
    return;
  }

  const roomCode = sanitizeRoomCode(multiplayerRoomInputEl?.value || multiplayer.roomCode || "");
  if (!roomCode) {
    setStatus("Enter a room code first.", true);
    return;
  }

  const serverUrl = normalizeMultiplayerServerUrl(multiplayerServerInputEl?.value || multiplayer.serverUrl || "");
  if (!serverUrl) {
    setStatus("Enter a valid multiplayer server URL first.", true);
    refreshMultiplayerPanel();
    return;
  }

  leaveMultiplayerSession(false);
  multiplayer.serverUrl = serverUrl;
  persistPreferredMultiplayerServerUrl(serverUrl);
  if (multiplayerServerInputEl) multiplayerServerInputEl.value = serverUrl;

  let joinedPacket = null;
  try {
    joinedPacket = await openMultiplayerConnection(roomCode, "host", serverUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to connect to multiplayer server.";
    leaveMultiplayerSession(false);
    setStatus(message, true);
    return;
  }

  multiplayer.role = "host";
  multiplayer.roomCode = roomCode;
  multiplayer.hostId = multiplayer.peerId;
  multiplayer.connected = false;
  multiplayer.peers.clear();
  multiplayer.roster.clear();
  if (Array.isArray(joinedPacket?.players)) setMultiplayerRosterFromPacket(joinedPacket.players, multiplayer.peerId);
  upsertMultiplayerRosterPlayer(multiplayer.peerId, getLocalMultiplayerDisplayName(), "host");
  for (const player of getMultiplayerRosterEntries()) {
    if (player.peerId === multiplayer.peerId) continue;
    multiplayer.peers.add(player.peerId);
  }
  multiplayer.connected = multiplayer.peers.size > 0;
  multiplayer.snapshotTimer = 0;
  multiplayer.lastLaneSignature = serializeLaneSignature();
  if (multiplayerRoomInputEl) multiplayerRoomInputEl.value = roomCode;
  appendMultiplayerLog(`Room created: ${roomCode}`);
  refreshMultiplayerPanel();
  setStatus(`Hosting multiplayer room ${roomCode}.`);
}

async function joinMultiplayerSession() {
  if (!multiplayer.supported) {
    setStatus("Multiplayer unavailable in this browser.", true);
    return;
  }

  const roomCode = sanitizeRoomCode(multiplayerRoomInputEl?.value || multiplayer.roomCode || "");
  if (!roomCode) {
    setStatus("Enter a room code first.", true);
    return;
  }

  const serverUrl = normalizeMultiplayerServerUrl(multiplayerServerInputEl?.value || multiplayer.serverUrl || "");
  if (!serverUrl) {
    setStatus("Enter a valid multiplayer server URL first.", true);
    refreshMultiplayerPanel();
    return;
  }

  leaveMultiplayerSession(false);
  multiplayer.serverUrl = serverUrl;
  persistPreferredMultiplayerServerUrl(serverUrl);
  if (multiplayerServerInputEl) multiplayerServerInputEl.value = serverUrl;

  let joinedPacket = null;
  try {
    joinedPacket = await openMultiplayerConnection(roomCode, "client", serverUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to connect to multiplayer server.";
    leaveMultiplayerSession(false);
    setStatus(message, true);
    return;
  }

  multiplayer.role = "client";
  multiplayer.roomCode = roomCode;
  multiplayer.connected = false;
  multiplayer.peers.clear();
  multiplayer.roster.clear();
  multiplayer.hostId = typeof joinedPacket?.hostPeerId === "string" ? joinedPacket.hostPeerId : null;
  if (Array.isArray(joinedPacket?.players)) setMultiplayerRosterFromPacket(joinedPacket.players, multiplayer.hostId);
  upsertMultiplayerRosterPlayer(multiplayer.peerId, joinedPacket?.displayName || getLocalMultiplayerDisplayName(), "client");
  if (multiplayer.hostId && multiplayer.hostId !== multiplayer.peerId) {
    const hostName = getMultiplayerDisplayNameForPeer(multiplayer.hostId, "Host");
    upsertMultiplayerRosterPlayer(multiplayer.hostId, hostName, "host");
    multiplayer.connected = true;
  }
  multiplayer.snapshotTimer = 0;
  multiplayer.lastLaneSignature = "";
  clearActiveCombatState();
  resetTowersForNewLevel();
  if (multiplayerRoomInputEl) multiplayerRoomInputEl.value = roomCode;
  appendMultiplayerLog(`Joining room: ${roomCode}`);
  postMultiplayerMessage({ type: "hello", name: getLocalMultiplayerDisplayName() });
  refreshMultiplayerPanel();
  setStatus(`Joining multiplayer room ${roomCode}...`);
}

function sendMultiplayerAction(action, payload = {}) {
  if (!isMultiplayerClient() || !isMultiplayerActive()) return;
  postMultiplayerMessage({
    type: "action",
    action,
    payload,
  });
}

function getProgressStorage() {
  try {
    return window.localStorage;
  } catch (_) {
    return null;
  }
}

function sanitizeAccountName(name) {
  return String(name || "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 24);
}

function createAccountId() {
  return `acct_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeTowerIds(rawIds, unlockedSet, validTowerIds, maxCount = Infinity, unlockedSpawnerSet = null) {
  const set = new Set();
  if (!Array.isArray(rawIds)) return set;
  for (const towerTypeId of rawIds) {
    if (typeof towerTypeId !== "string") continue;
    if (!validTowerIds.has(towerTypeId)) continue;
    const spawnerEnemyTypeId = enemyTypeFromSpawnerTowerId(towerTypeId);
    if (spawnerEnemyTypeId) {
      if (unlockedSpawnerSet && !unlockedSpawnerSet.has(spawnerEnemyTypeId)) continue;
    } else if (unlockedSet && !unlockedSet.has(towerTypeId)) {
      continue;
    }
    set.add(towerTypeId);
    if (set.size >= maxCount) break;
  }
  return set;
}

function normalizeEnemyKillCounts(rawCounts) {
  const counts = {};
  for (const enemyTypeId of CREATURE_SHOP_ENEMY_IDS) {
    const raw = rawCounts && typeof rawCounts === "object" ? Number(rawCounts[enemyTypeId]) : 0;
    counts[enemyTypeId] = Number.isFinite(raw) ? Math.max(0, Math.floor(raw)) : 0;
  }
  return counts;
}

function normalizeUnlockedSpawnerTypes(rawSpawnerIds, killCounts) {
  const set = new Set();
  if (Array.isArray(rawSpawnerIds)) {
    for (const enemyTypeId of rawSpawnerIds) {
      if (typeof enemyTypeId !== "string") continue;
      if (!Object.prototype.hasOwnProperty.call(CREATURE_SPAWNER_UNLOCKS, enemyTypeId)) continue;
      set.add(enemyTypeId);
    }
  }

  for (const enemyTypeId of CREATURE_SHOP_ENEMY_IDS) {
    const requirement = CREATURE_SPAWNER_UNLOCKS[enemyTypeId]?.killRequirement || Number.POSITIVE_INFINITY;
    if ((killCounts[enemyTypeId] || 0) >= requirement) set.add(enemyTypeId);
  }
  return set;
}

function clampLoadoutSlotLimit(rawValue) {
  if (!Number.isFinite(rawValue)) return BASE_LOADOUT_SLOTS;
  return Math.max(BASE_LOADOUT_SLOTS, Math.min(MAX_LOADOUT_SLOTS, Math.floor(rawValue)));
}

function getCurrentLoadoutSlotLimit() {
  return clampLoadoutSlotLimit(game.maxLoadoutSlots);
}

function addDefaultLoadoutEntries(loadoutSet, unlockedTowerSet, unlockedSpawnerSet, maxCount = BASE_LOADOUT_SLOTS) {
  for (const towerTypeId of unlockedTowerSet) {
    loadoutSet.add(towerTypeId);
    if (loadoutSet.size >= maxCount) return;
  }
  for (const enemyTypeId of CREATURE_SHOP_ENEMY_IDS) {
    if (!unlockedSpawnerSet?.has(enemyTypeId)) continue;
    loadoutSet.add(spawnerTowerIdForEnemy(enemyTypeId));
    if (loadoutSet.size >= maxCount) return;
  }
}

function isUnlockedForLoadout(towerTypeId) {
  if (isTowerUnlocked(towerTypeId)) return true;
  if (isSpawnerTowerId(towerTypeId)) return isSpawnerTowerUnlocked(towerTypeId);
  return false;
}

function createAccountRecord(name = "Commander", seed = null) {
  const validTowerIds = getAllTowerTypeIds();
  const unlocked = new Set(BASE_UNLOCKED_TOWERS);
  if (seed && Array.isArray(seed.unlockedTowers)) {
    for (const towerTypeId of seed.unlockedTowers) {
      if (typeof towerTypeId !== "string") continue;
      if (!validTowerIds.has(towerTypeId)) continue;
      unlocked.add(towerTypeId);
    }
  }

  const enemyKillCounts = normalizeEnemyKillCounts(seed?.enemyKillCounts);
  const unlockedSpawnerTowers = normalizeUnlockedSpawnerTypes(seed?.unlockedSpawnerTowers, enemyKillCounts);
  const towerCapUpgrades = normalizeTowerCapUpgrades(seed?.towerCapUpgrades);
  const towerDamageUpgrades = normalizeTowerDamageUpgrades(seed?.towerDamageUpgrades);
  const towerAttackSpeedUpgrades = normalizeTowerAttackSpeedUpgrades(seed?.towerAttackSpeedUpgrades);
  const towerRangeUpgrades = normalizeTowerRangeUpgrades(seed?.towerRangeUpgrades);
  const spawnerCooldownUpgrades = normalizeSpawnerCooldownUpgrades(seed?.spawnerCooldownUpgrades);
  const maxLoadoutSlots = clampLoadoutSlotLimit(Number(seed?.maxLoadoutSlots));
  let loadout = normalizeTowerIds(
    seed?.activeLoadout,
    unlocked,
    validTowerIds,
    maxLoadoutSlots,
    unlockedSpawnerTowers
  );
  if (loadout.size === 0) {
    addDefaultLoadoutEntries(loadout, unlocked, unlockedSpawnerTowers, maxLoadoutSlots);
  }

  const shardValue = Number(seed?.shards);
  const levelValue = Number(seed?.maxLevelUnlocked);
  const seededId = typeof seed?.id === "string" ? seed.id.trim() : "";
  const safeId = /^[A-Za-z0-9_-]{4,80}$/.test(seededId) ? seededId : "";
  return {
    id: safeId || createAccountId(),
    name: sanitizeAccountName(seed?.name ?? name) || "Commander",
    shards: Number.isFinite(shardValue) ? Math.max(0, Math.floor(shardValue)) : 0,
    maxLevelUnlocked: Number.isFinite(levelValue) ? Math.max(1, Math.floor(levelValue)) : 1,
    maxLoadoutSlots,
    unlockedTowers: Array.from(unlocked),
    activeLoadout: Array.from(loadout),
    enemyKillCounts,
    unlockedSpawnerTowers: Array.from(unlockedSpawnerTowers),
    towerCapUpgrades,
    towerDamageUpgrades,
    towerAttackSpeedUpgrades,
    towerRangeUpgrades,
    spawnerCooldownUpgrades,
  };
}

function defaultProgressData(seed = null) {
  const account = createAccountRecord("Commander", seed);
  return {
    currentAccountId: account.id,
    accounts: [account],
  };
}

function parseLegacyProgress(storage) {
  if (!storage) return null;
  let parsed = null;
  try {
    parsed = JSON.parse(storage.getItem(LEGACY_PROGRESS_STORAGE_KEY) || "null");
  } catch (_) {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;
  return {
    shards: parsed.shards,
    unlockedTowers: parsed.unlockedTowers,
    activeLoadout: parsed.activeLoadout,
  };
}

function normalizeProgressData(rawData) {
  if (!rawData || typeof rawData !== "object") return defaultProgressData();

  const accounts = [];
  const seenIds = new Set();
  if (Array.isArray(rawData.accounts)) {
    for (const rawAccount of rawData.accounts) {
      const normalized = createAccountRecord(rawAccount?.name ?? "Commander", rawAccount || null);
      if (seenIds.has(normalized.id)) normalized.id = createAccountId();
      seenIds.add(normalized.id);
      accounts.push(normalized);
    }
  }

  if (accounts.length === 0) return defaultProgressData();

  let currentAccountId = typeof rawData.currentAccountId === "string" ? rawData.currentAccountId : "";
  if (!accounts.some((account) => account.id === currentAccountId)) currentAccountId = accounts[0].id;

  return {
    currentAccountId,
    accounts,
  };
}

let progressData = defaultProgressData();

function getCurrentAccountRecord() {
  const current = progressData.accounts.find((account) => account.id === progressData.currentAccountId);
  return current || progressData.accounts[0] || null;
}

function applyAccountToGame(account) {
  if (!account) return;
  game.accountId = account.id;
  game.accountName = sanitizeAccountName(account.name) || "Commander";
  game.shards = Math.max(0, Math.floor(account.shards || 0));
  game.maxLevelUnlocked = Math.max(1, Math.floor(account.maxLevelUnlocked || 1));
  game.maxLoadoutSlots = clampLoadoutSlotLimit(Number(account.maxLoadoutSlots));
  if (!Number.isFinite(game.menuSelectedLevel)) game.menuSelectedLevel = getHighestUnlockedLevel();
  game.menuSelectedLevel = clampMenuSelectedLevel(game.menuSelectedLevel);
  if (!game.started || game.over || game.currentLevel > game.maxLevelUnlocked) {
    game.currentLevel = getHighestUnlockedLevel();
  }
  game.unlockedTowers = new Set(account.unlockedTowers);
  game.towerCapUpgrades = normalizeTowerCapUpgrades(account.towerCapUpgrades);
  game.towerDamageUpgrades = normalizeTowerDamageUpgrades(account.towerDamageUpgrades);
  game.towerAttackSpeedUpgrades = normalizeTowerAttackSpeedUpgrades(account.towerAttackSpeedUpgrades);
  game.towerRangeUpgrades = normalizeTowerRangeUpgrades(account.towerRangeUpgrades);
  game.spawnerCooldownUpgrades = normalizeSpawnerCooldownUpgrades(account.spawnerCooldownUpgrades);
  game.enemyKillCounts = normalizeEnemyKillCounts(account.enemyKillCounts);
  game.unlockedSpawnerTowers = normalizeUnlockedSpawnerTypes(
    account.unlockedSpawnerTowers,
    game.enemyKillCounts
  );
  game.activeLoadout = normalizeTowerIds(
    account.activeLoadout,
    game.unlockedTowers,
    getAllTowerTypeIds(),
    game.maxLoadoutSlots,
    game.unlockedSpawnerTowers
  );

  if (game.activeLoadout.size === 0) {
    addDefaultLoadoutEntries(game.activeLoadout, game.unlockedTowers, game.unlockedSpawnerTowers, game.maxLoadoutSlots);
  }

  if (!isTowerSelectable(game.selectedTowerType)) {
    game.selectedTowerType = firstAvailableTowerId() || "pulse";
  }
  game.loadoutUpgradeTargetId = null;
}

function persistProgressData() {
  const storage = getProgressStorage();
  if (!storage) return;
  try {
    storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progressData));
  } catch (_) {}
}

function savePlayerProgress() {
  let current = getCurrentAccountRecord();
  if (!current) {
    current = createAccountRecord(game.accountName || "Commander");
    progressData.accounts = [current];
    progressData.currentAccountId = current.id;
  }

  current.name = sanitizeAccountName(game.accountName) || "Commander";
  current.shards = Math.max(0, Math.floor(game.shards || 0));
  current.maxLevelUnlocked = Math.max(1, Math.floor(game.maxLevelUnlocked || 1));
  current.maxLoadoutSlots = getCurrentLoadoutSlotLimit();
  current.unlockedTowers = Array.from(game.unlockedTowers);
  current.towerCapUpgrades = normalizeTowerCapUpgrades(game.towerCapUpgrades);
  current.towerDamageUpgrades = normalizeTowerDamageUpgrades(game.towerDamageUpgrades);
  current.towerAttackSpeedUpgrades = normalizeTowerAttackSpeedUpgrades(game.towerAttackSpeedUpgrades);
  current.towerRangeUpgrades = normalizeTowerRangeUpgrades(game.towerRangeUpgrades);
  current.spawnerCooldownUpgrades = normalizeSpawnerCooldownUpgrades(game.spawnerCooldownUpgrades);
  current.enemyKillCounts = normalizeEnemyKillCounts(game.enemyKillCounts);
  current.unlockedSpawnerTowers = Array.from(game.unlockedSpawnerTowers).filter((enemyTypeId) =>
    Object.prototype.hasOwnProperty.call(CREATURE_SPAWNER_UNLOCKS, enemyTypeId)
  );
  current.activeLoadout = Array.from(game.activeLoadout)
    .filter((towerTypeId) => {
      if (game.unlockedTowers.has(towerTypeId)) return true;
      const enemyTypeId = enemyTypeFromSpawnerTowerId(towerTypeId);
      return !!enemyTypeId && game.unlockedSpawnerTowers.has(enemyTypeId);
    })
    .slice(0, current.maxLoadoutSlots);

  if (current.activeLoadout.length === 0) {
    const fallbackLoadout = new Set();
    addDefaultLoadoutEntries(
      fallbackLoadout,
      new Set(current.unlockedTowers),
      new Set(current.unlockedSpawnerTowers),
      current.maxLoadoutSlots
    );
    current.activeLoadout = Array.from(fallbackLoadout);
  }

  progressData.currentAccountId = current.id;
  persistProgressData();
}

function loadPlayerProgress() {
  const storage = getProgressStorage();
  if (!storage) {
    progressData = defaultProgressData();
    applyAccountToGame(getCurrentAccountRecord());
    return false;
  }

  let parsed = null;
  try {
    parsed = JSON.parse(storage.getItem(PROGRESS_STORAGE_KEY) || "null");
  } catch (_) {
    parsed = null;
  }

  if (!parsed || typeof parsed !== "object") {
    const legacy = parseLegacyProgress(storage);
    progressData = legacy ? defaultProgressData(legacy) : defaultProgressData();
  } else {
    progressData = normalizeProgressData(parsed);
  }

  const current = getCurrentAccountRecord();
  if (!current) {
    progressData = defaultProgressData();
  }

  applyAccountToGame(getCurrentAccountRecord());
  savePlayerProgress();
  return true;
}

function createEnemyMesh(typeId, colorA, colorB, options = null) {
  const group = new THREE.Group();
  const primary = new THREE.Color(colorA);
  const secondary = new THREE.Color(colorB);
  const hideRings = !!options?.hideRings;

  const glassIntensity = {
    crawler: 0.9,
    blink: 1,
    skitter: 0.98,
    minion: 0.96,
    bulwark: 1.08,
    raider: 1.02,
    specter: 1.1,
    warden: 1.1,
    prism: 1.16,
    colossus: 1.22,
    leviathan: 1.3,
    monolith: 1.48,
    icosahedron: 1.5,
    star: 1.9,
    rhombus: 1.64,
    rhombusMinus: 1.36,
  }[typeId] || 1;

  const absorptionA = primary.clone().lerp(new THREE.Color("#e8f8ff"), 0.32);
  const absorptionB = secondary.clone().lerp(new THREE.Color("#ffffff"), 0.36);

  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: primary.clone().lerp(new THREE.Color("#f2fbff"), 0.2),
    emissive: primary.clone().multiplyScalar(0.06),
    emissiveIntensity: 0.2,
    roughness: 0.06,
    metalness: 0,
    transmission: 0.98,
    ior: 1.46,
    thickness: 1.05 * glassIntensity,
    attenuationColor: absorptionA,
    attenuationDistance: 1.8,
    clearcoat: 0.95,
    clearcoatRoughness: 0.025,
    envMapIntensity: 1.65,
    reflectivity: 0.75,
    transparent: false,
    opacity: 1,
  });

  const accentMat = new THREE.MeshPhysicalMaterial({
    color: secondary.clone().lerp(new THREE.Color("#f5fcff"), 0.26),
    emissive: secondary.clone().multiplyScalar(0.1),
    emissiveIntensity: 0.3,
    roughness: 0.045,
    metalness: 0,
    transmission: 0.99,
    ior: 1.48,
    thickness: 0.9 * glassIntensity,
    attenuationColor: absorptionB,
    attenuationDistance: 1.5,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    envMapIntensity: 1.72,
    reflectivity: 0.82,
    transparent: false,
    opacity: 1,
  });

  const darkMat = new THREE.MeshPhysicalMaterial({
    color: primary.clone().multiplyScalar(0.38),
    emissive: primary.clone().multiplyScalar(0.03),
    emissiveIntensity: 0.16,
    roughness: 0.11,
    metalness: 0,
    transmission: 0.72,
    ior: 1.44,
    thickness: 0.75,
    attenuationColor: absorptionA.clone().multiplyScalar(0.8),
    attenuationDistance: 1.2,
    clearcoat: 0.72,
    clearcoatRoughness: 0.06,
    envMapIntensity: 1.35,
    reflectivity: 0.72,
    transparent: false,
    opacity: 1,
  });

  const ringMat = new THREE.MeshPhysicalMaterial({
    color: secondary.clone().lerp(new THREE.Color("#ffffff"), 0.34),
    emissive: secondary.clone().multiplyScalar(0.14),
    emissiveIntensity: 0.38,
    roughness: 0.055,
    metalness: 0,
    transmission: 0.94,
    ior: 1.46,
    thickness: 0.42 * glassIntensity,
    attenuationColor: absorptionB,
    attenuationDistance: 1.25,
    clearcoat: 0.95,
    clearcoatRoughness: 0.03,
    envMapIntensity: 1.58,
    reflectivity: 0.8,
    transparent: false,
    opacity: 1,
  });

  const glowCoreMat = new THREE.MeshBasicMaterial({
    color: secondary.clone().lerp(new THREE.Color("#ffffff"), 0.4),
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
  });

  if (typeId === "star") {
    bodyMat.color.set("#ffe982");
    bodyMat.emissive.set("#b88900");
    bodyMat.emissiveIntensity = 0.28;
    bodyMat.roughness = 0.03;
    bodyMat.thickness = 1.25 * glassIntensity;
    bodyMat.attenuationColor.set("#ffe56b");
    bodyMat.attenuationDistance = 1.35;
    bodyMat.envMapIntensity = 1.9;

    accentMat.color.set("#fff9d2");
    accentMat.emissive.set("#d49a00");
    accentMat.emissiveIntensity = 0.36;
    accentMat.roughness = 0.025;
    accentMat.thickness = 1.12 * glassIntensity;
    accentMat.attenuationColor.set("#fff0a8");
    accentMat.attenuationDistance = 1.22;
    accentMat.envMapIntensity = 1.95;
  }

  const cast = (mesh) => {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  };

  const SHAPE_SETUPS = {
    crawler: { shape: "sphere", radius: 0.85, ringRadius: 0, coreRadius: 0 },
    blink: { shape: "triangle", size: 0.84, ringRadius: 0.72, coreRadius: 0.16 },
    skitter: { shape: "triangle", size: 0.66, ringRadius: 0.56, coreRadius: 0.14 },
    minion: { shape: "triangle", size: 0.56, ringRadius: 0, coreRadius: 0.12 },
    bulwark: { shape: "cube", sizeX: 1.7, sizeY: 1.7, sizeZ: 1.7, ringRadius: 0.74, coreRadius: 0.17, coreY: 0.22 },
    raider: { shape: "triangle", size: 0.9, ringRadius: 0.84, coreRadius: 0.16, coreY: 0.08 },
    specter: { shape: "hex", radius: 0.78, height: 1.2, ringRadius: 0.92, coreRadius: 0.16 },
    warden: { shape: "cube", sizeX: 1.5, sizeY: 1.24, sizeZ: 1.5, ringRadius: 0.78, coreRadius: 0.18, coreY: 0.24 },
    prism: { shape: "hex", radius: 0.96, height: 1.44, ringRadius: 1.06, coreRadius: 0.17, coreY: 0.08 },
    colossus: { shape: "hex", radius: 1.08, height: 1.64, ringRadius: 1.24, ringTube: 0.08, coreRadius: 0.18 },
    leviathan: {
      shape: "sphere",
      radius: 1.18,
      shellRadius: 1.5,
      ringRadius: 1.66,
      ringTube: 0.1,
      coreRadius: 0.19,
      coreY: 0.1,
    },
    monolith: { shape: "cube", sizeX: 2.35, sizeY: 2.35, sizeZ: 2.35, ringRadius: 0, coreRadius: 0.3, coreY: 0.3 },
    icosahedron: {
      shape: "icosa",
      radius: 1.95,
      ringRadius: 0,
      coreRadius: 0.24,
      coreY: 0.14,
      spikeLength: 0.7,
      spikeRadius: 0.14,
    },
    star: {
      shape: "starBall",
      radius: 1.38,
      spikeLength: 2.32,
      spikeRadius: 0.86,
      ringRadius: 0,
      coreRadius: 0,
      coreY: 0.12,
    },
    rhombus: {
      shape: "rhombus",
      radius: 2.15,
      ringRadius: 0,
      coreRadius: 0.3,
      coreY: 0.18,
    },
    rhombusMinus: {
      shape: "rhombus",
      radius: 1.38,
      ringRadius: 0,
      coreRadius: 0.2,
      coreY: 0.12,
    },
  };

  const setup = SHAPE_SETUPS[typeId] || SHAPE_SETUPS.crawler;
  const isSphereShape = setup.shape === "sphere";

  if (isSphereShape) {
    // Make spheres read a little more like clear glass without washing them out.
    bodyMat.transmission = Math.min(1, bodyMat.transmission + 0.015);
    bodyMat.roughness = Math.max(0.03, bodyMat.roughness - 0.02);
    bodyMat.thickness *= 0.8;
    bodyMat.attenuationDistance *= 1.28;
    bodyMat.emissiveIntensity *= 0.85;

    accentMat.roughness = Math.max(0.028, accentMat.roughness - 0.012);
    accentMat.thickness *= 0.82;
    accentMat.attenuationDistance *= 1.2;
    accentMat.emissiveIntensity *= 0.9;
  }

  let spinNode = null;
  let body = null;
  const isPrimarySphere = typeId === "crawler";

  if (setup.shape === "triangle") {
    body = cast(new THREE.Mesh(new THREE.TetrahedronGeometry(setup.size), bodyMat));
    body.rotation.y = Math.PI / 3;
    group.add(body);
  } else if (setup.shape === "cube") {
    body = cast(new THREE.Mesh(new THREE.BoxGeometry(setup.sizeX, setup.sizeY, setup.sizeZ), bodyMat));
    group.add(body);

    const corner = setup.sizeX * 0.38;
    for (let i = 0; i < 4; i += 1) {
      const angle = (i / 4) * Math.PI * 2;
      const plate = cast(new THREE.Mesh(new THREE.BoxGeometry(0.16, setup.sizeY * 0.65, setup.sizeZ * 0.2), darkMat));
      plate.position.set(Math.cos(angle) * corner, 0, Math.sin(angle) * corner);
      plate.rotation.y = angle;
      group.add(plate);
    }
  } else if (setup.shape === "hex") {
    body = cast(new THREE.Mesh(new THREE.CylinderGeometry(setup.radius, setup.radius, setup.height, 6), bodyMat));
    group.add(body);
  } else if (setup.shape === "icosa") {
    body = cast(new THREE.Mesh(new THREE.IcosahedronGeometry(setup.radius, 0), bodyMat));
    body.rotation.y = Math.PI / 10;
    group.add(body);

    const icosaTemplate = new THREE.IcosahedronGeometry(setup.radius, 0);
    const pos = icosaTemplate.getAttribute("position");
    const spikeDirs = [];
    const dir = new THREE.Vector3();
    const upAxis = new THREE.Vector3(0, 1, 0);

    for (let i = 0; i < pos.count; i += 1) {
      dir.set(pos.getX(i), pos.getY(i), pos.getZ(i)).normalize();
      let exists = false;
      for (const stored of spikeDirs) {
        if (stored.dot(dir) > 0.999) {
          exists = true;
          break;
        }
      }
      if (!exists) spikeDirs.push(dir.clone());
    }
    icosaTemplate.dispose();

    for (const spikeDir of spikeDirs) {
      const spike = cast(
        new THREE.Mesh(
          new THREE.ConeGeometry(setup.spikeRadius || 0.14, setup.spikeLength || 0.7, 8),
          darkMat
        )
      );
      spike.quaternion.setFromUnitVectors(upAxis, spikeDir);
      spike.position.copy(spikeDir).multiplyScalar(setup.radius + (setup.spikeLength || 0.7) * 0.32);
      group.add(spike);
    }
  } else if (setup.shape === "starBall") {
    const coreRadius = Math.max(0.7, setup.radius || 1.35);
    const spikeLength = Math.max(0.4, setup.spikeLength || 1.4);
    const spikeRadius = Math.max(0.16, setup.spikeRadius || 0.34);

    const coreGeometry = new THREE.IcosahedronGeometry(coreRadius, 0);

    const spikeMat = new THREE.MeshPhysicalMaterial({
      color: secondary.clone().lerp(new THREE.Color("#ffffff"), 0.14),
      emissive: primary.clone().multiplyScalar(0.16),
      emissiveIntensity: 0.34,
      roughness: 0.02,
      metalness: 0,
      transmission: 1,
      ior: 1.5,
      thickness: 0.95 * glassIntensity,
      attenuationColor: primary.clone().lerp(new THREE.Color("#ffe56b"), 0.6),
      attenuationDistance: 1.08,
      clearcoat: 1,
      clearcoatRoughness: 0.015,
      envMapIntensity: 2.05,
      reflectivity: 0.9,
      transparent: false,
      opacity: 1,
    });

    const spikeGeometry = new THREE.ConeGeometry(spikeRadius, spikeLength, 4, 1, false);
    spikeGeometry.rotateY(Math.PI / 4);

    const faceGeometry = coreGeometry.toNonIndexed();
    const pos = faceGeometry.getAttribute("position");
    const upAxis = new THREE.Vector3(0, 1, 0);
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    const c = new THREE.Vector3();
    const center = new THREE.Vector3();
    const edgeAB = new THREE.Vector3();
    const edgeAC = new THREE.Vector3();
    const normal = new THREE.Vector3();

    for (let i = 0; i < pos.count; i += 3) {
      a.set(pos.getX(i), pos.getY(i), pos.getZ(i));
      b.set(pos.getX(i + 1), pos.getY(i + 1), pos.getZ(i + 1));
      c.set(pos.getX(i + 2), pos.getY(i + 2), pos.getZ(i + 2));
      center.copy(a).add(b).add(c).multiplyScalar(1 / 3);

      edgeAB.copy(b).sub(a);
      edgeAC.copy(c).sub(a);
      normal.crossVectors(edgeAB, edgeAC).normalize();
      if (normal.dot(center) < 0) normal.multiplyScalar(-1);

      const spike = cast(new THREE.Mesh(spikeGeometry, spikeMat));
      const offset = coreRadius * 0.03 + spikeLength * 0.33;
      spike.position.copy(center).addScaledVector(normal, offset);
      spike.quaternion.setFromUnitVectors(upAxis, normal);
      group.add(spike);
    }
    coreGeometry.dispose();
    faceGeometry.dispose();
  } else if (setup.shape === "rhombus") {
    body = cast(new THREE.Mesh(new THREE.OctahedronGeometry(setup.radius, 0), bodyMat));
    body.rotation.y = Math.PI / 4;
    group.add(body);
  } else {
    // Standard sphere shapes stay as spheres.
    body = cast(new THREE.Mesh(new THREE.SphereGeometry(setup.radius, 38, 38), bodyMat));
    group.add(body);
  }

  if (!isPrimarySphere && body) {
    const sleekCoat = new THREE.Mesh(
      body.geometry.clone(),
      new THREE.MeshPhysicalMaterial({
        color: secondary.clone().lerp(new THREE.Color("#ffffff"), 0.42),
        emissive: secondary.clone().multiplyScalar(0.04),
        emissiveIntensity: 0.2,
        roughness: 0.012,
        metalness: 0,
        transmission: 1,
        ior: 1.52,
        thickness: 0.24 * glassIntensity,
        attenuationColor: absorptionB,
        attenuationDistance: 0.9,
        clearcoat: 1,
        clearcoatRoughness: 0.01,
        envMapIntensity: 1.95,
        reflectivity: 0.9,
        transparent: false,
        opacity: 1,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      })
    );
    sleekCoat.position.copy(body.position);
    sleekCoat.rotation.copy(body.rotation);
    sleekCoat.scale.copy(body.scale).multiplyScalar(1.018);
    sleekCoat.castShadow = false;
    sleekCoat.receiveShadow = true;
    sleekCoat.renderOrder = 2;
    group.add(sleekCoat);
  }

  if (setup.shellRadius) {
    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(setup.shellRadius, 30, 30),
      new THREE.MeshPhysicalMaterial({
        color: secondary.clone().lerp(new THREE.Color("#ffffff"), 0.28),
        emissive: secondary.clone().multiplyScalar(0.08),
        emissiveIntensity: 0.36,
        roughness: 0.018,
        metalness: 0,
        transmission: 1,
        ior: 1.5,
        thickness: 0.78 * glassIntensity,
        attenuationColor: absorptionB,
        attenuationDistance: 1.45,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        envMapIntensity: 1.8,
        reflectivity: 0.84,
        transparent: false,
        opacity: 1,
      })
    );
    group.add(shell);
  }

  if (!hideRings && setup.ringRadius > 0) {
    const ringTube = setup.ringTube || 0.07;
    let ringRadius = setup.ringRadius;
    if (setup.shape === "cube") {
      const halfDiag = Math.hypot((setup.sizeX || 1) * 0.5, (setup.sizeZ || 1) * 0.5);
      ringRadius = Math.max(ringRadius, halfDiag + ringTube + 0.08);
    }
    const ring = cast(
      new THREE.Mesh(
        new THREE.TorusGeometry(ringRadius, ringTube, 10, 28),
        ringMat
      )
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = setup.ringY || 0;
    group.add(ring);
    spinNode = ring;
  }

  if ((setup.coreRadius || 0) > 0) {
    const core = cast(new THREE.Mesh(new THREE.SphereGeometry(setup.coreRadius, 20, 20), accentMat));
    core.position.y = setup.coreY || 0;
    group.add(core);
  }

  if (setup.shape === "sphere") {
    const glowRadius = setup.radius || 0.6;
    const glow = new THREE.Mesh(new THREE.SphereGeometry(glowRadius, 22, 22), glowCoreMat);
    glow.position.y = (setup.coreY || 0) + 0.02;
    glow.scale.y = 0.88;
    glow.renderOrder = 3;
    group.add(glow);
  }

  group.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(group);
  return {
    group,
    spinNode,
    minY: bounds.min.y,
    maxY: bounds.max.y,
  };
}

function createTowerMesh(towerTypeId, bodyColor, coreColor) {
  const spawnerEnemyTypeId = enemyTypeFromSpawnerTowerId(towerTypeId);
  if (spawnerEnemyTypeId) return createSpawnerTowerMesh(spawnerEnemyTypeId, bodyColor, coreColor);

  const group = new THREE.Group();
  const bodyBase = new THREE.Color(bodyColor);
  const coreBase = new THREE.Color(coreColor);

  const bodyMat = new THREE.MeshStandardMaterial({
    color: bodyBase,
    emissive: bodyBase.clone().multiplyScalar(0.35),
    emissiveIntensity: 1.1,
    roughness: 0.3,
    metalness: 0.68,
  });
  const coreMat = new THREE.MeshStandardMaterial({
    color: coreBase,
    emissive: coreBase.clone().multiplyScalar(0.42),
    emissiveIntensity: 1,
    roughness: 0.35,
    metalness: 0.62,
  });
  const darkMat = new THREE.MeshStandardMaterial({
    color: "#1a2836",
    emissive: "#0d1621",
    emissiveIntensity: 0.48,
    roughness: 0.54,
    metalness: 0.58,
  });
  const glowMat = new THREE.MeshStandardMaterial({
    color: bodyBase.clone().lerp(new THREE.Color("#ffffff"), 0.25),
    emissive: bodyBase.clone().multiplyScalar(0.5),
    emissiveIntensity: 1.4,
    roughness: 0.18,
    metalness: 0.78,
  });
  const beaconMat = new THREE.MeshBasicMaterial({
    color: bodyBase.clone().lerp(new THREE.Color("#ffffff"), 0.4),
  });

  let turret = null;
  let muzzle = null;
  let spinNode = null;

  function cast(mesh) {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  const base = cast(new THREE.Mesh(new THREE.CylinderGeometry(1.26, 1.45, 0.42, 26), darkMat));
  base.position.y = 0.21;
  group.add(base);

  const lowerCore = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.86, 0.98, 1.15, 24), bodyMat));
  lowerCore.position.y = 0.95;
  group.add(lowerCore);

  const neck = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.62, 0.3, 20), coreMat));
  neck.position.y = 1.67;
  group.add(neck);

  for (let i = 0; i < 4; i += 1) {
    const angle = (i / 4) * Math.PI * 2;
    const strut = cast(new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.6, 0.34), darkMat));
    strut.position.set(Math.cos(angle) * 0.95, 0.72, Math.sin(angle) * 0.95);
    strut.rotation.y = angle;
    group.add(strut);
  }

  const ring = cast(new THREE.Mesh(new THREE.TorusGeometry(0.96, 0.06, 10, 32), glowMat));
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 1.46;
  group.add(ring);

  turret = new THREE.Group();
  group.add(turret);

  if (towerTypeId === "lance" || towerTypeId === "ion" || towerTypeId === "quarry" || towerTypeId === "sentinel" || towerTypeId === "citadel") {
    turret.position.y = 1.9;

    const head = cast(new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.82, 0.78), bodyMat));
    head.position.y = 0.34;
    turret.add(head);

    const barrel = cast(new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.24, 2.4), coreMat));
    barrel.position.set(0, 0.42, 1.34);
    turret.add(barrel);

    const railL = cast(new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 2.28), darkMat));
    railL.position.set(-0.18, 0.58, 1.34);
    turret.add(railL);
    const railR = cast(new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 2.28), darkMat));
    railR.position.set(0.18, 0.58, 1.34);
    turret.add(railR);

    const tail = cast(new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.4, 0.3), darkMat));
    tail.position.set(0, 0.3, -0.44);
    turret.add(tail);

    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), beaconMat);
    beacon.position.set(0, 0.88, 0.2);
    turret.add(beacon);

    if (towerTypeId === "ion") {
      for (let i = 0; i < 3; i += 1) {
        const angle = (i / 3) * Math.PI * 2;
        const fin = cast(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.74, 0.34), glowMat));
        fin.position.set(Math.cos(angle) * 0.44, 0.56, Math.sin(angle) * 0.44 - 0.06);
        fin.rotation.y = angle;
        turret.add(fin);
      }
      const halo = cast(new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.05, 10, 28), glowMat));
      halo.rotation.y = Math.PI / 2;
      halo.position.set(0, 0.44, 0.72);
      turret.add(halo);

      const capacitorL = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.76, 10), coreMat));
      capacitorL.rotation.z = Math.PI / 2;
      capacitorL.position.set(-0.44, 0.66, 0.28);
      turret.add(capacitorL);
      const capacitorR = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.76, 10), coreMat));
      capacitorR.rotation.z = Math.PI / 2;
      capacitorR.position.set(0.44, 0.66, 0.28);
      turret.add(capacitorR);

      const focusLens = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.16, 0.28, 12), glowMat));
      focusLens.rotation.x = Math.PI / 2;
      focusLens.position.set(0, 0.44, 2.28);
      turret.add(focusLens);
    } else if (towerTypeId === "quarry") {
      head.scale.set(1.16, 1.14, 1.08);
      const ramHead = cast(new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.46, 0.52), darkMat));
      ramHead.position.set(0, 0.4, 2.05);
      turret.add(ramHead);

      const braceL = cast(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.26, 1.72), darkMat));
      braceL.position.set(-0.34, 0.14, 0.94);
      turret.add(braceL);
      const braceR = cast(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.26, 1.72), darkMat));
      braceR.position.set(0.34, 0.14, 0.94);
      turret.add(braceR);

      const armorL = cast(new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.52, 1.28), darkMat));
      armorL.position.set(-0.48, 0.38, 1.08);
      turret.add(armorL);
      const armorR = cast(new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.52, 1.28), darkMat));
      armorR.position.set(0.48, 0.38, 1.08);
      turret.add(armorR);

      const recoilBlock = cast(new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.34, 0.36), coreMat));
      recoilBlock.position.set(0, 0.42, -0.24);
      turret.add(recoilBlock);
    } else if (towerTypeId === "sentinel") {
      head.scale.set(0.98, 0.9, 1.1);

      const longBarrel = cast(new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 3.12), coreMat));
      longBarrel.position.set(0, 0.44, 1.74);
      turret.add(longBarrel);

      const sleeve = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.17, 0.64, 10), darkMat));
      sleeve.rotation.x = Math.PI / 2;
      sleeve.position.set(0, 0.44, 2.64);
      turret.add(sleeve);

      const stabilizerL = cast(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.32, 1.28), darkMat));
      stabilizerL.position.set(-0.36, 0.24, 1.06);
      turret.add(stabilizerL);
      const stabilizerR = cast(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.32, 1.28), darkMat));
      stabilizerR.position.set(0.36, 0.24, 1.06);
      turret.add(stabilizerR);

      const scope = cast(new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.04, 8, 20), glowMat));
      scope.rotation.y = Math.PI / 2;
      scope.position.set(0, 0.72, 1.16);
      turret.add(scope);
    } else if (towerTypeId === "citadel") {
      head.scale.set(1.26, 1.14, 1.22);

      const siegeBarrel = cast(new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.3, 3.56), coreMat));
      siegeBarrel.position.set(0, 0.44, 1.96);
      turret.add(siegeBarrel);

      const barrelSleeve = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.24, 0.92, 12), darkMat));
      barrelSleeve.rotation.x = Math.PI / 2;
      barrelSleeve.position.set(0, 0.44, 2.84);
      turret.add(barrelSleeve);

      const recoilBox = cast(new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.54, 0.66), darkMat));
      recoilBox.position.set(0, 0.44, 0.58);
      turret.add(recoilBox);

      const sideArmorL = cast(new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.5, 2.16), darkMat));
      sideArmorL.position.set(-0.46, 0.3, 1.52);
      turret.add(sideArmorL);
      const sideArmorR = cast(new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.5, 2.16), darkMat));
      sideArmorR.position.set(0.46, 0.3, 1.52);
      turret.add(sideArmorR);

      const dorsalPlate = cast(new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.16, 1.16), bodyMat));
      dorsalPlate.position.set(0, 0.84, 0.82);
      turret.add(dorsalPlate);

      const rearMass = cast(new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.44, 0.44), darkMat));
      rearMass.position.set(0, 0.34, -0.5);
      turret.add(rearMass);
    }

    muzzle = new THREE.Object3D();
    muzzle.position.set(0, 0.42, 2.6);
    if (towerTypeId === "ion") muzzle.position.set(0, 0.44, 2.74);
    if (towerTypeId === "quarry") muzzle.position.set(0, 0.4, 2.9);
    if (towerTypeId === "sentinel") muzzle.position.set(0, 0.44, 3.34);
    if (towerTypeId === "citadel") muzzle.position.set(0, 0.44, 3.78);
    turret.add(muzzle);
  } else if (towerTypeId === "swarm" || towerTypeId === "volt" || towerTypeId === "frost" || towerTypeId === "nova" || towerTypeId === "photon") {
    turret.position.y = 1.78;

    const hub = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.45, 0.62, 20), coreMat));
    hub.position.y = 0.22;
    turret.add(hub);

    spinNode = new THREE.Group();
    spinNode.position.y = 0.28;
    for (let i = 0; i < 3; i += 1) {
      const a = (i / 3) * Math.PI * 2;
      const arm = cast(new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.96), darkMat));
      arm.rotation.y = a;
      arm.position.set(Math.cos(a) * 0.28, 0, Math.sin(a) * 0.28);
      spinNode.add(arm);

      const orb = cast(new THREE.Mesh(new THREE.SphereGeometry(0.17, 10, 10), bodyMat));
      orb.position.set(Math.cos(a) * 0.76, 0, Math.sin(a) * 0.76);
      spinNode.add(orb);
    }
    turret.add(spinNode);

    const centerBarrel = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 1.24, 12), coreMat));
    centerBarrel.rotation.x = Math.PI / 2;
    centerBarrel.position.set(0, 0.22, 0.8);
    turret.add(centerBarrel);

    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), beaconMat);
    beacon.position.set(0, 0.56, 0.2);
    turret.add(beacon);

    if (towerTypeId === "volt") {
      const arcRing = cast(new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.05, 10, 30), glowMat));
      arcRing.rotation.x = Math.PI / 2;
      arcRing.position.set(0, 0.36, 0.86);
      turret.add(arcRing);

      for (let i = -1; i <= 1; i += 1) {
        const prong = cast(new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.24, 0.56), coreMat));
        prong.position.set(i * 0.17, 0.24, 1.3);
        prong.rotation.x = -0.18;
        turret.add(prong);
      }

      const forkL = cast(new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.44, 0.18), coreMat));
      forkL.position.set(-0.26, 0.44, 1.45);
      turret.add(forkL);
      const forkR = cast(new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.44, 0.18), coreMat));
      forkR.position.set(0.26, 0.44, 1.45);
      turret.add(forkR);

      const rearCell = cast(new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), glowMat));
      rearCell.position.set(0, 0.22, -0.42);
      turret.add(rearCell);
    } else if (towerTypeId === "frost") {
      for (let i = 0; i < 6; i += 1) {
        const angle = (i / 6) * Math.PI * 2;
        const crystal = cast(new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.34, 4), glowMat));
        crystal.position.set(Math.cos(angle) * 0.52, 0.38, Math.sin(angle) * 0.52);
        crystal.rotation.y = angle;
        crystal.rotation.z = Math.PI;
        turret.add(crystal);
      }
      const coolant = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.46, 12), darkMat));
      coolant.position.set(0, -0.02, -0.34);
      turret.add(coolant);

      const chillRing = cast(new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.04, 10, 28), glowMat));
      chillRing.rotation.x = Math.PI / 2;
      chillRing.position.set(0, 0.16, 0.66);
      turret.add(chillRing);

      const cryoL = cast(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.18, 0.62), coreMat));
      cryoL.position.set(-0.26, 0.08, 0.64);
      turret.add(cryoL);
      const cryoR = cast(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.18, 0.62), coreMat));
      cryoR.position.set(0.26, 0.08, 0.64);
      turret.add(cryoR);
    } else if (towerTypeId === "nova") {
      const surgeRingA = cast(new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.05, 10, 30), glowMat));
      surgeRingA.rotation.x = Math.PI / 2;
      surgeRingA.position.set(0, 0.28, 0.58);
      turret.add(surgeRingA);

      const surgeRingB = cast(new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.04, 10, 26), coreMat));
      surgeRingB.rotation.x = Math.PI / 2;
      surgeRingB.position.set(0, 0.18, 1.02);
      turret.add(surgeRingB);

      for (let i = 0; i < 4; i += 1) {
        const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const fin = cast(new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.26, 0.46), darkMat));
        fin.position.set(Math.cos(angle) * 0.38, 0.22, Math.sin(angle) * 0.38);
        fin.rotation.y = angle;
        turret.add(fin);
      }

      const coreOrb = cast(new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), glowMat));
      coreOrb.position.set(0, 0.24, -0.22);
      turret.add(coreOrb);
    } else if (towerTypeId === "photon") {
      const photonRing = cast(new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.05, 10, 30), glowMat));
      photonRing.rotation.x = Math.PI / 2;
      photonRing.position.set(0, 0.3, 0.9);
      turret.add(photonRing);

      const lens = cast(new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), coreMat));
      lens.position.set(0, 0.24, 1.34);
      turret.add(lens);

      const beamL = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 1.48, 10), coreMat));
      beamL.rotation.x = Math.PI / 2;
      beamL.position.set(-0.16, 0.24, 1.26);
      turret.add(beamL);
      const beamR = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 1.48, 10), coreMat));
      beamR.rotation.x = Math.PI / 2;
      beamR.position.set(0.16, 0.24, 1.26);
      turret.add(beamR);

      for (let i = 0; i < 4; i += 1) {
        const angle = (i / 4) * Math.PI * 2;
        const fin = cast(new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 0.58), darkMat));
        fin.position.set(Math.cos(angle) * 0.42, 0.2, Math.sin(angle) * 0.42 + 0.26);
        fin.rotation.y = angle;
        turret.add(fin);
      }

      const rearNode = cast(new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), glowMat));
      rearNode.position.set(0, 0.2, -0.38);
      turret.add(rearNode);
    }

    muzzle = new THREE.Object3D();
    muzzle.position.set(0, 0.22, 1.5);
    if (towerTypeId === "volt") muzzle.position.set(0, 0.24, 1.7);
    if (towerTypeId === "frost") muzzle.position.set(0, 0.24, 1.56);
    if (towerTypeId === "nova") muzzle.position.set(0, 0.22, 1.78);
    if (towerTypeId === "photon") muzzle.position.set(0, 0.24, 1.98);
    turret.add(muzzle);
  } else if (towerTypeId === "ember" || towerTypeId === "rift" || towerTypeId === "bastion") {
    turret.position.y = 1.78;

    const furnace = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.64, 0.82, 20), bodyMat));
    furnace.position.y = 0.24;
    turret.add(furnace);

    const nozzle = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.18, 1.24, 12), coreMat));
    nozzle.rotation.x = Math.PI / 2;
    nozzle.position.set(0, 0.24, 0.9);
    turret.add(nozzle);

    const sideTankL = cast(new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 10), darkMat));
    sideTankL.position.set(-0.48, 0.18, -0.06);
    turret.add(sideTankL);
    const sideTankR = cast(new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 10), darkMat));
    sideTankR.position.set(0.48, 0.18, -0.06);
    turret.add(sideTankR);

    const chimney = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.42, 10), darkMat));
    chimney.position.set(0, 0.72, -0.08);
    turret.add(chimney);

    const flameCore = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), beaconMat);
    flameCore.position.set(0, 0.48, 0.14);
    turret.add(flameCore);

    if (towerTypeId === "rift") {
      const portalRing = cast(new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.06, 10, 28), glowMat));
      portalRing.position.set(0, 0.24, 1.18);
      portalRing.rotation.y = Math.PI / 2;
      turret.add(portalRing);

      const vaneL = cast(new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.78), darkMat));
      vaneL.position.set(-0.24, 0.24, 1.02);
      turret.add(vaneL);
      const vaneR = cast(new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.78), darkMat));
      vaneR.position.set(0.24, 0.24, 1.02);
      turret.add(vaneR);

      const splitNozzleL = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 1, 10), coreMat));
      splitNozzleL.rotation.x = Math.PI / 2;
      splitNozzleL.position.set(-0.18, 0.24, 1.18);
      turret.add(splitNozzleL);
      const splitNozzleR = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 1, 10), coreMat));
      splitNozzleR.rotation.x = Math.PI / 2;
      splitNozzleR.position.set(0.18, 0.24, 1.18);
      turret.add(splitNozzleR);
    } else if (towerTypeId === "bastion") {
      const armorShell = cast(new THREE.Mesh(new THREE.BoxGeometry(1.12, 0.58, 0.86), darkMat));
      armorShell.position.set(0, 0.22, 0.06);
      turret.add(armorShell);

      const heavyBarrelL = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 1.36, 10), coreMat));
      heavyBarrelL.rotation.x = Math.PI / 2;
      heavyBarrelL.position.set(-0.2, 0.26, 1.05);
      turret.add(heavyBarrelL);
      const heavyBarrelR = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 1.36, 10), coreMat));
      heavyBarrelR.rotation.x = Math.PI / 2;
      heavyBarrelR.position.set(0.2, 0.26, 1.05);
      turret.add(heavyBarrelR);

      const topArmor = cast(new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.18, 0.72), coreMat));
      topArmor.position.set(0, 0.62, 0.06);
      turret.add(topArmor);

      const shieldL = cast(new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.52, 0.96), darkMat));
      shieldL.position.set(-0.44, 0.24, 0.28);
      turret.add(shieldL);
      const shieldR = cast(new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.52, 0.96), darkMat));
      shieldR.position.set(0.44, 0.24, 0.28);
      turret.add(shieldR);
    }

    muzzle = new THREE.Object3D();
    muzzle.position.set(0, 0.24, 1.64);
    if (towerTypeId === "rift") muzzle.position.set(0, 0.24, 1.88);
    if (towerTypeId === "bastion") muzzle.position.set(0, 0.26, 1.9);
    turret.add(muzzle);
  } else {
    turret.position.y = 1.8;

    const core = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.46, 0.64, 16), coreMat));
    core.position.y = 0.18;
    turret.add(core);

    const nozzle = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 1.08, 12), bodyMat));
    nozzle.rotation.x = Math.PI / 2;
    nozzle.position.set(0, 0.18, 0.74);
    turret.add(nozzle);

    const coilA = cast(new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.05, 10, 22), glowMat));
    coilA.rotation.x = Math.PI / 2;
    coilA.position.set(0, 0.18, 0.08);
    turret.add(coilA);
    const coilB = cast(new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.05, 10, 22), glowMat));
    coilB.rotation.x = Math.PI / 2;
    coilB.position.set(0, 0.18, 0.5);
    turret.add(coilB);

    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), beaconMat);
    beacon.position.set(0, 0.52, 0.16);
    turret.add(beacon);

    muzzle = new THREE.Object3D();
    muzzle.position.set(0, 0.18, 1.38);
    turret.add(muzzle);
  }

  const mastLight = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, 0.34, 10), glowMat);
  mastLight.position.y = 2.08;
  group.add(mastLight);

  return { group, turret, muzzle, spinNode };
}

function createSpawnerTowerMesh(enemyTypeId, bodyColor, coreColor) {
  const group = new THREE.Group();
  const bodyBase = new THREE.Color(bodyColor);
  const coreBase = new THREE.Color(coreColor);

  const platformMat = new THREE.MeshStandardMaterial({
    color: bodyBase.clone().lerp(new THREE.Color("#0f1f2d"), 0.4),
    emissive: bodyBase.clone().multiplyScalar(0.25),
    emissiveIntensity: 0.75,
    roughness: 0.36,
    metalness: 0.52,
  });
  const topPlateMat = new THREE.MeshStandardMaterial({
    color: bodyBase.clone().lerp(new THREE.Color("#ffffff"), 0.12),
    emissive: bodyBase.clone().multiplyScalar(0.28),
    emissiveIntensity: 0.88,
    roughness: 0.24,
    metalness: 0.6,
  });
  const symbolMat = new THREE.MeshPhysicalMaterial({
    color: coreBase.clone().lerp(new THREE.Color("#ffffff"), 0.16),
    emissive: bodyBase.clone().multiplyScalar(0.4),
    emissiveIntensity: 0.92,
    roughness: 0.16,
    metalness: 0.22,
    transmission: 0.64,
    ior: 1.4,
    thickness: 0.34,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    envMapIntensity: 1.18,
  });
  const rimMat = new THREE.MeshStandardMaterial({
    color: coreBase.clone().lerp(new THREE.Color("#ffffff"), 0.18),
    emissive: coreBase.clone().multiplyScalar(0.34),
    emissiveIntensity: 0.86,
    roughness: 0.22,
    metalness: 0.62,
  });

  const cast = (mesh) => {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  };

  const base = cast(new THREE.Mesh(new THREE.CylinderGeometry(1.52, 1.64, 0.28, 36), platformMat));
  base.position.y = 0.14;
  group.add(base);

  const topPlate = cast(new THREE.Mesh(new THREE.CylinderGeometry(1.26, 1.34, 0.12, 36), topPlateMat));
  topPlate.position.y = 0.34;
  group.add(topPlate);

  const rim = cast(new THREE.Mesh(new THREE.TorusGeometry(1.04, 0.07, 14, 42), rimMat));
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.42;
  group.add(rim);

  let symbolGeometry = null;
  let symbolY = 0.67;
  if (enemyTypeId === "blink" || enemyTypeId === "skitter" || enemyTypeId === "minion" || enemyTypeId === "raider") {
    symbolGeometry = new THREE.TetrahedronGeometry(0.54);
    symbolY = 0.73;
  } else if (enemyTypeId === "bulwark" || enemyTypeId === "warden" || enemyTypeId === "monolith") {
    symbolGeometry = new THREE.BoxGeometry(0.74, 0.74, 0.74);
  } else if (enemyTypeId === "specter" || enemyTypeId === "colossus") {
    symbolGeometry = new THREE.CylinderGeometry(0.48, 0.48, 0.7, 6);
  } else if (enemyTypeId === "icosahedron") {
    symbolGeometry = new THREE.IcosahedronGeometry(0.56, 0);
  } else if (enemyTypeId === "star") {
    const starShape = new THREE.Shape();
    const outer = 0.58;
    const inner = 0.26;
    const points = 10;
    for (let i = 0; i < points; i += 1) {
      const angle = (i / points) * Math.PI * 2 - Math.PI / 2;
      const radius = i % 2 === 0 ? outer : inner;
      const px = Math.cos(angle) * radius;
      const py = Math.sin(angle) * radius;
      if (i === 0) starShape.moveTo(px, py);
      else starShape.lineTo(px, py);
    }
    starShape.closePath();
    symbolGeometry = new THREE.ExtrudeGeometry(starShape, {
      depth: 0.2,
      steps: 1,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 2,
      curveSegments: 18,
    });
    symbolGeometry.center();
    symbolY = 0.7;
  } else if (enemyTypeId === "rhombus" || enemyTypeId === "rhombusMinus") {
    symbolGeometry = new THREE.OctahedronGeometry(0.58, 0);
  } else {
    symbolGeometry = new THREE.SphereGeometry(0.5, 20, 20);
  }

  const symbolPivot = new THREE.Group();
  symbolPivot.position.y = symbolY;
  group.add(symbolPivot);

  const symbol = cast(new THREE.Mesh(symbolGeometry, symbolMat));
  if (enemyTypeId === "blink" || enemyTypeId === "skitter" || enemyTypeId === "minion" || enemyTypeId === "raider") {
    symbol.rotation.y = Math.PI / 3;
  } else if (enemyTypeId === "rhombus" || enemyTypeId === "rhombusMinus") {
    symbol.rotation.y = Math.PI / 4;
  } else if (enemyTypeId === "icosahedron") {
    symbol.rotation.y = Math.PI / 10;
  } else if (enemyTypeId === "star") {
    symbol.rotation.x = Math.PI / 2;
    symbol.rotation.z = Math.PI / 10;
  }
  symbolPivot.add(symbol);

  const symbolGlow = new THREE.Mesh(
    new THREE.CircleGeometry(0.52, 24),
    new THREE.MeshBasicMaterial({
      color: coreBase.clone().lerp(new THREE.Color("#ffffff"), 0.2),
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
    })
  );
  symbolGlow.rotation.x = -Math.PI / 2;
  symbolGlow.position.y = 0.45;
  symbolGlow.renderOrder = 2;
  group.add(symbolGlow);

  return { group, turret: symbolPivot, muzzle: null, spinNode: symbolPivot };
}

function getEnemySpinSpeed(typeId) {
  if (typeId === "icosahedron") return 1.25;
  if (typeId === "star") return 0.48;
  if (typeId === "rhombus") return 1.05;
  if (typeId === "rhombusMinus") return 1.22;
  if (typeId === "monolith") return 1.18;
  if (typeId === "prism") return 1.88;
  if (typeId === "colossus" || typeId === "leviathan") return 1.55;
  if (typeId === "warden") return 2.1;
  return 2.8;
}

class Enemy {
  constructor(stats) {
    this.pathIndex = 0;
    this.x = pathPoints[0].x;
    this.z = pathPoints[0].z;
    this.typeId = stats.typeId;
    this.name = stats.name;
    this.speed = stats.speed;
    this.hp = stats.hp;
    this.maxHp = stats.hp;
    this.reward = stats.reward;
    this.radius = stats.radius;
    this.coreDamage = stats.coreDamage;
    this.hoverHeight = stats.hoverHeight;
    this.colorA = stats.colorA;
    this.colorB = stats.colorB;
    this.reachedEnd = false;
    this.alive = true;
    this.shattered = false;
    this.progressScore = 0;
    this.animSeed = Math.random() * Math.PI * 2;
    this.headingX = 1;
    this.headingZ = 0;

    const enemyVisual = createEnemyMesh(stats.typeId, stats.colorA, stats.colorB);
    this.mesh = enemyVisual.group;
    this.spinNode = enemyVisual.spinNode;
    this.visualMinY = Number.isFinite(enemyVisual.minY) ? enemyVisual.minY : -this.radius;
    this.visualMaxY = Number.isFinite(enemyVisual.maxY) ? enemyVisual.maxY : this.radius;
    this.bobAmplitude = 0.1;
    this.surfaceClearance = 0.05;
    this.baseYOffset = -this.visualMinY + this.surfaceClearance + this.bobAmplitude;
    this.aimOffsetY = Math.max(0.1, (this.visualMaxY - this.visualMinY) * 0.28);
    this.currentY = getLaneSurfaceY(this.x, this.z) + this.baseYOffset;
    this.rollRadius = Math.max(0.22, (this.visualMaxY - this.visualMinY) * 0.5);
    this.rollAxis = new THREE.Vector3(1, 0, 0);
    this.rollQuat = new THREE.Quaternion();
    this.healthBarRoot = null;
    this.healthBarBack = null;
    this.healthBarFill = null;
    this.healthBarWidth = 0;
    this.healthBarYOffset = 0;
    this.healthBarVisibleUntil = -1;

    this.mesh.position.set(this.x, this.currentY, this.z);
    scene.add(this.mesh);
    this.createHealthBar();
  }

  update(dt) {
    if (!this.alive) {
      this.updateHealthBar();
      return;
    }
    const prevX = this.x;
    const prevZ = this.z;
    let remaining = this.speed * dt;

    while (remaining > 0 && this.pathIndex < pathPoints.length - 1) {
      const to = pathPoints[this.pathIndex + 1];
      const dx = to.x - this.x;
      const dz = to.z - this.z;
      const dist = Math.hypot(dx, dz);

      if (dist < 0.0001) {
        this.pathIndex += 1;
        continue;
      }

      this.headingX = dx / dist;
      this.headingZ = dz / dist;

      if (remaining >= dist) {
        this.x = to.x;
        this.z = to.z;
        remaining -= dist;
        this.pathIndex += 1;
      } else {
        this.x += this.headingX * remaining;
        this.z += this.headingZ * remaining;
        remaining = 0;
      }
    }

    if (this.pathIndex >= pathSegments.length) {
      this.progressScore = totalPathLength;
    } else {
      const segment = pathSegments[this.pathIndex];
      const partial = Math.hypot(this.x - segment.a.x, this.z - segment.a.z);
      this.progressScore = segment.start + Math.min(partial, segment.length);
    }

    if (this.pathIndex >= pathPoints.length - 1) {
      this.alive = false;
      this.reachedEnd = true;
      this.updateHealthBar();
      return;
    }

    const bob = Math.sin(game.time * 4 + this.animSeed) * this.bobAmplitude;
    this.currentY = getLaneSurfaceY(this.x, this.z) + this.baseYOffset + bob;
    this.mesh.position.set(this.x, this.currentY, this.z);
    const movedX = this.x - prevX;
    const movedZ = this.z - prevZ;
    const movedDistance = Math.hypot(movedX, movedZ);
    if (movedDistance > 1e-5) {
      const invMove = 1 / movedDistance;
      this.rollAxis.set(movedZ * invMove, 0, -movedX * invMove);
      this.rollQuat.setFromAxisAngle(this.rollAxis, movedDistance / this.rollRadius);
      this.mesh.quaternion.premultiply(this.rollQuat);
      this.mesh.quaternion.normalize();
    }

    if (this.spinNode) {
      this.spinNode.rotation.y += dt * getEnemySpinSpeed(this.typeId);
    }

    this.updateHealthBar();
  }

  getAimPoint(out = new THREE.Vector3()) {
    out.set(this.x, this.currentY + this.aimOffsetY, this.z);
    return out;
  }

  createHealthBar() {
    this.healthBarWidth = Math.max(1.15, this.radius * 1.95);
    const healthBarHeight = Math.max(0.13, this.radius * 0.22);
    this.healthBarYOffset = this.visualMaxY + 0.44;

    this.healthBarRoot = new THREE.Group();
    this.healthBarRoot.visible = false;

    this.healthBarBack = new THREE.Mesh(
      new THREE.PlaneGeometry(this.healthBarWidth + 0.22, healthBarHeight + 0.1),
      new THREE.MeshBasicMaterial({
        color: "#09121d",
        transparent: true,
        opacity: 0.72,
        depthWrite: false,
        depthTest: false,
      })
    );
    this.healthBarBack.renderOrder = 80;
    this.healthBarRoot.add(this.healthBarBack);

    this.healthBarFill = new THREE.Mesh(
      new THREE.PlaneGeometry(this.healthBarWidth, healthBarHeight),
      new THREE.MeshBasicMaterial({
        color: "#66ff9e",
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        depthTest: false,
      })
    );
    this.healthBarFill.position.z = 0.01;
    this.healthBarFill.renderOrder = 81;
    this.healthBarRoot.add(this.healthBarFill);

    scene.add(this.healthBarRoot);
  }

  updateHealthBar() {
    if (!this.healthBarRoot || !this.healthBarFill) return;

    const shouldShow =
      this.alive && this.hp > 0 && this.hp < this.maxHp && game.time <= this.healthBarVisibleUntil;

    this.healthBarRoot.visible = shouldShow;
    if (!shouldShow) return;

    const hpRatio = THREE.MathUtils.clamp(this.hp / this.maxHp, 0, 1);
    this.healthBarFill.scale.x = Math.max(0.0001, hpRatio);
    this.healthBarFill.position.x = -this.healthBarWidth * (1 - hpRatio) * 0.5;
    this.healthBarFill.material.color.setHSL(0.02 + hpRatio * 0.31, 0.92, 0.57);

    this.healthBarRoot.position.set(this.x, this.currentY + this.healthBarYOffset, this.z);
    this.healthBarRoot.quaternion.copy(camera.quaternion);
  }

  applyDamage(amount) {
    if (!this.alive || amount <= 0) return false;
    this.hp = Math.max(0, this.hp - amount);
    this.healthBarVisibleUntil = game.time + HEALTH_BAR_SHOW_TIME;
    this.updateHealthBar();
    return this.hp <= 0;
  }

  disposeHealthBar() {
    if (!this.healthBarRoot) return;
    scene.remove(this.healthBarRoot);

    if (this.healthBarBack) {
      this.healthBarBack.geometry.dispose();
      this.healthBarBack.material.dispose();
      this.healthBarBack = null;
    }
    if (this.healthBarFill) {
      this.healthBarFill.geometry.dispose();
      this.healthBarFill.material.dispose();
      this.healthBarFill = null;
    }
    this.healthBarRoot = null;
  }

  shatter() {
    if (this.shattered) return;
    this.shattered = true;
    audioSystem.playEnemyShatter(this.radius, this.typeId === "icosahedron" || this.typeId === "rhombus" || this.typeId === "star");

    const origin = this.mesh.position.clone();
    const colorA = new THREE.Color(this.colorA);
    const colorB = new THREE.Color(this.colorB);
    const pieceCount = Math.min(30, Math.max(12, Math.round(this.radius * 14)));

    for (let i = 0; i < pieceCount; i += 1) {
      const size = THREE.MathUtils.lerp(this.radius * 0.11, this.radius * 0.24, Math.random());
      let geometry = null;
      if (i % 3 === 0) geometry = new THREE.TetrahedronGeometry(size, 0);
      else if (i % 3 === 1) geometry = new THREE.BoxGeometry(size * 1.22, size * 0.72, size * 1.26);
      else geometry = new THREE.OctahedronGeometry(size * 0.82, 0);

      const tint = colorA.clone().lerp(colorB, Math.random() * 0.82);
      const material = new THREE.MeshPhysicalMaterial({
        color: tint.clone().lerp(new THREE.Color("#ffffff"), 0.18),
        emissive: tint.clone().multiplyScalar(0.34),
        emissiveIntensity: 0.92,
        roughness: 0.09,
        metalness: 0.08,
        transmission: 0.93,
        ior: 1.42,
        thickness: 0.36 + Math.random() * 0.66,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        envMapIntensity: 1.28,
        transparent: true,
        opacity: 0.96,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const launchDir = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 1.45 + 0.12,
        Math.random() * 2 - 1
      ).normalize();
      const speed = THREE.MathUtils.lerp(7.5, 17.5, Math.random()) * (0.76 + this.radius * 0.38);
      mesh.position
        .copy(origin)
        .addScaledVector(launchDir, size * 0.8)
        .add(new THREE.Vector3(0, 0.04, 0));
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      scene.add(mesh);

      game.debris.push(new EnemyDebrisPiece(mesh, launchDir.multiplyScalar(speed), size));
    }

    const burst = new THREE.Mesh(
      new THREE.SphereGeometry(this.radius * 0.9, 12, 12),
      new THREE.MeshBasicMaterial({
        color: colorA.clone().lerp(colorB, 0.5),
        transparent: true,
        opacity: 0.52,
        depthWrite: false,
      })
    );
    burst.position.copy(origin);
    scene.add(burst);
    game.debris.push(new EnemyDebrisPulse(burst, this.radius * 0.9));

    this.disposeHealthBar();
    scene.remove(this.mesh);
  }

  dispose() {
    this.disposeHealthBar();
    scene.remove(this.mesh);
  }
}

class EnemyDebrisPiece {
  constructor(mesh, velocity, size) {
    this.mesh = mesh;
    this.velocity = velocity;
    this.size = size;
    this.age = 0;
    this.life = 1.3 + Math.random() * 1.15;
    this.bounce = 0.28 + Math.random() * 0.24;
    this.angularVelocity = new THREE.Vector3(
      (Math.random() * 2 - 1) * 9.2,
      (Math.random() * 2 - 1) * 9.8,
      (Math.random() * 2 - 1) * 9.2
    );
  }

  update(dt) {
    this.age += dt;

    this.velocity.y += SHATTER_GRAVITY * dt;
    const airDrag = Math.exp(-SHATTER_AIR_DRAG * dt);
    this.velocity.multiplyScalar(airDrag);
    this.mesh.position.addScaledVector(this.velocity, dt);

    this.mesh.rotation.x += this.angularVelocity.x * dt;
    this.mesh.rotation.y += this.angularVelocity.y * dt;
    this.mesh.rotation.z += this.angularVelocity.z * dt;

    const floorY = getLaneSurfaceY(this.mesh.position.x, this.mesh.position.z);
    const floorOffset = this.size * 0.6;
    if (this.mesh.position.y - floorOffset <= floorY) {
      this.mesh.position.y = floorY + floorOffset;
      if (this.velocity.y < 0) this.velocity.y *= -this.bounce;

      const groundDrag = Math.exp(-SHATTER_GROUND_DRAG * dt);
      this.velocity.x *= groundDrag;
      this.velocity.z *= groundDrag;
      this.angularVelocity.multiplyScalar(0.9);

      if (Math.abs(this.velocity.y) < 0.95) this.velocity.y = 0;
    }

    const lifeT = Math.min(this.age / this.life, 1);
    const fade = lifeT < 0.72 ? 1 : Math.max(0, 1 - (lifeT - 0.72) / 0.28);
    this.mesh.material.opacity = 0.96 * fade;
    const shrink = 1 - lifeT * 0.28;
    this.mesh.scale.setScalar(Math.max(0.02, shrink));

    return this.age < this.life;
  }

  dispose() {
    scene.remove(this.mesh);
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}

class EnemyDebrisPulse {
  constructor(mesh, baseRadius) {
    this.mesh = mesh;
    this.baseRadius = baseRadius;
    this.age = 0;
    this.life = 0.26;
  }

  update(dt) {
    this.age += dt;
    const t = Math.min(this.age / this.life, 1);
    const scale = 1 + t * 1.9;
    this.mesh.scale.set(scale, scale, scale);
    this.mesh.material.opacity = (1 - t) * 0.52;
    return this.age < this.life;
  }

  dispose() {
    scene.remove(this.mesh);
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}

class AllyMinion {
  constructor(stats) {
    this.typeId = stats.typeId;
    this.name = `${stats.name} Ally`;
    this.speed = stats.speed;
    this.hp = stats.hp;
    this.maxHp = stats.hp;
    this.radius = stats.radius;
    this.hoverHeight = stats.hoverHeight;
    this.alive = true;
    this.shattered = false;
    this.reachedStart = false;
    this.animSeed = Math.random() * Math.PI * 2;
    this.headingX = -1;
    this.headingZ = 0;
    this.pathIndex = Math.max(0, pathPoints.length - 1);

    const spawnPoint = pathPoints[this.pathIndex] || new THREE.Vector3(0, 0, 0);
    this.x = spawnPoint.x;
    this.z = spawnPoint.z;

    const allyVisual = createEnemyMesh(this.typeId, ALLY_COLOR_A, ALLY_COLOR_B, { hideRings: true });
    this.mesh = allyVisual.group;
    this.spinNode = allyVisual.spinNode;
    this.visualMinY = Number.isFinite(allyVisual.minY) ? allyVisual.minY : -this.radius;
    this.visualMaxY = Number.isFinite(allyVisual.maxY) ? allyVisual.maxY : this.radius;
    this.bobAmplitude = 0.08;
    this.surfaceClearance = 0.05;
    this.baseYOffset = -this.visualMinY + this.surfaceClearance + this.bobAmplitude;
    this.currentY = getLaneSurfaceY(this.x, this.z) + this.baseYOffset;
    this.rollRadius = Math.max(0.22, (this.visualMaxY - this.visualMinY) * 0.5);
    this.rollAxis = new THREE.Vector3(1, 0, 0);
    this.rollQuat = new THREE.Quaternion();

    this.mesh.position.set(this.x, this.currentY, this.z);
    scene.add(this.mesh);
  }

  update(dt) {
    if (!this.alive) return;
    if (pathPoints.length < 2) {
      this.alive = false;
      return;
    }

    const prevX = this.x;
    const prevZ = this.z;
    let remaining = this.speed * dt;

    while (remaining > 0 && this.pathIndex > 0) {
      const to = pathPoints[this.pathIndex - 1];
      const dx = to.x - this.x;
      const dz = to.z - this.z;
      const dist = Math.hypot(dx, dz);

      if (dist < 0.0001) {
        this.pathIndex -= 1;
        continue;
      }

      this.headingX = dx / dist;
      this.headingZ = dz / dist;

      if (remaining >= dist) {
        this.x = to.x;
        this.z = to.z;
        remaining -= dist;
        this.pathIndex -= 1;
      } else {
        this.x += this.headingX * remaining;
        this.z += this.headingZ * remaining;
        remaining = 0;
      }
    }

    if (this.pathIndex <= 0) {
      this.alive = false;
      this.reachedStart = true;
      return;
    }

    const bob = Math.sin(game.time * 4 + this.animSeed) * this.bobAmplitude;
    this.currentY = getLaneSurfaceY(this.x, this.z) + this.baseYOffset + bob;
    this.mesh.position.set(this.x, this.currentY, this.z);
    const movedX = this.x - prevX;
    const movedZ = this.z - prevZ;
    const movedDistance = Math.hypot(movedX, movedZ);
    if (movedDistance > 1e-5) {
      const invMove = 1 / movedDistance;
      this.rollAxis.set(movedZ * invMove, 0, -movedX * invMove);
      this.rollQuat.setFromAxisAngle(this.rollAxis, movedDistance / this.rollRadius);
      this.mesh.quaternion.premultiply(this.rollQuat);
      this.mesh.quaternion.normalize();
    }

    if (this.spinNode) {
      this.spinNode.rotation.y += dt * getEnemySpinSpeed(this.typeId);
    }
  }

  applyDamage(amount) {
    if (!this.alive || amount <= 0) return false;
    this.hp = Math.max(0, this.hp - amount);
    if (this.hp <= 0) {
      this.alive = false;
      this.shatter();
      return true;
    }
    return false;
  }

  shatter() {
    if (this.shattered) return;
    this.shattered = true;

    const origin = this.mesh.position.clone();
    const color = new THREE.Color(ALLY_COLOR_A);
    const pieceCount = Math.min(16, Math.max(6, Math.round(this.radius * 8)));

    for (let i = 0; i < pieceCount; i += 1) {
      const size = THREE.MathUtils.lerp(this.radius * 0.08, this.radius * 0.18, Math.random());
      const geometry =
        i % 2 === 0
          ? new THREE.TetrahedronGeometry(size, 0)
          : new THREE.BoxGeometry(size * 1.14, size * 0.68, size * 1.18);
      const material = new THREE.MeshPhysicalMaterial({
        color: color.clone().lerp(new THREE.Color("#d8ffe8"), 0.1),
        emissive: color.clone().multiplyScalar(0.22),
        emissiveIntensity: 0.74,
        roughness: 0.08,
        metalness: 0.05,
        transmission: 0.9,
        ior: 1.42,
        thickness: 0.24 + Math.random() * 0.24,
        clearcoat: 0.96,
        clearcoatRoughness: 0.05,
        envMapIntensity: 1.1,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const launchDir = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 1.25 + 0.18,
        Math.random() * 2 - 1
      ).normalize();
      const speed = THREE.MathUtils.lerp(5.2, 11.8, Math.random()) * (0.74 + this.radius * 0.26);
      mesh.position.copy(origin).addScaledVector(launchDir, size * 0.65).add(new THREE.Vector3(0, 0.03, 0));
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      scene.add(mesh);
      game.debris.push(new EnemyDebrisPiece(mesh, launchDir.multiplyScalar(speed), size));
    }

    scene.remove(this.mesh);
  }

  dispose() {
    scene.remove(this.mesh);
  }
}

class Tower {
  constructor(cellX, cellY, towerTypeId) {
    const config = getTowerType(towerTypeId);
    const world = cellToWorld(cellX, cellY);
    const baseY = getCellTopY(cellX, cellY);

    this.cellX = cellX;
    this.cellY = cellY;
    this.x = world.x;
    this.y = baseY;
    this.z = world.z;
    this.towerTypeId = towerTypeId;
    this.name = config.name;
    this.cost = config.cost;
    this.isSpawner = !!config.spawnerEnemyTypeId;
    this.spawnEnemyTypeId = config.spawnerEnemyTypeId || null;
    this.spawnInterval = config.spawnInterval || config.fireInterval;
    this.spawnCount = Math.max(1, Math.floor(config.spawnCount || 1));
    this.range = config.range;
    this.damage = config.damage;
    this.turnSpeed = config.turnSpeed ?? 5.2;
    this.cooldown = 0;
    this.fireInterval = config.fireInterval;
    this.projectileSpeed = config.projectileSpeed;
    this.projectileRadius = config.projectileRadius;
    this.projectileColor = config.projectileColor;

    const meshData = createTowerMesh(towerTypeId, config.bodyColor, config.coreColor);
    this.mesh = meshData.group;
    this.turret = meshData.turret;
    this.muzzle = meshData.muzzle;
    this.spinNode = meshData.spinNode;

    this.mesh.position.set(this.x, this.y + 0.02, this.z);
    scene.add(this.mesh);
  }

  update(dt) {
    if (this.spinNode) {
      this.spinNode.rotation.y += dt * 2.5;
    }

    if (this.isSpawner && this.turret) {
      this.turret.rotation.y += dt * 0.78;
    }

    if (this.cooldown > 0) this.cooldown -= dt;

    if (this.isSpawner) {
      if (!game.inWave) return;
      if (this.cooldown > 0) return;
      let spawnedCount = 0;
      for (let i = 0; i < this.spawnCount; i += 1) {
        if (!spawnAllyFromTower(this.spawnEnemyTypeId)) break;
        spawnedCount += 1;
      }
      this.cooldown = spawnedCount > 0 ? this.spawnInterval : Math.min(0.8, this.spawnInterval * 0.3);
      return;
    }

    let target = null;
    for (const enemy of game.enemies) {
      if (!enemy.alive) continue;
      const d = Math.hypot(enemy.x - this.x, enemy.z - this.z);
      if (d > this.range) continue;
      if (!target || enemy.progressScore > target.progressScore) {
        target = enemy;
      }
    }

    let aimError = 0;
    if (target && this.turret) {
      const dx = target.x - this.x;
      const dz = target.z - this.z;
      const desiredYaw = Math.atan2(dx, dz);
      const nextYaw = rotateYawTowards(this.turret.rotation.y, desiredYaw, this.turnSpeed * dt);
      this.turret.rotation.y = nextYaw;
      aimError = Math.abs(shortestAngleDelta(nextYaw, desiredYaw));
    }

    if (this.cooldown > 0) return;
    if (!target) return;
    if (this.turret && aimError > 0.22) return;

    const origin = new THREE.Vector3();
    if (this.muzzle) this.muzzle.getWorldPosition(origin);
    else origin.set(this.x, this.y + 1.1, this.z);

    this.cooldown = this.fireInterval;
    audioSystem.playTowerShot(this.damage);
    game.projectiles.push(
      new Projectile(
        origin,
        target,
        this.damage,
        this.projectileSpeed,
        this.projectileColor,
        this.projectileRadius
      )
    );
  }

  dispose() {
    scene.remove(this.mesh);
  }
}

class Projectile {
  constructor(origin, target, damage, speed, color, radius) {
    this.target = target;
    this.damage = damage;
    this.speed = speed;
    this.color = color;
    this.radius = radius;
    this.alive = true;
    this.position = origin.clone();
    this.renderPosition = origin.clone();
    this.prevRenderPosition = origin.clone();
    this.direction = new THREE.Vector3(0, 0, 1);
    this.targetPoint = new THREE.Vector3();
    this.toTarget = new THREE.Vector3();
    this.moveVec = new THREE.Vector3();
    this.desiredQuat = new THREE.Quaternion();

    this.group = new THREE.Group();
    this.group.position.copy(this.position);

    const streakMat = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 1.25,
      metalness: 0.05,
      roughness: 0.2,
      transparent: true,
      opacity: 0.68,
      depthWrite: false,
    });

    this.streak = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.35, radius * 0.95, radius * 7, 10, 1, true),
      streakMat
    );
    this.streak.rotation.x = Math.PI / 2;
    this.streak.position.z = -radius * 2.4;
    this.group.add(this.streak);

    this.core = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 10, 10),
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 1.3,
        metalness: 0.22,
        roughness: 0.24,
      })
    );
    this.group.add(this.core);

    const initialTarget = this.target.getAimPoint(this.targetPoint);
    this.toTarget.subVectors(initialTarget, this.position);
    if (this.toTarget.lengthSq() > 1e-6) this.direction.copy(this.toTarget).normalize();
    this.group.quaternion.setFromUnitVectors(PROJECTILE_FORWARD, this.direction);

    scene.add(this.group);
  }

  update(dt) {
    if (!this.alive) return;
    if (!this.target.alive) {
      this.alive = false;
      return;
    }

    const targetPoint = this.target.getAimPoint(this.targetPoint);
    this.toTarget.subVectors(targetPoint, this.position);
    const dist = this.toTarget.length();

    if (dist <= this.speed * dt || dist < this.target.radius + this.radius) {
      const killed = this.target.applyDamage(this.damage);
      if (killed) handleEnemyDefeated(this.target);
      this.alive = false;
      return;
    }

    if (dist > 1e-6) {
      this.toTarget.multiplyScalar(1 / dist);
      const steering = 1 - Math.exp(-18 * dt);
      this.direction.lerp(this.toTarget, steering).normalize();
    }
    this.position.addScaledVector(this.direction, this.speed * dt);

    const smoothing = 1 - Math.exp(-28 * dt);
    this.renderPosition.lerp(this.position, smoothing);

    this.moveVec.subVectors(this.renderPosition, this.prevRenderPosition);
    if (this.moveVec.lengthSq() > 1e-6) this.moveVec.normalize();
    else this.moveVec.copy(this.direction);

    this.group.position.copy(this.renderPosition);
    this.desiredQuat.setFromUnitVectors(PROJECTILE_FORWARD, this.moveVec);
    this.group.quaternion.slerp(this.desiredQuat, 1 - Math.exp(-34 * dt));
    this.prevRenderPosition.copy(this.renderPosition);

    const stretch = 1 + Math.min(this.speed * 0.03, 1.8);
    this.streak.scale.z = stretch;
  }

  dispose() {
    scene.remove(this.group);
  }
}

class NetworkProjectile {
  constructor(state) {
    this.alive = true;
    this.color = state?.color || "#9fd8ff";
    this.radius = Math.max(0.04, Number.isFinite(state?.radius) ? state.radius : 0.14);
    this.speed = Number.isFinite(state?.speed) ? state.speed : 12;
    this.renderPosition = new THREE.Vector3();
    this.targetPosition = new THREE.Vector3();
    this.direction = new THREE.Vector3(0, 0, 1);
    this.desiredQuat = new THREE.Quaternion();

    this.group = new THREE.Group();

    this.streakMat = new THREE.MeshStandardMaterial({
      color: this.color,
      emissive: this.color,
      emissiveIntensity: 1.25,
      metalness: 0.05,
      roughness: 0.2,
      transparent: true,
      opacity: 0.68,
      depthWrite: false,
    });

    this.streak = new THREE.Mesh(
      new THREE.CylinderGeometry(this.radius * 0.35, this.radius * 0.95, this.radius * 7, 10, 1, true),
      this.streakMat
    );
    this.streak.rotation.x = Math.PI / 2;
    this.streak.position.z = -this.radius * 2.4;
    this.group.add(this.streak);

    this.coreMat = new THREE.MeshStandardMaterial({
      color: this.color,
      emissive: this.color,
      emissiveIntensity: 1.3,
      metalness: 0.22,
      roughness: 0.24,
    });

    this.core = new THREE.Mesh(new THREE.SphereGeometry(this.radius, 10, 10), this.coreMat);
    this.group.add(this.core);

    scene.add(this.group);
    this.updateFromNetworkState(state, true);
  }

  updateFromNetworkState(state, snap = false) {
    if (!state || typeof state !== "object") {
      this.alive = false;
      return;
    }

    const nextColor = state.color || this.color;
    if (nextColor !== this.color) {
      this.color = nextColor;
      this.streakMat.color.set(nextColor);
      this.streakMat.emissive.set(nextColor);
      this.coreMat.color.set(nextColor);
      this.coreMat.emissive.set(nextColor);
    }

    this.speed = Number.isFinite(state.speed) ? state.speed : this.speed;

    const x = Number.isFinite(state.x) ? state.x : this.targetPosition.x;
    const y = Number.isFinite(state.y) ? state.y : this.targetPosition.y;
    const z = Number.isFinite(state.z) ? state.z : this.targetPosition.z;
    this.targetPosition.set(x, y, z);

    if (snap) this.renderPosition.copy(this.targetPosition);
    else this.renderPosition.lerp(this.targetPosition, 0.82);
    this.group.position.copy(this.renderPosition);

    const dx = Number.isFinite(state.dirX) ? state.dirX : this.direction.x;
    const dy = Number.isFinite(state.dirY) ? state.dirY : this.direction.y;
    const dz = Number.isFinite(state.dirZ) ? state.dirZ : this.direction.z;
    const dirLength = Math.hypot(dx, dy, dz);
    if (dirLength > 1e-6) this.direction.set(dx / dirLength, dy / dirLength, dz / dirLength);

    this.desiredQuat.setFromUnitVectors(PROJECTILE_FORWARD, this.direction);
    if (snap) this.group.quaternion.copy(this.desiredQuat);
    else this.group.quaternion.slerp(this.desiredQuat, 0.68);

    const stretch = 1 + Math.min(this.speed * 0.03, 1.8);
    this.streak.scale.z = stretch;
    this.alive = state.alive !== false;
  }

  update() {
    this.alive = false;
  }

  dispose() {
    scene.remove(this.group);
  }
}

function serializeTowerState(tower) {
  return {
    towerTypeId: tower.towerTypeId,
    cellX: tower.cellX,
    cellY: tower.cellY,
    cooldown: tower.cooldown,
    turretYaw: tower.turret ? tower.turret.rotation.y : 0,
    spinYaw: tower.spinNode ? tower.spinNode.rotation.y : 0,
  };
}

function serializeEnemyState(enemy) {
  return {
    typeId: enemy.typeId,
    name: enemy.name,
    speed: enemy.speed,
    hp: enemy.hp,
    maxHp: enemy.maxHp,
    reward: enemy.reward,
    radius: enemy.radius,
    coreDamage: enemy.coreDamage,
    hoverHeight: enemy.hoverHeight,
    colorA: enemy.colorA,
    colorB: enemy.colorB,
    x: enemy.x,
    z: enemy.z,
    currentY: enemy.currentY,
    pathIndex: enemy.pathIndex,
    reachedEnd: enemy.reachedEnd,
    progressScore: enemy.progressScore,
    headingX: enemy.headingX,
    headingZ: enemy.headingZ,
    quaternion: [enemy.mesh.quaternion.x, enemy.mesh.quaternion.y, enemy.mesh.quaternion.z, enemy.mesh.quaternion.w],
    spinYaw: enemy.spinNode ? enemy.spinNode.rotation.y : 0,
    healthBarVisibleUntil: enemy.healthBarVisibleUntil,
  };
}

function serializeAllyState(ally) {
  return {
    typeId: ally.typeId,
    speed: ally.speed,
    hp: ally.hp,
    maxHp: ally.maxHp,
    radius: ally.radius,
    hoverHeight: ally.hoverHeight,
    x: ally.x,
    z: ally.z,
    currentY: ally.currentY,
    pathIndex: ally.pathIndex,
    reachedStart: ally.reachedStart,
    headingX: ally.headingX,
    headingZ: ally.headingZ,
    quaternion: [ally.mesh.quaternion.x, ally.mesh.quaternion.y, ally.mesh.quaternion.z, ally.mesh.quaternion.w],
    spinYaw: ally.spinNode ? ally.spinNode.rotation.y : 0,
  };
}

function serializeProjectileState(projectile) {
  if (!projectile || !projectile.alive) return null;
  const position = projectile.renderPosition || projectile.position || projectile.group?.position || null;
  if (!position) return null;
  const direction = projectile.direction || PROJECTILE_FORWARD;
  return {
    x: Number.isFinite(position.x) ? position.x : 0,
    y: Number.isFinite(position.y) ? position.y : 0,
    z: Number.isFinite(position.z) ? position.z : 0,
    dirX: Number.isFinite(direction.x) ? direction.x : 0,
    dirY: Number.isFinite(direction.y) ? direction.y : 0,
    dirZ: Number.isFinite(direction.z) ? direction.z : 1,
    speed: Number.isFinite(projectile.speed) ? projectile.speed : 0,
    radius: Number.isFinite(projectile.radius) ? projectile.radius : 0.12,
    color: projectile.color || "#9fd8ff",
    alive: projectile.alive !== false,
  };
}

function buildMultiplayerSnapshot() {
  return {
    started: game.started,
    menuOpen: game.menuOpen,
    menuView: game.menuView,
    currentLevel: game.currentLevel,
    maxLevelUnlocked: game.maxLevelUnlocked,
    maxLoadoutSlots: getCurrentLoadoutSlotLimit(),
    menuSelectedLevel: game.menuSelectedLevel,
    money: game.money,
    shards: game.shards,
    lives: game.lives,
    wave: game.wave,
    inWave: game.inWave,
    waveCreditsEarned: game.waveCreditsEarned,
    spawnLeft: game.spawnLeft,
    spawnTimer: game.spawnTimer,
    selectedTowerType: game.selectedTowerType,
    placing: game.placing,
    selling: game.selling,
    editingLane: game.editingLane,
    paused: game.paused,
    autoWaveEnabled: game.autoWaveEnabled,
    autoWaveCountdown: game.autoWaveCountdown,
    over: game.over,
    levelOneDefeated: game.levelOneDefeated,
    speedStepIndex: game.speedStepIndex,
    speedMultiplier: game.speedMultiplier,
    time: game.time,
    accountName: game.accountName,
    multiplayerHostId: multiplayer.hostId || multiplayer.peerId,
    multiplayerPlayers: getMultiplayerRosterPayload(),
    activeLoadout: Array.from(game.activeLoadout),
    unlockedTowers: Array.from(game.unlockedTowers),
    towerCapUpgrades: normalizeTowerCapUpgrades(game.towerCapUpgrades),
    towerDamageUpgrades: normalizeTowerDamageUpgrades(game.towerDamageUpgrades),
    towerAttackSpeedUpgrades: normalizeTowerAttackSpeedUpgrades(game.towerAttackSpeedUpgrades),
    towerRangeUpgrades: normalizeTowerRangeUpgrades(game.towerRangeUpgrades),
    spawnerCooldownUpgrades: normalizeSpawnerCooldownUpgrades(game.spawnerCooldownUpgrades),
    unlockedSpawnerTowers: Array.from(game.unlockedSpawnerTowers),
    laneCells: Array.from(pathCellSet),
    statusText: statusEl ? statusEl.textContent : "",
    statusDanger: statusEl ? statusEl.style.color === "#ff8f8f" : false,
    towers: game.towers.map(serializeTowerState),
    enemies: game.enemies.filter((enemy) => enemy.alive).map(serializeEnemyState),
    allies: game.allies.filter((ally) => ally.alive).map(serializeAllyState),
    projectiles: game.projectiles.map(serializeProjectileState).filter(Boolean),
  };
}

function sendMultiplayerSnapshot(force = false) {
  if (!isMultiplayerHost() || !isMultiplayerActive()) return;
  if (!force && multiplayer.peers.size === 0) return;
  postMultiplayerMessage({
    type: "snapshot",
    snapshot: buildMultiplayerSnapshot(),
  });
}

function syncTowersFromMultiplayer(states) {
  const next = [];
  const list = Array.isArray(states) ? states : [];
  for (let i = 0; i < list.length; i += 1) {
    const state = list[i];
    if (!state || typeof state.towerTypeId !== "string") continue;
    let tower = game.towers[i] || null;
    const needsRebuild =
      !tower ||
      tower.towerTypeId !== state.towerTypeId ||
      tower.cellX !== state.cellX ||
      tower.cellY !== state.cellY;
    if (needsRebuild) {
      if (tower) tower.dispose();
      tower = new Tower(state.cellX, state.cellY, state.towerTypeId);
    }

    tower.cooldown = Number.isFinite(state.cooldown) ? state.cooldown : 0;
    if (tower.turret && Number.isFinite(state.turretYaw)) tower.turret.rotation.y = state.turretYaw;
    if (tower.spinNode && Number.isFinite(state.spinYaw)) tower.spinNode.rotation.y = state.spinYaw;
    next.push(tower);
  }

  for (let i = list.length; i < game.towers.length; i += 1) {
    const tower = game.towers[i];
    if (tower) tower.dispose();
  }
  game.towers = next;
}

function createEnemyFromNetworkState(state) {
  const stats = {
    typeId: state.typeId,
    name: state.name || ENEMY_TYPES[state.typeId]?.name || "Enemy",
    hp: Math.max(1, Math.ceil(state.maxHp || state.hp || 1)),
    speed: Number.isFinite(state.speed) ? state.speed : (ENEMY_TYPES[state.typeId]?.speed || 3),
    reward: Math.max(1, Math.ceil(state.reward || 1)),
    radius: Number.isFinite(state.radius) ? state.radius : (ENEMY_TYPES[state.typeId]?.radius || 0.8),
    coreDamage: Math.max(1, Math.ceil(state.coreDamage || 1)),
    colorA: state.colorA || ENEMY_TYPES[state.typeId]?.colorA || "#ff8f63",
    colorB: state.colorB || ENEMY_TYPES[state.typeId]?.colorB || "#ffcc84",
    hoverHeight: Number.isFinite(state.hoverHeight) ? state.hoverHeight : ENEMY_TYPES[state.typeId]?.hoverHeight || 1,
  };
  return new Enemy(stats);
}

function syncEnemiesFromMultiplayer(states) {
  const next = [];
  const list = Array.isArray(states) ? states : [];
  for (let i = 0; i < list.length; i += 1) {
    const state = list[i];
    if (!state || typeof state.typeId !== "string") continue;
    let enemy = game.enemies[i] || null;
    const needsRebuild = !enemy || enemy.typeId !== state.typeId;
    if (needsRebuild) {
      if (enemy) enemy.dispose();
      enemy = createEnemyFromNetworkState(state);
    }

    enemy.name = state.name || enemy.name;
    enemy.speed = Number.isFinite(state.speed) ? state.speed : enemy.speed;
    enemy.maxHp = Math.max(1, Number.isFinite(state.maxHp) ? state.maxHp : enemy.maxHp);
    enemy.hp = Math.max(0, Number.isFinite(state.hp) ? state.hp : enemy.hp);
    enemy.reward = Math.max(1, Number.isFinite(state.reward) ? state.reward : enemy.reward);
    enemy.radius = Number.isFinite(state.radius) ? state.radius : enemy.radius;
    enemy.coreDamage = Math.max(1, Number.isFinite(state.coreDamage) ? state.coreDamage : enemy.coreDamage);
    enemy.x = Number.isFinite(state.x) ? state.x : enemy.x;
    enemy.z = Number.isFinite(state.z) ? state.z : enemy.z;
    enemy.currentY = Number.isFinite(state.currentY) ? state.currentY : getLaneSurfaceY(enemy.x, enemy.z) + enemy.baseYOffset;
    enemy.pathIndex = Number.isFinite(state.pathIndex) ? Math.max(0, Math.floor(state.pathIndex)) : enemy.pathIndex;
    enemy.reachedEnd = !!state.reachedEnd;
    enemy.progressScore = Number.isFinite(state.progressScore) ? state.progressScore : enemy.progressScore;
    enemy.headingX = Number.isFinite(state.headingX) ? state.headingX : enemy.headingX;
    enemy.headingZ = Number.isFinite(state.headingZ) ? state.headingZ : enemy.headingZ;
    enemy.healthBarVisibleUntil = Number.isFinite(state.healthBarVisibleUntil) ? state.healthBarVisibleUntil : -1;
    enemy.alive = enemy.hp > 0 && !enemy.reachedEnd;
    enemy.mesh.position.set(enemy.x, enemy.currentY, enemy.z);
    const q = state.quaternion;
    if (Array.isArray(q) && q.length === 4) {
      enemy.mesh.quaternion.set(q[0], q[1], q[2], q[3]);
    }
    if (enemy.spinNode && Number.isFinite(state.spinYaw)) enemy.spinNode.rotation.y = state.spinYaw;
    enemy.updateHealthBar();
    next.push(enemy);
  }

  for (let i = list.length; i < game.enemies.length; i += 1) {
    const enemy = game.enemies[i];
    if (enemy) enemy.dispose();
  }
  game.enemies = next;
}

function createAllyFromNetworkState(state) {
  const stats = createAllyStatsForType(state.typeId);
  if (!stats) return null;
  return new AllyMinion(stats);
}

function syncAlliesFromMultiplayer(states) {
  const next = [];
  const list = Array.isArray(states) ? states : [];
  for (let i = 0; i < list.length; i += 1) {
    const state = list[i];
    if (!state || typeof state.typeId !== "string") continue;
    let ally = game.allies[i] || null;
    const needsRebuild = !ally || ally.typeId !== state.typeId;
    if (needsRebuild) {
      if (ally) ally.dispose();
      ally = createAllyFromNetworkState(state);
      if (!ally) continue;
    }

    ally.speed = Number.isFinite(state.speed) ? state.speed : ally.speed;
    ally.maxHp = Math.max(1, Number.isFinite(state.maxHp) ? state.maxHp : ally.maxHp);
    ally.hp = Math.max(0, Number.isFinite(state.hp) ? state.hp : ally.hp);
    ally.radius = Number.isFinite(state.radius) ? state.radius : ally.radius;
    ally.hoverHeight = Number.isFinite(state.hoverHeight) ? state.hoverHeight : ally.hoverHeight;
    ally.x = Number.isFinite(state.x) ? state.x : ally.x;
    ally.z = Number.isFinite(state.z) ? state.z : ally.z;
    ally.currentY = Number.isFinite(state.currentY) ? state.currentY : getLaneSurfaceY(ally.x, ally.z) + ally.baseYOffset;
    ally.pathIndex = Number.isFinite(state.pathIndex) ? Math.max(0, Math.floor(state.pathIndex)) : ally.pathIndex;
    ally.reachedStart = !!state.reachedStart;
    ally.headingX = Number.isFinite(state.headingX) ? state.headingX : ally.headingX;
    ally.headingZ = Number.isFinite(state.headingZ) ? state.headingZ : ally.headingZ;
    ally.alive = ally.hp > 0 && !ally.reachedStart;
    ally.mesh.position.set(ally.x, ally.currentY, ally.z);
    const q = state.quaternion;
    if (Array.isArray(q) && q.length === 4) {
      ally.mesh.quaternion.set(q[0], q[1], q[2], q[3]);
    }
    if (ally.spinNode && Number.isFinite(state.spinYaw)) ally.spinNode.rotation.y = state.spinYaw;
    next.push(ally);
  }

  for (let i = list.length; i < game.allies.length; i += 1) {
    const ally = game.allies[i];
    if (ally) ally.dispose();
  }
  game.allies = next;
}

function syncProjectilesFromMultiplayer(states) {
  const next = [];
  const list = Array.isArray(states) ? states : [];
  for (let i = 0; i < list.length; i += 1) {
    const state = list[i];
    if (!state || typeof state !== "object") continue;
    let projectile = game.projectiles[i] || null;
    const reusable = projectile && typeof projectile.updateFromNetworkState === "function";
    if (!reusable) {
      if (projectile) projectile.dispose();
      projectile = new NetworkProjectile(state);
    } else {
      projectile.updateFromNetworkState(state);
    }
    if (projectile.alive) next.push(projectile);
    else projectile.dispose();
  }

  for (let i = list.length; i < game.projectiles.length; i += 1) {
    const projectile = game.projectiles[i];
    if (projectile) projectile.dispose();
  }
  game.projectiles = next;
}

function applyMultiplayerSnapshot(snapshot) {
  if (!isMultiplayerClient() || !snapshot || typeof snapshot !== "object") return;
  const level = Math.max(1, Math.floor(snapshot.currentLevel || 1));
  const laneCells = Array.isArray(snapshot.laneCells) ? snapshot.laneCells.filter((key) => typeof key === "string") : [];
  const laneSignature = laneCells.slice().sort().join("|");

  if (game.currentLevel !== level) {
    clearActiveCombatState();
    resetTowersForNewLevel();
    game.currentLevel = level;
    resetLaneToLevelDefaults(level);
    rebuildWorld();
  }

  if (laneCells.length > 0 && laneSignature !== multiplayer.lastLaneSignature) {
    const laneSet = new Set(laneCells);
    laneSet.add(LANE_START_KEY);
    laneSet.add(LANE_END_KEY);
    if (commitLaneCellSet(laneSet)) rebuildWorld();
    multiplayer.lastLaneSignature = serializeLaneSignature();
  }

  game.started = !!snapshot.started;
  game.menuOpen = !!snapshot.menuOpen;
  game.menuView = typeof snapshot.menuView === "string" ? snapshot.menuView : game.menuView;
  game.maxLevelUnlocked = Math.max(1, Math.floor(snapshot.maxLevelUnlocked || game.maxLevelUnlocked || 1));
  game.maxLoadoutSlots = clampLoadoutSlotLimit(
    Number(snapshot.maxLoadoutSlots || game.maxLoadoutSlots || BASE_LOADOUT_SLOTS)
  );
  game.menuSelectedLevel = clampMenuSelectedLevel(snapshot.menuSelectedLevel || game.menuSelectedLevel || 1);
  game.money = Math.max(0, Math.floor(snapshot.money || 0));
  game.shards = Math.max(0, Math.floor(snapshot.shards || 0));
  game.lives = Math.max(0, Math.floor(snapshot.lives || 0));
  game.wave = Math.max(0, Math.floor(snapshot.wave || 0));
  game.inWave = !!snapshot.inWave;
  game.waveCreditsEarned = Math.max(0, Math.floor(snapshot.waveCreditsEarned || 0));
  game.spawnLeft = Math.max(0, Math.floor(snapshot.spawnLeft || 0));
  game.spawnTimer = Number.isFinite(snapshot.spawnTimer) ? snapshot.spawnTimer : 0;
  game.selectedTowerType = typeof snapshot.selectedTowerType === "string" ? snapshot.selectedTowerType : game.selectedTowerType;
  game.placing = !!snapshot.placing;
  game.selling = !!snapshot.selling;
  game.editingLane = !!snapshot.editingLane;
  game.paused = !!snapshot.paused;
  game.autoWaveEnabled = !!snapshot.autoWaveEnabled;
  game.autoWaveCountdown = Number.isFinite(snapshot.autoWaveCountdown) ? snapshot.autoWaveCountdown : game.autoWaveInterval;
  game.over = !!snapshot.over;
  game.levelOneDefeated = !!snapshot.levelOneDefeated;
  game.speedStepIndex = Number.isFinite(snapshot.speedStepIndex)
    ? Math.max(0, Math.min(GAME_SPEED_STEPS.length - 1, Math.floor(snapshot.speedStepIndex)))
    : game.speedStepIndex;
  game.speedMultiplier = Number.isFinite(snapshot.speedMultiplier)
    ? Math.max(0.5, Math.min(2, snapshot.speedMultiplier))
    : GAME_SPEED_STEPS[game.speedStepIndex];
  game.time = Number.isFinite(snapshot.time) ? snapshot.time : game.time;
  if (typeof snapshot.multiplayerHostId === "string" && snapshot.multiplayerHostId) multiplayer.hostId = snapshot.multiplayerHostId;
  if (Array.isArray(snapshot.multiplayerPlayers)) {
    setMultiplayerRosterFromPacket(snapshot.multiplayerPlayers, snapshot.multiplayerHostId || multiplayer.hostId);
  }
  upsertMultiplayerRosterPlayer(multiplayer.peerId, getLocalMultiplayerDisplayName(), isMultiplayerHost() ? "host" : "client");

  if (Array.isArray(snapshot.unlockedTowers)) {
    game.unlockedTowers = new Set(snapshot.unlockedTowers.filter((id) => Object.prototype.hasOwnProperty.call(TOWER_TYPES, id)));
  }
  game.towerCapUpgrades = normalizeTowerCapUpgrades(snapshot.towerCapUpgrades || game.towerCapUpgrades);
  game.towerDamageUpgrades = normalizeTowerDamageUpgrades(snapshot.towerDamageUpgrades || game.towerDamageUpgrades);
  game.towerAttackSpeedUpgrades = normalizeTowerAttackSpeedUpgrades(
    snapshot.towerAttackSpeedUpgrades || game.towerAttackSpeedUpgrades
  );
  game.towerRangeUpgrades = normalizeTowerRangeUpgrades(snapshot.towerRangeUpgrades || game.towerRangeUpgrades);
  game.spawnerCooldownUpgrades = normalizeSpawnerCooldownUpgrades(
    snapshot.spawnerCooldownUpgrades || game.spawnerCooldownUpgrades
  );
  if (Array.isArray(snapshot.unlockedSpawnerTowers)) {
    game.unlockedSpawnerTowers = new Set(
      snapshot.unlockedSpawnerTowers.filter((id) => Object.prototype.hasOwnProperty.call(CREATURE_SPAWNER_UNLOCKS, id))
    );
  }
  if (Array.isArray(snapshot.activeLoadout)) {
    game.activeLoadout = normalizeTowerIds(
      snapshot.activeLoadout,
      game.unlockedTowers,
      getAllTowerTypeIds(),
      game.maxLoadoutSlots,
      game.unlockedSpawnerTowers
    );
  }

  if (game.menuOpen) {
    if (menuScreenEl) menuScreenEl.hidden = false;
    document.body.classList.add("menu-active");
    setMenuView(game.menuView || "home");
  } else {
    if (menuScreenEl) menuScreenEl.hidden = true;
    document.body.classList.remove("menu-active");
  }

  syncTowersFromMultiplayer(snapshot.towers);
  syncEnemiesFromMultiplayer(snapshot.enemies);
  syncAlliesFromMultiplayer(snapshot.allies);
  syncProjectilesFromMultiplayer(snapshot.projectiles);
  for (const debris of game.debris) debris.dispose();
  game.debris = [];

  if (typeof snapshot.statusText === "string" && snapshot.statusText !== multiplayer.lastStatusLine) {
    multiplayer.lastStatusLine = snapshot.statusText;
    setStatus(snapshot.statusText, !!snapshot.statusDanger);
  }

  const shopSignature = [
    game.selectedTowerType,
    Array.from(game.activeLoadout).join(","),
    Array.from(game.unlockedTowers).sort().join(","),
    Array.from(game.unlockedSpawnerTowers).sort().join(","),
    Object.keys(game.towerCapUpgrades || {})
      .sort()
      .map((towerTypeId) => `${towerTypeId}:${game.towerCapUpgrades[towerTypeId]}`)
      .join(","),
    Object.keys(game.towerDamageUpgrades || {})
      .sort()
      .map((towerTypeId) => `${towerTypeId}:${game.towerDamageUpgrades[towerTypeId]}`)
      .join(","),
    Object.keys(game.towerAttackSpeedUpgrades || {})
      .sort()
      .map((towerTypeId) => `${towerTypeId}:${game.towerAttackSpeedUpgrades[towerTypeId]}`)
      .join(","),
    Object.keys(game.towerRangeUpgrades || {})
      .sort()
      .map((towerTypeId) => `${towerTypeId}:${game.towerRangeUpgrades[towerTypeId]}`)
      .join(","),
    Object.keys(game.spawnerCooldownUpgrades || {})
      .sort()
      .map((towerTypeId) => `${towerTypeId}:${game.spawnerCooldownUpgrades[towerTypeId]}`)
      .join(","),
  ].join("|");
  if (shopSignature !== multiplayer.lastShopSignature) {
    multiplayer.lastShopSignature = shopSignature;
    renderShop();
    renderMenuShop();
    renderCreatureShop();
    renderLoadoutMenu();
  }
  syncMusicState();
  updateHud();
}

function handleIncomingMultiplayerAction(action, payload = {}, fromPeer = "") {
  if (!isMultiplayerHost()) return;
  if (typeof action !== "string") return;

  if (action === "startLevel") {
    const level = Math.max(1, Math.floor(payload.level || game.menuSelectedLevel || 1));
    startGameFromMenu(level);
    sendMultiplayerSnapshot(true);
    return;
  }

  if (!game.started || game.over || game.menuOpen || game.exitConfirmOpen || game.levelClearOpen || game.defeatOpen) {
    return;
  }

  if (action === "setPlacing") {
    const desired = !!payload.value;
    if (desired !== game.placing) toggleBuildMode();
    sendMultiplayerSnapshot(true);
    return;
  }

  if (action === "setSelling") {
    const desired = !!payload.value;
    if (desired !== game.selling) toggleSellMode();
    sendMultiplayerSnapshot(true);
    return;
  }

  if (action === "setLaneEditing") {
    const desired = !!payload.value;
    if (desired !== game.editingLane) toggleLaneEditMode();
    sendMultiplayerSnapshot(true);
    return;
  }

  if (action === "selectTowerForBuild") {
    const towerTypeId = typeof payload.towerTypeId === "string" ? payload.towerTypeId : "";
    if (!isTowerSelectable(towerTypeId)) return;
    game.selectedTowerType = towerTypeId;
    game.placing = true;
    game.selling = false;
    game.editingLane = false;
    updateHud();
    sendMultiplayerSnapshot(true);
    return;
  }

  if (action === "placeTower") {
    const cellX = Math.floor(payload.cellX);
    const cellY = Math.floor(payload.cellY);
    const towerTypeId = typeof payload.towerTypeId === "string" ? payload.towerTypeId : game.selectedTowerType;
    tryPlaceTowerAtCell(cellX, cellY, towerTypeId, fromPeer);
    sendMultiplayerSnapshot(true);
    return;
  }

  if (action === "sellTower") {
    sellTowerAtCell(Math.floor(payload.cellX), Math.floor(payload.cellY));
    sendMultiplayerSnapshot(true);
    return;
  }

  if (action === "editLane") {
    editLaneAtCell(Math.floor(payload.cellX), Math.floor(payload.cellY));
    sendMultiplayerSnapshot(true);
    return;
  }

  if (action === "startWave") {
    startWave();
    sendMultiplayerSnapshot(true);
    return;
  }

  if (action === "togglePause") {
    togglePause();
    sendMultiplayerSnapshot(true);
    return;
  }

  if (action === "toggleAutoWave") {
    toggleAutoWave();
    sendMultiplayerSnapshot(true);
    return;
  }

  if (action === "setSpeedStep") {
    applyGameSpeedStep(Math.floor(payload.index), true);
    sendMultiplayerSnapshot(true);
  }
}

function updateMultiplayerNetwork(dt) {
  if (!isMultiplayerHost() || !isMultiplayerActive()) return;
  multiplayer.snapshotTimer -= dt;
  if (multiplayer.snapshotTimer <= 0) {
    sendMultiplayerSnapshot(false);
    multiplayer.snapshotTimer = MULTIPLAYER_SNAPSHOT_INTERVAL;
  }
}

function setStatus(message, danger = false) {
  statusEl.textContent = message;
  statusEl.style.color = danger ? "#ff8f8f" : "#bfd6e8";
}

function getActiveBossEnemies() {
  return game.enemies.filter(
    (enemy) => enemy.alive && (enemy.typeId === "icosahedron" || enemy.typeId === "rhombus" || enemy.typeId === "star")
  );
}

function updateBossBar() {
  if (!bossBarWrapEl || !bossNameEl || !bossHpEl || !bossBarFillEl || !bossBarSplitEl || !bossBarFillLeftEl || !bossBarFillRightEl) return;
  const bosses = getActiveBossEnemies();

  if (!game.started || game.menuOpen || game.exitConfirmOpen || game.levelClearOpen || game.defeatOpen || bosses.length === 0) {
    bossBarWrapEl.hidden = true;
    bossBarSplitEl.hidden = true;
    bossBarFillEl.style.transform = "scaleX(1)";
    return;
  }

  const totalHp = bosses.reduce((sum, boss) => sum + Math.max(0, Math.ceil(boss.hp)), 0);
  const totalMaxHp = bosses.reduce((sum, boss) => sum + Math.max(1, Math.ceil(boss.maxHp)), 0);
  const totalRatio = totalMaxHp > 0 ? Math.min(1, Math.max(0, totalHp / totalMaxHp)) : 0;

  if (bosses.length >= 2 && bosses.every((boss) => boss.typeId === "rhombus")) {
    const sorted = bosses.slice(0, 2).sort((a, b) => a.x - b.x);
    const leftBoss = sorted[0];
    const rightBoss = sorted[1];
    const leftRatio = Math.min(1, Math.max(0, leftBoss.hp / Math.max(1, leftBoss.maxHp)));
    const rightRatio = Math.min(1, Math.max(0, rightBoss.hp / Math.max(1, rightBoss.maxHp)));

    bossBarFillEl.style.transform = "scaleX(0)";
    bossBarSplitEl.hidden = false;
    bossBarFillLeftEl.style.transform = `scaleX(${leftRatio})`;
    bossBarFillRightEl.style.transform = `scaleX(${rightRatio})`;
    bossNameEl.textContent = "Rhombus Twin Bosses";
    bossHpEl.textContent = `${Math.max(0, Math.ceil(leftBoss.hp))} + ${Math.max(0, Math.ceil(rightBoss.hp))} / ${Math.max(
      1,
      Math.ceil(leftBoss.maxHp)
    )} + ${Math.max(1, Math.ceil(rightBoss.maxHp))}`;
  } else {
    const primaryBoss = bosses[0];
    bossBarSplitEl.hidden = true;
    bossBarFillEl.style.transform = `scaleX(${totalRatio})`;
    bossNameEl.textContent = `${primaryBoss.name} Boss`;
    bossHpEl.textContent = `${Math.max(0, Math.ceil(totalHp))} / ${Math.max(1, Math.ceil(totalMaxHp))}`;
  }

  bossBarWrapEl.hidden = false;
}

function completeCurrentLevel(nextLevel, shardReward, statusMessage, panelMessage) {
  if (game.levelOneDefeated) return;
  clearPendingLevelClearPanel();
  audioSystem.stopBossMusic();
  audioSystem.stopFluteMusic(true);
  game.levelOneDefeated = true;
  if (Number.isFinite(nextLevel)) {
    const targetLevel = Math.max(1, Math.floor(nextLevel));
    game.maxLevelUnlocked = Math.max(game.maxLevelUnlocked, targetLevel);
    game.menuSelectedLevel = clampMenuSelectedLevel(targetLevel);
  }
  if (Number.isFinite(shardReward) && shardReward > 0) {
    game.shards += Math.floor(shardReward);
  }
  game.levelClearTitle = "Level Cleared";
  game.levelClearText = panelMessage || "Victory confirmed. New map access awarded.";
  game.over = true;
  game.inWave = false;
  game.autoWaveEnabled = false;
  game.spawnQueue = [];
  game.spawnLeft = 0;
  game.spawnTimer = 0;
  game.bossEnemy = null;

  for (const enemy of game.enemies) {
    if (enemy.alive) enemy.alive = false;
  }
  for (const projectile of game.projectiles) projectile.alive = false;

  savePlayerProgress();
  renderAccountMenu();
  renderMenuShop();
  renderCreatureShop();
  updateHud();
  setStatus(statusMessage || "Level cleared.");

  game.levelClearTimer = setTimeout(() => {
    game.levelClearTimer = null;
    openLevelClearPanel();
  }, 1000);
}

function onIcosahedronDefeated() {
  completeCurrentLevel(
    2,
    20,
    "Level 1 Defeated. Level 2 unlocked. +20 shards.",
    "Level 1 complete. Access to Level 2 unlocked. +20 shards awarded."
  );
}

function onRhombusDefeated() {
  completeCurrentLevel(
    3,
    30,
    "Level 2 Cleared. Level 3 unlocked. +30 shards.",
    "Level 2 complete. Access to Level 3 unlocked. +30 shards awarded."
  );
}

function clearActiveCombatState() {
  clearPendingLevelClearPanel();
  closeDefeatPanel();
  closeLevelClearPanel();
  audioSystem.stopBossMusic();
  audioSystem.stopFluteMusic(true);
  for (const enemy of game.enemies) enemy.dispose();
  for (const ally of game.allies) ally.dispose();
  for (const projectile of game.projectiles) projectile.dispose();
  for (const debris of game.debris) debris.dispose();
  game.enemies = [];
  game.allies = [];
  game.projectiles = [];
  game.debris = [];
  game.inWave = false;
  game.waveCreditsEarned = 0;
  game.spawnQueue = [];
  game.spawnLeft = 0;
  game.spawnTimer = 0;
  game.bossEnemy = null;
}

function getHighestUnlockedLevel() {
  return Math.max(1, Math.min(MAP_CATALOG.length, Math.floor(game.maxLevelUnlocked || 1)));
}

function getMapEntry(level) {
  return MAP_CATALOG.find((entry) => entry.level === level) || MAP_CATALOG[0];
}

function clampMenuSelectedLevel(level) {
  const maxLevel = Math.max(1, MAP_CATALOG.length);
  return Math.max(1, Math.min(maxLevel, Math.floor(level || 1)));
}

function isLevelUnlocked(level) {
  return Math.max(1, Math.floor(level || 1)) <= getHighestUnlockedLevel();
}

function clearMapPreviewAnimation() {
  if (mapPreviewSwapTimer) {
    clearTimeout(mapPreviewSwapTimer);
    mapPreviewSwapTimer = null;
  }
  if (mapPreviewResetTimer) {
    clearTimeout(mapPreviewResetTimer);
    mapPreviewResetTimer = null;
  }
  if (!mapPreviewEl) return;
  mapPreviewEl.classList.remove("swipe-out-left", "swipe-out-right", "swipe-in-left", "swipe-in-right");
}

function applyMapPreviewContent() {
  if (!mapPreviewIndexEl || !mapPreviewNameEl || !mapPreviewDescEl || !mapPreviewLockEl) return;
  const selectedLevel = clampMenuSelectedLevel(game.menuSelectedLevel);
  const mapEntry = getMapEntry(selectedLevel);
  const unlocked = isLevelUnlocked(selectedLevel);
  mapPreviewIndexEl.textContent = `Map ${selectedLevel} / ${MAP_CATALOG.length}`;
  mapPreviewNameEl.textContent = mapEntry.name;
  mapPreviewDescEl.textContent = mapEntry.description;
  mapPreviewLockEl.textContent = unlocked ? "Unlocked" : "Locked";
  mapPreviewLockEl.classList.toggle("unlocked", unlocked);
  mapPreviewLockEl.classList.toggle("locked", !unlocked);
}

function renderMapPreview(direction = 0, animate = false) {
  if (!mapPreviewEl) return;
  if (!animate || direction === 0) {
    clearMapPreviewAnimation();
    applyMapPreviewContent();
    return;
  }

  clearMapPreviewAnimation();
  const swipeOutClass = direction > 0 ? "swipe-out-left" : "swipe-out-right";
  const swipeInClass = direction > 0 ? "swipe-in-right" : "swipe-in-left";
  mapPreviewEl.classList.add(swipeOutClass);
  mapPreviewSwapTimer = setTimeout(() => {
    mapPreviewSwapTimer = null;
    mapPreviewEl.classList.remove(swipeOutClass);
    applyMapPreviewContent();
    mapPreviewEl.classList.add(swipeInClass);
    mapPreviewResetTimer = setTimeout(() => {
      mapPreviewResetTimer = null;
      mapPreviewEl.classList.remove(swipeInClass);
    }, 170);
  }, 150);
}

function selectMenuLevel(level, direction = 0, animate = false) {
  game.menuSelectedLevel = clampMenuSelectedLevel(level);
  renderMapPreview(direction, animate);
  if (playBtn) playBtn.textContent = getMenuPlayButtonLabel();
}

function cycleMenuLevel(step) {
  const total = Math.max(1, MAP_CATALOG.length);
  const delta = step >= 0 ? 1 : -1;
  const current = clampMenuSelectedLevel(game.menuSelectedLevel);
  const next = ((current - 1 + delta + total) % total) + 1;
  selectMenuLevel(next, delta, true);
}

function getMenuPlayButtonLabel() {
  const selectedLevel = clampMenuSelectedLevel(game.menuSelectedLevel || getHighestUnlockedLevel());
  return isLevelUnlocked(selectedLevel) ? `Start Level ${selectedLevel}` : `Level ${selectedLevel} Locked`;
}

function resetTowersForNewLevel() {
  for (const tower of game.towers) tower.dispose();
  game.towers = [];
}

function prepareLevel(level) {
  const targetLevel = Math.max(1, Math.min(getHighestUnlockedLevel(), Math.floor(level || 1)));
  const profile = getLevelDifficultyProfile(targetLevel);
  clearActiveCombatState();
  resetTowersForNewLevel();
  game.currentLevel = targetLevel;
  game.over = false;
  game.levelOneDefeated = false;
  game.levelClearTitle = "Level Cleared";
  game.levelClearText = "Victory confirmed. New map access awarded.";
  game.autoWaveEnabled = false;
  game.autoWaveCountdown = game.autoWaveInterval;
  game.paused = false;
  game.editingLane = false;
  game.placing = false;
  game.selling = false;
  game.hoverCell = null;
  game.money = profile.startingCredits;
  game.lives = profile.startingLives;
  game.wave = 0;
  game.waveCreditsEarned = 0;
  resetLaneToLevelDefaults(targetLevel);
  rebuildWorld();
  renderShop();
}

function refreshSettingsPanel() {
  const applyToggleVisual = (button, enabled) => {
    if (!button) return;
    button.textContent = enabled ? "On" : "Off";
    button.classList.toggle("active", enabled);
  };

  applyToggleVisual(settingMusicBtn, audioSystem.musicEnabled);
  applyToggleVisual(settingSfxBtn, audioSystem.sfxEnabled);
  applyToggleVisual(settingShotBtn, audioSystem.shotSfxEnabled);
  applyToggleVisual(settingShatterBtn, audioSystem.shatterSfxEnabled);

  if (settingShotBtn) settingShotBtn.disabled = !audioSystem.sfxEnabled;
  if (settingShatterBtn) settingShatterBtn.disabled = !audioSystem.sfxEnabled;
}

function openSettingsPanel() {
  if (!game.started || game.exitConfirmOpen || game.levelClearOpen || game.defeatOpen) return;
  if (!settingsPanelEl) return;
  closeCommandConsole();
  settingsPanelEl.hidden = false;
  game.settingsOpen = true;
  refreshSettingsPanel();
}

function closeSettingsPanel() {
  if (!settingsPanelEl) return;
  settingsPanelEl.hidden = true;
  game.settingsOpen = false;
}

function toggleSettingsPanel() {
  if (!game.started || game.exitConfirmOpen || game.levelClearOpen || game.defeatOpen) return;
  if (!settingsPanelEl) return;
  if (settingsPanelEl.hidden) openSettingsPanel();
  else closeSettingsPanel();
}

function toggleSettingMusic() {
  if (!game.started || game.exitConfirmOpen || game.levelClearOpen || game.defeatOpen) return;
  audioSystem.unlock();
  audioSystem.setMusicEnabled(!audioSystem.musicEnabled);
  syncMusicState();
  setStatus(audioSystem.musicEnabled ? "Music enabled." : "Music muted.");
  refreshSettingsPanel();
  updateHud();
}

function toggleSettingSfx() {
  if (!game.started || game.exitConfirmOpen || game.levelClearOpen || game.defeatOpen) return;
  audioSystem.unlock();
  audioSystem.setSfxEnabled(!audioSystem.sfxEnabled);
  setStatus(audioSystem.sfxEnabled ? "Sound effects enabled." : "Sound effects muted.");
  refreshSettingsPanel();
  updateHud();
}

function toggleSettingShots() {
  if (!game.started || game.exitConfirmOpen || game.levelClearOpen || game.defeatOpen || !audioSystem.sfxEnabled) return;
  audioSystem.shotSfxEnabled = !audioSystem.shotSfxEnabled;
  setStatus(audioSystem.shotSfxEnabled ? "Tower shot SFX enabled." : "Tower shot SFX muted.");
  refreshSettingsPanel();
}

function toggleSettingShatter() {
  if (!game.started || game.exitConfirmOpen || game.levelClearOpen || game.defeatOpen || !audioSystem.sfxEnabled) return;
  audioSystem.shatterSfxEnabled = !audioSystem.shatterSfxEnabled;
  setStatus(audioSystem.shatterSfxEnabled ? "Glass shatter SFX enabled." : "Glass shatter SFX muted.");
  refreshSettingsPanel();
}

function openCommandConsole() {
  if (game.levelClearOpen || game.defeatOpen) return;
  if (!commandConsoleEl) return;
  closeSettingsPanel();
  commandConsoleEl.hidden = false;
  if (commandInputEl) {
    commandInputEl.focus();
    commandInputEl.select();
  }
}

function closeCommandConsole() {
  if (!commandConsoleEl) return;
  commandConsoleEl.hidden = true;
}

function toggleCommandConsole() {
  if (!commandConsoleEl) return;
  if (commandConsoleEl.hidden) openCommandConsole();
  else closeCommandConsole();
}

function skipToWaveByCommand(targetWave) {
  const waveNumber = Math.max(1, Math.floor(targetWave));
  if (game.exitConfirmOpen) closeExitConfirm();
  if (!game.started) startGameFromMenu();
  if (game.menuOpen) closeMenuShop();

  clearActiveCombatState();
  game.over = false;
  game.levelOneDefeated = false;
  game.autoWaveEnabled = false;
  game.autoWaveCountdown = game.autoWaveInterval;
  game.editingLane = false;
  game.placing = false;
  game.selling = false;
  game.hoverCell = null;
  game.lives = 20;
  game.money = 4000;
  game.wave = waveNumber - 1;

  startWave();
  updateHud();
}

function executeConsoleCommand(rawCommand) {
  const command = String(rawCommand || "").trim();
  if (!command) return;

  if (/^@reset$/i.test(command)) {
    resetAllProgressFromCommand();
    return;
  }

  const waveMatch = /^wave\s*(\d+)$/i.exec(command);
  if (waveMatch) {
    skipToWaveByCommand(parseInt(waveMatch[1], 10));
    return;
  }

  setStatus(`Unknown command: ${command}`, true);
}

function runConsoleCommandFromInput() {
  if (!commandInputEl) return;
  const command = commandInputEl.value.trim();
  if (!command) return;
  executeConsoleCommand(command);
  commandInputEl.value = "";
}

function registerEnemyKill(enemyTypeId) {
  if (!Object.prototype.hasOwnProperty.call(CREATURE_SPAWNER_UNLOCKS, enemyTypeId)) {
    savePlayerProgress();
    return;
  }

  const nextCount = getEnemyKillCount(enemyTypeId) + 1;
  game.enemyKillCounts[enemyTypeId] = nextCount;
  const unlock = CREATURE_SPAWNER_UNLOCKS[enemyTypeId];

  let unlockedNow = false;
  if (!game.unlockedSpawnerTowers.has(enemyTypeId) && nextCount >= unlock.killRequirement) {
    game.unlockedSpawnerTowers.add(enemyTypeId);
    unlockedNow = true;
  }

  savePlayerProgress();
  if (game.menuView === "creatures") renderCreatureShop();

  if (unlockedNow) {
    renderCreatureShop();
    renderShop();
    updateHud();
    const enemyName = ENEMY_TYPES[enemyTypeId]?.name || enemyTypeId;
    setStatus(`${enemyName} Spawner unlocked in Creature Shop.`);
  }
}

function handleEnemyDefeated(enemy) {
  if (!enemy || !enemy.alive) return;
  const wasIcosahedronBoss = enemy.typeId === "icosahedron" && game.currentLevel === 1;
  const wasRhombusBoss = enemy.typeId === "rhombus" && game.currentLevel === 2;
  enemy.alive = false;
  enemy.shatter();
  game.money += enemy.reward;
  if (game.inWave) game.waveCreditsEarned += enemy.reward;
  registerEnemyKill(enemy.typeId);
  if (wasIcosahedronBoss) onIcosahedronDefeated();
  if (wasRhombusBoss) {
    const anyRhombusAlive = game.enemies.some((entry) => entry.alive && entry.typeId === "rhombus");
    if (!anyRhombusAlive && game.wave >= 30) onRhombusDefeated();
  }
}

function createAllyStatsForType(enemyTypeId) {
  const type = ENEMY_TYPES[enemyTypeId];
  if (!type) return null;
  const waveForStats = Math.max(1, game.wave || 1);
  const enemyStats = createEnemyStats(enemyTypeId, waveForStats, game.currentLevel);
  return {
    typeId: enemyTypeId,
    name: type.name,
    hp: enemyStats.hp,
    speed: enemyStats.speed,
    radius: enemyStats.radius,
    hoverHeight: enemyStats.hoverHeight,
  };
}

function spawnAllyFromTower(enemyTypeId) {
  if (!enemyTypeId || !ENEMY_TYPES[enemyTypeId]) return false;
  if (game.allies.length >= ALLY_UNIT_CAP) return false;
  if (pathPoints.length < 2) return false;
  const allyStats = createAllyStatsForType(enemyTypeId);
  if (!allyStats) return false;
  game.allies.push(new AllyMinion(allyStats));
  return true;
}

function updateAllyEnemyCollisions() {
  if (game.allies.length === 0 || game.enemies.length === 0) return;

  for (const ally of game.allies) {
    if (!ally.alive) continue;
    for (const enemy of game.enemies) {
      if (!enemy.alive) continue;
      const touchRadius = Math.max(0.2, ally.radius + enemy.radius);
      const dx = enemy.x - ally.x;
      const dz = enemy.z - ally.z;
      if (dx * dx + dz * dz > touchRadius * touchRadius) continue;

      const tradeDamage = Math.min(ally.hp, enemy.hp);
      if (tradeDamage <= 0) break;

      const enemyKilled = enemy.applyDamage(tradeDamage);
      ally.applyDamage(tradeDamage);

      if (enemyKilled) handleEnemyDefeated(enemy);
      break;
    }
  }
}

function isTowerUnlocked(towerTypeId) {
  return game.unlockedTowers.has(towerTypeId);
}

function isTowerInLoadout(towerTypeId) {
  return game.activeLoadout.has(towerTypeId);
}

function isSpawnerTowerUnlocked(towerTypeId) {
  const enemyTypeId = enemyTypeFromSpawnerTowerId(towerTypeId);
  return !!enemyTypeId && game.unlockedSpawnerTowers.has(enemyTypeId);
}

function getEnemyKillCount(enemyTypeId) {
  return game.enemyKillCounts?.[enemyTypeId] || 0;
}

function isTowerSelectable(towerTypeId) {
  if (isSpawnerTowerId(towerTypeId)) return isSpawnerTowerUnlocked(towerTypeId) && isTowerInLoadout(towerTypeId);
  return isTowerUnlocked(towerTypeId) && isTowerInLoadout(towerTypeId);
}

function getAvailableTowerEntries() {
  const entries = [];
  for (const enemyTypeId of CREATURE_SHOP_ENEMY_IDS) {
    const towerTypeId = spawnerTowerIdForEnemy(enemyTypeId);
    if (!isTowerSelectable(towerTypeId)) continue;
    entries.push([towerTypeId, getTowerType(towerTypeId)]);
  }
  for (const towerTypeId of Object.keys(TOWER_TYPES)) {
    if (!isTowerSelectable(towerTypeId)) continue;
    entries.push([towerTypeId, getTowerType(towerTypeId)]);
  }
  return entries;
}

function firstAvailableTowerId() {
  const entries = getAvailableTowerEntries();
  return entries.length > 0 ? entries[0][0] : null;
}

function updateShopButtons() {
  if (!isTowerSelectable(game.selectedTowerType)) {
    game.selectedTowerType = firstAvailableTowerId() || "pulse";
  }
  const selected = getTowerType(game.selectedTowerType);
  const buttons = shopEl.querySelectorAll(".shop-item");
  for (const button of buttons) {
    const typeId = button.dataset.towerType;
    const type = getTowerType(typeId);
    const placement = getTowerPlacementStats(typeId);
    button.classList.toggle("active", typeId === game.selectedTowerType);
    button.classList.toggle("unaffordable", game.money < type.cost);
    button.classList.toggle("capped", placement.atCap);
    const capLine = button.querySelector(".shop-cap-line");
    if (capLine) {
      capLine.textContent = formatPlacementCapLine(typeId, placement);
    }
  }
  return selected;
}

function renderShop() {
  const fragments = [];
  for (const [towerTypeId, type] of getAvailableTowerEntries()) {
    const placement = getTowerPlacementStats(towerTypeId);
    const detailLine = type.spawnerEnemyTypeId
      ? `Spawns ${type.spawnCount || 1} every ${type.spawnInterval.toFixed(1)}s | Lane ally`
      : `DMG ${type.damage} | RNG ${type.range.toFixed(1)}`;
    fragments.push(`
      <button class="shop-item" type="button" data-tower-type="${towerTypeId}">
        <strong>${type.name} - ${type.cost}</strong>
        <span>${type.summary}</span>
        <span>${detailLine}</span>
        <span class="shop-cap-line">${formatPlacementCapLine(towerTypeId, placement, false)}</span>
      </button>
    `);
  }
  shopEl.innerHTML = fragments.join("");

  const buttons = shopEl.querySelectorAll(".shop-item");
  for (const button of buttons) {
    button.addEventListener("click", () => {
      if (isMultiplayerClient() && isMultiplayerActive()) {
        const towerTypeId = button.dataset.towerType;
        sendMultiplayerAction("selectTowerForBuild", { towerTypeId });
        setStatus("Tower selection sent to host.");
        return;
      }
      game.selectedTowerType = button.dataset.towerType;
      game.placing = true;
      game.selling = false;
      game.editingLane = false;
      const type = getTowerType(game.selectedTowerType);
      const placement = getTowerPlacementStats(game.selectedTowerType);
      if (type.spawnerEnemyTypeId) {
        const enemyName = ENEMY_TYPES[type.spawnerEnemyTypeId]?.name || "creature";
        if (placement.atCap) {
          setStatus(`${type.name} cap reached (${placement.placed}/${placement.cap}). Sell one to place another.`, true);
        } else {
          setStatus(
            `${type.name} selected. Place it to spawn green ${enemyName} allies. (${placement.placed}/${placement.cap})`
          );
        }
      } else {
        if (placement.atCap) {
          setStatus(`${type.name} cap reached (${placement.placed}/${placement.cap}). Sell one to place another.`, true);
        } else {
          setStatus(`${type.name} tower selected. Place it on a free tile. (${placement.placed}/${placement.cap})`);
        }
      }
      updateHud();
    });
  }

  updateShopButtons();
}

function getLoadoutUpgradeOptions(towerTypeId) {
  const options = [];
  const towerType = getTowerType(towerTypeId);
  const isSpawner = isSpawnerTowerId(towerTypeId);

  if (isSpawner) {
    const cooldownMax = getSpawnerCooldownUpgradeMaxLevel(towerTypeId);
    const cooldownLevel = getSpawnerCooldownUpgradeLevel(towerTypeId);
    const cooldownAtMax = cooldownLevel >= cooldownMax;
    const cooldownNextLevel = cooldownLevel + 1;
    const cooldownCost = cooldownAtMax ? 0 : getSpawnerCooldownUpgradeCost(towerTypeId, cooldownNextLevel);
    const baseSpawnerType = getSpawnerTowerType(towerTypeId) || towerType;
    const nextCooldownMultiplier = Math.max(0.4, 1 - cooldownNextLevel * SPAWNER_COOLDOWN_UPGRADE_STEP);
    const nextCooldown = Math.max(0.35, Number((baseSpawnerType.spawnInterval * nextCooldownMultiplier).toFixed(2)));
    options.push({
      kind: "cooldown",
      label: "Cooldown",
      level: cooldownLevel,
      maxLevel: cooldownMax,
      atMax: cooldownAtMax,
      cost: cooldownCost,
      detail: cooldownAtMax
        ? `Spawn every ${towerType.spawnInterval.toFixed(2)}s`
        : `${towerType.spawnInterval.toFixed(2)}s -> ${nextCooldown.toFixed(2)}s`,
    });
  } else {
    const damageMax = getTowerDamageUpgradeMaxLevel(towerTypeId);
    const damageLevel = getTowerDamageUpgradeLevel(towerTypeId);
    const damageAtMax = damageLevel >= damageMax;
    const damageNextLevel = damageLevel + 1;
    const damageCost = damageAtMax ? 0 : getTowerDamageUpgradeCost(towerTypeId, damageNextLevel);
    const baseTowerType = TOWER_TYPES[towerTypeId] || towerType;
    const nextDamage = Math.max(1, Math.round(baseTowerType.damage * (1 + damageNextLevel * TOWER_DAMAGE_UPGRADE_STEP)));
    options.push({
      kind: "damage",
      label: "Damage",
      level: damageLevel,
      maxLevel: damageMax,
      atMax: damageAtMax,
      cost: damageCost,
      detail: damageAtMax ? `${towerType.damage}` : `${towerType.damage} -> ${nextDamage}`,
    });

    const attackSpeedMax = getTowerAttackSpeedUpgradeMaxLevel(towerTypeId);
    const attackSpeedLevel = getTowerAttackSpeedUpgradeLevel(towerTypeId);
    const attackSpeedAtMax = attackSpeedLevel >= attackSpeedMax;
    const attackSpeedNextLevel = attackSpeedLevel + 1;
    const attackSpeedCost = attackSpeedAtMax ? 0 : getTowerAttackSpeedUpgradeCost(towerTypeId, attackSpeedNextLevel);
    const nextIntervalMultiplier = Math.max(0.35, 1 - attackSpeedNextLevel * TOWER_ATTACK_SPEED_UPGRADE_STEP);
    const nextFireInterval = Math.max(0.05, Number((baseTowerType.fireInterval * nextIntervalMultiplier).toFixed(3)));
    const currentShots = (1 / Math.max(0.01, towerType.fireInterval)).toFixed(2);
    const nextShots = (1 / Math.max(0.01, nextFireInterval)).toFixed(2);
    options.push({
      kind: "attackSpeed",
      label: "Attack Speed",
      level: attackSpeedLevel,
      maxLevel: attackSpeedMax,
      atMax: attackSpeedAtMax,
      cost: attackSpeedCost,
      detail: attackSpeedAtMax ? `${currentShots}/s` : `${currentShots}/s -> ${nextShots}/s`,
    });

    const rangeMax = getTowerRangeUpgradeMaxLevel(towerTypeId);
    const rangeLevel = getTowerRangeUpgradeLevel(towerTypeId);
    const rangeAtMax = rangeLevel >= rangeMax;
    const rangeNextLevel = rangeLevel + 1;
    const rangeCost = rangeAtMax ? 0 : getTowerRangeUpgradeCost(towerTypeId, rangeNextLevel);
    const nextRangeMultiplier = 1 + rangeNextLevel * TOWER_RANGE_UPGRADE_STEP;
    const nextRange = Math.max(1.2, Number((baseTowerType.range * nextRangeMultiplier).toFixed(2)));
    options.push({
      kind: "range",
      label: "Range",
      level: rangeLevel,
      maxLevel: rangeMax,
      atMax: rangeAtMax,
      cost: rangeCost,
      detail: rangeAtMax ? `${towerType.range.toFixed(1)}` : `${towerType.range.toFixed(1)} -> ${nextRange.toFixed(1)}`,
    });
  }

  const capMax = getTowerCapUpgradeMaxLevel(towerTypeId);
  const capLevel = getTowerCapUpgradeLevel(towerTypeId);
  const capAtMax = capLevel >= capMax;
  const capNextLevel = capLevel + 1;
  const capCost = capAtMax ? 0 : getTowerCapUpgradeCost(towerTypeId, capNextLevel);
  const capCurrent = getTowerPlaceCap(towerTypeId);
  const capNext = Math.min(TOWER_CAP_HARD_LIMIT, capCurrent + 1);
  options.push({
    kind: "placementCap",
    label: "Placement Cap",
    level: capLevel,
    maxLevel: capMax,
    atMax: capAtMax,
    cost: capCost,
    detail: capAtMax ? `${capCurrent}` : `${capCurrent} -> ${capNext}`,
  });

  return options;
}

function tryPurchaseLoadoutUpgrade(towerTypeId, kind) {
  if (!towerTypeId || !isUnlockedForLoadout(towerTypeId)) return false;
  if (!isTowerInLoadout(towerTypeId)) {
    setStatus("Equip that entry first before upgrading.", true);
    return false;
  }

  const towerName = getTowerType(towerTypeId).name;
  let nextLevel = 0;
  let maxLevel = 0;
  let cost = 0;
  let successMessage = "";

  if (kind === "damage") {
    maxLevel = getTowerDamageUpgradeMaxLevel(towerTypeId);
    const currentLevel = getTowerDamageUpgradeLevel(towerTypeId);
    if (maxLevel <= 0) return false;
    if (currentLevel >= maxLevel) {
      setStatus(`${towerName} damage is already maxed.`);
      return false;
    }
    nextLevel = currentLevel + 1;
    cost = getTowerDamageUpgradeCost(towerTypeId, nextLevel);
    if (game.shards < cost) {
      setStatus("Not enough shards for that upgrade.", true);
      updateHud();
      return false;
    }
    game.shards -= cost;
    game.towerDamageUpgrades[towerTypeId] = nextLevel;
    successMessage = `${towerName} damage upgraded (${nextLevel}/${maxLevel}).`;
  } else if (kind === "attackSpeed") {
    maxLevel = getTowerAttackSpeedUpgradeMaxLevel(towerTypeId);
    const currentLevel = getTowerAttackSpeedUpgradeLevel(towerTypeId);
    if (maxLevel <= 0) return false;
    if (currentLevel >= maxLevel) {
      setStatus(`${towerName} attack speed is already maxed.`);
      return false;
    }
    nextLevel = currentLevel + 1;
    cost = getTowerAttackSpeedUpgradeCost(towerTypeId, nextLevel);
    if (game.shards < cost) {
      setStatus("Not enough shards for that upgrade.", true);
      updateHud();
      return false;
    }
    game.shards -= cost;
    game.towerAttackSpeedUpgrades[towerTypeId] = nextLevel;
    successMessage = `${towerName} attack speed upgraded (${nextLevel}/${maxLevel}).`;
  } else if (kind === "range") {
    maxLevel = getTowerRangeUpgradeMaxLevel(towerTypeId);
    const currentLevel = getTowerRangeUpgradeLevel(towerTypeId);
    if (maxLevel <= 0) return false;
    if (currentLevel >= maxLevel) {
      setStatus(`${towerName} range is already maxed.`);
      return false;
    }
    nextLevel = currentLevel + 1;
    cost = getTowerRangeUpgradeCost(towerTypeId, nextLevel);
    if (game.shards < cost) {
      setStatus("Not enough shards for that upgrade.", true);
      updateHud();
      return false;
    }
    game.shards -= cost;
    game.towerRangeUpgrades[towerTypeId] = nextLevel;
    successMessage = `${towerName} range upgraded (${nextLevel}/${maxLevel}).`;
  } else if (kind === "cooldown") {
    maxLevel = getSpawnerCooldownUpgradeMaxLevel(towerTypeId);
    const currentLevel = getSpawnerCooldownUpgradeLevel(towerTypeId);
    if (maxLevel <= 0) return false;
    if (currentLevel >= maxLevel) {
      setStatus(`${towerName} cooldown is already maxed.`);
      return false;
    }
    nextLevel = currentLevel + 1;
    cost = getSpawnerCooldownUpgradeCost(towerTypeId, nextLevel);
    if (game.shards < cost) {
      setStatus("Not enough shards for that upgrade.", true);
      updateHud();
      return false;
    }
    game.shards -= cost;
    game.spawnerCooldownUpgrades[towerTypeId] = nextLevel;
    successMessage = `${towerName} cooldown upgraded (${nextLevel}/${maxLevel}).`;
  } else if (kind === "placementCap") {
    maxLevel = getTowerCapUpgradeMaxLevel(towerTypeId);
    const currentLevel = getTowerCapUpgradeLevel(towerTypeId);
    if (maxLevel <= 0) return false;
    if (currentLevel >= maxLevel) {
      setStatus(`${towerName} placement cap is already maxed.`);
      return false;
    }
    nextLevel = currentLevel + 1;
    cost = getTowerCapUpgradeCost(towerTypeId, nextLevel);
    if (game.shards < cost) {
      setStatus("Not enough shards for that upgrade.", true);
      updateHud();
      return false;
    }
    game.shards -= cost;
    game.towerCapUpgrades[towerTypeId] = nextLevel;
    const upgradedCap = getTowerPlaceCap(towerTypeId);
    successMessage = `${towerName} placement cap increased to ${upgradedCap}.`;
  } else {
    return false;
  }

  refreshPlacedTowerStats(towerTypeId);
  setStatus(successMessage);
  savePlayerProgress();
  renderAccountMenu();
  renderMenuShop();
  renderCreatureShop();
  renderLoadoutMenu();
  renderShop();
  updateHud();
  return true;
}

function renderLoadoutMenu() {
  if (!menuLoadoutEl) return;
  const fragments = [];
  const loadoutLimit = getCurrentLoadoutSlotLimit();
  const equippedCount = game.activeLoadout.size;
  if (menuLoadoutCountEl) menuLoadoutCountEl.textContent = `${equippedCount}/${loadoutLimit} Equipped`;
  const rawSearchText = (menuLoadoutSearchEl?.value || "").trim();
  const searchText = rawSearchText.toLowerCase();

  const renderLoadoutCard = (towerTypeId, type, isSpawner) => {
    const equipped = isTowerInLoadout(towerTypeId);
    const capInfo = getTowerCapBreakdown(towerTypeId);
    let actionLabel = "Equip";
    let actionDisabled = "";

    if (equipped) {
      actionLabel = "Equipped";
      if (game.activeLoadout.size <= 1) {
        actionLabel = "Required";
        actionDisabled = "disabled";
      }
    } else if (game.activeLoadout.size >= loadoutLimit) {
      actionLabel = "Loadout Full";
      actionDisabled = "disabled";
    }

    const isUpgradeOpen = game.loadoutUpgradeTargetId === towerTypeId;
    const upgradeToggleLabel = isUpgradeOpen ? "CLOSE UPGRADE MENU" : "UPGRADE MENU";
    const classes = ["menu-loadout-item", isSpawner ? "spawner" : "", equipped ? "equipped" : ""].filter(Boolean).join(" ");

    const infoLine = isSpawner
      ? `Spawner | Spawn ${Math.max(1, Math.floor(type.spawnCount || 1))} every ${type.spawnInterval.toFixed(2)}s`
      : `${type.summary} | DMG ${type.damage} | RNG ${type.range.toFixed(1)}`;
    const options = isUpgradeOpen ? getLoadoutUpgradeOptions(towerTypeId) : [];
    const upgradePanel = isUpgradeOpen
      ? `
        <div class="menu-loadout-upgrade-panel">
          ${options
            .map((option) => {
              const buttonLabel = option.atMax ? "Maxed" : `${option.cost} Shards`;
              const buttonDisabled = option.atMax || option.maxLevel <= 0 ? "disabled" : "";
              return `
                <div class="menu-loadout-upgrade-row">
                  <div>
                    <strong>${option.label}</strong>
                    <span>${option.detail} | L${option.level}/${option.maxLevel}</span>
                  </div>
                  <button
                    class="menu-loadout-upgrade-buy"
                    type="button"
                    data-loadout-upgrade-target="${towerTypeId}"
                    data-loadout-upgrade-kind="${option.kind}"
                    ${buttonDisabled}
                  >
                    ${buttonLabel}
                  </button>
                </div>
              `;
            })
            .join("")}
        </div>
      `
      : "";

    fragments.push(`
      <div class="${classes}">
        <div>
          <strong>${type.name}</strong>
          <span>${infoLine}</span>
          <span>Placement Cap ${capInfo.cap} (Base ${capInfo.baseCap} +${capInfo.upgradeLevel})</span>
        </div>
        <div class="menu-loadout-actions">
          <button class="menu-loadout-upgrade-toggle" type="button" data-loadout-upgrade-toggle="${towerTypeId}">
            ${upgradeToggleLabel}
          </button>
          <button class="menu-loadout-action" type="button" data-loadout-type="${towerTypeId}" ${actionDisabled}>
            ${actionLabel}
          </button>
        </div>
        ${upgradePanel}
      </div>
    `);
  };

  const unlockedEntries = Object.entries(TOWER_TYPES).filter(([towerTypeId, type]) => {
    if (!isTowerUnlocked(towerTypeId)) return false;
    if (!searchText) return true;
    return (
      type.name.toLowerCase().includes(searchText) ||
      type.summary.toLowerCase().includes(searchText) ||
      towerTypeId.toLowerCase().includes(searchText)
    );
  });
  for (const [towerTypeId] of unlockedEntries) {
    renderLoadoutCard(towerTypeId, getTowerType(towerTypeId), false);
  }

  const unlockedSpawnerEntries = CREATURE_SHOP_ENEMY_IDS.map((enemyTypeId) => {
    const towerTypeId = spawnerTowerIdForEnemy(enemyTypeId);
    const type = getTowerType(towerTypeId);
    return { towerTypeId, type };
  }).filter((entry) => {
    if (!isSpawnerTowerUnlocked(entry.towerTypeId)) return false;
    if (!searchText) return true;
    return (
      entry.type.name.toLowerCase().includes(searchText) ||
      entry.type.summary.toLowerCase().includes(searchText) ||
      entry.towerTypeId.toLowerCase().includes(searchText)
    );
  });
  for (const entry of unlockedSpawnerEntries) {
    renderLoadoutCard(entry.towerTypeId, entry.type, true);
  }

  if (fragments.length === 0) {
    const message = searchText
      ? `No unlocked entries match "${escapeHtml(rawSearchText)}".`
      : "No unlocked towers or spawners available.";
    fragments.push(`
      <div class="menu-loadout-item">
        <div>
          <strong>${message}</strong>
          <span>Unlock towers in Tower Unlock Shop and spawners in Creature Spawner Shop.</span>
        </div>
      </div>
    `);
  }

  menuLoadoutEl.innerHTML = fragments.join("");

  const loadoutButtons = menuLoadoutEl.querySelectorAll(".menu-loadout-action");
  for (const button of loadoutButtons) {
    button.addEventListener("click", () => {
      const towerTypeId = button.dataset.loadoutType;
      if (!towerTypeId || !isUnlockedForLoadout(towerTypeId)) return;

      if (isTowerInLoadout(towerTypeId)) {
        if (game.activeLoadout.size <= 1) {
          setStatus("At least one loadout entry must stay equipped.", true);
          return;
        }
        game.activeLoadout.delete(towerTypeId);
        if (game.loadoutUpgradeTargetId === towerTypeId) game.loadoutUpgradeTargetId = null;
        setStatus(`${getTowerType(towerTypeId).name} removed from loadout.`);
      } else {
        if (game.activeLoadout.size >= loadoutLimit) {
          setStatus(`Loadout is full (${loadoutLimit}). Unequip one first.`, true);
          return;
        }
        game.activeLoadout.add(towerTypeId);
        setStatus(`${getTowerType(towerTypeId).name} added to loadout.`);
      }

      if (!isTowerSelectable(game.selectedTowerType)) {
        game.selectedTowerType = firstAvailableTowerId() || "pulse";
      }
      savePlayerProgress();
      renderAccountMenu();
      renderLoadoutMenu();
      renderShop();
      updateHud();
    });
  }

  const upgradeToggleButtons = menuLoadoutEl.querySelectorAll(".menu-loadout-upgrade-toggle");
  for (const button of upgradeToggleButtons) {
    button.addEventListener("click", () => {
      const towerTypeId = button.dataset.loadoutUpgradeToggle;
      if (!towerTypeId) return;
      game.loadoutUpgradeTargetId = game.loadoutUpgradeTargetId === towerTypeId ? null : towerTypeId;
      renderLoadoutMenu();
    });
  }

  const upgradeBuyButtons = menuLoadoutEl.querySelectorAll(".menu-loadout-upgrade-buy");
  for (const button of upgradeBuyButtons) {
    button.addEventListener("click", () => {
      const towerTypeId = button.dataset.loadoutUpgradeTarget;
      const kind = button.dataset.loadoutUpgradeKind;
      if (!towerTypeId || !kind) return;
      tryPurchaseLoadoutUpgrade(towerTypeId, kind);
    });
  }
}

function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderAccountMenu() {
  if (menuAccountCurrentEl) menuAccountCurrentEl.textContent = `Account: ${game.accountName || "Commander"}`;
  if (!menuAccountEl) return;

  const fragments = [];
  for (const account of progressData.accounts) {
    const active = account.id === game.accountId;
    const spawnerCount = Array.isArray(account.unlockedSpawnerTowers) ? account.unlockedSpawnerTowers.length : 0;
    const loadoutSlots = clampLoadoutSlotLimit(Number(account.maxLoadoutSlots));
    fragments.push(`
      <div class="menu-account-item ${active ? "active" : ""}">
        <div>
          <strong>${escapeHtml(account.name)}</strong>
          <span>${account.shards} shards | ${account.unlockedTowers.length} towers | ${spawnerCount} spawners | ${loadoutSlots} slots | L${Math.max(1, account.maxLevelUnlocked || 1)}</span>
        </div>
        <div class="menu-account-actions">
          <button type="button" data-account-action="switch" data-account-id="${account.id}" ${active ? "disabled" : ""}>
            ${active ? "Active" : "Switch"}
          </button>
          <button type="button" data-account-action="delete" data-account-id="${account.id}">
            Delete
          </button>
        </div>
      </div>
    `);
  }

  menuAccountEl.innerHTML = fragments.join("");
  menuAccountEl.onclick = (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const button = target.closest("button[data-account-action][data-account-id]");
    if (!button || !menuAccountEl.contains(button)) return;
    const accountId = button.dataset.accountId;
    const action = button.dataset.accountAction;
    if (!accountId || !action) return;
    if (action === "switch") {
      if (accountId === game.accountId) return;
      switchToAccount(accountId);
      return;
    }
    if (action === "delete") {
      deleteAccountById(accountId);
    }
  };
}

function deleteAccountById(accountId) {
  const account = progressData.accounts.find((entry) => entry.id === accountId);
  if (!account) return;

  if (progressData.accounts.length <= 1) {
    setStatus("Cannot delete the only account.", true);
    return;
  }

  const confirmed = typeof window.confirm === "function"
    ? window.confirm(`Delete account "${account.name}"? This cannot be undone.`)
    : true;
  if (!confirmed) return;

  const index = progressData.accounts.findIndex((entry) => entry.id === accountId);
  if (index < 0) return;
  const removed = progressData.accounts[index];
  const deletingActive = removed.id === progressData.currentAccountId;
  progressData.accounts.splice(index, 1);

  if (progressData.accounts.length === 0) {
    const fallback = createAccountRecord("Commander");
    progressData.accounts = [fallback];
    progressData.currentAccountId = fallback.id;
  } else if (deletingActive) {
    progressData.currentAccountId = progressData.accounts[0].id;
  }

  if (deletingActive) {
    applyAccountToGame(getCurrentAccountRecord());
  }
  savePlayerProgress();
  renderMapPreview();
  renderAccountMenu();
  renderMenuShop();
  renderCreatureShop();
  renderLoadoutMenu();
  renderShop();
  updateHud();
  if (accountNameInputEl) accountNameInputEl.value = game.accountName || "";
  setStatus(`Deleted account ${removed.name}.`);
}

function switchToAccount(accountId, quiet = false) {
  const account = progressData.accounts.find((entry) => entry.id === accountId);
  if (!account) return;

  progressData.currentAccountId = account.id;
  applyAccountToGame(account);
  savePlayerProgress();
  renderMapPreview();
  renderAccountMenu();
  renderMenuShop();
  renderCreatureShop();
  renderLoadoutMenu();
  renderShop();
  updateHud();
  if (!quiet) setStatus(`Switched to account ${account.name}.`);
}

function createAccountFromInput() {
  const rawName = accountNameInputEl ? accountNameInputEl.value : "";
  const name = sanitizeAccountName(rawName);
  if (!name) {
    setStatus("Enter an account name first.", true);
    return;
  }

  const existing = progressData.accounts.find((account) => account.name.toLowerCase() === name.toLowerCase());
  if (existing) {
    switchToAccount(existing.id);
    if (accountNameInputEl) accountNameInputEl.value = existing.name;
    return;
  }

  const account = createAccountRecord(name);
  progressData.accounts.push(account);
  progressData.currentAccountId = account.id;
  applyAccountToGame(account);
  savePlayerProgress();
  renderAccountMenu();
  renderMenuShop();
  renderCreatureShop();
  renderLoadoutMenu();
  renderShop();
  updateHud();
  if (accountNameInputEl) accountNameInputEl.value = account.name;
  setStatus(`Account ${account.name} created.`);
}

function resetAllProgressFromCommand() {
  clearPendingLevelClearPanel();
  closeLevelClearPanel();
  const storage = getProgressStorage();
  if (storage) {
    try {
      storage.removeItem(PROGRESS_STORAGE_KEY);
      storage.removeItem(LEGACY_PROGRESS_STORAGE_KEY);
    } catch (_) {}
  }

  progressData = defaultProgressData();
  applyAccountToGame(getCurrentAccountRecord());
  savePlayerProgress();
  renderAccountMenu();
  renderMenuShop();
  renderCreatureShop();
  renderLoadoutMenu();
  renderShop();
  updateHud();
  setStatus("All account progress reset.");
}

function renderMenuShop() {
  if (!menuShopEl) return;

  const fragments = [];
  for (const towerTypeId of MENU_UNLOCK_TOWER_IDS) {
    const type = getTowerType(towerTypeId);
    const unlock = TOWER_UNLOCKS[towerTypeId];
    const unlocked = isTowerUnlocked(towerTypeId);
    const canAfford = game.shards >= unlock.shardCost;
    const itemClasses = [
      "menu-unlock-item",
      unlocked ? "unlocked" : "",
      !unlocked && !canAfford ? "unaffordable" : "",
    ]
      .filter(Boolean)
      .join(" ");

    fragments.push(`
      <div class="${itemClasses}">
        <div>
          <strong>${type.name}</strong>
          <span>${type.summary} | DMG ${type.damage} | RNG ${type.range.toFixed(1)}</span>
        </div>
        <button
          class="unlock-action"
          type="button"
          data-unlock-type="${towerTypeId}"
          ${unlocked ? "disabled" : ""}
        >
          ${unlocked ? "Unlocked" : `${unlock.shardCost} Shards`}
        </button>
      </div>
    `);
  }

  menuShopEl.innerHTML = fragments.join("");

  const unlockButtons = menuShopEl.querySelectorAll("button[data-unlock-type]");
  for (const button of unlockButtons) {
    button.addEventListener("click", () => {
      const towerTypeId = button.dataset.unlockType;
      const unlock = TOWER_UNLOCKS[towerTypeId];
      if (!unlock || isTowerUnlocked(towerTypeId)) return;
      if (game.shards < unlock.shardCost) {
        setStatus("Not enough shards to unlock that tower.", true);
        updateHud();
        return;
      }

      game.shards -= unlock.shardCost;
      game.unlockedTowers.add(towerTypeId);
      const tower = getTowerType(towerTypeId);
      setStatus(`${tower.name} unlocked in the menu shop.`);
      savePlayerProgress();
      renderAccountMenu();
      renderMenuShop();
      renderCreatureShop();
      renderShop();
      updateHud();
    });
  }
}

function renderCreatureShop() {
  if (!menuCreatureShopEl) return;

  const totalCount = CREATURE_SHOP_ENEMY_IDS.length;
  const unlockedCount = CREATURE_SHOP_ENEMY_IDS.filter((enemyTypeId) =>
    game.unlockedSpawnerTowers.has(enemyTypeId)
  ).length;
  if (menuCreatureSummaryEl) menuCreatureSummaryEl.textContent = `Unlocked: ${unlockedCount}/${totalCount}`;

  const fragments = [];
  for (const enemyTypeId of CREATURE_SHOP_ENEMY_IDS) {
    const enemyType = ENEMY_TYPES[enemyTypeId];
    const unlock = CREATURE_SPAWNER_UNLOCKS[enemyTypeId];
    if (!enemyType || !unlock) continue;
    const killCount = getEnemyKillCount(enemyTypeId);
    const unlocked = game.unlockedSpawnerTowers.has(enemyTypeId);
    const progress = Math.min(1, killCount / Math.max(1, unlock.killRequirement));
    const towerType = getTowerType(spawnerTowerIdForEnemy(enemyTypeId));
    const classes = [
      "menu-unlock-item",
      "menu-creature-item",
      unlocked ? "unlocked" : "",
    ]
      .filter(Boolean)
      .join(" ");

    fragments.push(`
      <div class="${classes}">
        <div>
          <strong>${enemyType.name} Spawner</strong>
          <span>Kills ${killCount}/${unlock.killRequirement} | Cost ${towerType.cost} | Spawn ${towerType.spawnCount || 1} every ${towerType.spawnInterval.toFixed(1)}s</span>
          <div class="menu-creature-progress" aria-hidden="true">
            <div class="menu-creature-progress-fill" style="transform: scaleX(${progress})"></div>
          </div>
        </div>
        <button class="unlock-action" type="button" disabled>
          ${unlocked ? "Unlocked" : "Locked"}
        </button>
      </div>
    `);
  }

  menuCreatureShopEl.innerHTML = fragments.join("");
}

function setMenuView(view) {
  if (view !== "loadout") game.loadoutUpgradeTargetId = null;
  game.menuView = view;
  if (menuCardEl) menuCardEl.dataset.view = view;
}

function openMenuShop() {
  closeDefeatPanel();
  closeLevelClearPanel();
  closeExitConfirm();
  closeSettingsPanel();
  if (!Number.isFinite(game.menuSelectedLevel)) game.menuSelectedLevel = getHighestUnlockedLevel();
  game.menuSelectedLevel = clampMenuSelectedLevel(game.menuSelectedLevel);
  game.menuOpen = true;
  if (menuScreenEl) menuScreenEl.hidden = false;
  document.body.classList.add("menu-active");
  if (playBtn) playBtn.textContent = getMenuPlayButtonLabel();
  setMenuView("home");
  renderMapPreview();
  renderAccountMenu();
  renderMenuShop();
  renderCreatureShop();
  renderLoadoutMenu();
  refreshMultiplayerPanel();
  updateHud();
}

function closeMenuShop() {
  clearMapPreviewAnimation();
  game.menuOpen = false;
  if (menuScreenEl) menuScreenEl.hidden = true;
  document.body.classList.remove("menu-active");
  if (playBtn) playBtn.textContent = getMenuPlayButtonLabel();
  updateHud();
}

function openUnlocksMenu() {
  if (game.started && !game.over) {
    setStatus("Tower unlocks are menu-only before starting a run.", true);
    return;
  }
  openMenuShop();
  setMenuView("shop");
  if (menuShopEl) menuShopEl.scrollTop = 0;
}

function openCreatureMenu() {
  openMenuShop();
  setMenuView("creatures");
  renderCreatureShop();
  if (menuCreatureShopEl) menuCreatureShopEl.scrollTop = 0;
}

function openAccountMenu() {
  openMenuShop();
  setMenuView("account");
  renderAccountMenu();
  if (menuAccountEl) menuAccountEl.scrollTop = 0;
  if (accountNameInputEl) {
    accountNameInputEl.value = game.accountName || "";
    accountNameInputEl.focus();
    accountNameInputEl.select();
  }
}

function openLoadoutMenu() {
  if (game.started && !game.over) {
    setStatus("Loadout changes are menu-only before starting a run.", true);
    return;
  }
  openMenuShop();
  setMenuView("loadout");
  game.loadoutUpgradeTargetId = null;
  if (menuLoadoutSearchEl) menuLoadoutSearchEl.value = "";
  renderLoadoutMenu();
  if (menuLoadoutEl) menuLoadoutEl.scrollTop = 0;
  if (menuLoadoutSearchEl) {
    menuLoadoutSearchEl.focus();
    menuLoadoutSearchEl.select();
  }
}

function openMultiplayerMenu() {
  openMenuShop();
  setMenuView("multiplayer");
  refreshMultiplayerPanel();
  if (multiplayerServerInputEl) {
    if (!multiplayerServerInputEl.value && multiplayer.serverUrl) multiplayerServerInputEl.value = multiplayer.serverUrl;
  }
  if (multiplayerRoomInputEl) {
    if (!multiplayerRoomInputEl.value && multiplayer.roomCode) multiplayerRoomInputEl.value = multiplayer.roomCode;
    if (multiplayerServerInputEl && !multiplayerServerInputEl.value) {
      multiplayerServerInputEl.focus();
      multiplayerServerInputEl.select();
    } else {
      multiplayerRoomInputEl.focus();
      multiplayerRoomInputEl.select();
    }
  }
}

function closeAccountMenu() {
  setMenuView("home");
}

function closeUnlocksMenu() {
  setMenuView("home");
}

function closeCreatureMenu() {
  setMenuView("home");
}

function closeLoadoutMenu() {
  setMenuView("home");
}

function closeMultiplayerMenu() {
  setMenuView("home");
}

function openExitConfirm() {
  if (game.levelClearOpen || game.defeatOpen) return;
  if (!exitConfirmEl) {
    openMenuShop();
    return;
  }
  closeSettingsPanel();
  game.exitConfirmOpen = true;
  exitConfirmEl.hidden = false;
  updateHud();
}

function closeExitConfirm() {
  game.exitConfirmOpen = false;
  if (exitConfirmEl) exitConfirmEl.hidden = true;
  updateHud();
}

function clearPendingLevelClearPanel() {
  if (game.levelClearTimer) {
    clearTimeout(game.levelClearTimer);
    game.levelClearTimer = null;
  }
}

function openDefeatPanel() {
  if (!defeatPanelEl) {
    openMenuShop();
    return;
  }
  closeSettingsPanel();
  closeCommandConsole();
  game.defeatOpen = true;
  defeatPanelEl.hidden = false;
  updateHud();
}

function closeDefeatPanel() {
  game.defeatOpen = false;
  if (defeatPanelEl) defeatPanelEl.hidden = true;
  updateHud();
}

function acknowledgeDefeatToMenu() {
  closeDefeatPanel();
  openMenuShop();
}

function openLevelClearPanel() {
  if (!levelClearPanelEl) {
    openMenuShop();
    return;
  }
  closeSettingsPanel();
  closeCommandConsole();
  if (levelClearTitleEl) levelClearTitleEl.textContent = game.levelClearTitle || "Level Cleared";
  if (levelClearTextEl) levelClearTextEl.textContent = game.levelClearText || "Victory confirmed. New map access awarded.";
  game.levelClearOpen = true;
  levelClearPanelEl.hidden = false;
  updateHud();
}

function closeLevelClearPanel() {
  game.levelClearOpen = false;
  if (levelClearPanelEl) levelClearPanelEl.hidden = true;
  updateHud();
}

function acknowledgeLevelClearToMenu() {
  closeLevelClearPanel();
  openMenuShop();
}

function confirmExitToMenu() {
  closeExitConfirm();
  openMenuShop();
}

function toggleMenuHome() {
  if (!game.started) return;
  if (game.defeatOpen) {
    acknowledgeDefeatToMenu();
    return;
  }
  if (game.levelClearOpen) {
    acknowledgeLevelClearToMenu();
    return;
  }
  if (game.menuOpen && game.menuView === "home") {
    closeMenuShop();
    return;
  }

  if (!game.menuOpen) {
    openExitConfirm();
    return;
  }

  openMenuShop();
}

function toggleUnlocksMenu() {
  if (!game.started) return;
  if (game.menuOpen && game.menuView === "shop") closeMenuShop();
  else openUnlocksMenu();
}

function toggleLoadoutMenu() {
  if (!game.started) return;
  if (game.menuOpen && game.menuView === "loadout") closeMenuShop();
  else openLoadoutMenu();
}

function syncMusicState() {
  if (
    !game.started ||
    game.over ||
    !audioSystem.musicEnabled ||
    game.paused ||
    game.menuOpen ||
    game.exitConfirmOpen ||
    game.levelClearOpen ||
    game.defeatOpen
  ) {
    audioSystem.stopBossMusic();
    audioSystem.stopFluteMusic(true);
    return;
  }

  const bossFightActive = game.inWave && getActiveBossEnemies().length > 0;
  if (bossFightActive) {
    audioSystem.startBossMusic();
  } else {
    audioSystem.stopBossMusic();
    audioSystem.startFluteMusic();
  }
}

function formatSpeedLabel(multiplier) {
  return `${Number(multiplier).toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1")}x`;
}

function applyGameSpeedStep(nextIndex, announce = true) {
  const clamped = Math.max(0, Math.min(GAME_SPEED_STEPS.length - 1, Math.floor(nextIndex)));
  if (!Number.isFinite(clamped)) return;
  if (clamped === game.speedStepIndex) {
    updateHud();
    return;
  }

  game.speedStepIndex = clamped;
  game.speedMultiplier = GAME_SPEED_STEPS[clamped];
  if (announce && game.started) setStatus(`Game speed set to ${formatSpeedLabel(game.speedMultiplier)}.`);
  updateHud();
}

function stepGameSpeed(delta) {
  if (isMultiplayerClient() && isMultiplayerActive()) {
    if (!Number.isFinite(delta) || delta === 0) return;
    const dir = delta > 0 ? 1 : -1;
    sendMultiplayerAction("setSpeedStep", { index: game.speedStepIndex + dir });
    return;
  }
  if (!game.started || game.over || game.menuOpen || game.exitConfirmOpen || game.levelClearOpen || game.defeatOpen) return;
  if (!Number.isFinite(delta) || delta === 0) return;
  const dir = delta > 0 ? 1 : -1;
  applyGameSpeedStep(game.speedStepIndex + dir, true);
}

function updateHud() {
  const selectedTower = updateShopButtons();
  const placement = getTowerPlacementStats(game.selectedTowerType);
  const selectedCapInfo = getTowerCapBreakdown(game.selectedTowerType);
  moneyEl.textContent = `Credits: ${game.money}`;
  if (shardsEl) shardsEl.textContent = `Shards: ${game.shards}`;
  if (menuShardsEl) menuShardsEl.textContent = `Shards: ${game.shards}`;
  if (playBtn) playBtn.textContent = getMenuPlayButtonLabel();
  if (menuAccountCurrentEl) menuAccountCurrentEl.textContent = `Account: ${game.accountName || "Commander"}`;
  if (multiplayerPlayersHudEl) multiplayerPlayersHudEl.textContent = getMultiplayerHudRosterText();
  livesEl.textContent = `Core HP: ${game.lives}`;
  waveEl.textContent = `Wave: ${game.wave}`;
  buildBtn.textContent = `Build ${selectedTower.name} (${placement.placed}/${placement.cap}, +${selectedCapInfo.upgradeLevel}) (B) - ${selectedTower.cost}`;
  sellBtn.textContent = "Sell (X) - 40%";
  laneBtn.textContent = game.editingLane ? "Lane Edit (L): On" : "Lane Edit (L)";
  if (loadoutBtn) loadoutBtn.textContent = `Loadout (O) ${game.activeLoadout.size}/${getCurrentLoadoutSlotLimit()}`;
  if (unlockBtn) unlockBtn.textContent = "Unlock Shop (U)";
  menuBtn.textContent = game.menuOpen ? "Menu (M): Open" : "Menu (M)";
  startWaveBtn.textContent = game.levelOneDefeated ? "Level One Complete" : "Start Wave";
  if (pauseBtn) pauseBtn.textContent = game.paused ? "Resume (P)" : "Pause (P)";
  if (speedValueEl) speedValueEl.textContent = formatSpeedLabel(game.speedMultiplier);
  if (autoWaveBtn) {
    autoWaveBtn.textContent = game.autoWaveEnabled
      ? `Auto: On (${game.inWave ? "Wave" : `${Math.max(0, Math.ceil(game.autoWaveCountdown))}s`})`
      : "Auto: Off";
    autoWaveBtn.classList.toggle("active", game.autoWaveEnabled);
  }
  if (pauseBtn) pauseBtn.classList.toggle("active", game.paused);
  if (settingsToggleBtn) settingsToggleBtn.classList.toggle("active", game.settingsOpen);
  buildBtn.classList.toggle("active", game.placing);
  sellBtn.classList.toggle("active", game.selling);
  laneBtn.classList.toggle("active", game.editingLane);

  if (speedControlEl) speedControlEl.hidden = !game.started || game.menuOpen;
  if (autoWaveBtn) autoWaveBtn.hidden = !game.started || game.menuOpen;
  const lockMetaMenusDuringRun = game.started && !game.over;
  if (openUnlockShopBtn) openUnlockShopBtn.disabled = lockMetaMenusDuringRun;
  if (openLoadoutBtn) openLoadoutBtn.disabled = lockMetaMenusDuringRun;
  if (openCreatureFromUnlockBtn) openCreatureFromUnlockBtn.disabled = lockMetaMenusDuringRun;
  const speedLocked = !game.started || game.over || game.menuOpen || game.exitConfirmOpen || game.levelClearOpen || game.defeatOpen;
  if (speedDownBtn) speedDownBtn.disabled = speedLocked || game.speedStepIndex <= 0;
  if (speedUpBtn) speedUpBtn.disabled = speedLocked || game.speedStepIndex >= GAME_SPEED_STEPS.length - 1;

  const locked =
    !game.started || game.over || game.paused || game.menuOpen || game.exitConfirmOpen || game.levelClearOpen || game.defeatOpen;
  buildBtn.disabled = locked;
  sellBtn.disabled = locked;
  laneBtn.disabled = locked;
  if (loadoutBtn) loadoutBtn.disabled = !game.started || game.exitConfirmOpen || game.levelClearOpen || game.defeatOpen;
  startWaveBtn.disabled = locked;
  if (pauseBtn) pauseBtn.disabled = !game.started || game.over || game.menuOpen || game.exitConfirmOpen || game.levelClearOpen || game.defeatOpen;
  if (autoWaveBtn) autoWaveBtn.disabled = locked;
  if (settingsToggleBtn) settingsToggleBtn.disabled = !game.started || game.exitConfirmOpen || game.levelClearOpen || game.defeatOpen;
  if (unlockBtn) unlockBtn.disabled = !game.started || game.exitConfirmOpen || game.levelClearOpen || game.defeatOpen;
  menuBtn.disabled = !game.started || game.exitConfirmOpen || game.levelClearOpen || game.defeatOpen;
  const buttons = shopEl.querySelectorAll(".shop-item");
  for (const button of buttons) button.disabled = locked;
  refreshSettingsPanel();
  updateBossBar();
}

function togglePause() {
  if (isMultiplayerClient() && isMultiplayerActive()) {
    sendMultiplayerAction("togglePause");
    return;
  }
  if (!game.started || game.menuOpen || game.exitConfirmOpen || game.levelClearOpen || game.defeatOpen) return;
  if (game.over) return;
  game.paused = !game.paused;
  if (game.paused) {
    game.placing = false;
    game.selling = false;
    game.editingLane = false;
    game.hoverCell = null;
    setStatus("Game paused.");
  } else {
    setStatus("Game resumed.");
  }
  syncMusicState();
  updateHud();
}

function toggleAutoWave() {
  if (isMultiplayerClient() && isMultiplayerActive()) {
    sendMultiplayerAction("toggleAutoWave");
    return;
  }
  if (!game.started || game.menuOpen || game.exitConfirmOpen || game.paused) return;
  if (game.over) return;
  game.autoWaveEnabled = !game.autoWaveEnabled;
  game.autoWaveCountdown = game.autoWaveInterval;
  setStatus(
    game.autoWaveEnabled
      ? "Auto-wave enabled. New waves start every 10s while lane is clear."
      : "Auto-wave disabled."
  );
  updateHud();
}

function toggleSellMode() {
  if (isMultiplayerClient() && isMultiplayerActive()) {
    sendMultiplayerAction("setSelling", { value: !game.selling });
    return;
  }
  if (!game.started || game.menuOpen || game.exitConfirmOpen || game.paused) return;
  if (game.over) return;
  game.selling = !game.selling;
  if (game.selling) {
    game.placing = false;
    game.editingLane = false;
  }
  setStatus(
    game.selling
      ? "Sell mode active. Click a tower to recover 40% of its cost."
      : "Sell mode off."
  );
  updateHud();
}

function editLaneAtCell(cellX, cellY) {
  if (!inBounds(cellX, cellY)) return;
  if (game.inWave || game.enemies.length > 0 || game.allies.length > 0) {
    setStatus("Wait until the current wave is fully clear before editing lanes.", true);
    return;
  }

  const key = cellKey(cellX, cellY);
  const locked = isLaneEndpoint(cellX, cellY);
  const currentlyLane = pathCellSet.has(key);

  if (!currentlyLane && getTowerAtCell(cellX, cellY)) {
    setStatus("Sell the tower on that tile before turning it into a lane.", true);
    return;
  }

  if (locked && currentlyLane) {
    setStatus("Entry and core lane tiles are locked.", true);
    return;
  }

  const nextLaneSet = new Set(pathCellSet);
  if (currentlyLane) nextLaneSet.delete(key);
  else nextLaneSet.add(key);
  nextLaneSet.add(LANE_START_KEY);
  nextLaneSet.add(LANE_END_KEY);

  if (!commitLaneCellSet(nextLaneSet)) {
    setStatus("Invalid lane shape. Keep one connected route from entry to core.", true);
    return;
  }

  rebuildWorld();
  const change = currentlyLane ? "removed from" : "added to";
  setStatus(`Lane tile ${cellX},${cellY} ${change} route.`);
  updateHud();
}

function toggleLaneEditMode() {
  if (isMultiplayerClient() && isMultiplayerActive()) {
    sendMultiplayerAction("setLaneEditing", { value: !game.editingLane });
    return;
  }
  if (!game.started || game.menuOpen || game.exitConfirmOpen || game.paused) return;
  if (game.over) return;
  if (!game.editingLane && (game.inWave || game.enemies.length > 0 || game.allies.length > 0)) {
    setStatus("Wait until the current wave is fully clear before editing lanes.", true);
    return;
  }

  game.editingLane = !game.editingLane;
  if (game.editingLane) {
    game.placing = false;
    game.selling = false;
    setStatus("Lane edit mode active. Click tiles to add/remove lane. Entry and core are locked.");
  } else {
    setStatus("Lane edit mode off.");
  }
  updateHud();
}

function tryPlaceTowerAtCell(cellX, cellY, towerTypeId = game.selectedTowerType, placedByPeer = "") {
  if (!Number.isFinite(cellX) || !Number.isFinite(cellY)) return false;
  const targetCellX = Math.floor(cellX);
  const targetCellY = Math.floor(cellY);
  const selectedTower = getTowerType(towerTypeId);
  const placement = getTowerPlacementStats(towerTypeId);

  if (!isTowerSelectable(towerTypeId)) {
    if (isSpawnerTowerId(towerTypeId)) {
      if (!isSpawnerTowerUnlocked(towerTypeId)) {
        setStatus("That creature spawner is locked. Unlock it in the Creature Spawner Shop.", true);
      } else {
        setStatus("That spawner is not in your loadout. Equip it first.", true);
      }
    } else {
      setStatus("That tower is not in your loadout. Equip it first.", true);
    }
    return false;
  }

  if (placement.atCap) {
    setStatus(`${selectedTower.name} cap reached (${placement.placed}/${placement.cap}). Sell one first.`, true);
    return false;
  }

  if (!canPlaceTower(targetCellX, targetCellY, towerTypeId)) {
    setStatus("You can't build there.", true);
    return false;
  }

  if (game.money < selectedTower.cost) {
    setStatus("Not enough credits.", true);
    return false;
  }

  game.selectedTowerType = towerTypeId;
  game.money -= selectedTower.cost;
  game.towers.push(new Tower(targetCellX, targetCellY, towerTypeId));
  const updatedPlacement = getTowerPlacementStats(towerTypeId);
  if (placedByPeer) {
    setStatus(`${selectedTower.name} deployed by ${placedByPeer}. (${updatedPlacement.placed}/${updatedPlacement.cap})`);
  } else {
    setStatus(`${selectedTower.name} tower deployed. (${updatedPlacement.placed}/${updatedPlacement.cap})`);
  }
  updateHud();
  return true;
}

function canPlaceTower(cellX, cellY, towerTypeId = game.selectedTowerType) {
  if (cellX < 0 || cellY < 0 || cellX >= COLS || cellY >= ROWS) return false;
  if (pathCellSet.has(cellKey(cellX, cellY))) return false;
  if (game.towers.some((tower) => tower.cellX === cellX && tower.cellY === cellY)) return false;
  return !getTowerPlacementStats(towerTypeId).atCap;
}

function getTowerAtCell(cellX, cellY) {
  return game.towers.find((tower) => tower.cellX === cellX && tower.cellY === cellY) || null;
}

function sellTowerAtCell(cellX, cellY) {
  const tower = getTowerAtCell(cellX, cellY);
  if (!tower) {
    setStatus("No tower on this tile to sell.", true);
    return;
  }

  const refund = Math.max(1, Math.round(tower.cost * SELL_REFUND_RATIO));
  game.money += refund;
  tower.dispose();
  game.towers = game.towers.filter((entry) => entry !== tower);
  setStatus(`${tower.name} tower sold for ${refund} credits.`);
  updateHud();
}

function spawnEnemy() {
  const typeId = game.spawnQueue.shift() || "crawler";
  const stats = createEnemyStats(typeId, game.wave, game.currentLevel);
  const enemy = new Enemy(stats);
  game.spawnLeft = game.spawnQueue.length;
  game.enemies.push(enemy);
  if (typeId === "icosahedron" || typeId === "rhombus" || typeId === "star") game.bossEnemy = enemy;
  return typeId;
}

function startWave() {
  if (isMultiplayerClient() && isMultiplayerActive()) {
    sendMultiplayerAction("startWave");
    return;
  }
  audioSystem.unlock();
  if (!game.started || game.menuOpen || game.exitConfirmOpen || game.paused) return;
  if (game.levelOneDefeated) {
    setStatus("Current level already cleared. Return to menu for the next map.");
    return;
  }
  if (game.over) return;
  if (game.inWave) {
    setStatus("Wave already active.");
    return;
  }
  if (pathSegments.length === 0 || totalPathLength <= 0) {
    setStatus("Lane route is invalid. Use lane edit mode to reconnect entry to core.", true);
    return;
  }

  game.editingLane = false;
  game.wave += 1;
  game.inWave = true;
  game.waveCreditsEarned = 0;
  const profile = getLevelDifficultyProfile(game.currentLevel);
  const baseSpawnCount = 7 + game.wave * 2;
  const spawnCount = Math.max(1, Math.round(baseSpawnCount * profile.spawnMultiplier + profile.spawnFlatBonus));
  game.spawnQueue = buildWaveSpawnQueue(game.wave, spawnCount, game.currentLevel);
  game.spawnLeft = game.spawnQueue.length;
  game.spawnTimer = profile.spawnStartDelay;
  game.autoWaveCountdown = game.autoWaveInterval;
  syncMusicState();
  setStatus(`Wave ${game.wave} started. ${waveThreatLabel(game.wave, game.currentLevel)}`);
  updateHud();
}

function endWaveIfDone() {
  if (!game.inWave) return;

  const living = game.enemies.some((enemy) => enemy.alive);
  if (game.spawnLeft <= 0 && !living) {
    game.inWave = false;
    syncMusicState();
    const bonusCredits = 30 + game.wave * 5;
    game.money += bonusCredits;
    game.waveCreditsEarned += bonusCredits;
    const shardGain = Math.ceil(game.waveCreditsEarned * 0.01);
    game.shards += shardGain;
    setStatus(`Wave cleared. +${bonusCredits} credits, +${shardGain} shards.`);
    game.waveCreditsEarned = 0;
    savePlayerProgress();
    renderAccountMenu();
    renderMenuShop();
    renderCreatureShop();
    updateHud();
  }
}

function screenToWorld(event) {
  const rect = canvas.getBoundingClientRect();
  pointerNdc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointerNdc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointerNdc, camera);
  if (!raycaster.ray.intersectPlane(boardPlane, hitPoint)) return null;
  return { x: hitPoint.x, z: hitPoint.z };
}

function onPointerMove(event) {
  if (!game.started || game.menuOpen || game.exitConfirmOpen || game.levelClearOpen || game.defeatOpen || game.paused) return;
  const point = screenToWorld(event);
  if (!point) {
    game.hoverCell = null;
    return;
  }

  const { cellX, cellY } = worldToCell(point.x, point.z);
  game.hoverCell = { cellX, cellY };
}

function onPointerDown(event) {
  audioSystem.unlock();
  if (!game.started || game.menuOpen || game.exitConfirmOpen || game.levelClearOpen || game.defeatOpen || game.paused) return;
  if (game.over) return;

  if (event.button === 2) {
    if (game.placing) {
      if (isMultiplayerClient() && isMultiplayerActive()) {
        sendMultiplayerAction("setPlacing", { value: false });
      } else {
        game.placing = false;
        setStatus("Build mode off.");
        updateHud();
      }
    }
    return;
  }

  onPointerMove(event);
  if (!game.hoverCell) return;

  const { cellX, cellY } = game.hoverCell;

  if (game.editingLane) {
    if (isMultiplayerClient() && isMultiplayerActive()) {
      sendMultiplayerAction("editLane", { cellX, cellY });
      return;
    }
    editLaneAtCell(cellX, cellY);
    return;
  }

  if (game.selling) {
    if (isMultiplayerClient() && isMultiplayerActive()) {
      sendMultiplayerAction("sellTower", { cellX, cellY });
      return;
    }
    sellTowerAtCell(cellX, cellY);
    return;
  }

  if (!game.placing) return;
  if (isMultiplayerClient() && isMultiplayerActive()) {
    sendMultiplayerAction("placeTower", { cellX, cellY, towerTypeId: game.selectedTowerType });
    return;
  }
  tryPlaceTowerAtCell(cellX, cellY, game.selectedTowerType);
}

function toggleBuildMode() {
  if (isMultiplayerClient() && isMultiplayerActive()) {
    sendMultiplayerAction("setPlacing", { value: !game.placing });
    return;
  }
  if (!game.started || game.menuOpen || game.exitConfirmOpen || game.paused) return;
  if (game.over) return;
  game.placing = !game.placing;
  if (game.placing) {
    game.selling = false;
    game.editingLane = false;
  }
  const selectedTower = getTowerType(game.selectedTowerType);
  const placement = getTowerPlacementStats(game.selectedTowerType);
  if (game.placing) {
    if (placement.atCap) {
      setStatus(
        `Build mode active: ${selectedTower.name}. Cap reached (${placement.placed}/${placement.cap}) until you sell one.`,
        true
      );
    } else {
      setStatus(`Build mode active: ${selectedTower.name} (${placement.placed}/${placement.cap}).`);
    }
  } else {
    setStatus("Build mode off.");
  }
  updateHud();
}

function updatePlacementPreview() {
  if (
    game.paused ||
    game.menuOpen ||
    game.exitConfirmOpen ||
    (!game.placing && !game.selling && !game.editingLane) ||
    !game.hoverCell
  ) {
    previewGroup.visible = false;
    return;
  }

  const { cellX, cellY } = game.hoverCell;
  if (cellX < 0 || cellY < 0 || cellX >= COLS || cellY >= ROWS) {
    previewGroup.visible = false;
    return;
  }

  const world = cellToWorld(cellX, cellY);
  const baseY = getCellTopY(cellX, cellY);
  previewGroup.visible = true;
  previewGroup.position.set(world.x, baseY, world.z);

  if (game.editingLane) {
    const key = cellKey(cellX, cellY);
    const removing = pathCellSet.has(key);
    let valid = true;

    if (!removing && getTowerAtCell(cellX, cellY)) valid = false;
    if (removing && isLaneEndpoint(cellX, cellY)) valid = false;

    if (valid) {
      const nextLaneSet = new Set(pathCellSet);
      if (removing) nextLaneSet.delete(key);
      else nextLaneSet.add(key);
      nextLaneSet.add(LANE_START_KEY);
      nextLaneSet.add(LANE_END_KEY);
      valid = !!buildPathRoute(nextLaneSet);
    }

    previewRing.scale.set(1.05, 1.05, 1);
    setLanePreviewColor(valid, removing);
    return;
  }

  if (game.selling) {
    const tower = getTowerAtCell(cellX, cellY);
    const valid = !!tower;
    previewRing.scale.set(1.2, 1.2, 1);
    setPreviewColor(valid, true);
    return;
  }

  const selectedTower = getTowerType(game.selectedTowerType);
  const valid = canPlaceTower(cellX, cellY, game.selectedTowerType) && game.money >= selectedTower.cost;
  previewRing.scale.set(selectedTower.range, selectedTower.range, 1);
  setPreviewColor(valid);
}

function updateMapEffects(dt) {
  const moonLevel = game.currentLevel === 2;
  const emberLevel = game.currentLevel >= 3;
  const showPulses = !game.inWave;
  for (const pulse of mapState.pulseOrbs) {
    pulse.mesh.visible = showPulses;
    if (!showPulses) continue;
    const pulseSpeed = emberLevel ? 6.1 : moonLevel ? 5.4 : 6.6;
    const pulseY = emberLevel ? 0.82 : moonLevel ? 0.8 : 0.84;
    const pulseWave = emberLevel ? 6.4 : moonLevel ? 5.8 : 7;
    const pulseAmp = emberLevel ? 0.07 : moonLevel ? 0.06 : 0.08;
    const point = pointOnPath(game.time * pulseSpeed + pulse.offset);
    pulse.mesh.position.set(point.x, pulseY + Math.sin(game.time * pulseWave + pulse.offset) * pulseAmp, point.z);
  }

  if (mapState.starField) {
    mapState.starField.rotation.y += dt * (emberLevel ? 0.014 : moonLevel ? 0.024 : 0.018);
  }

  if (emberLevel) {
    tealRim.intensity = 0.64 + Math.sin(game.time * 1.34) * 0.08;
    emberRim.intensity = 0.36 + Math.sin(game.time * 1.06 + 1.2) * 0.06;
    prismKeyLight.intensity = 0.54 + Math.sin(game.time * 1.48 + 0.4) * 0.09;
    prismFillLight.intensity = 0.42 + Math.sin(game.time * 1.24 + 1.9) * 0.08;
    prismKeyLight.position.x = 1 + Math.sin(game.time * 0.28) * 9;
    prismFillLight.position.z = 16 + Math.cos(game.time * 0.24) * 5;
  } else if (moonLevel) {
    tealRim.intensity = 0.54 + Math.sin(game.time * 1.3) * 0.08;
    emberRim.intensity = 0.28 + Math.sin(game.time * 1.15 + 1.2) * 0.05;
    prismKeyLight.intensity = 0.56 + Math.sin(game.time * 1.5 + 0.4) * 0.1;
    prismFillLight.intensity = 0.44 + Math.sin(game.time * 1.25 + 1.9) * 0.08;
    prismKeyLight.position.x = Math.sin(game.time * 0.24) * 8;
    prismFillLight.position.z = 16 + Math.cos(game.time * 0.22) * 4.5;
  } else {
    tealRim.intensity = 0.75 + Math.sin(game.time * 1.8) * 0.12;
    emberRim.intensity = 0.62 + Math.sin(game.time * 1.5 + 1.2) * 0.1;
    prismKeyLight.intensity = 0.8 + Math.sin(game.time * 2.1 + 0.4) * 0.18;
    prismFillLight.intensity = 0.62 + Math.sin(game.time * 1.7 + 1.9) * 0.15;
    prismKeyLight.position.x = Math.sin(game.time * 0.36) * 11;
    prismFillLight.position.z = 14 + Math.cos(game.time * 0.33) * 7;
  }

  if (mapState.mapLights.length >= 3) {
    if (emberLevel) {
      mapState.mapLights[0].intensity = 0.38 + Math.sin(game.time * 1.05 + 0.2) * 0.09;
      mapState.mapLights[1].intensity = 0.3 + Math.sin(game.time * 0.96 + 1.6) * 0.08;
      mapState.mapLights[2].intensity = 0.24 + Math.sin(game.time * 1.1 + 2.2) * 0.06;
    } else if (moonLevel) {
      mapState.mapLights[0].intensity = 0.34 + Math.sin(game.time * 0.95 + 0.2) * 0.08;
      mapState.mapLights[1].intensity = 0.26 + Math.sin(game.time * 0.88 + 1.6) * 0.06;
      mapState.mapLights[2].intensity = 0.2 + Math.sin(game.time * 1.05 + 2.2) * 0.05;
    } else {
      mapState.mapLights[0].intensity = 0.44 + Math.sin(game.time * 1.25 + 0.2) * 0.11;
      mapState.mapLights[1].intensity = 0.36 + Math.sin(game.time * 1.1 + 1.6) * 0.09;
      mapState.mapLights[2].intensity = 0.24 + Math.sin(game.time * 1.45 + 2.2) * 0.07;
    }
  }
}

function updateDebris(dt) {
  if (game.debris.length === 0) return;
  const aliveDebris = [];
  for (const entry of game.debris) {
    if (entry.update(dt)) aliveDebris.push(entry);
    else entry.dispose();
  }
  game.debris = aliveDebris;
}

function update(dt) {
  updateMultiplayerNetwork(dt);

  if (isMultiplayerClient() && isMultiplayerActive()) {
    syncMusicState();
    updateHud();
    return;
  }

  if (!game.started || game.menuOpen || game.exitConfirmOpen) {
    syncMusicState();
    updateHud();
    return;
  }

  if (game.paused) {
    syncMusicState();
    updateHud();
    return;
  }

  game.time += dt;
  syncMusicState();
  updateDebris(dt);

  if (game.over) {
    updateHud();
    return;
  }

  if (game.autoWaveEnabled && !game.editingLane) {
    if (game.inWave) {
      game.autoWaveCountdown = game.autoWaveInterval;
    } else {
      game.autoWaveCountdown -= dt;
      if (game.autoWaveCountdown <= 0) {
        startWave();
        game.autoWaveCountdown = game.autoWaveInterval;
      }
    }
  } else if (game.autoWaveEnabled && game.editingLane) {
    game.autoWaveCountdown = game.autoWaveInterval;
  }

  if (game.inWave && game.spawnLeft > 0) {
    game.spawnTimer -= dt;
    if (game.spawnTimer <= 0) {
      const spawnedType = spawnEnemy();
      const profile = getLevelDifficultyProfile(game.currentLevel);
      const baseInterval = Math.max(0.18, 0.78 - game.wave * 0.015);
      let nextSpawnDelay = Math.max(profile.minSpawnInterval, baseInterval * profile.spawnIntervalScale);

      const isRhombusWave = game.currentLevel === 2 && game.wave === 30;
      if (isRhombusWave && spawnedType === "rhombusMinus") {
        // Keep escort units spaced so they stride with the bosses instead of clumping.
        nextSpawnDelay = Math.max(nextSpawnDelay, 0.58);
      }
      if (isRhombusWave && spawnedType === "rhombus" && game.spawnQueue.includes("rhombus")) {
        nextSpawnDelay = Math.max(nextSpawnDelay, 0.72);
      }
      game.spawnTimer = nextSpawnDelay;
    }
  }

  for (const tower of game.towers) tower.update(dt);
  for (const enemy of game.enemies) enemy.update(dt);
  for (const ally of game.allies) ally.update(dt);
  updateAllyEnemyCollisions();
  for (const projectile of game.projectiles) projectile.update(dt);

  for (const enemy of game.enemies) {
    if (enemy.reachedEnd) {
      enemy.reachedEnd = false;
      game.lives -= enemy.coreDamage;
      if (game.lives <= 0 && !game.over) {
        audioSystem.stopBossMusic();
        audioSystem.stopFluteMusic(true);
        game.over = true;
        game.inWave = false;
        game.autoWaveEnabled = false;
        game.spawnQueue = [];
        game.spawnLeft = 0;
        game.spawnTimer = 0;
        setStatus("Defeat! Your core was destroyed.", true);
        openDefeatPanel();
      }
    }
  }

  const aliveEnemies = [];
  for (const enemy of game.enemies) {
    if (enemy.alive) aliveEnemies.push(enemy);
    else enemy.dispose();
  }
  game.enemies = aliveEnemies;

  const aliveAllies = [];
  for (const ally of game.allies) {
    if (ally.alive) aliveAllies.push(ally);
    else ally.dispose();
  }
  game.allies = aliveAllies;

  const aliveProjectiles = [];
  for (const projectile of game.projectiles) {
    if (projectile.alive) aliveProjectiles.push(projectile);
    else projectile.dispose();
  }
  game.projectiles = aliveProjectiles;

  endWaveIfDone();
  updateHud();
}

function startGameFromMenu(preferredLevel = null) {
  if (isMultiplayerClient() && isMultiplayerActive()) {
    const requestedLevel = Number.isFinite(preferredLevel)
      ? Math.max(1, Math.floor(preferredLevel))
      : clampMenuSelectedLevel(game.menuSelectedLevel || getHighestUnlockedLevel());
    sendMultiplayerAction("startLevel", { level: requestedLevel });
    setStatus(`Start request sent to host for Level ${requestedLevel}.`);
    return;
  }
  audioSystem.unlock();
  closeDefeatPanel();
  clearPendingLevelClearPanel();
  closeLevelClearPanel();
  const hasPreferredLevel = Number.isFinite(preferredLevel);
  const requestedLevel = hasPreferredLevel ? Math.max(1, Math.floor(preferredLevel)) : getHighestUnlockedLevel();
  if (hasPreferredLevel && !isLevelUnlocked(requestedLevel)) {
    setStatus(`Level ${requestedLevel} is locked. Clear earlier levels first.`, true);
    updateHud();
    return;
  }

  const targetLevel = Math.max(1, Math.min(getHighestUnlockedLevel(), requestedLevel));
  const shouldStartFresh = hasPreferredLevel || !game.started || game.over || game.levelOneDefeated;

  if (shouldStartFresh) {
    game.started = true;
    prepareLevel(targetLevel);
    const levelLabel = getMapEntry(targetLevel)?.name || `Level ${targetLevel}`;
    setStatus(`${levelLabel} loaded. Build towers or use Edit Lanes (L), then start a wave.`);
  }
  closeMenuShop();
  syncMusicState();
  updateHud();
  if (isMultiplayerHost() && isMultiplayerActive()) sendMultiplayerSnapshot(true);
}

function onResize() {
  const width = canvas.clientWidth || 960;
  const height = canvas.clientHeight || 540;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  fitBattleCameraToViewport();
}

let last = performance.now();
function loop(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  const simDt = dt * game.speedMultiplier;
  const effectDt = game.paused ? 0 : simDt;

  update(simDt);
  updatePlacementPreview();
  updateMapEffects(effectDt);
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

buildBtn.addEventListener("click", toggleBuildMode);
sellBtn.addEventListener("click", toggleSellMode);
laneBtn.addEventListener("click", toggleLaneEditMode);
if (loadoutBtn) loadoutBtn.addEventListener("click", toggleLoadoutMenu);
if (unlockBtn) unlockBtn.addEventListener("click", toggleUnlocksMenu);
menuBtn.addEventListener("click", toggleMenuHome);
if (openAccountBtn) openAccountBtn.addEventListener("click", openAccountMenu);
if (openUnlockShopBtn) openUnlockShopBtn.addEventListener("click", openUnlocksMenu);
if (openCreatureFromUnlockBtn) openCreatureFromUnlockBtn.addEventListener("click", openCreatureMenu);
if (openLoadoutBtn) openLoadoutBtn.addEventListener("click", openLoadoutMenu);
if (openMultiplayerBtn) openMultiplayerBtn.addEventListener("click", openMultiplayerMenu);
if (closeAccountBtn) closeAccountBtn.addEventListener("click", closeAccountMenu);
if (closeUnlockShopBtn) closeUnlockShopBtn.addEventListener("click", closeUnlocksMenu);
if (closeCreatureShopBtn) closeCreatureShopBtn.addEventListener("click", closeCreatureMenu);
if (closeLoadoutBtn) closeLoadoutBtn.addEventListener("click", closeLoadoutMenu);
if (closeMultiplayerBtn) closeMultiplayerBtn.addEventListener("click", closeMultiplayerMenu);
if (confirmExitBtn) confirmExitBtn.addEventListener("click", confirmExitToMenu);
if (cancelExitBtn) cancelExitBtn.addEventListener("click", closeExitConfirm);
if (levelClearMenuBtn) levelClearMenuBtn.addEventListener("click", acknowledgeLevelClearToMenu);
if (defeatMenuBtn) defeatMenuBtn.addEventListener("click", acknowledgeDefeatToMenu);
if (settingsToggleBtn) settingsToggleBtn.addEventListener("click", toggleSettingsPanel);
if (settingsCloseBtn) settingsCloseBtn.addEventListener("click", closeSettingsPanel);
if (settingMusicBtn) settingMusicBtn.addEventListener("click", toggleSettingMusic);
if (settingSfxBtn) settingSfxBtn.addEventListener("click", toggleSettingSfx);
if (settingShotBtn) settingShotBtn.addEventListener("click", toggleSettingShots);
if (settingShatterBtn) settingShatterBtn.addEventListener("click", toggleSettingShatter);
if (commandToggleBtn) commandToggleBtn.addEventListener("click", toggleCommandConsole);
if (commandCloseBtn) commandCloseBtn.addEventListener("click", closeCommandConsole);
if (commandRunBtn) commandRunBtn.addEventListener("click", runConsoleCommandFromInput);
if (createAccountBtn) createAccountBtn.addEventListener("click", createAccountFromInput);
if (mapPrevBtn) mapPrevBtn.addEventListener("click", () => cycleMenuLevel(-1));
if (mapNextBtn) mapNextBtn.addEventListener("click", () => cycleMenuLevel(1));
if (commandInputEl) {
  commandInputEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      runConsoleCommandFromInput();
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeCommandConsole();
    }
  });
}
if (accountNameInputEl) {
  accountNameInputEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      createAccountFromInput();
    }
  });
}
if (multiplayerServerInputEl) {
  if (!multiplayerServerInputEl.value && multiplayer.serverUrl) multiplayerServerInputEl.value = multiplayer.serverUrl;
  multiplayerServerInputEl.addEventListener("blur", () => {
    const serverUrl = normalizeMultiplayerServerUrl(multiplayerServerInputEl.value || multiplayer.serverUrl || "");
    multiplayer.serverUrl = serverUrl;
    persistPreferredMultiplayerServerUrl(serverUrl);
    if (serverUrl) multiplayerServerInputEl.value = serverUrl;
    refreshMultiplayerPanel();
  });
  multiplayerServerInputEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const serverUrl = normalizeMultiplayerServerUrl(multiplayerServerInputEl.value || "");
      if (!serverUrl) {
        setStatus("Enter a valid ws:// or wss:// server URL.", true);
        refreshMultiplayerPanel();
        return;
      }
      multiplayer.serverUrl = serverUrl;
      multiplayerServerInputEl.value = serverUrl;
      persistPreferredMultiplayerServerUrl(serverUrl);
      if (multiplayerRoomInputEl) {
        multiplayerRoomInputEl.focus();
        multiplayerRoomInputEl.select();
      }
      refreshMultiplayerPanel();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      closeMultiplayerMenu();
    }
  });
}
if (multiplayerRoomInputEl) {
  multiplayerRoomInputEl.addEventListener("input", () => {
    multiplayerRoomInputEl.value = sanitizeRoomCode(multiplayerRoomInputEl.value);
  });
  multiplayerRoomInputEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (event.shiftKey) joinMultiplayerSession();
      else hostMultiplayerSession();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      closeMultiplayerMenu();
    }
  });
}
if (menuLoadoutSearchEl) {
  menuLoadoutSearchEl.addEventListener("input", renderLoadoutMenu);
  menuLoadoutSearchEl.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeLoadoutMenu();
    }
  });
}
startWaveBtn.addEventListener("click", startWave);
if (pauseBtn) pauseBtn.addEventListener("click", togglePause);
if (speedDownBtn) speedDownBtn.addEventListener("click", () => stepGameSpeed(-1));
if (speedUpBtn) speedUpBtn.addEventListener("click", () => stepGameSpeed(1));
if (hostMultiplayerBtn) hostMultiplayerBtn.addEventListener("click", hostMultiplayerSession);
if (joinMultiplayerBtn) joinMultiplayerBtn.addEventListener("click", joinMultiplayerSession);
if (leaveMultiplayerBtn) {
  leaveMultiplayerBtn.addEventListener("click", () => {
    leaveMultiplayerSession(true);
    setStatus("Left multiplayer session.");
  });
}
if (autoWaveBtn) autoWaveBtn.addEventListener("click", toggleAutoWave);
canvas.addEventListener("pointermove", onPointerMove);
canvas.addEventListener("pointerdown", onPointerDown);
canvas.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});
canvas.addEventListener("pointerleave", () => {
  game.hoverCell = null;
});

window.addEventListener("keydown", (event) => {
  if (accountNameInputEl && document.activeElement === accountNameInputEl) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeAccountMenu();
    }
    return;
  }
  if (menuLoadoutSearchEl && document.activeElement === menuLoadoutSearchEl) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeLoadoutMenu();
    }
    return;
  }
  if (multiplayerServerInputEl && document.activeElement === multiplayerServerInputEl) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMultiplayerMenu();
    }
    return;
  }
  if (multiplayerRoomInputEl && document.activeElement === multiplayerRoomInputEl) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMultiplayerMenu();
    }
    return;
  }

  if (game.levelClearOpen) {
    if (event.key === "Escape" || event.key === "Enter" || event.key.toLowerCase() === "m") {
      event.preventDefault();
      acknowledgeLevelClearToMenu();
    }
    return;
  }

  if (game.defeatOpen) {
    if (event.key === "Escape" || event.key === "Enter" || event.key.toLowerCase() === "m") {
      event.preventDefault();
      acknowledgeDefeatToMenu();
    }
    return;
  }

  if (settingsPanelEl && !settingsPanelEl.hidden) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeSettingsPanel();
      updateHud();
    }
    return;
  }

  if (commandConsoleEl && !commandConsoleEl.hidden) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeCommandConsole();
    }
    return;
  }

  if (game.exitConfirmOpen) {
    const key = event.key.toLowerCase();
    if (event.key === "Escape" || key === "n") {
      event.preventDefault();
      closeExitConfirm();
      return;
    }
    if (event.key === "Enter" || key === "y") {
      event.preventDefault();
      confirmExitToMenu();
      return;
    }
    return;
  }

  if (event.key === "Escape" && game.menuOpen) {
    event.preventDefault();
    if (game.started) closeMenuShop();
    else setMenuView("home");
    return;
  }

  if (!game.started || game.menuOpen) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      startGameFromMenu(game.menuSelectedLevel || getHighestUnlockedLevel());
    }
    if (game.menuOpen && game.menuView === "home" && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
      event.preventDefault();
      cycleMenuLevel(event.key === "ArrowLeft" ? -1 : 1);
    }
    if (game.started && event.key.toLowerCase() === "m") {
      event.preventDefault();
      toggleMenuHome();
    }
    if (event.key.toLowerCase() === "g") {
      event.preventDefault();
      if (game.started) openMultiplayerMenu();
    }
    return;
  }

  if (event.key.toLowerCase() === "m") {
    event.preventDefault();
    toggleMenuHome();
    return;
  }

  if (event.key.toLowerCase() === "g") {
    event.preventDefault();
    openMultiplayerMenu();
    return;
  }

  if (event.key.toLowerCase() === "p") {
    event.preventDefault();
    togglePause();
    return;
  }

  if (event.key.toLowerCase() === "b") toggleBuildMode();
  if (event.key.toLowerCase() === "x") toggleSellMode();
  if (event.key.toLowerCase() === "l") toggleLaneEditMode();
  if (event.key === " ") {
    event.preventDefault();
    startWave();
  }
});

window.addEventListener("resize", onResize);
window.addEventListener("beforeunload", () => {
  leaveMultiplayerSession(true);
  savePlayerProgress();
});

loadPlayerProgress();
resetLaneToLevelDefaults(game.currentLevel);
rebuildWorld();
renderShop();
renderAccountMenu();
renderMenuShop();
renderCreatureShop();
renderLoadoutMenu();
refreshMultiplayerPanel();
onResize();
openMenuShop();
if (menuScreenEl) menuScreenEl.hidden = false;
if (playBtn) playBtn.addEventListener("click", () => startGameFromMenu(game.menuSelectedLevel || getHighestUnlockedLevel()));
setStatus(`Press ${getMenuPlayButtonLabel()} to begin.`);
updateHud();
requestAnimationFrame(loop);
