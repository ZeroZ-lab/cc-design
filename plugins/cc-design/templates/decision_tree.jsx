/**
 * DecisionTree — Interactive decision tree explainer template
 *
 * SCHEMA
 * ======
 * {
 *   title: string,                          // Section heading
 *   subtitle: string,                       // Section sub-heading
 *   nodes: [{
 *     id: string,                           // Unique node identifier
 *     label: string,                        // Display name
 *     kind: 'question' | 'factor' | 'conclusion',
 *     detail: string,                       // Extended description for detail panel/popup
 *     conclusion?: string,                  // Conclusion verdict text (only for conclusion kind)
 *   }],
 *   edges: [{
 *     from: string,                         // Source node id
 *     to: string,                           // Target node id
 *     label: string,                        // Branch condition annotation
 *   }],
 *   cta?: {
 *     label: string,                        // CTA button text
 *     href: string,                         // CTA link URL
 *   },
 * }
 *
 * COMPLETE EXAMPLE — Technology Selection Decision Tree (14 nodes, 15 edges,
 * 3 question + 3 factor + 5 conclusion + 1 root question + 2 intermediate factor)
 * ===============================================================
 *
 * var EXAMPLE_DATA = {
 *   title: 'Technology Selection Decision Tree',
 *   subtitle: 'Choose the right stack for your project',
 *   nodes: [
 *     { id: 'root', label: 'What is your project type?', kind: 'question',
 *       detail: 'Start by identifying the primary purpose of your project. This determines which technology path to explore.' },
 *     { id: 'web-app', label: 'Web Application', kind: 'factor',
 *       detail: 'Browser-based applications with rich UI and frequent user interaction.' },
 *     { id: 'data-pipeline', label: 'Data Pipeline / ML', kind: 'factor',
 *       detail: 'Backend data processing, ETL, or machine learning workflows with minimal UI.' },
 *     { id: 'mobile', label: 'Mobile App', kind: 'factor',
 *       detail: 'Native mobile experience on iOS and/or Android.' },
 *     { id: 'spa', label: 'SPA / Interactive UI', kind: 'question',
 *       detail: 'Single-page application with complex state management and real-time updates.' },
 *     { id: 'static-site', label: 'Static / Content Site', kind: 'question',
 *       detail: 'Content-focused site with minimal interactivity, SEO is critical.' },
 *     { id: 'real-time', label: 'Real-time Updates', kind: 'factor',
 *       detail: 'Application requires WebSocket, SSE, or frequent data refresh.' },
 *     { id: 'conventional', label: 'Conventional CRUD', kind: 'factor',
 *       detail: 'Standard form-based application with server-rendered or slowly updating pages.' },
 *     { id: 'react-spa', label: 'Choose React', kind: 'conclusion',
 *       detail: 'React excels at complex SPA with frequent state changes. Large ecosystem, flexible architecture.',
 *       conclusion: 'React + TypeScript is optimal for interactive SPAs with real-time data. Pair with Next.js for SSR when needed.' },
 *     { id: 'vue-spa', label: 'Choose Vue', kind: 'conclusion',
 *       detail: 'Vue provides a gentler learning curve with built-in reactivity. Great for teams new to frontend frameworks.',
 *       conclusion: 'Vue 3 + Vite is optimal for SPAs where developer experience and built-in conventions matter. Easier onboarding for new team members.' },
 *     { id: 'astro-site', label: 'Choose Astro', kind: 'conclusion',
 *       detail: 'Astro delivers fast static sites with island architecture. Zero JS by default, hydrate only interactive islands.',
 *       conclusion: 'Astro is optimal for content-heavy sites where performance and SEO are critical. Pair with Vue/React islands for interactive sections.' },
 *     { id: 'python-pipe', label: 'Choose Python', kind: 'conclusion',
 *       detail: 'Python dominates data/ML: NumPy, Pandas, PyTorch, FastAPI for serving models.',
 *       conclusion: 'Python + FastAPI is optimal for data pipelines and ML serving. Use Celery/Dask for distributed processing.' },
 *     { id: 'rust-pipe', label: 'Choose Rust', kind: 'conclusion',
 *       detail: 'Rust for high-throughput, low-latency pipelines where performance is critical.',
 *       conclusion: 'Rust is optimal when throughput and latency are hard constraints. Higher development cost, but unmatched runtime performance.' },
 *     { id: 'flutter-app', label: 'Choose Flutter', kind: 'conclusion',
 *       detail: 'Flutter for cross-platform mobile with a single codebase. Growing ecosystem, good performance.',
 *       conclusion: 'Flutter is optimal for cross-platform mobile apps where a single team maintains both platforms. Use Dart for consistency.' },
 *   ],
 *   edges: [
 *     { from: 'root', to: 'web-app', label: 'Web' },
 *     { from: 'root', to: 'data-pipeline', label: 'Data/ML' },
 *     { from: 'root', to: 'mobile', label: 'Mobile' },
 *     { from: 'web-app', to: 'spa', label: 'Interactive' },
 *     { from: 'web-app', to: 'static-site', label: 'Content' },
 *     { from: 'spa', to: 'real-time', label: 'Real-time needed' },
 *     { from: 'spa', to: 'conventional', label: 'Standard CRUD' },
 *     { from: 'real-time', to: 'react-spa', label: 'Complex state' },
 *     { from: 'real-time', to: 'vue-spa', label: 'Simpler DX' },
 *     { from: 'conventional', to: 'react-spa', label: 'Large team' },
 *     { from: 'conventional', to: 'vue-spa', label: 'Small team' },
 *     { from: 'static-site', to: 'astro-site', label: 'SEO critical' },
 *     { from: 'data-pipeline', to: 'python-pipe', label: 'Standard ML' },
 *     { from: 'data-pipeline', to: 'rust-pipe', label: 'Ultra-low latency' },
 *     { from: 'mobile', to: 'flutter-app', label: 'Cross-platform' },
 *   ],
 *   cta: { label: 'Start your selection', href: '#' },
 * };
 *
 * For use with React+Babel inline. After loading this file,
 * window.DecisionTree and window.DecisionTreeExampleData are available.
 */

(function () {
  'use strict';

  var React = window.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useRef = React.useRef;
  var useCallback = React.useCallback;
  var useMemo = React.useMemo;

  // ---------------------------------------------------------------------------
  // Inline easing: expoOut (cubic-bezier(0.16, 1, 0.3, 1))
  // Source: animations.jsx Easing library
  // ---------------------------------------------------------------------------
  function expoOut(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  // ---------------------------------------------------------------------------
  // URL sanitization (shared with Compare template)
  // ---------------------------------------------------------------------------
  function sanitizeUrl(url) {
    if (!url) return '#';
    if (/^https?:\/\//i.test(url)) return url;
    if (/^mailto:/i.test(url)) return url;
    if (/^\//i.test(url)) return url;  // Relative paths
    // Block javascript:, data:, vbscript: protocols
    return '#';
  }

  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------
  var KIND_COLORS = {
    question:   '#F59E0B',
    factor:     '#6B7280',
    conclusion: '#10B981',
  };

  var KIND_TEXT_COLORS = {
    question:   '#1F2937',
    factor:     '#FFFFFF',
    conclusion: '#1F2937',
  };

  var KIND_SHADOWS = {
    question:   'none',
    factor:     'none',
    conclusion: '0 2px 8px rgba(16,185,129,0.25)',
  };

  var BREAKPOINT_MOBILE  = 768;
  var BREAKPOINT_TABLET  = 1024;

  var STAGGER_DELAY      = 50;
  var NODE_DURATION      = 400;
  var EDGE_DURATION      = 600;
  var EDGE_START_DELAY   = 200;
  var TITLE_DURATION     = 400;
  var DIM_DURATION       = 200;
  var PULSE_REPEAT       = 4;

  var NODE_RADIUS        = 8;
  var NODE_MIN_W         = 96;
  var NODE_MAX_W         = 160;
  var NODE_MIN_H         = 48;
  var NODE_MAX_H         = 72;
  var NODE_GAP_X         = 32;
  var VERTICAL_GAP       = 48;
  var MOBILE_INDENT      = 24;

  var ACCENT_PATH_COLOR  = '#10B981';

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
  function debounce(fn, ms) {
    var timer;
    return function () {
      var args = arguments;
      var ctx = this;
      clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(ctx, args); }, ms);
    };
  }

  function animateValue(from, to, duration, easing, onFrame) {
    var start = null;
    var id;
    function tick(ts) {
      if (!start) start = ts;
      var elapsed = ts - start;
      var progress = Math.min(elapsed / duration, 1);
      var value = from + (to - from) * easing(progress);
      onFrame(value, progress >= 1);
      if (progress < 1) {
        id = requestAnimationFrame(tick);
      }
    }
    id = requestAnimationFrame(tick);
    return function cancel() { cancelAnimationFrame(id); };
  }

  function prefersReducedMotion() {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // ---------------------------------------------------------------------------
  // BFS Layout Algorithm: Three-phase (subtree width, DFS placement, parent centering)
  // ---------------------------------------------------------------------------
  function computeTreeLayout(nodes, edges) {
    var nodeMap = {};
    nodes.forEach(function (n) { nodeMap[n.id] = n; });

    // Build parent/children maps
    // DAG handling: only the first encountered edge becomes the primary parent
    var parentMap = {};
    var childrenMap = {};
    var allParentEdges = {};  // For path traversal: all incoming parents

    edges.forEach(function (e) {
      if (!allParentEdges[e.to]) allParentEdges[e.to] = [];
      allParentEdges[e.to].push(e.from);

      if (!parentMap[e.to]) {
        parentMap[e.to] = e.from;
        if (!childrenMap[e.from]) childrenMap[e.from] = [];
        if (childrenMap[e.from].indexOf(e.to) === -1) {
          childrenMap[e.from].push(e.to);
        }
      }
    });

    // Find root (node with no parent)
    var rootId = null;
    nodes.forEach(function (n) {
      if (!parentMap[n.id]) rootId = n.id;
    });

    if (!rootId) return null;

    // BFS: compute levels
    var levels = {};
    var bfsQueue = [rootId];
    levels[rootId] = 0;

    while (bfsQueue.length > 0) {
      var current = bfsQueue.shift();
      var children = childrenMap[current] || [];
      children.forEach(function (childId) {
        levels[childId] = levels[current] + 1;
        bfsQueue.push(childId);
      });
    }

    // Detect max siblings per level for fallback
    var levelSiblingCounts = {};
    nodes.forEach(function (n) {
      var lv = levels[n.id];
      if (!levelSiblingCounts[lv]) levelSiblingCounts[lv] = 0;
      levelSiblingCounts[lv]++;
    });

    // Use wider gap when any level has >5 siblings
    var hasWideLevel = false;
    Object.keys(levelSiblingCounts).forEach(function (lv) {
      if (levelSiblingCounts[lv] > 5) hasWideLevel = true;
    });
    var horizontalGap = hasWideLevel ? 64 : NODE_GAP_X;

    // Phase 1: Compute subtree widths (bottom-up recursive)
    var subtreeWidth = {};
    function computeSubtreeWidthFn(nodeId) {
      var children = childrenMap[nodeId] || [];
      if (children.length === 0) {
        subtreeWidth[nodeId] = NODE_MAX_W;
        return NODE_MAX_W;
      }
      var totalWidth = 0;
      children.forEach(function (childId, idx) {
        totalWidth += computeSubtreeWidthFn(childId);
        if (idx < children.length - 1) totalWidth += horizontalGap;
      });
      subtreeWidth[nodeId] = Math.max(NODE_MAX_W, totalWidth);
      return subtreeWidth[nodeId];
    }
    computeSubtreeWidthFn(rootId);

    // Phase 2: DFS top-down placement
    var nodePositions = {};
    var maxLevel = 0;

    function placeChildren(nodeId, leftEdge, level) {
      if (level > maxLevel) maxLevel = level;
      var children = childrenMap[nodeId] || [];
      var stw = subtreeWidth[nodeId];

      nodePositions[nodeId] = {
        x: 0, // Corrected in Phase 3
        y: level * (NODE_MAX_H + VERTICAL_GAP),
      };

      if (children.length === 0) {
        nodePositions[nodeId].x = leftEdge + stw / 2 - NODE_MAX_W / 2;
        return;
      }

      var childrenTotalWidth = 0;
      children.forEach(function (childId, idx) {
        childrenTotalWidth += subtreeWidth[childId];
        if (idx < children.length - 1) childrenTotalWidth += horizontalGap;
      });

      var childrenStartX = leftEdge + (stw - childrenTotalWidth) / 2;
      var currentX = childrenStartX;
      children.forEach(function (childId) {
        placeChildren(childId, currentX, level + 1);
        currentX += subtreeWidth[childId] + horizontalGap;
      });
    }

    placeChildren(rootId, 0, 0);

    // Phase 3: Center parents over children (bottom-up)
    function centerParentsBottomUp() {
      for (var lv = maxLevel; lv >= 0; lv--) {
        nodes.forEach(function (n) {
          if (levels[n.id] !== lv) return;
          var children = childrenMap[n.id] || [];
          if (children.length === 0) return;

          var minChildX = Infinity;
          var maxChildX = -Infinity;
          children.forEach(function (childId) {
            var cx = nodePositions[childId].x;
            if (cx < minChildX) minChildX = cx;
            if (cx + NODE_MAX_W > maxChildX) maxChildX = cx + NODE_MAX_W;
          });
          var childrenCenterX = (minChildX + maxChildX) / 2;
          nodePositions[n.id].x = childrenCenterX - NODE_MAX_W / 2;
        });
      }
    }
    centerParentsBottomUp();

    // Normalize: shift so minimum x >= padding
    var minX = Infinity;
    Object.keys(nodePositions).forEach(function (id) {
      if (nodePositions[id].x < minX) minX = nodePositions[id].x;
    });
    var padding = 24;
    var shiftAll = padding - minX;
    if (shiftAll > 0) {
      Object.keys(nodePositions).forEach(function (id) {
        nodePositions[id].x += shiftAll;
      });
    }

    // Compute container dimensions
    var maxX = 0;
    var maxY = 0;
    Object.keys(nodePositions).forEach(function (id) {
      var p = nodePositions[id];
      if (p.x + NODE_MAX_W > maxX) maxX = p.x + NODE_MAX_W;
      if (p.y + NODE_MAX_H > maxY) maxY = p.y + NODE_MAX_H;
    });

    return {
      nodePositions: nodePositions,
      levels: levels,
      parentMap: parentMap,
      childrenMap: childrenMap,
      allParentEdges: allParentEdges,
      rootId: rootId,
      maxLevel: maxLevel,
      containerWidth: maxX + padding,
      containerHeight: maxY + padding + NODE_MAX_H,
      horizontalGap: horizontalGap,
      hasWideLevel: hasWideLevel,
    };
  }

  // ---------------------------------------------------------------------------
  // Path computation: root -> nodeId via primary parent pointers
  // ---------------------------------------------------------------------------
  function computePath(nodeId, parentMap) {
    if (!nodeId) return [];
    var path = [nodeId];
    var current = nodeId;
    while (parentMap[current]) {
      current = parentMap[current];
      path.unshift(current);
    }
    return path;
  }

  // Build path description text: "Node Label -> Edge Label -> Node Label -> ..."
  function buildPathDescription(pathNodeIds, nodeMap, edges) {
    var parts = [];
    for (var i = 0; i < pathNodeIds.length; i++) {
      parts.push(nodeMap[pathNodeIds[i]].label);
      if (i < pathNodeIds.length - 1) {
        var edgeLabel = '';
        edges.forEach(function (e) {
          if (e.from === pathNodeIds[i] && e.to === pathNodeIds[i + 1]) {
            edgeLabel = e.label;
          }
        });
        if (edgeLabel) parts.push(edgeLabel);
      }
    }
    return parts;
  }

  // ---------------------------------------------------------------------------
  // Schema validation
  // ---------------------------------------------------------------------------
  function validateSchema(data) {
    if (!data || typeof data !== 'object') {
      console.warn('DecisionTree: schema is missing or not an object');
      return false;
    }
    if (!Array.isArray(data.nodes) || data.nodes.length === 0) {
      console.warn('DecisionTree: nodes array is missing or empty');
      return false;
    }
    return true;
  }

  // ---------------------------------------------------------------------------
  // TreeNode
  // ---------------------------------------------------------------------------
  function TreeNode(props) {
    var node = props.node;
    var level = props.level;
    var isOnPath = props.isOnPath;
    var isDimmed = props.isDimmed;
    var isHovered = props.isHovered;
    var isDesktop = props.isDesktop;
    var isMobile = props.isMobile;
    var nodeRef = props.nodeRef;
    var onMouseEnter = props.onMouseEnter;
    var onMouseLeave = props.onMouseLeave;
    var onClick = props.onClick;
    var onFocus = props.onFocus;
    var onBlur = props.onBlur;
    var entryProgress = props.entryProgress;
    var reducedMotion = props.reducedMotion;
    var x = props.x;
    var y = props.y;

    var bgColor = KIND_COLORS[node.kind] || KIND_COLORS.factor;
    var textColor = KIND_TEXT_COLORS[node.kind] || '#1F2937';
    var shadow = KIND_SHADOWS[node.kind] || 'none';

    // Dimming
    var dimOpacity = 0.35;
    var dimBlur = isDesktop ? 4 : 0;
    var dimTextOpacity = 0.4;

    var currentOpacity, currentBlur, textOpacity;
    if (isOnPath) {
      currentOpacity = 1;
      currentBlur = 0;
      textOpacity = 1;
    } else if (isDimmed) {
      currentOpacity = dimOpacity;
      currentBlur = dimBlur;
      textOpacity = dimTextOpacity;
    } else {
      // Normal state (no path active)
      currentOpacity = 1;
      currentBlur = 0;
      textOpacity = 1;
    }

    // Hover elevation
    var hoverScale = isHovered ? 1.04 : 1;
    var hoverShadow = isHovered
      ? '0 4px 12px rgba(0,0,0,0.15)'
      : shadow;

    // Entry animation overrides
    if (entryProgress < 1) {
      currentOpacity = entryProgress * currentOpacity;
      currentBlur = 0;
      textOpacity = entryProgress * textOpacity;
    }

    var translateY = reducedMotion ? 0 : ((1 - entryProgress) * -12);
    var transitionDuration = reducedMotion ? '0ms' : DIM_DURATION + 'ms';

    // Desktop: absolute positioning
    if (!isMobile) {
      var style = {
        position: 'absolute',
        left: x + 'px',
        top: y + 'px',
        minWidth: NODE_MIN_W,
        maxWidth: NODE_MAX_W,
        width: NODE_MAX_W,
        minHeight: NODE_MIN_H,
        maxHeight: NODE_MAX_H,
        borderRadius: NODE_RADIUS,
        background: bgColor,
        color: textColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px 16px',
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 1.3,
        textAlign: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        opacity: currentOpacity,
        filter: currentBlur > 0 ? 'blur(' + currentBlur + 'px)' : 'none',
        transform: 'translateY(' + translateY + 'px) scale(' + hoverScale + ')',
        boxShadow: hoverShadow,
        transition: 'opacity ' + transitionDuration + ' ease, filter ' + transitionDuration + ' ease, transform ' + transitionDuration + ' ease, box-shadow ' + transitionDuration + ' ease',
        outline: 'none',
        zIndex: isHovered ? 2 : 1,
      };

      if (reducedMotion && isHovered) {
        style.outline = '2px solid ' + bgColor;
        style.outlineOffset = '2px';
      }

      return React.createElement('div', {
        ref: nodeRef,
        className: 'dt-node',
        style: style,
        role: 'button',
        tabIndex: 0,
        'aria-label': node.label + ', ' + node.kind + ' node',
        'data-kind': node.kind,
        'data-level': level,
        onMouseEnter: onMouseEnter,
        onMouseLeave: onMouseLeave,
        onClick: onClick,
        onFocus: onFocus,
        onBlur: onBlur,
        onKeyDown: function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (onClick) onClick(e);
          }
        },
      }, node.label);
    }

    // Mobile: indented vertical list
    var indent = level * MOBILE_INDENT;
    var mobileStyle = {
      position: 'relative',
      left: 'auto',
      top: 'auto',
      minWidth: 0,
      maxWidth: 'none',
      width: '100%',
      minHeight: 48,  // 48x48 touch target
      height: 'auto',
      marginLeft: indent + 'px',
      marginBottom: 8,
      borderRadius: NODE_RADIUS,
      background: bgColor,
      color: textColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '12px 16px',
      fontSize: 14,
      fontWeight: 600,
      lineHeight: 1.3,
      textAlign: 'left',
      cursor: 'pointer',
      userSelect: 'none',
      opacity: currentOpacity,
      filter: 'none',  // No blur on mobile
      transform: reducedMotion ? 'none' : 'translateY(' + translateY + 'px)',
      boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.15)' : shadow,
      transition: reducedMotion ? 'none' : 'opacity ' + transitionDuration + ' ease',
      outline: 'none',
    };

    if (reducedMotion && isHovered) {
      mobileStyle.outline = '2px solid ' + bgColor;
      mobileStyle.outlineOffset = '2px';
    }

    return React.createElement('div', {
      ref: nodeRef,
      className: 'dt-node',
      style: mobileStyle,
      role: 'button',
      tabIndex: 0,
      'aria-label': node.label + ', ' + node.kind + ' node',
      'data-kind': node.kind,
      'data-level': level,
      onMouseEnter: undefined,  // No hover on mobile
      onMouseLeave: undefined,
      onClick: onClick,
      onFocus: onFocus,
      onBlur: onBlur,
      onKeyDown: function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (onClick) onClick(e);
        }
      },
    }, node.label);
  }

  // ---------------------------------------------------------------------------
  // TreeDiagram — HTML nodes + SVG overlay for edges
  // ---------------------------------------------------------------------------
  function TreeDiagram(props) {
    var nodes = props.nodes;
    var edges = props.edges;
    var layout = props.layout;
    var nodeMap = props.nodeMap;
    var hoveredNode = props.hoveredNode;
    var highlightedPath = props.highlightedPath;
    var isDesktop = props.isDesktop;
    var isMobile = props.isMobile;
    var entryProgress = props.entryProgress;
    var edgeProgress = props.edgeProgress;
    var pulseState = props.pulseState;
    var reducedMotion = props.reducedMotion;
    var onNodeEnter = props.onNodeEnter;
    var onNodeLeave = props.onNodeLeave;
    var onNodeClick = props.onNodeClick;

    var containerRef = useRef(null);
    var svgRef = useRef(null);
    var nodeRefs = useRef({});
    var pathRefs = useRef({});
    var resizeObserverRef = useRef(null);

    var _edgeData = useState([]);
    var edgeData = _edgeData[0];
    var setEdgeData = _edgeData[1];

    // Determine if a node is on the highlighted path
    var isOnPath = useCallback(function (nodeId) {
      return highlightedPath.indexOf(nodeId) >= 0;
    }, [highlightedPath]);

    // Determine if a node is dimmed (not on path, and there is an active path)
    var isDimmed = useCallback(function (nodeId) {
      if (highlightedPath.length === 0) return false;
      return highlightedPath.indexOf(nodeId) < 0;
    }, [highlightedPath]);

    // Compute edge positions from node layout positions (desktop)
    var computeEdges = useCallback(function () {
      if (!layout || isMobile) return;
      var newEdges = [];

      edges.forEach(function (edge) {
        var parentPos = layout.nodePositions[edge.from];
        var childPos = layout.nodePositions[edge.to];
        if (!parentPos || !childPos) return;

        // Anchors: parent bottom-center -> child top-center
        var sx = parentPos.x + NODE_MAX_W / 2;
        var sy = parentPos.y + NODE_MAX_H;
        var tx = childPos.x + NODE_MAX_W / 2;
        var ty = childPos.y;

        // Cubic bezier control points (vertical direction: 40% of vertical gap)
        var verticalOffset = VERTICAL_GAP * 0.4;
        var cp1x = sx;
        var cp1y = sy + verticalOffset;
        var cp2x = tx;
        var cp2y = ty - verticalOffset;

        newEdges.push({
          from: edge.from,
          to: edge.to,
          label: edge.label,
          sx: sx, sy: sy,
          tx: tx, ty: ty,
          cp1x: cp1x, cp1y: cp1y,
          cp2x: cp2x, cp2y: cp2y,
        });
      });

      setEdgeData(newEdges);
    }, [edges, layout, isMobile]);

    // ResizeObserver + 50ms debounce
    useEffect(function () {
      if (typeof ResizeObserver === 'undefined' || isMobile) return;
      var debounced = debounce(computeEdges, 50);
      resizeObserverRef.current = new ResizeObserver(debounced);
      if (containerRef.current) {
        resizeObserverRef.current.observe(containerRef.current);
      }
      return function () {
        if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
      };
    }, [computeEdges, isMobile]);

    // Observe node elements
    useEffect(function () {
      if (!resizeObserverRef.current || isMobile) return;
      var ro = resizeObserverRef.current;
      Object.values(nodeRefs.current).forEach(function (el) {
        if (el) ro.observe(el);
      });
    }, [nodes, entryProgress, isMobile]);

    // Initial edge computation
    useEffect(function () {
      if (isMobile) return;
      var t1 = setTimeout(computeEdges, 100);
      var t2 = setTimeout(computeEdges, 300);
      var t3 = setTimeout(computeEdges, 600);
      return function () { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, [computeEdges, isMobile]);

    // Update path dasharray/dashoffset for entry + pulse
    useEffect(function () {
      if (isMobile) return;
      var keys = Object.keys(pathRefs.current);
      if (keys.length === 0) return;

      keys.forEach(function (key) {
        var path = pathRefs.current[key];
        if (!path || typeof path.getTotalLength !== 'function') return;
        var len = path.getTotalLength();
        if (len === 0) return;

        if (edgeProgress < 1) {
          var offset = len * (1 - edgeProgress);
          path.style.strokeDasharray = len;
          path.style.strokeDashoffset = offset;
        } else if (pulseState.count < PULSE_REPEAT) {
          var pulseOffset = len * (1 - pulseState.progress);
          path.style.strokeDasharray = len + ' ' + len;
          path.style.strokeDashoffset = pulseOffset;
        } else {
          path.style.strokeDasharray = 'none';
          path.style.strokeDashoffset = '0';
        }
      });
    }, [edgeProgress, pulseState, isMobile]);

    // Node ref setter
    var setNodeRef = useCallback(function (nodeId) {
      return function (el) { nodeRefs.current[nodeId] = el; };
    }, []);

    // Determine path-active edges
    var isEdgeOnPath = useCallback(function (fromId, toId) {
      if (highlightedPath.length === 0) return false;
      for (var i = 0; i < highlightedPath.length - 1; i++) {
        if (highlightedPath[i] === fromId && highlightedPath[i + 1] === toId) return true;
      }
      return false;
    }, [highlightedPath]);

    // Container style
    if (isMobile) {
      // Mobile: indented vertical list, no SVG overlay
      var mobileContainerStyle = {
        position: 'relative',
        flex: 1,
        minHeight: 0,
        background: '#FAFAFA',
        padding: '24px 16px',
        overflow: 'auto',
      };

      return React.createElement('div', {
        ref: containerRef,
        style: mobileContainerStyle,
      },
        nodes.map(function (node) {
          var nodeId = node.id;
          var level = layout ? layout.levels[nodeId] : 0;
          return React.createElement(TreeNode, {
            key: nodeId,
            node: node,
            level: level,
            isOnPath: isOnPath(nodeId),
            isDimmed: isDimmed(nodeId),
            isHovered: hoveredNode === nodeId,
            isDesktop: false,
            isMobile: true,
            nodeRef: setNodeRef(nodeId),
            onMouseEnter: undefined,
            onMouseLeave: undefined,
            onClick: function () { onNodeClick(nodeId); },
            onFocus: function () { onNodeClick(nodeId); },
            onBlur: function () { onNodeLeave(); },
            entryProgress: entryProgress[nodeId] !== undefined ? entryProgress[nodeId] : 1,
            reducedMotion: reducedMotion,
            x: 0,
            y: 0,
          });
        })
      );
    }

    // Desktop/tablet: absolute positioning + SVG overlay
    if (!layout) return null;

    var containerW = layout.containerWidth;
    var containerH = layout.containerHeight;

    var desktopContainerStyle = {
      position: 'relative',
      flex: 1,
      minHeight: 0,
      background: '#FAFAFA',
      overflow: layout.hasWideLevel ? 'auto' : 'hidden',
    };

    var treeInnerStyle = {
      position: 'relative',
      width: containerW + 'px',
      height: containerH + 'px',
      marginTop: '24px',
    };

    var svgStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: containerW + 'px',
      height: containerH + 'px',
      pointerEvents: 'none',
      zIndex: 0,
    };

    return React.createElement('div', {
      ref: containerRef,
      style: desktopContainerStyle,
    },
      React.createElement('div', { style: treeInnerStyle },
        // SVG overlay for edges
        React.createElement('svg', {
          ref: svgRef,
          style: svgStyle,
          'aria-hidden': 'true',
        },
          edgeData.map(function (e, i) {
            var onPath = isEdgeOnPath(e.from, e.to);
            var d = 'M ' + e.sx + ' ' + e.sy + ' C ' + e.cp1x + ' ' + e.cp1y + ' ' + e.cp2x + ' ' + e.cp2y + ' ' + e.tx + ' ' + e.ty;

            var strokeColor = onPath ? ACCENT_PATH_COLOR : '#9CA3AF';
            var strokeWidth = onPath ? 3 : 2;
            var edgeOpacity = highlightedPath.length > 0
              ? (onPath ? 1 : 0.2)
              : 1;

            // Edge label at midpoint, above the line
            var midX = (e.sx + e.cp1x + e.cp2x + e.tx) / 4;
            var midY = (e.sy + e.cp1y + e.cp2y + e.ty) / 4 - 6;
            var labelOpacity = highlightedPath.length > 0
              ? (onPath ? 1 : 0.25)
              : 1;
            var labelFill = onPath ? ACCENT_PATH_COLOR : '#6B7280';

            var transitionStyle = reducedMotion ? 'none' : 'opacity ' + DIM_DURATION + 'ms ease, stroke ' + DIM_DURATION + 'ms ease, stroke-width ' + DIM_DURATION + 'ms ease';

            return React.createElement('g', { key: 'edge-' + i },
              React.createElement('path', {
                ref: function (el) { pathRefs.current['edge-' + i] = el; },
                d: d,
                fill: 'none',
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                opacity: edgeOpacity,
                style: { transition: transitionStyle },
              }),
              e.label ? React.createElement('text', {
                x: midX,
                y: midY,
                textAnchor: 'middle',
                fontSize: 12,
                fill: labelFill,
                opacity: labelOpacity,
                paintOrder: 'stroke fill',
                stroke: '#FAFAFA',
                strokeWidth: '3px',
                strokeLinejoin: 'round',
                style: { transition: reducedMotion ? 'none' : 'opacity ' + DIM_DURATION + 'ms ease, fill ' + DIM_DURATION + 'ms ease' },
              }, e.label) : null
            );
          })
        ),

        // Nodes layer
        nodes.map(function (node) {
          var nodeId = node.id;
          var pos = layout.nodePositions[nodeId];
          var level = layout.levels[nodeId];

          return React.createElement(TreeNode, {
            key: nodeId,
            node: node,
            level: level,
            isOnPath: isOnPath(nodeId),
            isDimmed: isDimmed(nodeId),
            isHovered: hoveredNode === nodeId,
            isDesktop: isDesktop,
            isMobile: false,
            nodeRef: setNodeRef(nodeId),
            onMouseEnter: function () { onNodeEnter(nodeId); },
            onMouseLeave: function () { onNodeLeave(); },
            onClick: function () { onNodeClick(nodeId); },
            onFocus: function () { onNodeEnter(nodeId); },
            onBlur: function () { onNodeLeave(); },
            entryProgress: entryProgress[nodeId] !== undefined ? entryProgress[nodeId] : 1,
            reducedMotion: reducedMotion,
            x: pos ? pos.x : 0,
            y: pos ? pos.y : 0,
          });
        })
      )
    );
  }

  // ---------------------------------------------------------------------------
  // PathPanel — right side panel (desktop) / bottom overlay (mobile)
  // ---------------------------------------------------------------------------
  function PathPanel(props) {
    var hoveredNode = props.hoveredNode;
    var highlightedPath = props.highlightedPath;
    var nodeMap = props.nodeMap;
    var edges = props.edges;
    var nodes = props.nodes;
    var cta = props.cta;
    var isMobile = props.isMobile;
    var reducedMotion = props.reducedMotion;
    var onClose = props.onClose;

    var hoveredNodeObj = hoveredNode ? nodeMap[hoveredNode] : null;

    // Build path description parts
    var pathParts = useMemo(function () {
      if (highlightedPath.length === 0) return [];
      return buildPathDescription(highlightedPath, nodeMap, edges);
    }, [highlightedPath, nodeMap, edges]);

    var panelRef = useRef(null);

    // Scroll to top on hover change
    useEffect(function () {
      if (panelRef.current) {
        var scrollTarget = panelRef.current.querySelector('.dt-panel-scroll');
        if (scrollTarget) scrollTarget.scrollTop = 0;
      }
    }, [hoveredNode]);

    // Mobile overlay style
    if (isMobile) {
      if (!hoveredNode) return null;

      var mobileOverlayStyle = {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: '#FFFFFF',
        borderTop: '1px solid #E5E7EB',
        padding: '12px 16px',
        minHeight: 120,
        maxHeight: '50vh',
        overflow: 'auto',
        boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
      };

      var closeButtonStyle = {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 48,
        height: 48,
        border: 'none',
        borderRadius: 8,
        background: '#F9FAFB',
        color: '#374151',
        fontSize: 18,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      };

      var bgColor = KIND_COLORS[hoveredNodeObj.kind] || KIND_COLORS.factor;

      return React.createElement('div', {
        ref: panelRef,
        style: mobileOverlayStyle,
        role: 'region',
        'aria-label': 'Path explanation',
      },
        React.createElement('button', {
          onClick: onClose,
          style: closeButtonStyle,
          'aria-label': 'Close',
        }, '\u00D7'),

        // Path label
        React.createElement('div', {
          style: {
            fontSize: 12,
            color: '#9CA3AF',
            marginBottom: 4,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          },
        }, 'Path Overview'),

        // Path text
        React.createElement('div', {
          style: {
            fontSize: 14,
            color: '#1F2937',
            lineHeight: 1.6,
            padding: '8px 12px',
            background: '#F9FAFB',
            borderRadius: 6,
            marginBottom: 12,
            paddingRight: 48,
          },
        },
          pathParts.map(function (part, i) {
            // Every even index is a node label, odd index is an edge label
            if (i % 2 === 1) {
              return React.createElement('span', {
                key: i,
                style: { color: ACCENT_PATH_COLOR, fontWeight: 600, margin: '0 4px' },
              }, ' \u2192 ' + part);
            }
            return React.createElement('span', { key: i }, part);
          })
        ),

        // Node detail
        hoveredNodeObj ? React.createElement('div', {
          style: {
            fontSize: 14,
            color: '#374151',
            lineHeight: 1.5,
            padding: 12,
            background: '#F9FAFB',
            borderRadius: 6,
            borderLeft: '4px solid ' + bgColor,
            marginBottom: 12,
          },
        }, hoveredNodeObj.detail) : null,

        // Conclusion badge
        hoveredNodeObj && hoveredNodeObj.kind === 'conclusion' && hoveredNodeObj.conclusion
          ? React.createElement('div', {
              style: {
                display: 'inline-block',
                fontSize: 13,
                fontWeight: 600,
                color: '#1F2937',
                background: '#10B981',
                padding: '4px 12px',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(16,185,129,0.25)',
                marginBottom: 12,
              },
            }, hoveredNodeObj.conclusion)
          : null
      );
    }

    // Desktop panel style
    var desktopPanelStyle = {
      display: 'flex',
      flexDirection: 'column',
      background: '#FFFFFF',
      borderLeft: '1px solid #E5E7EB',
      overflow: 'hidden',
      width: '35%',
      minWidth: 280,
      maxWidth: 400,
    };

    var pathLabelStyle = {
      fontSize: 12,
      color: '#9CA3AF',
      marginBottom: 4,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    };

    var defaultPathText = 'Hover any node to trace its decision path.';
    var pathTextContent = highlightedPath.length > 0
      ? pathParts.map(function (part, i) {
          if (i % 2 === 1) {
            return React.createElement('span', {
              key: i,
              style: { color: ACCENT_PATH_COLOR, fontWeight: 600, margin: '0 4px' },
            }, ' \u2192 ' + part);
          }
          return React.createElement('span', { key: i }, part);
        })
      : defaultPathText;

    var hoveredNodeBgColor = hoveredNodeObj
      ? (KIND_COLORS[hoveredNodeObj.kind] || KIND_COLORS.factor)
      : '#10B981';

    return React.createElement('div', {
      ref: panelRef,
      style: desktopPanelStyle,
      role: 'region',
      'aria-label': 'Path explanation',
    },
      React.createElement('div', {
        className: 'dt-panel-scroll',
        style: {
          flex: 1,
          overflow: 'auto',
          padding: '16px 20px',
        },
      },
        // Path label
        React.createElement('div', { style: pathLabelStyle }, 'Path Overview'),

        // Path text
        React.createElement('div', {
          style: {
            fontSize: 14,
            color: '#1F2937',
            lineHeight: 1.6,
            padding: '8px 12px',
            background: '#F9FAFB',
            borderRadius: 6,
            marginBottom: 16,
          },
        }, pathTextContent),

        // Node detail
        hoveredNodeObj ? React.createElement('div', {
          style: {
            fontSize: 14,
            color: '#374151',
            lineHeight: 1.5,
            padding: 12,
            background: '#F9FAFB',
            borderRadius: 6,
            borderLeft: '4px solid ' + hoveredNodeBgColor,
            marginBottom: 16,
          },
        }, hoveredNodeObj.detail) : null,

        // Conclusion badge
        hoveredNodeObj && hoveredNodeObj.kind === 'conclusion' && hoveredNodeObj.conclusion
          ? React.createElement('div', {
              style: {
                display: 'inline-block',
                fontSize: 13,
                fontWeight: 600,
                color: '#1F2937',
                background: '#10B981',
                padding: '4px 12px',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(16,185,129,0.25)',
                marginBottom: 16,
              },
            }, hoveredNodeObj.conclusion)
          : null
      ),

      // CTA
      cta ? React.createElement('div', {
        style: {
          padding: '16px 20px',
          borderTop: '1px solid #F3F4F6',
        },
      },
        React.createElement('a', {
          href: sanitizeUrl(cta.href),
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 48,
            padding: '0 24px',
            background: '#3B82F6',
            color: '#FFFFFF',
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 600,
            textDecoration: 'none',
            cursor: 'pointer',
            transition: reducedMotion ? 'none' : 'background 150ms ease',
          },
        }, cta.label)
      ) : null
    );
  }

  // ---------------------------------------------------------------------------
  // DecisionTree — main component
  // ---------------------------------------------------------------------------
  function DecisionTree(props) {
    var data = props.data;

    // Schema validation
    var valid = validateSchema(data);
    if (!valid) {
      return React.createElement('div', {
        style: { padding: 40, color: '#6B7280' },
      }, 'DecisionTree: invalid data schema');
    }

    var title = data.title || '';
    var subtitle = data.subtitle || '';
    var nodes = data.nodes || [];
    var edges = data.edges || [];
    var cta = data.cta || null;

    // Edge case: 0 nodes
    if (nodes.length === 0) {
      console.warn('DecisionTree: no nodes provided');
      return React.createElement('div', {
        style: { padding: 40, color: '#6B7280' },
      }, 'DecisionTree: no nodes to display');
    }

    // Build nodeMap
    var nodeMap = {};
    nodes.forEach(function (n) { nodeMap[n.id] = n; });

    // Compute layout
    var layout = useMemo(function () {
      return computeTreeLayout(nodes, edges);
    }, [nodes, edges]);

    // Edge case: no root
    if (!layout) {
      console.warn('DecisionTree: no root node found');
      return React.createElement('div', {
        style: { padding: 40, color: '#6B7280' },
      }, 'DecisionTree: no root node found');
    }

    // Responsive state
    var _viewport = useState(function () {
      if (typeof window === 'undefined') return 'desktop';
      var w = window.innerWidth;
      if (w < BREAKPOINT_MOBILE) return 'mobile';
      if (w < BREAKPOINT_TABLET) return 'tablet';
      return 'desktop';
    });
    var viewport = _viewport[0];
    var setViewport = _viewport[1];

    useEffect(function () {
      function onResize() {
        var w = window.innerWidth;
        if (w < BREAKPOINT_MOBILE) setViewport('mobile');
        else if (w < BREAKPOINT_TABLET) setViewport('tablet');
        else setViewport('desktop');
      }
      window.addEventListener('resize', onResize);
      return function () { window.removeEventListener('resize', onResize); };
    }, []);

    var isMobile = viewport === 'mobile';
    var isDesktop = viewport === 'desktop';

    // Reduced motion
    var _reduced = useState(prefersReducedMotion());
    var reducedMotion = _reduced[0];
    useEffect(function () {
      if (typeof window === 'undefined' || !window.matchMedia) return;
      var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      function handler(e) { _reduced[1](e.matches); }
      mq.addEventListener('change', handler);
      return function () { mq.removeEventListener('change', handler); };
    }, []);

    // Phase: entering -> ready
    var _phase = useState(reducedMotion ? 'ready' : 'entering');
    var phase = _phase[0];
    var setPhase = _phase[1];

    // Hovered node
    var _hoveredNode = useState(null);
    var hoveredNode = _hoveredNode[0];
    var setHoveredNode = _hoveredNode[1];

    // Highlighted path
    var highlightedPath = useMemo(function () {
      return computePath(hoveredNode, layout.parentMap);
    }, [hoveredNode, layout.parentMap]);

    // Node entry progress (per-node, keyed by node id)
    var _entryProgress = useState(function () {
      var initial = {};
      nodes.forEach(function (n) { initial[n.id] = reducedMotion ? 1 : 0; });
      return initial;
    });
    var entryProgress = _entryProgress[0];
    var setEntryProgress = _entryProgress[1];

    // Edge draw progress
    var _edgeProgress = useState(reducedMotion ? 1 : 0);
    var edgeProgress = _edgeProgress[0];
    var setEdgeProgress = _edgeProgress[1];

    // Title progress
    var _titleProgress = useState(reducedMotion ? 1 : 0);
    var titleProgress = _titleProgress[0];
    var setTitleProgress = _titleProgress[1];

    // Pulse state
    var _pulseState = useState({ count: 0, progress: 0 });
    var pulseState = _pulseState[0];
    var setPulseState = _pulseState[1];

    // Cancellation refs
    var cancelRefs = useRef([]);
    var pulseCancelRefs = useRef([]);

    // --- Entry Animation Sequence ---
    useEffect(function () {
      if (phase !== 'entering' || reducedMotion) return;

      var cancels = cancelRefs.current;

      // Title fade in
      cancels.push(animateValue(0, 1, TITLE_DURATION, expoOut, function (v) {
        setTitleProgress(v);
      }));

      // Build level groups for staggered entrance
      var levelGroups = {};
      nodes.forEach(function (n) {
        var lv = layout.levels[n.id];
        if (!levelGroups[lv]) levelGroups[lv] = [];
        levelGroups[lv].push(n.id);
      });

      // Node staggered entrance per BFS level
      var baseDelay = 300;
      for (var lv = 0; lv <= layout.maxLevel; lv++) {
        var nodesAtLevel = levelGroups[lv] || [];
        nodesAtLevel.forEach(function (nodeId, idx) {
          var delay = baseDelay + lv * STAGGER_DELAY * 3 + idx * STAGGER_DELAY;
          var timer = setTimeout(function () {
            cancels.push(animateValue(0, 1, NODE_DURATION, expoOut, function (v) {
              setEntryProgress(function (prev) {
                var next = Object.assign({}, prev);
                next[nodeId] = v;
                return next;
              });
            }));
          }, delay);
          cancels.push(function () { clearTimeout(timer); });
        });
      }

      // Edge draw: 200ms after last level starts entrance
      var lastLevelNodeCount = levelGroups[layout.maxLevel] ? levelGroups[layout.maxLevel].length : 0;
      var lastNodeDelay = baseDelay + layout.maxLevel * STAGGER_DELAY * 3 + lastLevelNodeCount * STAGGER_DELAY;
      var edgeStartDelay = lastNodeDelay + EDGE_START_DELAY;
      var edgeTimer = setTimeout(function () {
        cancels.push(animateValue(0, 1, EDGE_DURATION, expoOut, function (v) {
          setEdgeProgress(v);
        }));
      }, edgeStartDelay);
      cancels.push(function () { clearTimeout(edgeTimer); });

      // Total entry duration
      var totalDuration = edgeStartDelay + edges.length * STAGGER_DELAY + EDGE_DURATION + 50;
      var readyTimer = setTimeout(function () {
        setPhase('ready');
        runPulse();
      }, totalDuration);
      cancels.push(function () { clearTimeout(readyTimer); });

      return function () {
        cancels.forEach(function (fn) { if (fn) fn(); });
        cancelRefs.current = [];
      };
    }, [phase, reducedMotion, nodes.length, layout]);

    // --- Pulse animation ---
    var runPulse = useCallback(function () {
      if (reducedMotion) return;

      var pulseCount = 0;
      var pulseDuration = 600;

      function doPulse() {
        if (pulseCount >= PULSE_REPEAT) {
          setPulseState({ count: PULSE_REPEAT, progress: 0 });
          return;
        }
        var cancel = animateValue(0, 1, pulseDuration, expoOut, function (v, done) {
          setPulseState({ count: pulseCount, progress: v });
          if (done) {
            pulseCount++;
            doPulse();
          }
        });
        pulseCancelRefs.current.push(cancel);
      }
      doPulse();
    }, [reducedMotion]);

    // --- Skip on any input ---
    useEffect(function () {
      if (phase !== 'entering') return;

      function skip() {
        cancelRefs.current.forEach(function (fn) { if (fn) fn(); });
        cancelRefs.current = [];
        pulseCancelRefs.current.forEach(function (fn) { if (fn) fn(); });
        pulseCancelRefs.current = [];

        var finalEntry = {};
        nodes.forEach(function (n) { finalEntry[n.id] = 1; });
        setEntryProgress(finalEntry);
        setEdgeProgress(1);
        setTitleProgress(1);
        setPulseState({ count: PULSE_REPEAT, progress: 0 });
        setPhase('ready');
      }

      document.addEventListener('click', skip, true);
      document.addEventListener('keydown', skip, true);
      document.addEventListener('touchstart', skip, true);

      return function () {
        document.removeEventListener('click', skip, true);
        document.removeEventListener('keydown', skip, true);
        document.removeEventListener('touchstart', skip, true);
      };
    }, [phase, nodes.length]);

    // --- Hover handlers ---
    var handleNodeEnter = useCallback(function (nodeId) {
      if (phase !== 'ready') return;
      if (isMobile) return;
      setHoveredNode(nodeId);
    }, [phase, isMobile]);

    var handleNodeLeave = useCallback(function () {
      if (isMobile) return;
      setHoveredNode(null);
    }, [isMobile]);

    var handleNodeClick = useCallback(function (nodeId) {
      if (phase !== 'ready') return;
      if (isMobile) {
        setHoveredNode(function (prev) { return prev === nodeId ? null : nodeId; });
      } else {
        // Desktop: click also activates hover (for keyboard users)
        setHoveredNode(nodeId);
      }
    }, [phase, isMobile]);

    var handlePopupClose = useCallback(function () {
      setHoveredNode(null);
    }, []);

    // --- Title animation style ---
    var titleOpacity = titleProgress;
    var titleTranslateY = -12 * (1 - titleProgress);

    // --- Container layout ---
    var wrapperStyle = {
      fontFamily: '-apple-system, "SF Pro Text", "PingFang SC", sans-serif',
      background: '#FAFAFA',
      minHeight: '100%',
      padding: isMobile ? '20px 16px' : '40px 32px',
    };

    var contentStyle = {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: 0,
      minHeight: isMobile ? 320 : 400,
      borderRadius: 12,
      overflow: 'hidden',
      background: '#FAFAFA',
      border: '1px solid #E5E7EB',
    };

    return React.createElement('div', {
      id: 'decision-tree-root',
      style: wrapperStyle,
    },
      // Title area
      React.createElement('div', {
        style: {
          marginBottom: isMobile ? 16 : 24,
          opacity: titleOpacity,
          transform: 'translateY(' + titleTranslateY + 'px)',
          transition: reducedMotion ? 'none' : 'opacity 400ms ease, transform 400ms ease',
        },
      },
        React.createElement('h2', {
          style: {
            fontSize: isMobile ? 22 : 28,
            fontWeight: 600,
            color: '#1F2937',
            letterSpacing: '-0.02em',
            marginBottom: 8,
          },
        }, title),
        React.createElement('p', {
          style: {
            fontSize: isMobile ? 14 : 16,
            color: '#6B7280',
            lineHeight: 1.5,
          },
        }, subtitle)
      ),

      // Content area (tree + panel)
      React.createElement('div', { style: contentStyle },
        // TreeDiagram
        React.createElement(TreeDiagram, {
          nodes: nodes,
          edges: edges,
          layout: layout,
          nodeMap: nodeMap,
          hoveredNode: hoveredNode,
          highlightedPath: highlightedPath,
          isDesktop: isDesktop,
          isMobile: isMobile,
          entryProgress: entryProgress,
          edgeProgress: edgeProgress,
          pulseState: pulseState,
          reducedMotion: reducedMotion,
          onNodeEnter: handleNodeEnter,
          onNodeLeave: handleNodeLeave,
          onNodeClick: handleNodeClick,
        }),

        // PathPanel (desktop: always visible, mobile: only when hovered)
        !isMobile ? React.createElement(PathPanel, {
          hoveredNode: hoveredNode,
          highlightedPath: highlightedPath,
          nodeMap: nodeMap,
          edges: edges,
          nodes: nodes,
          cta: cta,
          isMobile: false,
          reducedMotion: reducedMotion,
          onClose: handlePopupClose,
        }) : null
      ),

      // Mobile overlay (PathPanel rendered as fixed bottom overlay)
      isMobile ? React.createElement(PathPanel, {
        hoveredNode: hoveredNode,
        highlightedPath: highlightedPath,
        nodeMap: nodeMap,
        edges: edges,
        nodes: nodes,
        cta: cta,
        isMobile: true,
        reducedMotion: reducedMotion,
        onClose: handlePopupClose,
      }) : null
    );
  }

  // ---------------------------------------------------------------------------
  // Example data — Technology Selection Decision Tree (14 nodes, 15 edges)
  // ---------------------------------------------------------------------------
  var EXAMPLE_DATA = {
    title: 'Technology Selection Decision Tree',
    subtitle: 'Choose the right stack for your project',
    nodes: [
      { id: 'root', label: 'What is your project type?', kind: 'question',
        detail: 'Start by identifying the primary purpose of your project. This determines which technology path to explore.' },
      { id: 'web-app', label: 'Web Application', kind: 'factor',
        detail: 'Browser-based applications with rich UI and frequent user interaction.' },
      { id: 'data-pipeline', label: 'Data Pipeline / ML', kind: 'factor',
        detail: 'Backend data processing, ETL, or machine learning workflows with minimal UI.' },
      { id: 'mobile', label: 'Mobile App', kind: 'factor',
        detail: 'Native mobile experience on iOS and/or Android.' },
      { id: 'spa', label: 'SPA / Interactive UI', kind: 'question',
        detail: 'Single-page application with complex state management and real-time updates.' },
      { id: 'static-site', label: 'Static / Content Site', kind: 'question',
        detail: 'Content-focused site with minimal interactivity, SEO is critical.' },
      { id: 'real-time', label: 'Real-time Updates', kind: 'factor',
        detail: 'Application requires WebSocket, SSE, or frequent data refresh.' },
      { id: 'conventional', label: 'Conventional CRUD', kind: 'factor',
        detail: 'Standard form-based application with server-rendered or slowly updating pages.' },
      { id: 'react-spa', label: 'Choose React', kind: 'conclusion',
        detail: 'React excels at complex SPA with frequent state changes. Large ecosystem, flexible architecture.',
        conclusion: 'React + TypeScript is optimal for interactive SPAs with real-time data. Pair with Next.js for SSR when needed.' },
      { id: 'vue-spa', label: 'Choose Vue', kind: 'conclusion',
        detail: 'Vue provides a gentler learning curve with built-in reactivity. Great for teams new to frontend frameworks.',
        conclusion: 'Vue 3 + Vite is optimal for SPAs where developer experience and built-in conventions matter. Easier onboarding for new team members.' },
      { id: 'astro-site', label: 'Choose Astro', kind: 'conclusion',
        detail: 'Astro delivers fast static sites with island architecture. Zero JS by default, hydrate only interactive islands.',
        conclusion: 'Astro is optimal for content-heavy sites where performance and SEO are critical. Pair with Vue/React islands for interactive sections.' },
      { id: 'python-pipe', label: 'Choose Python', kind: 'conclusion',
        detail: 'Python dominates data/ML: NumPy, Pandas, PyTorch, FastAPI for serving models.',
        conclusion: 'Python + FastAPI is optimal for data pipelines and ML serving. Use Celery/Dask for distributed processing.' },
      { id: 'rust-pipe', label: 'Choose Rust', kind: 'conclusion',
        detail: 'Rust for high-throughput, low-latency pipelines where performance is critical.',
        conclusion: 'Rust is optimal when throughput and latency are hard constraints. Higher development cost, but unmatched runtime performance.' },
      { id: 'flutter-app', label: 'Choose Flutter', kind: 'conclusion',
        detail: 'Flutter for cross-platform mobile with a single codebase. Growing ecosystem, good performance.',
        conclusion: 'Flutter is optimal for cross-platform mobile apps where a single team maintains both platforms. Use Dart for consistency.' },
    ],
    edges: [
      { from: 'root', to: 'web-app', label: 'Web' },
      { from: 'root', to: 'data-pipeline', label: 'Data/ML' },
      { from: 'root', to: 'mobile', label: 'Mobile' },
      { from: 'web-app', to: 'spa', label: 'Interactive' },
      { from: 'web-app', to: 'static-site', label: 'Content' },
      { from: 'spa', to: 'real-time', label: 'Real-time needed' },
      { from: 'spa', to: 'conventional', label: 'Standard CRUD' },
      { from: 'real-time', to: 'react-spa', label: 'Complex state' },
      { from: 'real-time', to: 'vue-spa', label: 'Simpler DX' },
      { from: 'conventional', to: 'react-spa', label: 'Large team' },
      { from: 'conventional', to: 'vue-spa', label: 'Small team' },
      { from: 'static-site', to: 'astro-site', label: 'SEO critical' },
      { from: 'data-pipeline', to: 'python-pipe', label: 'Standard ML' },
      { from: 'data-pipeline', to: 'rust-pipe', label: 'Ultra-low latency' },
      { from: 'mobile', to: 'flutter-app', label: 'Cross-platform' },
    ],
    cta: { label: 'Start your selection', href: '#' },
  };

  // ---------------------------------------------------------------------------
  // Export to window (React+Babel scope sharing)
  // ---------------------------------------------------------------------------
  window.DecisionTree = DecisionTree;
  window.DecisionTreeExampleData = EXAMPLE_DATA;

})();