/** Background music: a short chiptune loop written here and played with Web Audio, so there is no audio file and
    nothing to license. Soft (master 0.35). It starts on the visitor's first interaction (browsers block autoplay),
    remembers the on/off choice, and is off by default for prefers-reduced-motion. */

const STORAGE_KEY = "music";
const EVENT = "musicchange";
const VOLUME = 0.35;
const BPM = 112;
const STEP = 60 / BPM / 2; // eighth notes

// Four bars of C, Am, F, G. MIDI note numbers, null is a rest. The last bar resolves differently the second time.
const LEAD: (number | null)[] = [
  72, 76, 79, 76, 74, 72, null, 67,
  69, 72, 76, 72, 74, 72, 69, null,
  65, 69, 72, 77, 76, 72, 74, null,
  67, 71, 74, 79, 77, 74, 71, null,
  72, 76, 79, 76, 74, 72, null, 67,
  69, 72, 76, 72, 74, 72, 69, null,
  65, 69, 72, 77, 76, 72, 74, 76,
  79, 77, 74, 71, 72, null, null, null,
];
const BASS_ROOTS = [48, 45, 41, 43, 48, 45, 41, 43];

let audio: AudioContext | null = null;
let master: GainNode | null = null;
let timer = 0;
let step = 0;
let nextTime = 0;
let playing = false;

const freq = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

function note(type: OscillatorType, midi: number, at: number, length: number, level: number) {
  if (!audio || !master) return;
  const osc = audio.createOscillator();
  const env = audio.createGain();
  osc.type = type;
  osc.frequency.value = freq(midi);
  env.gain.setValueAtTime(0, at);
  env.gain.linearRampToValueAtTime(level, at + 0.01);
  env.gain.exponentialRampToValueAtTime(0.001, at + length);
  osc.connect(env).connect(master);
  osc.start(at);
  osc.stop(at + length + 0.02);
}

function tick(at: number) {
  if (!audio || !master) return;
  const i = step % LEAD.length;
  const lead = LEAD[i];
  if (lead !== null) note("square", lead, at, STEP * 0.8, 0.22);
  // Bass on every beat: root, then the fifth.
  if (i % 2 === 0) {
    const root = BASS_ROOTS[Math.floor(i / 8)];
    note("triangle", i % 4 === 0 ? root : root + 7, at, STEP * 1.6, 0.5);
  }
  // A soft tick on the off beats.
  if (i % 2 === 1) note("square", 96, at, 0.03, 0.04);
  step++;
}

function schedule() {
  if (!audio || !playing) return;
  // After a stall (busy main thread), skip ahead instead of playing every missed note at once.
  if (nextTime < audio.currentTime) nextTime = audio.currentTime + 0.05;
  while (nextTime < audio.currentTime + 0.25) {
    tick(nextTime);
    nextTime += STEP;
  }
  timer = window.setTimeout(schedule, 60);
}

/** Inside a tap or click: play one silent sample, which is what iPhones need to really unlock Web Audio, and ask
    for "playback" so the silent switch does not mute the music (Safari 16.4 and later). */
function unlock() {
  if (!audio) return;
  try {
    const nav = navigator as Navigator & { audioSession?: { type: string } };
    if (nav.audioSession) nav.audioSession.type = "playback";
    const src = audio.createBufferSource();
    src.buffer = audio.createBuffer(1, 1, 22050);
    src.connect(audio.destination);
    src.start(0);
  } catch {
    // Nothing to unlock: the resume below is enough on this browser.
  }
}

function start() {
  if (playing) {
    unlock();
    void audio?.resume(); // a later gesture can unlock a context the first touch could not
    return;
  }
  try {
    audio ??= new AudioContext();
    unlock();
    if (!master) {
      master = audio.createGain();
      master.gain.value = VOLUME;
      master.connect(audio.destination);
    }
    void audio.resume();
    playing = true;
    // Notes from before a quick off and on are still queued up to 0.25 s ahead: carry on after them.
    nextTime = Math.max(nextTime, audio.currentTime + 0.05);
    schedule();
  } catch {
    playing = false; // no Web Audio: the site just stays quiet
  }
}

function stop() {
  playing = false;
  window.clearTimeout(timer);
  void audio?.suspend();
}

export function musicEnabled() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "on") return true;
    if (stored === "off") return false;
  } catch {
    // Storage blocked: fall through to the default.
  }
  return !matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function setMusicEnabled(on: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {
    // Storage blocked: the choice still applies for this visit.
  }
  if (on) start();
  else stop();
  window.dispatchEvent(new CustomEvent(EVENT));
}

/** True once sound is actually coming out (the context is unlocked and running). */
export function musicPlaying() {
  return playing && audio?.state === "running";
}

export function onMusicChange(callback: () => void) {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}

/** Starts the music on the first click, tap or key press if it is on, and pauses it while the tab is hidden.
    Browsers only unlock audio on some events (on touch: the end of a tap, never a scroll swipe), so it keeps
    listening until the context is really running. */
const UNLOCK = ["pointerdown", "pointerup", "touchend", "click", "keydown"] as const;
export function bootMusic() {
  const first = (e: Event) => {
    if ((e.target as Element | null)?.closest?.("[data-music-toggle]")) return; // the toggle handles itself
    if (!musicEnabled()) return remove();
    start();
    void audio?.resume().then(() => {
      if (audio?.state === "running") remove();
      window.dispatchEvent(new CustomEvent(EVENT));
    });
  };
  const remove = () => UNLOCK.forEach((type) => window.removeEventListener(type, first, true));
  const visibility = () => {
    if (!audio || !playing) return;
    if (document.hidden) void audio.suspend();
    else void audio.resume();
  };
  UNLOCK.forEach((type) => window.addEventListener(type, first, true));
  document.addEventListener("visibilitychange", visibility);
  return () => {
    remove();
    document.removeEventListener("visibilitychange", visibility);
  };
}
