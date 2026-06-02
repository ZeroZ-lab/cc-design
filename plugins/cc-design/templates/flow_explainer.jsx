/**
 * FlowExplainer — Interactive step-by-step flow diagram template
 *
 * SCHEMA
 * ======
 * {
 *   title: string,                          // Section heading
 *   subtitle: string,                       // Section sub-heading
 *   nodes: [{
 *     id: string,                           // Unique node identifier
 *     label: string,                        // Display name
 *     kind: 'input'|'process'|'output'|'decision',
 *     description: string,                  // Extended description for detail popup
 *   }],
 *   edges: [{
 *     from: string,                         // Source node id
 *     to: string,                           // Target node id
 *     label?: string,                       // Optional edge annotation
 *   }],
 *   steps: [{
 *     headline: string,                     // Step title shown in panel
 *     body: string,                         // Step body text
 *     focus: string[],                      // Node ids highlighted in this step
 *   }],
 *   cta: {
 *     label: string,                        // CTA button text
 *     href: string,                         // CTA link
 *   },
 * }
 *
 * COMPLETE EXAMPLE — RAG Retrieval-Augmented Generation Pipeline
 * ===============================================================
 *
 * const EXAMPLE_DATA = {
 *   title: 'RAG Retrieval-Augmented Generation Pipeline',
 *   subtitle: 'How your query becomes an accurate, grounded answer',
 *   nodes: [
 *     { id: 'user-query',   label: 'User Query',        kind: 'input',    description: 'The natural-language question submitted by the end user. This is the entry point of the pipeline.' },
 *     { id: 'retriever',    label: 'Retriever',          kind: 'process',  description: 'Embeds the query and searches the vector store for the top-k most relevant document chunks.' },
 *     { id: 'reranker',     label: 'Reranker',           kind: 'decision', description: 'Scores retrieved chunks with a cross-encoder and reranks them by true relevance to the query.' },
 *     { id: 'generator',    label: 'Answer Generator',   kind: 'process',  description: 'Feeds the top ranked context chunks plus the original query into the LLM to produce a draft answer.' },
 *     { id: 'response',     label: 'Response',           kind: 'output',   description: 'The final grounded answer returned to the user, complete with source citations.' },
 *   ],
 *   edges: [
 *     { from: 'user-query', to: 'retriever',  label: 'embed + search' },
 *     { from: 'retriever',  to: 'reranker',   label: 'top-k chunks' },
 *     { from: 'reranker',   to: 'generator',  label: 'ranked context' },
 *     { from: 'generator',  to: 'response',   label: 'draft answer' },
 *   ],
 *   steps: [
 *     { headline: '1. User submits a query',
 *       body: 'The pipeline starts when a user types a natural-language question. The system normalises the text and prepares it for embedding.',
 *       focus: ['user-query'] },
 *     { headline: '2. Retriever searches the knowledge base',
 *       body: 'The query is converted into a dense vector embedding. A similarity search retrieves the top-k most relevant document chunks from the vector store.',
 *       focus: ['user-query', 'retriever'] },
 *     { headline: '3. Reranker refines the results',
 *       body: 'A cross-encoder reranker scores each retrieved chunk for true relevance. Chunks are reordered so the most useful context reaches the generator first.',
 *       focus: ['retriever', 'reranker'] },
 *     { headline: '4. Answer Generator produces a draft',
 *       body: 'The top-ranked context chunks and the original query are assembled into a prompt. The LLM generates a grounded draft answer with inline citations.',
 *       focus: ['reranker', 'generator'] },
 *     { headline: '5. Grounded response delivered',
 *       body: 'The final answer is returned to the user. Every claim is backed by a source citation, making the response auditable and trustworthy.',
 *       focus: ['generator', 'response'] },
 *   ],
 *   cta: { label: 'Try it in your project', href: '#' },
 * };
 *
 * For use with React+Babel inline. After loading this file,
 * window.FlowExplainer and window.FlowExplainerExampleData are available.
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
  // Constants
  // ---------------------------------------------------------------------------
  var KIND_COLORS = {
    input:    '#3B82F6',
    process:  '#6B7280',
    output:   '#10B981',
    decision: '#F59E0B',
  };

  var KIND_TEXT_COLORS = {
    input:    '#1F2937',
    process:  '#FFFFFF',
    output:   '#1F2937',
    decision: '#1F2937',
  };

  var BREAKPOINT_MOBILE  = 768;
  var BREAKPOINT_TABLET  = 1024;

  var STAGGER_DELAY      = 50;   // ms between nodes
  var NODE_DURATION      = 400;  // ms per node entrance
  var EDGE_DURATION      = 600;  // ms edge draw
  var EDGE_START_DELAY   = 200;  // ms after last node starts
  var TITLE_DURATION     = 400;  // ms title entrance
  var STEP_TRANSITION    = 250;  // ms step highlight
  var DIM_DURATION       = 300;  // ms dim/restore
  var HOVER_DURATION     = 200;  // ms hover focus
  var PULSE_REPEAT       = 4;

  var NODE_RADIUS        = 8;
  var NODE_MIN_W         = 96;
  var NODE_MAX_W         = 160;
  var NODE_MIN_H         = 48;
  var NODE_MAX_H         = 72;
  var NODE_GAP_X         = 32;
  var NODE_GAP_Y         = 24;

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
  // Schema validation
  // ---------------------------------------------------------------------------
  function validateSchema(data) {
    if (!data || typeof data !== 'object') {
      console.warning('FlowExplainer: schema is missing or not an object');
      return false;
    }
    if (!Array.isArray(data.nodes) || data.nodes.length === 0) {
      console.warning('FlowExplainer: nodes array is missing or empty');
      return false;
    }
    if (!Array.isArray(data.steps)) {
      console.warning('FlowExplainer: steps array is missing');
      return false;
    }
    return true;
  }

  // ---------------------------------------------------------------------------
  // FlowNode
  // ---------------------------------------------------------------------------
  function FlowNode(props) {
    var node = props.node;
    var isActive = props.isActive;
    var isDimmed = props.isDimmed;
    var isDesktop = props.isDesktop;
    var nodeRef = props.nodeRef;
    var onMouseEnter = props.onMouseEnter;
    var onMouseLeave = props.onMouseLeave;
    var onClick = props.onClick;
    var onFocus = props.onFocus;
    var onBlur = props.onBlur;
    var entryProgress = props.entryProgress;
    var reducedMotion = props.reducedMotion;

    var bgColor = KIND_COLORS[node.kind] || KIND_COLORS.process;
    var textColor = KIND_TEXT_COLORS[node.kind] || '#1F2937';

    var dimOpacity = 0.35;
    var dimBlur = isDesktop ? 4 : 0;
    var dimTextOpacity = 0.4;

    var currentOpacity = isActive ? 1 : dimOpacity;
    var currentBlur = (!isActive && isDesktop) ? dimBlur : 0;
    var textOpacity = isActive ? 1 : dimTextOpacity;

    // Entry animation overrides
    if (entryProgress < 1) {
      currentOpacity = entryProgress;
      currentBlur = 0;
      textOpacity = entryProgress;
    }

    var translateX = reducedMotion ? 0 : ((1 - entryProgress) * -16);
    var transitionDuration = reducedMotion ? '0ms' : (entryProgress < 1 ? '0ms' : DIM_DURATION + 'ms');

    var style = {
      minWidth: NODE_MIN_W,
      maxWidth: NODE_MAX_W,
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
      transform: 'translateX(' + translateX + 'px)',
      transition: 'opacity ' + transitionDuration + 'ms ease, filter ' + transitionDuration + 'ms ease',
      position: 'relative',
      outline: 'none',
    };

    if (reducedMotion && isActive && !entryProgress < 1) {
      // On reduced motion, active hover uses outline
    }

    return React.createElement('div', {
      ref: nodeRef,
      className: 'explainer-node',
      style: style,
      role: 'button',
      tabIndex: 0,
      'aria-label': node.label + ', ' + node.kind + ' node',
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

  // ---------------------------------------------------------------------------
  // FlowDiagram — nodes + SVG overlay for edges
  // ---------------------------------------------------------------------------
  function FlowDiagram(props) {
    var nodes = props.nodes;
    var edges = props.edges;
    var activeNodeIds = props.activeNodeIds;
    var hoveredNodeId = props.hoveredNodeId;
    var isDesktop = props.isDesktop;
    var isMobile = props.isMobile;
    var entryProgress = props.entryProgress;
    var edgeProgress = props.edgeProgress;
    var pulseState = props.pulseState;
    var reducedMotion = props.reducedMotion;
    var phase = props.phase;
    var onNodeEnter = props.onNodeEnter;
    var onNodeLeave = props.onNodeLeave;
    var onNodeClick = props.onNodeClick;

    var containerRef = useRef(null);
    var svgRef = useRef(null);
    var nodeRefs = useRef({});
    var pathRefs = useRef({});
    var pathLengths = useRef({});
    var resizeObserverRef = useRef(null);

    var _edgeData = useState([]);
    var edgeData = _edgeData[0];
    var setEdgeData = _edgeData[1];

    // Compute which node ids are active (considering hover override)
    var effectiveActiveIds = useMemo(function () {
      if (hoveredNodeId !== null) {
        // Hover wins: hovered node + directly connected nodes + connected edges
        var connected = [hoveredNodeId];
        edges.forEach(function (e) {
          if (e.from === hoveredNodeId) connected.push(e.to);
          if (e.to === hoveredNodeId) connected.push(e.from);
        });
        return connected;
      }
      return activeNodeIds;
    }, [hoveredNodeId, activeNodeIds, edges]);

    // Compute edge positions from node DOM rects
    var computeEdges = useCallback(function () {
      if (!containerRef.current) return;
      var containerRect = containerRef.current.getBoundingClientRect();
      var newEdges = [];

      edges.forEach(function (edge) {
        var sourceEl = nodeRefs.current[edge.from];
        var targetEl = nodeRefs.current[edge.to];
        if (!sourceEl || !targetEl) return;

        // Use container-relative offsets (works with scroll)
        var sRect = sourceEl.getBoundingClientRect();
        var tRect = targetEl.getBoundingClientRect();

        var sx = sRect.left - containerRect.left + sRect.width;
        var sy = sRect.top - containerRect.top + sRect.height / 2;
        var tx = tRect.left - containerRect.left;
        var ty = tRect.top - containerRect.top + tRect.height / 2;

        var gap = tx - sx;
        var cpOffset = gap * 0.4;

        newEdges.push({
          from: edge.from,
          to: edge.to,
          label: edge.label,
          sx: sx, sy: sy,
          tx: tx, ty: ty,
          cp1x: sx + cpOffset, cp1y: sy,
          cp2x: tx - cpOffset, cp2y: ty,
        });
      });

      setEdgeData(newEdges);
    }, [edges]);

    // ResizeObserver + debounce 50ms
    useEffect(function () {
      if (typeof ResizeObserver === 'undefined') return;

      var debounced = debounce(computeEdges, 50);

      resizeObserverRef.current = new ResizeObserver(debounced);

      if (containerRef.current) {
        resizeObserverRef.current.observe(containerRef.current);
      }

      return function () {
        if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
      };
    }, [computeEdges]);

    // Observe node elements as they mount
    useEffect(function () {
      if (!resizeObserverRef.current) return;
      var ro = resizeObserverRef.current;
      Object.values(nodeRefs.current).forEach(function (el) {
        if (el) ro.observe(el);
      });
    }, [nodes, entryProgress]);

    // Recompute edges after layout stabilises
    useEffect(function () {
      // Multiple passes to ensure nodes are fully laid out
      var t1 = setTimeout(computeEdges, 100);
      var t2 = setTimeout(computeEdges, 300);
      var t3 = setTimeout(computeEdges, 600);
      return function () { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, [computeEdges, isMobile, phase]);

    // Update path dasharray/dashoffset for entry + pulse
    useEffect(function () {
      var keys = Object.keys(pathRefs.current);
      if (keys.length === 0) return;

      keys.forEach(function (key) {
        var path = pathRefs.current[key];
        if (!path || typeof path.getTotalLength !== 'function') return;

        var len = path.getTotalLength();
        if (len === 0) return;
        pathLengths.current[key] = len;

        if (edgeProgress < 1) {
          // Drawing animation
          var offset = len * (1 - edgeProgress);
          path.style.strokeDasharray = len;
          path.style.strokeDashoffset = offset;
        } else if (pulseState.count < PULSE_REPEAT) {
          // Pulse animation
          var pulseLen = len;
          var dashGap = pulseLen;
          var pulseOffset = pulseLen * (1 - pulseState.progress);
          path.style.strokeDasharray = dashGap + ' ' + dashGap;
          path.style.strokeDashoffset = pulseOffset;
        } else {
          // Pulse done -- show full edge
          path.style.strokeDasharray = 'none';
          path.style.strokeDashoffset = '0';
        }
      });
    }, [edgeProgress, pulseState]);

    // Node ref setter
    var setNodeRef = useCallback(function (nodeId) {
      return function (el) {
        nodeRefs.current[nodeId] = el;
      };
    }, []);

    // Determine if edge is connected to active nodes
    var isEdgeActive = function (edge) {
      return effectiveActiveIds.indexOf(edge.from) >= 0 && effectiveActiveIds.indexOf(edge.to) >= 0;
    };

    // Layout: horizontal flow on desktop/tablet, vertical on mobile
    var containerStyle = {
      position: 'relative',
      flex: 1,
      minHeight: 0,
      background: '#FAFAFA',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: isMobile ? '16px' : '32px',
      padding: isMobile ? '24px 16px' : '32px',
      overflow: 'auto',
    };

    // SVG overlay style
    var svgStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 0,
    };

    return React.createElement('div', {
      ref: containerRef,
      style: containerStyle,
    },
      // Nodes layer (z-index above SVG)
      React.createElement('div', {
        style: {
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: isMobile ? '16px' : '32px',
          position: 'relative',
          zIndex: 1,
          flexWrap: 'wrap',
        },
      },
        nodes.map(function (node, i) {
          var nodeId = node.id;
          var isActive = effectiveActiveIds.indexOf(nodeId) >= 0;

          return React.createElement(FlowNode, {
            key: nodeId,
            node: node,
            isActive: isActive,
            isDimmed: !isActive && effectiveActiveIds.length > 0,
            isDesktop: isDesktop,
            nodeRef: setNodeRef(nodeId),
            onMouseEnter: isMobile ? undefined : function () { onNodeEnter(nodeId); },
            onMouseLeave: isMobile ? undefined : function () { onNodeLeave(); },
            onClick: isMobile ? function () { onNodeClick(nodeId); } : function () { onNodeClick(nodeId); },
            onFocus: function () { onNodeEnter(nodeId); },
            onBlur: function () { onNodeLeave(); },
            entryProgress: entryProgress[i] !== undefined ? entryProgress[i] : 1,
            reducedMotion: reducedMotion,
          });
        })
      ),

      // SVG overlay for edges
      React.createElement('svg', {
        ref: svgRef,
        style: svgStyle,
        'aria-hidden': 'true',
      },
        edgeData.map(function (e, i) {
          var active = isEdgeActive(e);
          var d = 'M ' + e.sx + ' ' + e.sy + ' C ' + e.cp1x + ' ' + e.cp1y + ' ' + e.cp2x + ' ' + e.cp2y + ' ' + e.tx + ' ' + e.ty;

          // Arrow head: small triangle polygon at the target end
          var angle = Math.atan2(e.ty - e.cp2y, e.tx - e.cp2x);
          var arrowSize = 8;
          var ax = e.tx;
          var ay = e.ty;
          // Triangle points in local coords (pointing right), then rotated
          var cos = Math.cos(angle);
          var sin = Math.sin(angle);
          // Tip at (ax, ay), base behind
          var p1x = ax;
          var p1y = ay;
          var p2x = ax - arrowSize * cos + (arrowSize / 2) * sin;
          var p2y = ay - arrowSize * sin - (arrowSize / 2) * cos;
          var p3x = ax - arrowSize * cos - (arrowSize / 2) * sin;
          var p3y = ay - arrowSize * sin + (arrowSize / 2) * cos;

          return React.createElement('g', { key: 'edge-' + i },
            React.createElement('path', {
              ref: function (el) { pathRefs.current['edge-' + i] = el; },
              d: d,
              fill: 'none',
              stroke: active ? '#6B7280' : '#D1D5DB',
              strokeWidth: 2,
              opacity: active ? 1 : 0.2,
              style: { transition: reducedMotion ? 'none' : 'opacity ' + DIM_DURATION + 'ms ease, stroke ' + DIM_DURATION + 'ms ease' },
            }),
            // Arrow polygon
            React.createElement('polygon', {
              points: p1x + ',' + p1y + ' ' + p2x + ',' + p2y + ' ' + p3x + ',' + p3y,
              fill: active ? '#6B7280' : '#D1D5DB',
              opacity: active ? 1 : 0.2,
              style: { transition: reducedMotion ? 'none' : 'opacity ' + DIM_DURATION + 'ms ease' },
            }),
            // Edge label
            e.label ? React.createElement('text', {
              x: (e.sx + e.tx) / 2,
              y: (e.sy + e.ty) / 2 - 8,
              textAnchor: 'middle',
              fontSize: 11,
              fill: active ? '#6B7280' : '#D1D5DB',
              opacity: active ? 1 : 0.25,
              style: { transition: reducedMotion ? 'none' : 'opacity ' + DIM_DURATION + 'ms ease' },
            }, e.label) : null
          );
        })
      )
    );
  }

  // ---------------------------------------------------------------------------
  // StepPanel
  // ---------------------------------------------------------------------------
  function StepPanel(props) {
    var steps = props.steps;
    var currentStep = props.currentStep;
    var isMobile = props.isMobile;
    var onPrev = props.onPrev;
    var onNext = props.onNext;
    var reducedMotion = props.reducedMotion;
    var panelRef = useRef(null);

    var step = steps[currentStep] || steps[0];
    if (!step) return null;

    var totalSteps = steps.length;
    var isLast = currentStep === totalSteps - 1;
    var isFirst = currentStep === 0;

    // Scroll panel content to top on step change
    useEffect(function () {
      if (panelRef.current) {
        var scrollTarget = panelRef.current.querySelector('.step-body-scroll');
        if (scrollTarget) {
          scrollTarget.scrollTop = 0;
        }
      }
    }, [currentStep]);

    var panelStyle = {
      display: 'flex',
      flexDirection: 'column',
      background: '#FFFFFF',
      borderLeft: isMobile ? 'none' : '1px solid #E5E7EB',
      borderTop: isMobile ? '1px solid #E5E7EB' : 'none',
      overflow: 'hidden',
    };

    if (!isMobile) {
      panelStyle.width = '35%';
      panelStyle.minWidth = 280;
      panelStyle.maxWidth = 400;
    } else {
      panelStyle.minHeight = 120;
      panelStyle.maxHeight = '50vh';
      panelStyle.position = 'relative';
    }

    var progressPct = ((currentStep + 1) / totalSteps) * 100;

    var navButtonStyle = function (disabled) {
      return {
        width: 48,
        height: 48,
        border: '1px solid #E5E7EB',
        borderRadius: 8,
        background: disabled ? '#F9FAFB' : '#FFFFFF',
        color: disabled ? '#D1D5DB' : '#374151',
        cursor: disabled ? 'default' : 'pointer',
        fontSize: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: reducedMotion ? 'none' : 'background 150ms ease',
      };
    };

    return React.createElement('div', {
      ref: panelRef,
      style: panelStyle,
      role: 'region',
      'aria-label': 'Step explanation',
    },
      // Progress bar
      React.createElement('div', {
        style: {
          padding: isMobile ? '12px 16px 0' : '20px 20px 0',
        },
      },
        React.createElement('div', {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          },
        },
          React.createElement('span', {
            style: { fontSize: 14, fontWeight: 500, color: '#6B7280' },
          }, (currentStep + 1) + '/' + totalSteps),
          React.createElement('div', {
            style: {
              flex: 1,
              height: 3,
              background: '#E5E7EB',
              borderRadius: 2,
              marginLeft: 12,
              overflow: 'hidden',
            },
          },
            React.createElement('div', {
              style: {
                height: '100%',
                width: progressPct + '%',
                background: '#3B82F6',
                borderRadius: 2,
                transition: reducedMotion ? 'none' : 'width ' + STEP_TRANSITION + 'ms ease',
              },
            })
          )
        ),
      ),

      // Headline + Body
      React.createElement('div', {
        className: 'step-body-scroll',
        style: {
          flex: 1,
          overflow: 'auto',
          padding: isMobile ? '8px 16px' : '12px 20px',
        },
      },
        React.createElement('div', {
          role: 'status',
          'aria-live': 'polite',
        },
          React.createElement('h3', {
            style: {
              fontSize: isMobile ? 16 : 18,
              fontWeight: 600,
              color: '#1F2937',
              marginBottom: 8,
              lineHeight: 1.4,
            },
          }, step.headline),
          React.createElement('p', {
            style: {
              fontSize: isMobile ? 14 : 16,
              color: '#1F2937',
              lineHeight: 1.6,
            },
          }, step.body)
        )
      ),

      // Navigation + CTA
      React.createElement('div', {
        style: {
          padding: isMobile ? '12px 16px' : '16px 20px',
          borderTop: '1px solid #F3F4F6',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        },
      },
        // Prev button
        React.createElement('button', {
          style: navButtonStyle(isFirst),
          onClick: onPrev,
          disabled: isFirst,
          'aria-label': 'Previous step',
        }, '\u2190'),

        // Next button
        React.createElement('button', {
          style: navButtonStyle(false),
          onClick: onNext,
          'aria-label': 'Next step',
        }, '\u2192'),

        // Spacer
        React.createElement('div', { style: { flex: 1 } }),

        // CTA (last step)
        isLast ? React.createElement('a', {
          href: props.cta ? props.cta.href : '#',
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
        }, props.cta ? props.cta.label : 'Learn more') : null
      )
    );
  }

  // ---------------------------------------------------------------------------
  // DetailPopup — mobile tap-to-inspect floating overlay
  // ---------------------------------------------------------------------------
  function DetailPopup(props) {
    var node = props.node;
    var onClose = props.onClose;
    var reducedMotion = props.reducedMotion;

    if (!node) return null;

    var bgColor = KIND_COLORS[node.kind] || KIND_COLORS.process;

    return React.createElement('div', {
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      onClick: onClose,
    },
      React.createElement('div', {
        style: {
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.15)',
        },
      }),
      React.createElement('div', {
        style: {
          position: 'relative',
          background: '#FFFFFF',
          borderRadius: 12,
          padding: 20,
          maxWidth: 280,
          width: '90%',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          zIndex: 1,
        },
        onClick: function (e) { e.stopPropagation(); },
      },
        React.createElement('div', {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 12,
          },
        },
          React.createElement('div', {
            style: {
              width: 12,
              height: 12,
              borderRadius: 3,
              background: bgColor,
            },
          }),
          React.createElement('span', {
            style: { fontSize: 16, fontWeight: 600, color: '#1F2937' },
          }, node.label)
        ),
        React.createElement('p', {
          style: { fontSize: 14, lineHeight: 1.6, color: '#4B5563' },
        }, node.description),
        React.createElement('button', {
          onClick: onClose,
          style: {
            marginTop: 16,
            width: '100%',
            padding: '10px 0',
            border: '1px solid #E5E7EB',
            borderRadius: 8,
            background: '#FFFFFF',
            color: '#374151',
            fontSize: 14,
            cursor: 'pointer',
          },
        }, 'Close')
      )
    );
  }

  // ---------------------------------------------------------------------------
  // FlowExplainer — main component
  // ---------------------------------------------------------------------------
  function FlowExplainer(props) {
    var data = props.data;

    // Schema validation
    var valid = validateSchema(data);
    if (!valid) {
      // Show minimal fallback
      return React.createElement('div', {
        style: { padding: 40, color: '#6B7280' },
      }, 'FlowExplainer: invalid data schema');
    }

    var title = data.title || '';
    var subtitle = data.subtitle || '';
    var nodes = data.nodes || [];
    var edges = data.edges || [];
    var steps = data.steps || [];
    var cta = data.cta || null;

    // Edge case: 0 steps -> static node graph, no interaction
    var hasSteps = steps.length > 0;

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

    // Current step
    var _currentStep = useState(0);
    var currentStep = _currentStep[0];
    var setCurrentStep = _currentStep[1];

    // Hovered node (desktop: hover, mobile: tap-to-inspect)
    var _hoveredNode = useState(null);
    var hoveredNode = _hoveredNode[0];
    var setHoveredNode = _hoveredNode[1];

    // Node entry progress array
    var _entryProgress = useState(function () {
      return nodes.map(function () { return reducedMotion ? 1 : 0; });
    });
    var entryProgress = _entryProgress[0];
    var setEntryProgress = _entryProgress[1];

    // Edge draw progress (0 to 1)
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

    // Cancellation refs for animations (entry vs pulse tracked separately)
    var cancelRefs = useRef([]);
    var pulseCancelRefs = useRef([]);

    // --- Entry Animation Sequence ---
    useEffect(function () {
      if (phase !== 'entering' || reducedMotion) return;

      var cancels = cancelRefs.current;

      // Title fade in (0-400ms)
      cancels.push(animateValue(0, 1, TITLE_DURATION, expoOut, function (v, done) {
        setTitleProgress(v);
      }));

      // Node staggered entrance
      nodes.forEach(function (_, i) {
        var delay = 300 + i * STAGGER_DELAY;
        var timer = setTimeout(function () {
          cancels.push(animateValue(0, 1, NODE_DURATION, expoOut, function (v, done) {
            setEntryProgress(function (prev) {
              var next = prev.slice();
              next[i] = v;
              return next;
            });
          }));
        }, delay);
        cancels.push(function () { clearTimeout(timer); });
      });

      // Edge draw: starts 200ms after last node begins
      var lastNodeStart = 300 + (nodes.length - 1) * STAGGER_DELAY;
      var edgeStart = lastNodeStart + EDGE_START_DELAY;
      var edgeTimer = setTimeout(function () {
        cancels.push(animateValue(0, 1, EDGE_DURATION, expoOut, function (v, done) {
          setEdgeProgress(v);
        }));
      }, edgeStart);
      cancels.push(function () { clearTimeout(edgeTimer); });

      // Total entry duration: last node start + edge delay + edge draw
      var totalDuration = lastNodeStart + EDGE_START_DELAY + EDGE_DURATION + 50;
      var readyTimer = setTimeout(function () {
        setPhase('ready');
        // Start pulse after ready transition (runs outside this effect's cleanup)
        runPulse();
      }, totalDuration);
      cancels.push(function () { clearTimeout(readyTimer); });

      return function () {
        cancels.forEach(function (fn) { if (fn) fn(); });
        cancelRefs.current = [];
      };
    }, [phase, reducedMotion, nodes.length]);

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
        // Cancel all entry animations
        cancelRefs.current.forEach(function (fn) { if (fn) fn(); });
        cancelRefs.current = [];
        // Cancel any pulse animations
        pulseCancelRefs.current.forEach(function (fn) { if (fn) fn(); });
        pulseCancelRefs.current = [];

        // Set everything to final state
        setEntryProgress(nodes.map(function () { return 1; }));
        setEdgeProgress(1);
        setTitleProgress(1);
        setPulseState({ count: PULSE_REPEAT, progress: 0 });
        setPhase('ready');
      }

      // Listen on document to catch any input regardless of mount timing
      document.addEventListener('click', skip, true);
      document.addEventListener('keydown', skip, true);
      document.addEventListener('touchstart', skip, true);

      return function () {
        document.removeEventListener('click', skip, true);
        document.removeEventListener('keydown', skip, true);
        document.removeEventListener('touchstart', skip, true);
      };
    }, [phase, nodes.length]);

    // --- Step navigation ---
    var goToStep = useCallback(function (idx) {
      if (!hasSteps) return;
      var clamped = Math.max(0, Math.min(steps.length - 1, idx));
      setCurrentStep(clamped);
      setHoveredNode(null); // Close any mobile popup on step change
    }, [hasSteps, steps.length]);

    var handlePrev = useCallback(function () {
      if (currentStep > 0) goToStep(currentStep - 1);
    }, [currentStep, goToStep]);

    var handleNext = useCallback(function () {
      if (currentStep < steps.length - 1) goToStep(currentStep + 1);
    }, [currentStep, goToStep, steps.length]);

    // --- Keyboard navigation ---
    useEffect(function () {
      if (phase !== 'ready') return;

      function onKey(e) {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          handleNext();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          handlePrev();
        }
      }

      window.addEventListener('keydown', onKey);
      return function () { window.removeEventListener('keydown', onKey); };
    }, [phase, handleNext, handlePrev]);

    // --- Hover handlers ---
    var handleNodeEnter = useCallback(function (nodeId) {
      if (phase !== 'ready') return;
      if (isMobile) return; // No hover on mobile
      setHoveredNode(nodeId);
    }, [phase, isMobile]);

    var handleNodeLeave = useCallback(function () {
      if (isMobile) return;
      setHoveredNode(null);
    }, [isMobile]);

    var handleNodeClick = useCallback(function (nodeId) {
      if (phase !== 'ready') return;
      if (isMobile) {
        // Toggle tap-to-inspect
        setHoveredNode(function (prev) { return prev === nodeId ? null : nodeId; });
      }
    }, [phase, isMobile]);

    var handlePopupClose = useCallback(function () {
      setHoveredNode(null);
    }, []);

    // Active node ids from current step
    var activeNodeIds = useMemo(function () {
      if (!hasSteps || !steps[currentStep]) return [];
      return steps[currentStep].focus || [];
    }, [hasSteps, steps, currentStep]);

    // Hovered node object
    var hoveredNodeObj = useMemo(function () {
      if (!hoveredNode) return null;
      return nodes.find(function (n) { return n.id === hoveredNode; }) || null;
    }, [hoveredNode, nodes]);

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

    if (isMobile) {
      contentStyle.flexDirection = 'column';
    }

    return React.createElement('div', {
      id: 'flow-explainer-root',
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

      // Content area (diagram + panel)
      React.createElement('div', { style: contentStyle },
        // FlowDiagram
        React.createElement(FlowDiagram, {
          nodes: nodes,
          edges: edges,
          activeNodeIds: activeNodeIds,
          hoveredNodeId: hoveredNode,
          isDesktop: isDesktop,
          isMobile: isMobile,
          phase: phase,
          entryProgress: entryProgress,
          edgeProgress: edgeProgress,
          pulseState: pulseState,
          reducedMotion: reducedMotion,
          onNodeEnter: handleNodeEnter,
          onNodeLeave: handleNodeLeave,
          onNodeClick: handleNodeClick,
        }),

        // StepPanel
        hasSteps ? React.createElement(StepPanel, {
          steps: steps,
          currentStep: currentStep,
          isMobile: isMobile,
          onPrev: handlePrev,
          onNext: handleNext,
          cta: cta,
          reducedMotion: reducedMotion,
        }) : null,

        // DetailPopup (mobile)
        isMobile && hoveredNodeObj ? React.createElement(DetailPopup, {
          node: hoveredNodeObj,
          onClose: handlePopupClose,
          reducedMotion: reducedMotion,
        }) : null
      )
    );
  }

  // ---------------------------------------------------------------------------
  // Example data
  // ---------------------------------------------------------------------------
  var FlowExplainerExampleData = {
    title: 'RAG Retrieval-Augmented Generation Pipeline',
    subtitle: 'How your query becomes an accurate, grounded answer',
    nodes: [
      { id: 'user-query', label: 'User Query', kind: 'input', description: 'The natural-language question submitted by the end user. This is the entry point of the pipeline.' },
      { id: 'retriever', label: 'Retriever', kind: 'process', description: 'Embeds the query and searches the vector store for the top-k most relevant document chunks.' },
      { id: 'reranker', label: 'Reranker', kind: 'decision', description: 'Scores retrieved chunks with a cross-encoder and reranks them by true relevance to the query.' },
      { id: 'generator', label: 'Answer Generator', kind: 'process', description: 'Feeds the top ranked context chunks plus the original query into the LLM to produce a draft answer.' },
      { id: 'response', label: 'Response', kind: 'output', description: 'The final grounded answer returned to the user, complete with source citations.' },
    ],
    edges: [
      { from: 'user-query', to: 'retriever', label: 'embed + search' },
      { from: 'retriever', to: 'reranker', label: 'top-k chunks' },
      { from: 'reranker', to: 'generator', label: 'ranked context' },
      { from: 'generator', to: 'response', label: 'draft answer' },
    ],
    steps: [
      { headline: '1. User submits a query', body: 'The pipeline starts when a user types a natural-language question. The system normalises the text and prepares it for embedding.', focus: ['user-query'] },
      { headline: '2. Retriever searches the knowledge base', body: 'The query is converted into a dense vector embedding. A similarity search retrieves the top-k most relevant document chunks from the vector store.', focus: ['user-query', 'retriever'] },
      { headline: '3. Reranker refines the results', body: 'A cross-encoder reranker scores each retrieved chunk for true relevance. Chunks are reordered so the most useful context reaches the generator first.', focus: ['retriever', 'reranker'] },
      { headline: '4. Answer Generator produces a draft', body: 'The top-ranked context chunks and the original query are assembled into a prompt. The LLM generates a grounded draft answer with inline citations.', focus: ['reranker', 'generator'] },
      { headline: '5. Grounded response delivered', body: 'The final answer is returned to the user. Every claim is backed by a source citation, making the response auditable and trustworthy.', focus: ['generator', 'response'] },
    ],
    cta: { label: 'Try it in your project', href: '#' },
  };

  // ---------------------------------------------------------------------------
  // Export to window (React+Babel scope sharing)
  // ---------------------------------------------------------------------------
  Object.assign(window, {
    FlowExplainer: FlowExplainer,
    FlowExplainerExampleData: FlowExplainerExampleData,
  });

})();
