/**
 * Browser Window — React component for desktop browser chrome with tab bar.
 * Load via: <script type="text/babel" src="browser_window.jsx"></script>
 *
 * Usage:
 *   <BrowserWindow url="https://example.com" width={1024} height={768}>
 *     <div>Page content</div>
 *   </BrowserWindow>
 */

function BrowserWindow({ children, url = 'https://example.com', width = 1024, height = 768, background = '#fff' }) {
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

  const tabBarStyles = {
    height: '38px',
    background: '#e8e8e8',
    display: 'flex',
    alignItems: 'center',
    padding: '0 10px',
    gap: '8px',
    borderBottom: '1px solid #d0d0d0',
  };

  const dotStyles = (color) => ({
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: color,
    border: '0.5px solid rgba(0,0,0,0.12)',
    flexShrink: 0,
  });

  const tabStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 12px',
    background: '#fff',
    borderRadius: '6px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '12px',
    color: '#333',
    maxWidth: '200px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  };

  const tabIconStyles = {
    width: '14px',
    height: '14px',
    borderRadius: '3px',
    background: 'linear-gradient(135deg, #4285f4, #34a853, #fbbc05, #ea4335)',
    flexShrink: 0,
  };

  const toolbarStyles = {
    height: '36px',
    background: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    padding: '0 12px',
    gap: '8px',
    borderBottom: '1px solid #d0d0d0',
  };

  const urlBarStyles = {
    flex: 1,
    height: '24px',
    borderRadius: '12px',
    background: '#fff',
    border: '1px solid #ccc',
    padding: '0 10px',
    fontFamily: 'system-ui, sans-serif',
    fontSize: '12px',
    color: '#555',
    display: 'flex',
    alignItems: 'center',
    lineHeight: 1,
  };

  const contentStyles = {
    flex: 1,
    overflow: 'auto',
    position: 'relative',
  };

  return React.createElement('div', { style: wrapperStyles },
    React.createElement('div', { style: tabBarStyles },
      React.createElement('div', { style: dotStyles('#FF5F56') }),
      React.createElement('div', { style: dotStyles('#FFBD2E') }),
      React.createElement('div', { style: dotStyles('#27C93F') }),
      React.createElement('div', { style: tabStyles },
        React.createElement('div', { style: tabIconStyles }),
        url.replace(/^https?:\/\//, '').split('/')[0]
      )
    ),
    React.createElement('div', { style: toolbarStyles },
      React.createElement('span', { style: { color: '#999', fontSize: '14px' } }, '←'),
      React.createElement('span', { style: { color: '#999', fontSize: '14px' } }, '→'),
      React.createElement('span', { style: { color: '#999', fontSize: '14px' } }, '↻'),
      React.createElement('div', { style: urlBarStyles }, `🔒 ${url}`)
    ),
    React.createElement('div', { style: contentStyles }, children)
  );
}

Object.assign(window, { BrowserWindow });
