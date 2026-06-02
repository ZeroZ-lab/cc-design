/**
 * audio-controls.jsx — Audio control panel for Stage
 *
 * Inserts SFX/BGM volume sliders, BGM selector, and mute button
 * into the existing Stage bottom controls bar.
 *
 * Usage (after audio-engine.jsx and animations.jsx are loaded):
 *   <script type="text/babel" src="templates/audio-controls.jsx"></script>
 *
 * Then inside your scene, render:
 *   <AudioControls />
 *
 * Or use the auto-mount by including data-audio-controls on the Stage.
 */

(function () {
  const { useState, useEffect, useCallback } = React;

  const BGM_OPTIONS = [
    { value: '', label: 'None' },
    { value: 'bgm-tech', label: 'Tech' },
    { value: 'bgm-tech-alt', label: 'Tech (alt)' },
    { value: 'bgm-tutorial', label: 'Tutorial' },
    { value: 'bgm-tutorial-alt', label: 'Tutorial (alt)' },
    { value: 'bgm-educational', label: 'Educational' },
    { value: 'bgm-ad', label: 'Ad' },
  ];

  const styles = {
    controls: {
      position: 'fixed',
      bottom: 56,
      right: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
      padding: '8px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      color: '#fff',
      fontSize: 11,
      zIndex: 101,
      borderTopLeftRadius: 6,
      borderBottom: 'none',
    },
    group: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
    },
    label: {
      opacity: 0.7,
      minWidth: 24,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      fontSize: 10,
    },
    slider: {
      width: 60,
      height: 3,
      appearance: 'none',
      WebkitAppearance: 'none',
      background: 'rgba(255,255,255,0.3)',
      borderRadius: 2,
      outline: 'none',
      cursor: 'pointer',
    },
    select: {
      background: 'rgba(255,255,255,0.1)',
      border: '1px solid rgba(255,255,255,0.2)',
      color: '#fff',
      padding: '3px 6px',
      borderRadius: 3,
      fontSize: 10,
      cursor: 'pointer',
    },
    button: {
      background: 'none',
      border: '1px solid rgba(255,255,255,0.3)',
      color: '#fff',
      padding: '3px 8px',
      borderRadius: 3,
      cursor: 'pointer',
      fontSize: 10,
    },
    separator: {
      width: 1,
      height: 16,
      background: 'rgba(255,255,255,0.2)',
    },
  };

  function AudioControls() {
    const [sfxVol, setSfxVol] = useState(1.0);
    const [bgmVol, setBgmVol] = useState(0.45);
    const [bgmSrc, setBgmSrc] = useState('');
    const [muted, setMuted] = useState(false);
    const [ready, setReady] = useState(false);

    useEffect(() => {
      const AE = window.AudioEngine;
      if (AE && AE.isReady()) {
        setReady(true);
      }

      const onInteract = () => {
        if (AE && !AE.isReady()) {
          AE.init();
        }
        setReady(AE && AE.isReady());
      };

      document.addEventListener('click', onInteract, { once: true });
      document.addEventListener('keydown', onInteract, { once: true });

      return () => {
        document.removeEventListener('click', onInteract);
        document.removeEventListener('keydown', onInteract);
      };
    }, []);

    const handleSfxVol = useCallback((e) => {
      const v = parseFloat(e.target.value);
      setSfxVol(v);
      if (window.AudioEngine) window.AudioEngine.setVolume('sfx', v);
    }, []);

    const handleBgmVol = useCallback((e) => {
      const v = parseFloat(e.target.value);
      setBgmVol(v);
      if (window.AudioEngine) window.AudioEngine.setVolume('bgm', v);
    }, []);

    const handleBgmChange = useCallback((e) => {
      const src = e.target.value;
      setBgmSrc(src);
      if (!window.AudioEngine || !window.AudioEngine.isReady()) return;
      if (src) {
        window.AudioEngine.playBGM(src, { volume: bgmVol });
      } else {
        window.AudioEngine.stopBGM();
      }
    }, [bgmVol]);

    const handleMute = useCallback(() => {
      if (!window.AudioEngine) return;
      if (muted) {
        window.AudioEngine.unmute();
        setMuted(false);
      } else {
        window.AudioEngine.mute();
        setMuted(true);
      }
    }, [muted]);

    const handleReset = useCallback(() => {
      setSfxVol(1.0);
      setBgmVol(0.45);
      if (window.AudioEngine) {
        window.AudioEngine.setVolume('sfx', 1.0);
        window.AudioEngine.setVolume('bgm', 0.45);
      }
    }, []);

    return (
      <div style={styles.controls}>
        <div style={styles.group}>
          <span style={styles.label}>SFX</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={sfxVol}
            onChange={handleSfxVol}
            style={styles.slider}
          />
        </div>

        <div style={styles.separator} />

        <div style={styles.group}>
          <span style={styles.label}>BGM</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={bgmVol}
            onChange={handleBgmVol}
            style={styles.slider}
          />
          <select value={bgmSrc} onChange={handleBgmChange} style={styles.select}>
            {BGM_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div style={styles.separator} />

        <button onClick={handleMute} style={styles.button}>
          {muted ? 'Unmute' : 'Mute'}
        </button>

        <button onClick={handleReset} style={styles.button}>
          Reset
        </button>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Audio Init Overlay
  // ---------------------------------------------------------------------------

  function AudioInitOverlay() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      // Show overlay if AudioEngine not yet initialized
      const AE = window.AudioEngine;
      if (AE && !AE.isReady()) {
        setVisible(true);
      }

      const handleClick = () => {
        if (AE && !AE.isReady()) {
          AE.init();
        }
        setVisible(false);
      };

      document.addEventListener('click', handleClick, { once: true });
      document.addEventListener('keydown', handleClick, { once: true });

      return () => {
        document.removeEventListener('click', handleClick);
        document.removeEventListener('keydown', handleClick);
      };
    }, []);

    if (!visible) return null;

    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        cursor: 'pointer',
      }}>
        <div style={{
          color: '#fff',
          fontSize: 18,
          fontFamily: '-apple-system, sans-serif',
          textAlign: 'center',
          padding: 24,
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>&#x1f50a;</div>
          <div>Click anywhere to enable audio</div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Global mount
  // ---------------------------------------------------------------------------

  if (typeof window !== 'undefined') {
    window.AudioControls = {
      AudioControls,
      AudioInitOverlay,
    };
  }
})();
