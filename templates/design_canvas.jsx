/**
 * Design Canvas — React component for presenting 2+ static options side-by-side.
 * Load via: <script type="text/babel" src="design_canvas.jsx"></script>
 *
 * Usage:
 *   <DesignCanvas labels={["Option A", "Option B", "Option C"]}>
 *     <div>Option A content</div>
 *     <div>Option B content</div>
 *     <div>Option C content</div>
 *   </DesignCanvas>
 */

function DesignCanvas({ labels = [], children, columns, gap = 16 }) {
  const count = React.Children.count(children);
  const cols = columns || Math.min(count, 3);

  const canvasStyles = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: `${gap}px`,
    padding: `${gap}px`,
    width: '100%',
    minHeight: '100vh',
    background: '#f5f5f5',
    boxSizing: 'border-box',
  };

  return React.createElement('div', { style: canvasStyles },
    React.Children.map(children, (child, i) => {
      const cellStyles = {
        background: '#fff',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        position: 'relative',
      };

      const labelStyles = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '6px 12px',
        background: 'rgba(0,0,0,0.7)',
        color: '#fff',
        fontSize: '12px',
        fontWeight: 600,
        fontFamily: 'system-ui, sans-serif',
        zIndex: 10,
      };

      return React.createElement('div', { key: i, style: cellStyles },
        labels[i] && React.createElement('div', { style: labelStyles }, labels[i]),
        child
      );
    })
  );
}

// Export to global scope
Object.assign(window, { DesignCanvas });
