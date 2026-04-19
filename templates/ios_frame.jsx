/**
 * iOS Frame — React component for iPhone device bezel with status bar.
 * Load via: <script type="text/babel" src="ios_frame.jsx"></script>
 *
 * Usage:
 *   <IOSFrame>
 *     <div>Your app screen content here</div>
 *   </IOSFrame>
 */

function IOSFrame({ children, color = '#000', showNotch = true }) {
  const frameStyles = {
    width: '393px',
    height: '852px',
    borderRadius: '50px',
    border: '4px solid #1a1a1a',
    background: color,
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  };

  const statusBarStyles = {
    height: '54px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: '0 32px 8px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '15px',
    fontWeight: 600,
    color: '#fff',
  };

  const contentStyles = {
    height: 'calc(100% - 54px)',
    overflow: 'auto',
    position: 'relative',
  };

  const notchStyles = {
    position: 'absolute',
    top: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '126px',
    height: '34px',
    background: '#000',
    borderRadius: '0 0 20px 20px',
    zIndex: 10,
  };

  const homeIndicatorStyles = {
    position: 'absolute',
    bottom: '8px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '134px',
    height: '5px',
    background: 'rgba(255,255,255,0.3)',
    borderRadius: '3px',
  };

  const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  return React.createElement('div', { style: frameStyles },
    showNotch && React.createElement('div', { style: notchStyles }),
    React.createElement('div', { style: statusBarStyles },
      React.createElement('span', null, time),
      React.createElement('div', { style: { display: 'flex', gap: '4px', alignItems: 'center' } },
        React.createElement('span', { style: { fontSize: '13px' } }, '5G'),
        React.createElement('span', null, '🔋')
      )
    ),
    React.createElement('div', { style: contentStyles }, children),
    React.createElement('div', { style: homeIndicatorStyles })
  );
}

Object.assign(window, { IOSFrame });
