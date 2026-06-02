/**
 * audio-engine.jsx — Browser audio playback engine
 *
 * Dual-track audio system for cc-design animations:
 *   SFX track: Short stabs aligned to visual beats (high-freq 800Hz+)
 *   BGM track: Continuous emotional bed (mid-low freq <4kHz)
 *
 * Exports (mounted on window.AudioEngine + React components):
 *
 * --- AudioEngine (global singleton) ---
 *   AudioEngine.init()                        — Create AudioContext + GainNode topology
 *   AudioEngine.playSFX(path, opts?)          — Play SFX from assets/sfx/<path>.mp3
 *   AudioEngine.playBGM(src, opts?)           — Loop BGM from assets/<src>.mp3
 *   AudioEngine.stopBGM()                     — Stop current BGM
 *   AudioEngine.stopAll()                     — Stop all active sources
 *   AudioEngine.setVolume(track, val)         — Set sfx/bgm volume independently
 *   AudioEngine.mute() / .unmute()            — Master mute/unmute
 *   AudioEngine.isReady()                     — Check if initialized
 *
 * --- React Components ---
 *   <SFX at={2.5} src="keyboard/type" />     — Sprite-relative SFX trigger
 *   <BGM src="bgm-tech" volume={0.45} />      — BGM controller
 *   <Soundtrack preset="terminal-demo">        — Scene preset wrapper
 *     {children}
 *   </Soundtrack>
 *
 * Usage:
 *   <script type="text/babel" src="templates/audio-engine.jsx"></script>
 *   <script type="text/babel" src="templates/animations.jsx"></script>
 *
 * See references/audio-design-rules.md for the full spec.
 */

(function () {
  const { useState, useEffect, useRef } = React;

  // ---------------------------------------------------------------------------
  // AudioEngine Kernel
  // ---------------------------------------------------------------------------

  const AudioEngine = {
    _initialized: false,
    _ctx: null,
    _masterGain: null,
    _sfxGain: null,
    _bgmGain: null,
    _bufferCache: new Map(),
    _activeSources: new Set(),
    _currentBGM: null,
    _muted: false,
    _savedVolumes: { sfx: 1.0, bgm: 0.45 },
    _sfxMuted: false,

    init() {
      if (this._initialized) return;

      // Feature detection: prefer AudioContext, fallback for Safari
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) {
        console.warn('[AudioEngine] AudioContext not available — audio disabled');
        return;
      }

      this._ctx = new AC();
      this._masterGain = this._ctx.createGain();
      this._masterGain.connect(this._ctx.destination);

      this._sfxGain = this._ctx.createGain();
      this._sfxGain.gain.value = this._savedVolumes.sfx;
      this._sfxGain.connect(this._masterGain);

      this._bgmGain = this._ctx.createGain();
      this._bgmGain.gain.value = this._savedVolumes.bgm;
      this._bgmGain.connect(this._masterGain);

      this._initialized = true;

      // Resume on user gesture (autoplay policy)
      if (this._ctx.state === 'suspended') {
        this._ctx.resume();
      }

      console.info('[AudioEngine] initialized');
    },

    isReady() {
      return this._initialized;
    },

    _fetchBuffer(path) {
      if (this._bufferCache.has(path)) {
        return this._bufferCache.get(path);
      }

      const promise = fetch(path)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.arrayBuffer();
        })
        .then(buf => this._ctx.decodeAudioData(buf))
        .catch(err => {
          console.warn(`[AudioEngine] failed to load ${path}:`, err.message);
          this._bufferCache.delete(path);
          return null;
        });

      this._bufferCache.set(path, promise);
      return promise;
    },

    playSFX(path, opts) {
      if (!this._initialized) return;
      if (this._sfxMuted) return;

      const { volume = 1.0, delay = 0 } = opts || {};
      const assetPath = `assets/sfx/${path}.mp3`;

      this._fetchBuffer(assetPath).then(buffer => {
        if (!buffer) return;

        const source = this._ctx.createBufferSource();
        source.buffer = buffer;

        const gain = this._ctx.createGain();
        gain.gain.value = volume;
        source.connect(gain);
        gain.connect(this._sfxGain);

        const startTime = this._ctx.currentTime + delay;
        source.start(startTime);

        this._activeSources.add(source);
        source.onended = () => this._activeSources.delete(source);
      });
    },

    playBGM(src, opts) {
      if (!this._initialized) return;

      const { volume = 0.45, loop = true } = opts || {};
      const assetPath = `assets/${src}.mp3`;

      // Stop existing BGM (hard cut — documented limitation)
      this.stopBGM();

      this._fetchBuffer(assetPath).then(buffer => {
        if (!buffer) return;

        const source = this._ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = loop;

        const gain = this._ctx.createGain();
        gain.gain.value = volume;
        source.connect(gain);
        gain.connect(this._bgmGain);

        source.start(0);
        this._currentBGM = { source, gain, src };
        this._activeSources.add(source);

        source.onended = () => {
          this._activeSources.delete(source);
          if (this._currentBGM && this._currentBGM.source === source) {
            this._currentBGM = null;
          }
        };
      });
    },

    stopBGM() {
      if (this._currentBGM) {
        try {
          this._currentBGM.source.stop();
        } catch (e) {
          // Already stopped — ignore
        }
        this._activeSources.delete(this._currentBGM.source);
        this._currentBGM = null;
      }
    },

    stopAll() {
      this._activeSources.forEach(source => {
        try { source.stop(); } catch (e) { /* ignore */ }
      });
      this._activeSources.clear();
      this._currentBGM = null;
    },

    setVolume(track, val) {
      val = Math.max(0, Math.min(1, val));
      this._savedVolumes[track] = val;
      if (track === 'sfx' && this._sfxGain) {
        this._sfxGain.gain.value = val;
      }
      if (track === 'bgm' && this._bgmGain) {
        this._bgmGain.gain.value = val;
      }
    },

    mute() {
      if (!this._initialized || this._muted) return;
      this._muted = true;
      if (this._masterGain) {
        this._masterGain.gain.value = 0;
      }
    },

    unmute() {
      if (!this._initialized || !this._muted) return;
      this._muted = false;
      if (this._masterGain) {
        this._masterGain.gain.value = 1;
      }
    },

    isMuted() {
      return this._muted;
    },

    getVolume(track) {
      return this._savedVolumes[track] || 0;
    },

    getCurrentBGM() {
      return this._currentBGM ? this._currentBGM.src : null;
    },

    // SFX mute for scrubbing — stops SFX without affecting BGM
    muteSFX() {
      this._sfxMuted = true;
      if (this._sfxGain) {
        this._sfxGain.gain.value = 0;
      }
    },

    unmuteSFX() {
      this._sfxMuted = false;
      if (this._sfxGain) {
        this._sfxGain.gain.value = this._savedVolumes.sfx;
      }
    },
  };

  // ---------------------------------------------------------------------------
  // Hook: useAudioInit
  // ---------------------------------------------------------------------------

  function useAudioInit() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
      const handleInteraction = () => {
        if (!AudioEngine.isReady()) {
          AudioEngine.init();
        }
        setReady(AudioEngine.isReady());
      };

      // Try to init immediately if context already allowed
      if (!AudioEngine.isReady()) {
        AudioEngine.init();
      }
      setReady(AudioEngine.isReady());

      // Also listen for user gesture to resume suspended context
      const events = ['click', 'keydown', 'touchstart'];
      events.forEach(evt => {
        document.addEventListener(evt, handleInteraction, { once: true });
      });

      return () => {
        events.forEach(evt => {
          document.removeEventListener(evt, handleInteraction);
        });
      };
    }, []);

    return ready;
  }

  // ---------------------------------------------------------------------------
  // Component: <SFX>
  //
  // Must be rendered inside a <Sprite> from animations.jsx.
  // Uses window.Animations.useSprite() to read elapsed time and trigger
  // SFX playback at the specified `at` offset (seconds into the Sprite).
  // ---------------------------------------------------------------------------

  function SFX({ at = 0, src, volume, disabled }) {
    const firedRef = useRef(false);
    const ready = useAudioInit();

    // Access useSprite from animations.jsx — both scripts are loaded
    // in the browser before user code runs, so this is always available.
    const Anim = window.Animations;
    let sprite = { t: 0, elapsed: 0, duration: 0 };
    if (Anim && Anim.useSprite) {
      sprite = Anim.useSprite();
    }

    useEffect(() => {
      if (disabled || !ready || !src) return;

      const elapsed = sprite.elapsed;

      // Fire when elapsed first crosses the `at` threshold
      if (!firedRef.current && elapsed >= at) {
        firedRef.current = true;
        AudioEngine.playSFX(src, { volume });
      }

      // Reset on scrub backwards (elapsed drops below at)
      if (firedRef.current && elapsed < at) {
        firedRef.current = false;
      }
    });

    return null;
  }

  // ---------------------------------------------------------------------------
  // Component: <BGM>
  // ---------------------------------------------------------------------------

  function BGM({ src, volume = 0.45, loop = true }) {
    const ready = useAudioInit();
    const prevSrcRef = useRef(null);

    useEffect(() => {
      if (!ready || !src) return;

      // Only restart if src changed
      if (prevSrcRef.current !== src) {
        prevSrcRef.current = src;
        AudioEngine.playBGM(src, { volume, loop });
      }

      return () => {
        // Don't stop BGM on unmount — let Soundtrack handle cleanup
        // This prevents BGM cutoff during React re-renders
      };
    }, [ready, src, volume, loop]);

    return null;
  }

  // ---------------------------------------------------------------------------
  // Component: <Soundtrack>
  // ---------------------------------------------------------------------------

  const PRESETS = {
    'terminal-demo': {
      bgm: 'bgm-tech',
      bgmVolume: 0.45,
      sfxVolume: 1.0,
    },
    'product-launch': {
      bgm: 'bgm-tech',
      bgmVolume: 0.45,
      sfxVolume: 1.0,
    },
    'tutorial-walkthrough': {
      bgm: 'bgm-tutorial',
      bgmVolume: 0.50,
      sfxVolume: 1.0,
    },
    'ai-generation': {
      bgm: 'bgm-tech-alt',
      bgmVolume: 0.40,
      sfxVolume: 1.0,
    },
  };

  function Soundtrack({ preset, children }) {
    const ready = useAudioInit();
    const prevPresetRef = useRef(null);

    useEffect(() => {
      if (!ready || !preset) return;

      const config = PRESETS[preset];
      if (!config) {
        console.warn(`[Soundtrack] unknown preset: ${preset}`);
        return;
      }

      if (prevPresetRef.current !== preset) {
        prevPresetRef.current = preset;
        AudioEngine.setVolume('sfx', config.sfxVolume);
        AudioEngine.setVolume('bgm', config.bgmVolume);

        if (config.bgm) {
          AudioEngine.playBGM(config.bgm, { volume: config.bgmVolume });
        }
      }

      return () => {
        AudioEngine.stopBGM();
      };
    }, [ready, preset]);

    return children || null;
  }

  // ---------------------------------------------------------------------------
  // Component: <SFXTimeline>
  //
  // Batch SFX trigger inside a Sprite. Each cue fires once when the
  // Sprite's elapsed time crosses the cue's `at` offset.
  // ---------------------------------------------------------------------------

  function SFXTimeline({ cues = [] }) {
    const firedRef = useRef({});
    const ready = useAudioInit();
    const prevCuesKeyRef = useRef('');

    const Anim = window.Animations;
    let sprite = { t: 0, elapsed: 0, duration: 0 };
    if (Anim && Anim.useSprite) {
      sprite = Anim.useSprite();
    }

    // Reset fired state when cues change identity
    const cuesKey = cues.map(c => `${c.at}:${c.src}`).join('|');
    if (cuesKey !== prevCuesKeyRef.current) {
      prevCuesKeyRef.current = cuesKey;
      firedRef.current = {};
    }

    if (ready && cues.length > 0) {
      const elapsed = sprite.elapsed;
      cues.forEach((cue, i) => {
        if (!firedRef.current[i] && elapsed >= cue.at) {
          firedRef.current[i] = true;
          AudioEngine.playSFX(cue.src, { volume: cue.volume });
        }
        // Reset on scrub backwards
        if (firedRef.current[i] && elapsed < cue.at) {
          firedRef.current[i] = false;
        }
      });
    }

    return null;
  }

  // ---------------------------------------------------------------------------
  // Global mount
  // ---------------------------------------------------------------------------

  if (typeof window !== 'undefined') {
    window.AudioEngine = AudioEngine;

    window.AudioComponents = {
      SFX,
      BGM,
      Soundtrack,
      SFXTimeline,
      PRESETS,
      useAudioInit,
    };
  }
})();
