/**
 * macOS Window — React component for desktop window chrome with traffic lights.
 * Load via: <script type="text/babel" src="macos_window.jsx"></script>
 *
 * Usage:
 *   <MacOSWindow title="My App" width={800} height={600}>
 *     <div>Window content</div>
 *   </MacOSWindow>
 */

function MacOSWindow({ children, title = 'Untitled', width = 800, height = 600, background = '#fff' }) {
  const wrapperStyles = {
    width: `${width}px`,
    height: `${height}px`,
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    background,
  };

  const titleBarStyles = {
    height: '38px',
    background: '#e8e8e8',
    display: 'flex',
    alignItems: 'center',
    padding: '0 14px',
    gap: '8px',
    borderBottom: '1px solid #d0d0d0',
    flexShrink: 0,
  };

  const dotStyles = (color) => ({
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: color,
    border: '0.5px solid rgba(0,0,0,0.12)',
  });

  const titleTextStyles = {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '13px',
    fontWeight: 500,
    color: '#333',
    paddingRight: '56px', // balance traffic lights
  };

  const contentStyles = {
    flex: 1,
    overflow: 'auto',
    position: 'relative',
  };

  return React.createElement('div', { style: wrapperStyles },
    React.createElement('div', { style: titleBarStyles },
      React.createElement('div', { style: dotStyles('#FF5F56') }),
      React.createElement('div', { style: dotStyles('#FFBD2E') }),
      React.createElement('div', { style: dotStyles('#27C93F') }),
      React.createElement('div', { style: titleTextStyles }, title)
    ),
    React.createElement('div', { style: contentStyles }, children)
  );
}

Object.assign(window, { MacOSWindow });
