/**
 * Android Frame — React component for Android phone device bezel with status bar.
 * Load via: <script type="text/babel" src="android_frame.jsx"></script>
 *
 * Usage:
 *   <AndroidFrame>
 *     <div>Your app screen content here</div>
 *   </AndroidFrame>
 */

function AndroidFrame({ children, color = '#000' }) {
  const frameStyles = {
    width: '393px',
    height: '851px',
    borderRadius: '28px',
    border: '4px solid #1a1a1a',
    background: color,
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  };

  const statusBarStyles = {
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    fontFamily: 'system-ui, sans-serif',
    fontSize: '13px',
    fontWeight: 500,
    color: '#fff',
  };

  const cameraCutoutStyles = {
    position: 'absolute',
    top: '12px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '12px',
    height: '12px',
    background: '#111',
    borderRadius: '50%',
    zIndex: 10,
  };

  const contentStyles = {
    height: 'calc(100% - 48px)',
    overflow: 'auto',
    position: 'relative',
  };

  const navBarStyles = {
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '60px',
    background: 'rgba(0,0,0,0.5)',
  };

  const navBtnStyles = { width: '18px', height: '18px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.5)' };

  const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  return React.createElement('div', { style: frameStyles },
    React.createElement('div', { style: cameraCutoutStyles }),
    React.createElement('div', { style: statusBarStyles },
      React.createElement('span', null, time),
      React.createElement('div', { style: { display: 'flex', gap: '6px', alignItems: 'center' } },
        React.createElement('span', { style: { fontSize: '11px' } }, 'LTE'),
        React.createElement('span', null, '🔋')
      )
    ),
    React.createElement('div', { style: contentStyles }, children),
    React.createElement('div', { style: navBarStyles },
      React.createElement('div', { style: { ...navBtnStyles, border: 'none', width: '14px', height: '14px' } }),
      React.createElement('div', { style: navBtnStyles }),
      React.createElement('div', { style: navBtnStyles })
    )
  );
}

Object.assign(window, { AndroidFrame });
