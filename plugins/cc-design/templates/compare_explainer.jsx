/**
 * CompareExplainer — Interactive multi-dimension comparison explainer template
 *
 * SCHEMA
 * ======
 * {
 *   title: string,                          // Section heading
 *   subtitle: string,                       // Section sub-heading
 *   subjects: [{
 *     id: string,                           // Unique subject identifier
 *     label: string,                        // Display name
 *     accentColor: string,                  // Subject accent color (hex)
 *     verdict: string,                      // "Best for X" verdict text
 *   }],
 *   dimensions: [{
 *     id: string,                           // Unique dimension identifier
 *     label: string,                        // Display name (tab label)
 *     headline: string,                     // Dimension headline (panel title)
 *     body: string,                         // Dimension body (panel text)
 *   }],
 *   items: [{
 *     id: string,                           // Unique item identifier
 *     subjectId: string,                    // Which subject this item belongs to
 *     dimensionId: string,                  // Which dimension this item belongs to
 *     label: string,                        // Display name
 *     kind: 'pro'|'con'|'neutral'|'highlight',
 *     detail: string,                       // Extended description for detail overlay
 *     score: number,                        // 1-5 rating, 0 = no score dots
 *   }],
 *   connections: [{
 *     fromSubjectId: string,                // Source subject
 *     toSubjectId: string,                  // Target subject
 *     dimensionId: string,                  // Which dimension this connection belongs to
 *     fromItemId: string,                   // Source item
 *     toItemId: string,                     // Target item
 *     label: string,                        // Connection annotation
 *   }],
 *   cta: {
 *     label: string,                        // CTA button text
 *     href: string,                         // CTA link URL
 *   },
 * }
 *
 * COMPLETE EXAMPLE — React vs Vue: Framework Comparison (4 dimensions)
 * ===============================================================
 *
 * var EXAMPLE_DATA = {
 *   title: 'React vs Vue: Framework Comparison',
 *   subtitle: 'Which frontend framework fits your project?',
 *   subjects: [
 *     { id: 'react', label: 'React', accentColor: '#61DAFB', verdict: 'Complex SPAs' },
 *     { id: 'vue',   label: 'Vue',   accentColor: '#42B883', verdict: 'Developer Experience' },
 *   ],
 *   dimensions: [
 *     { id: 'performance', label: 'Performance', headline: 'Runtime Performance',
 *       body: 'Both frameworks use virtual DOM for efficient UI updates, but differ in optimization strategies.' },
 *     { id: 'ecosystem', label: 'Ecosystem', headline: 'Ecosystem & Tooling',
 *       body: 'React has a larger ecosystem with more third-party libraries; Vue has a more integrated official toolchain.' },
 *     { id: 'developer-experience', label: 'DX', headline: 'Developer Experience',
 *       body: 'React favors explicit patterns with more manual control; Vue provides built-in conventions for faster onboarding.' },
 *     { id: 'cost', label: 'Cost', headline: 'Operational & Hiring Cost',
 *       body: 'React developers are more abundant and often cheaper to hire; Vue teams tend to be smaller but more cohesive.' },
 *   ],
 *   items: [
 *     // Performance
 *     { id: 'react-perf-1', subjectId: 'react', dimensionId: 'performance', label: 'Virtual DOM diffing', kind: 'pro',
 *       detail: 'React\'s Fiber scheduler enables incremental rendering, prioritizing high-impact updates.', score: 4 },
 *     { id: 'react-perf-2', subjectId: 'react', dimensionId: 'performance', label: 'Re-render optimization needed', kind: 'con',
 *       detail: 'Requires manual memoization (useMemo, useCallback) to avoid unnecessary re-renders.', score: 3 },
 *     { id: 'vue-perf-1', subjectId: 'vue', dimensionId: 'performance', label: 'Reactive dependency tracking', kind: 'pro',
 *       detail: 'Vue automatically tracks dependencies and only re-renders affected components.', score: 5 },
 *     { id: 'vue-perf-2', subjectId: 'vue', dimensionId: 'performance', label: 'Fine-grained reactivity', kind: 'highlight',
 *       detail: 'Vue 3 Proxy-based reactivity can update at the property level.', score: 5 },
 *     // Ecosystem
 *     { id: 'react-eco-1', subjectId: 'react', dimensionId: 'ecosystem', label: 'Massive ecosystem', kind: 'pro',
 *       detail: 'Thousands of community packages for state, routing, forms, animation.', score: 5 },
 *     { id: 'react-eco-2', subjectId: 'react', dimensionId: 'ecosystem', label: 'No official router/state', kind: 'con',
 *       detail: 'No official router or state management. Teams must choose their own.', score: 3 },
 *     { id: 'vue-eco-1', subjectId: 'vue', dimensionId: 'ecosystem', label: 'Integrated toolchain', kind: 'pro',
 *       detail: 'Vue Router, Pinia, Vite all maintained by the core team.', score: 4 },
 *     { id: 'vue-eco-2', subjectId: 'vue', dimensionId: 'ecosystem', label: 'Smaller ecosystem', kind: 'neutral',
 *       detail: 'Fewer third-party packages, but most needs are covered.', score: 3 },
 *     // Developer Experience
 *     { id: 'react-dx-1', subjectId: 'react', dimensionId: 'developer-experience', label: 'Flexible patterns', kind: 'pro',
 *       detail: 'React gives developers freedom to choose patterns, state management, and architecture.', score: 4 },
 *     { id: 'react-dx-2', subjectId: 'react', dimensionId: 'developer-experience', label: 'Steeper learning curve', kind: 'con',
 *       detail: 'Hooks, closures, and stale state traps require deep understanding to avoid bugs.', score: 2 },
 *     { id: 'vue-dx-1', subjectId: 'vue', dimensionId: 'developer-experience', label: 'Built-in conventions', kind: 'pro',
 *       detail: 'Vue\'s Options API provides a clear, conventional structure for component organization.', score: 5 },
 *     { id: 'vue-dx-2', subjectId: 'vue', dimensionId: 'developer-experience', label: 'Composition API migration', kind: 'neutral',
 *       detail: 'Teams need to decide between Options and Composition API, adding decision overhead.', score: 3 },
 *     // Cost
 *     { id: 'react-cost-1', subjectId: 'react', dimensionId: 'cost', label: 'Large hiring pool', kind: 'pro',
 *       detail: 'React dominates the market; finding React developers is significantly easier.', score: 5 },
 *     { id: 'react-cost-2', subjectId: 'react', dimensionId: 'cost', label: 'Higher turnover risk', kind: 'con',
 *       detail: 'React developers may churn faster due to broader market opportunities.', score: 3 },
 *     { id: 'vue-cost-1', subjectId: 'vue', dimensionId: 'cost', label: 'Smaller but cohesive teams', kind: 'pro',
 *       detail: 'Vue teams tend to be more stable and aligned with project conventions.', score: 4 },
 *     { id: 'vue-cost-2', subjectId: 'vue', dimensionId: 'cost', label: 'Smaller hiring pool', kind: 'con',
 *       detail: 'Fewer Vue developers available, especially in Western markets.', score: 2 },
 *   ],
 *   connections: [
 *     { fromSubjectId: 'react', toSubjectId: 'vue', dimensionId: 'performance',
 *       fromItemId: 'react-perf-1', toItemId: 'vue-perf-1',
 *       label: 'different reactivity model' },
 *     { fromSubjectId: 'react', toSubjectId: 'vue', dimensionId: 'ecosystem',
 *       fromItemId: 'react-eco-2', toItemId: 'vue-eco-1',
 *       label: 'official vs community' },
 *     { fromSubjectId: 'react', toSubjectId: 'vue', dimensionId: 'developer-experience',
 *       fromItemId: 'react-dx-2', toItemId: 'vue-dx-1',
 *       label: 'convention over freedom' },
 *     { fromSubjectId: 'react', toSubjectId: 'vue', dimensionId: 'cost',
 *       fromItemId: 'react-cost-1', toItemId: 'vue-cost-2',
 *       label: 'supply vs demand' },
 *   ],
 *   cta: { label: 'Choose your framework', href: '#' },
 * };
 *
 * For use with React+Babel inline. After loading this file,
 * window.CompareExplainer and window.CompareExplainerExampleData are available.
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
  // Constants
  // ---------------------------------------------------------------------------
  var KIND_COLORS = {
    pro:       '#10B981',
    con:       '#EF4444',
    neutral:   '#6B7280',
    highlight: '#3B82F6',
  };

  var KIND_LABELS = {
    pro:       'Pro',
    con:       'Con',
    neutral:   'Neutral',
    highlight: 'Highlight',
  };

  // Kind icons (SVG paths, 12px viewbox)
  var KIND_ICONS = {
    pro:       '<path d="M2 6l3 3 5-5" stroke="#10B981" stroke-width="2" fill="none" stroke-linecap="round"/>',
    con:       '<path d="M2 2l8 8M10 2l-8 8" stroke="#EF4444" stroke-width="2" fill="none" stroke-linecap="round"/>',
    neutral:   '<path d="M2 6h8" stroke="#6B7280" stroke-width="2" fill="none" stroke-linecap="round"/>',
    highlight: '<path d="M6 1l1.5 3 3.5.5-2.5 2.5.5 3.5L6 8.5 2.5 10.5l.5-3.5L.5 4.5 4 4z" stroke="#3B82F6" stroke-width="1" fill="none"/>',
  };

  var BREAKPOINT_MOBILE  = 768;
  var BREAKPOINT_TABLET  = 1024;

  var ITEM_DURATION      = 400;
  var TITLE_DURATION     = 400;
  var DIM_DURATION       = 300;
  var HOVER_DURATION     = 200;

  // ---------------------------------------------------------------------------
  // URL sanitization
  // ---------------------------------------------------------------------------
  function sanitizeUrl(url) {
    if (!url) return '#';
    var stripped = url.replace(/^\s+/, '').toLowerCase();
    if (stripped.startsWith('javascript:') || stripped.startsWith('data:') || stripped.startsWith('vbscript:')) {
      console.warn('[CompareExplainer] Blocked dangerous URI:', url);
      return '#';
    }
    return url;
  }

  // ---------------------------------------------------------------------------
  // Schema validation
  // ---------------------------------------------------------------------------
  function validateSchema(data) {
    if (!data || typeof data !== 'object') {
      console.warn('[CompareExplainer] schema is missing or not an object');
      return false;
    }
    if (!Array.isArray(data.subjects) || data.subjects.length < 2) {
      console.warn('[CompareExplainer] subjects array must have at least 2 entries');
      return false;
    }
    if (!Array.isArray(data.dimensions) || data.dimensions.length === 0) {
      console.warn('[CompareExplainer] dimensions array is missing or empty');
      return false;
    }
    return true;
  }

  // ---------------------------------------------------------------------------
  // Bezier parametric evaluation at parameter t
  // ---------------------------------------------------------------------------
  function bezierPoint(p0, p1, p2, p3, t) {
    var mt = 1 - t;
    return mt * mt * mt * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t * p3;
  }

  // ---------------------------------------------------------------------------
  // Diff computation (overview mode)
  // ---------------------------------------------------------------------------
  function computeDiffs(data) {
    var items = data.items;
    var diffs = [];
    var totalItems = 0;

    data.dimensions.forEach(function (dim) {
      var subjectItems = {};
      data.subjects.forEach(function (subj) {
        subjectItems[subj.id] = items.filter(function (i) {
          return i.subjectId === subj.id && i.dimensionId === dim.id;
        });
        totalItems += subjectItems[subj.id].length;
      });

      // Pair by position order between subjects
      var ids = data.subjects.map(function (s) { return s.id; });
      var maxLen = Math.max.apply(null, ids.map(function (id) { return subjectItems[id].length; }));
      for (var idx = 0; idx < maxLen; idx++) {
        var pairs = ids.map(function (id) { return subjectItems[id][idx]; });
        // "different" condition: kind differs OR score gap >= 2 OR any side is con
        var kinds = pairs.map(function (p) { return p ? p.kind : ''; });
        var scores = pairs.map(function (p) { return p ? (p.score || 0) : 0; });
        var isDifferent = false;
        for (var k = 0; k < kinds.length; k++) {
          for (var j = k + 1; j < kinds.length; j++) {
            if (kinds[k] !== kinds[j]) isDifferent = true;
            if (Math.abs(scores[k] - scores[j]) >= 2) isDifferent = true;
          }
          if (kinds[k] === 'con') isDifferent = true;
        }
        if (isDifferent) {
          pairs.forEach(function (p) { if (p) diffs.push(p); });
        }
      }
    });

    return { items: diffs, count: diffs.length, total: totalItems };
  }

  // ---------------------------------------------------------------------------
  // ItemCard component
  // ---------------------------------------------------------------------------
  function ItemCard(props) {
    var item = props.item;
    var isHovered = props.isHovered;
    var isDimmed = props.isDimmed;
    var isDesktop = props.isDesktop;
    var onMouseEnter = props.onMouseEnter;
    var onMouseLeave = props.onMouseLeave;
    var onClick = props.onClick;
    var reducedMotion = props.reducedMotion;
    var showScore = props.showScore;

    var kindColor = KIND_COLORS[item.kind] || KIND_COLORS.neutral;
    var kindLabel = KIND_LABELS[item.kind] || 'Neutral';
    var kindIcon  = KIND_ICONS[item.kind] || KIND_ICONS.neutral;

    var barWidth = isHovered ? 6 : 4;
    var cardOpacity = isDimmed ? 0.35 : 1;
    var cardBlur = isDimmed && isDesktop ? 4 : 0;
    var cardScale = isHovered ? 1.02 : 1;
    var cardShadow = isHovered ? '0 2px 8px rgba(0,0,0,0.08)' : 'none';

    if (reducedMotion) {
      cardScale = 1;
      cardBlur = 0;
      if (isHovered && !isDimmed) {
        cardShadow = 'none';
      }
    }

    var barStyle = {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: barWidth,
      borderRadius: '8px 0 0 8px',
      background: kindColor,
      transition: reducedMotion ? 'none' : 'width ' + HOVER_DURATION + 'ms cubic-bezier(0.16,1,0.3,1)',
    };

    var cardStyle = {
      minHeight: 48,
      maxHeight: 72,
      minWidth: 120,
      maxWidth: 200,
      padding: '8px 12px 8px 8px',
      borderRadius: 8,
      background: '#FAFAFA',
      border: '1px solid #E5E7EB',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      cursor: 'default',
      position: 'relative',
      overflow: 'hidden',
      opacity: cardOpacity,
      filter: cardBlur > 0 ? 'blur(' + cardBlur + 'px)' : 'none',
      transform: 'scale(' + cardScale + ')',
      boxShadow: cardShadow,
      transition: reducedMotion ? 'none' :
        'opacity ' + DIM_DURATION + 'ms ease, filter ' + DIM_DURATION + 'ms ease, transform ' + HOVER_DURATION + 'ms ease, box-shadow ' + HOVER_DURATION + 'ms ease',
      outline: reducedMotion && isHovered && !isDimmed ? '2px solid #3B82F6' : 'none',
      outlineOffset: reducedMotion && isHovered && !isDimmed ? 2 : 0,
    };

    var iconStyle = { width: 16, height: 16, flexShrink: 0, marginLeft: 4 };
    var labelStyle = { fontSize: 14, fontWeight: 600, color: '#1F2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: '1 1 0', minWidth: 0 };
    var tagStyle = { fontSize: 11, fontWeight: 500, color: kindColor, flexShrink: 0 };

    var scoreDots = null;
    if (showScore && item.score && item.score > 0) {
      scoreDots = React.createElement('div', {
        style: { display: 'flex', gap: 4, alignItems: 'center', flexShrink: 0, color: kindColor },
      },
        Array.from({ length: 5 }, function (_, d) {
          return React.createElement('span', {
            key: d,
            style: {
              width: 14, height: 14, borderRadius: '50%',
              background: d < item.score ? kindColor : '#D1D5DB',
              transition: reducedMotion ? 'none' : 'background 200ms',
            },
          });
        })
      );
    }

    return React.createElement('div', {
      style: cardStyle,
      'data-kind': item.kind,
      'data-item-id': item.id,
      'data-subject-id': item.subjectId,
      'data-dimension-id': item.dimensionId,
      role: 'button',
      tabIndex: 0,
      'aria-label': item.label + ', ' + item.kind,
      onMouseEnter: onMouseEnter,
      onMouseLeave: onMouseLeave,
      onClick: onClick,
      onKeyDown: function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (onClick) onClick(e);
        }
      },
    },
      // Left color bar
      React.createElement('div', { style: barStyle }),
      // Kind icon
      React.createElement('div', { style: iconStyle },
        React.createElement('svg', { viewBox: '0 0 12 12', xmlns: 'http://www.w3.org/2000/svg', width: 16, height: 16 }, kindIcon)
      ),
      // Label
      React.createElement('span', { style: labelStyle }, item.label),
      // Kind tag
      React.createElement('span', { style: tagStyle }, kindLabel),
      // Score dots
      scoreDots
    );
  }

  // ---------------------------------------------------------------------------
  // VerdictBadge component
  // ---------------------------------------------------------------------------
  function VerdictBadge(props) {
    var subject = props.subject;
    var isHovered = props.isHovered;
    var isDimmed = props.isDimmed;
    var isDesktop = props.isDesktop;
    var onMouseEnter = props.onMouseEnter;
    var onMouseLeave = props.onMouseLeave;
    var reducedMotion = props.reducedMotion;

    var barWidth = isHovered ? 6 : 4;
    var opacity = isDimmed ? 0.35 : 1;
    var blur = isDimmed && isDesktop ? 4 : 0;
    var shadow = isHovered ? '0 2px 8px rgba(0,0,0,0.08)' : 'none';

    var style = {
      minHeight: 32,
      minWidth: 80,
      padding: '6px 12px 6px 8px',
      borderRadius: 8,
      background: '#FAFAFA',
      border: '1px solid #E5E7EB',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 13,
      fontWeight: 500,
      color: '#1F2937',
      cursor: 'default',
      opacity: opacity,
      filter: blur > 0 ? 'blur(' + blur + 'px)' : 'none',
      boxShadow: shadow,
      transition: reducedMotion ? 'none' :
        'opacity ' + DIM_DURATION + 'ms ease, filter ' + DIM_DURATION + 'ms ease, box-shadow ' + HOVER_DURATION + 'ms ease',
      outline: reducedMotion && isHovered ? '2px solid #3B82F6' : 'none',
      outlineOffset: reducedMotion && isHovered ? 2 : 0,
    };

    var barStyle = {
      width: barWidth,
      minHeight: 20,
      borderRadius: 2,
      flexShrink: 0,
      background: subject.accentColor,
      transition: reducedMotion ? 'none' : 'width ' + HOVER_DURATION + 'ms cubic-bezier(0.16,1,0.3,1)',
    };

    return React.createElement('div', {
      style: style,
      'data-verdict-id': 'verdict-' + subject.id,
      onMouseEnter: onMouseEnter,
      onMouseLeave: onMouseLeave,
    },
      React.createElement('div', { style: barStyle }),
      React.createElement('span', null, 'Best for ' + subject.verdict)
    );
  }

  // ---------------------------------------------------------------------------
  // CompareExplainer — main component
  // ---------------------------------------------------------------------------
  function CompareExplainer(props) {
    var data = props.data;

    var valid = validateSchema(data);
    if (!valid) {
      return React.createElement('div', {
        style: { padding: 40, color: '#6B7280' },
      }, 'CompareExplainer: invalid data schema');
    }

    var title = data.title || '';
    var subtitle = data.subtitle || '';
    var subjects = data.subjects || [];
    var dimensions = data.dimensions || [];
    var items = data.items || [];
    var connections = data.connections || [];
    var cta = data.cta || null;

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

    // Dimension: 'overview' or dimensionId
    var _dimension = useState('overview');
    var dimension = _dimension[0];
    var setDimension = _dimension[1];

    // Hovered item: null | itemId | 'verdict-{subjectId}'
    var _hoveredItem = useState(null);
    var hoveredItem = _hoveredItem[0];
    var setHoveredItem = _hoveredItem[1];

    // Transitioning lock (during animation sequence)
    var _transitioning = useState(false);
    var transitioning = _transitioning[0];
    var setTransitioning = _transitioning[1];

    // Title progress
    var _titleProgress = useState(reducedMotion ? 1 : 0);
    var titleProgress = _titleProgress[0];
    var setTitleProgress = _titleProgress[1];

    // Entry animation cancellation refs
    var cancelRefs = useRef([]);

    // Connection data
    var _connData = useState([]);
    var connData = _connData[0];
    var setConnData = _connData[1];

    // Container refs
    var containerRef = useRef(null);
    var nodeRefs = useRef({});

    // --- Entry Animation ---
    useEffect(function () {
      if (phase !== 'entering' || reducedMotion) return;

      var cancels = cancelRefs.current;

      // Title fade in
      cancels.push(animateValue(0, 1, TITLE_DURATION, expoOut, function (v) {
        setTitleProgress(v);
      }));

      // Items staggered entrance (horizontal symmetric: left col translateX(-16), right col translateX(+16))
      var allItems = items.filter(function (i) {
        return dimension === 'overview' ? true : i.dimensionId === dimension;
      });
      // In overview, show diff items + verdict badges
      if (dimension === 'overview') {
        allItems = computeDiffs(data).items;
      }

      var totalDuration = TITLE_DURATION + 300 + 50 * allItems.length + ITEM_DURATION + 50;
      var readyTimer = setTimeout(function () {
        setPhase('ready');
        setTransitioning(false);
      }, totalDuration);
      cancels.push(function () { clearTimeout(readyTimer); });

      return function () {
        cancels.forEach(function (fn) { if (fn) fn(); });
        cancelRefs.current = [];
      };
    }, [phase, reducedMotion]);

    // --- Skip on any input ---
    useEffect(function () {
      if (phase !== 'entering') return;

      function skip() {
        cancelRefs.current.forEach(function (fn) { if (fn) fn(); });
        cancelRefs.current = [];
        setTitleProgress(1);
        setPhase('ready');
        setTransitioning(false);
      }

      document.addEventListener('click', skip, true);
      document.addEventListener('keydown', skip, true);
      document.addEventListener('touchstart', skip, true);

      return function () {
        document.removeEventListener('click', skip, true);
        document.removeEventListener('keydown', skip, true);
        document.removeEventListener('touchstart', skip, true);
      };
    }, [phase]);

    // --- Dimension switch (KD2 4-phase animation) ---
    var switchDimension = useCallback(function (newDim) {
      if (transitioning) return;
      if (dimension === newDim) return;
      setTransitioning(true);
      setHoveredItem(null);

      if (reducedMotion) {
        setDimension(newDim);
        setTransitioning(false);
        return;
      }

      // Clear connections during transition
      setConnData([]);

      // For dimension transitions, update dimension and rebuild content
      setDimension(newDim);

      // After content rebuilds, compute connections for dimension mode
      // Use setTimeout to allow DOM to update
      setTimeout(function () {
        if (newDim !== 'overview') {
          computeConnections(newDim);
        }
        setTransitioning(false);
      }, 500);
    }, [dimension, transitioning, reducedMotion]);

    // --- Compute connections ---
    var computeConnections = useCallback(function (dimId) {
      if (!containerRef.current) return;
      var containerRect = containerRef.current.getBoundingClientRect();
      var dimConnections = connections.filter(function (c) { return c.dimensionId === dimId; });
      var newConnData = [];

      dimConnections.forEach(function (conn) {
        var fromEl = nodeRefs.current[conn.fromItemId];
        var toEl   = nodeRefs.current[conn.toItemId];
        if (!fromEl || !toEl) return;

        var fromRect = fromEl.getBoundingClientRect();
        var toRect   = toEl.getBoundingClientRect();

        var x1 = fromRect.right  - containerRect.left;
        var y1 = fromRect.top + fromRect.height / 2 - containerRect.top;
        var x2 = toRect.left   - containerRect.left;
        var y2 = toRect.top + toRect.height / 2 - containerRect.top;

        var dx = Math.abs(x2 - x1) * 0.4;
        var cp1x = x1 + dx, cp1y = y1;
        var cp2x = x2 - dx, cp2y = y2;

        newConnData.push({
          path: 'M' + x1 + ',' + y1 + ' C' + cp1x + ',' + cp1y + ' ' + cp2x + ',' + cp2y + ' ' + x2 + ',' + y2,
          label: conn.label,
          labelX: bezierPoint(x1, cp1x, cp2x, x2, 0.5),
          labelY: bezierPoint(y1, cp1y, cp2y, y2, 0.5),
          fromItemId: conn.fromItemId,
          toItemId: conn.toItemId,
        });
      });

      setConnData(newConnData);
    }, [connections]);

    // Re-compute connections on resize
    useEffect(function () {
      if (dimension === 'overview' || isMobile) return;
      if (!containerRef.current) return;

      var debounced = debounce(function () {
        computeConnections(dimension);
      }, 50);

      if (typeof ResizeObserver === 'undefined') return;
      var observer = new ResizeObserver(debounced);
      observer.observe(containerRef.current);

      return function () { observer.disconnect(); };
    }, [dimension, isMobile, computeConnections]);

    // --- Hover handlers ---
    var handleItemEnter = useCallback(function (itemId) {
      if (phase !== 'ready' || transitioning) return;
      if (isMobile) return;
      setHoveredItem(itemId);
    }, [phase, transitioning, isMobile]);

    var handleItemLeave = useCallback(function () {
      if (isMobile) return;
      setHoveredItem(null);
    }, [isMobile]);

    var handleItemClick = useCallback(function (itemId) {
      if (phase !== 'ready' || transitioning) return;
      if (isMobile) {
        setHoveredItem(function (prev) { return prev === itemId ? null : itemId; });
      }
    }, [phase, transitioning, isMobile]);

    // --- Determine active/dimmed state for each item ---
    var getItemState = useCallback(function (itemId) {
      if (hoveredItem === null) return { isHovered: false, isDimmed: false };
      if (hoveredItem === itemId) return { isHovered: true, isDimmed: false };
      return { isHovered: false, isDimmed: true };
    }, [hoveredItem]);

    var getVerdictState = useCallback(function (subjectId) {
      var verdictId = 'verdict-' + subjectId;
      if (hoveredItem === null) return { isHovered: false, isDimmed: false };
      if (hoveredItem === verdictId) return { isHovered: true, isDimmed: false };
      return { isHovered: false, isDimmed: true };
    }, [hoveredItem]);

    // Connection highlighting
    var isConnActive = useCallback(function (fromId, toId) {
      return hoveredItem === fromId || hoveredItem === toId;
    }, [hoveredItem]);

    // --- Diff computation ---
    var diffs = useMemo(function () {
      return computeDiffs(data);
    }, [data]);

    // --- Detail text for hovered item ---
    var hoveredDetail = useMemo(function () {
      if (!hoveredItem) return null;
      // Check if it's a verdict badge
      if (hoveredItem.startsWith('verdict-')) {
        var subjId = hoveredItem.replace('verdict-', '');
        var subj = subjects.find(function (s) { return s.id === subjId; });
        if (subj) return { title: 'Verdict', body: subj.label + ' is best for ' + subj.verdict };
        return null;
      }
      // Regular item
      var item = items.find(function (i) { return i.id === hoveredItem; });
      if (item) return { title: item.label, body: item.detail };
      return null;
    }, [hoveredItem, items, subjects]);

    // --- Set node ref ---
    var setNodeRef = useCallback(function (itemId) {
      return function (el) { nodeRefs.current[itemId] = el; };
    }, []);

    // --- Build subject columns ---
    function buildSubjectColumns(dimId, isOverview) {
      var columnItems = isOverview
        ? diffs.items
        : items.filter(function (i) { return i.dimensionId === dimId; });

      return subjects.map(function (subject) {
        var colItems = columnItems.filter(function (i) { return i.subjectId === subject.id; });
        var colHighlight = hoveredItem && !hoveredItem.startsWith('verdict-') && colItems.some(function (i) { return i.id === hoveredItem; });

        return React.createElement('div', {
          key: subject.id,
          style: {
            flex: '1 1 0',
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            background: colHighlight ? 'rgba(59,130,246,0.04)' : 'transparent',
            borderRadius: 8,
            transition: reducedMotion ? 'none' : 'background ' + HOVER_DURATION + 'ms ease',
          },
          'data-subject-id': subject.id,
        },
          // Subject header
          React.createElement('div', {
            style: {
              fontSize: 16,
              fontWeight: 600,
              color: '#1F2937',
              paddingBottom: 8,
              borderBottom: '2px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            },
          },
            React.createElement('span', {
              style: { width: 12, height: 12, borderRadius: 3, background: subject.accentColor },
            }),
            React.createElement('span', null, subject.label)
          ),
          // Verdict badge (overview only)
          isOverview ? React.createElement(VerdictBadge, {
            subject: subject,
            isHovered: getVerdictState(subject.id).isHovered,
            isDimmed: getVerdictState(subject.id).isDimmed,
            isDesktop: isDesktop,
            onMouseEnter: function () { handleItemEnter('verdict-' + subject.id); },
            onMouseLeave: handleItemLeave,
            reducedMotion: reducedMotion,
          }) : null,
          // Items
          colItems.map(function (item) {
            var state = getItemState(item.id);
            return React.createElement(ItemCard, {
              key: item.id,
              item: item,
              isHovered: state.isHovered,
              isDimmed: state.isDimmed,
              isDesktop: isDesktop,
              showScore: !isOverview,
              onMouseEnter: function () { handleItemEnter(item.id); },
              onMouseLeave: handleItemLeave,
              onClick: function () { handleItemClick(item.id); },
              nodeRef: setNodeRef(item.id),
              reducedMotion: reducedMotion,
            });
          })
        );
      });
    }

    // --- Build dimension tabs ---
    var dimTabs = React.createElement('div', {
      style: {
        display: 'flex',
        flexDirection: isMobile ? 'row' : 'column',
        gap: 4,
        overflowX: isMobile ? 'auto' : 'visible',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: isMobile ? 'none' : 'auto',
      },
    },
      // Overview tab
      React.createElement('button', {
        key: 'overview',
        style: {
          minHeight: 40,
          minWidth: 80,
          padding: '8px 16px',
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 500,
          color: dimension === 'overview' ? '#FFFFFF' : '#4B5563',
          background: dimension === 'overview' ? '#1F2937' : '#F3F4F6',
          cursor: 'pointer',
          border: 'none',
          textAlign: isMobile ? 'center' : 'left',
          whiteSpace: 'nowrap',
          transition: reducedMotion ? 'none' : 'background 200ms ease, color 200ms ease',
        },
        onClick: function () { switchDimension('overview'); },
        'aria-label': 'Overview tab',
      }, 'Overview'),
      // Dimension tabs
      dimensions.map(function (dim) {
        return React.createElement('button', {
          key: dim.id,
          style: {
            minHeight: 40,
            minWidth: 80,
            padding: '8px 16px',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            color: dimension === dim.id ? '#FFFFFF' : '#4B5563',
            background: dimension === dim.id ? '#1F2937' : '#F3F4F6',
            cursor: 'pointer',
            border: 'none',
            textAlign: isMobile ? 'center' : 'left',
            whiteSpace: 'nowrap',
            transition: reducedMotion ? 'none' : 'background 200ms ease, color 200ms ease',
          },
          onClick: function () { switchDimension(dim.id); },
          'aria-label': dim.label + ' tab',
        }, dim.label);
      })
    );

    // --- Panel content ---
    var currentDim = dimensions.find(function (d) { return d.id === dimension; });
    var panelHeadline = dimension === 'overview' ? 'Overview' : (currentDim ? currentDim.headline : '');
    var panelBody = dimension === 'overview'
      ? 'Summary of key differences between ' + subjects.map(function (s) { return s.label; }).join(' and ') + '.'
      : (currentDim ? currentDim.body : '');

    // --- Mobile bottom bar ---
    var mobileOverlay = null;
    if (isMobile && hoveredDetail) {
      mobileOverlay = React.createElement('div', {
        style: {
          display: 'flex',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          minHeight: 120,
          background: '#FFFFFF',
          borderTop: '1px solid #E5E7EB',
          padding: 16,
          zIndex: 10,
          flexDirection: 'column',
          gap: 8,
        },
      },
        React.createElement('div', { style: { fontWeight: 600, fontSize: 14 } }, hoveredDetail.title),
        React.createElement('div', { style: { fontSize: 13, lineHeight: 1.5 } }, hoveredDetail.body),
        React.createElement('button', {
          onClick: function () { setHoveredItem(null); },
          style: {
            marginTop: 8,
            padding: '8px 16px',
            borderRadius: 8,
            border: '1px solid #E5E7EB',
            background: '#FFFFFF',
            cursor: 'pointer',
            fontSize: 14,
          },
        }, 'Close')
      );
    }

    // --- SVG connections overlay ---
    var svgOverlay = null;
    if (!isMobile && dimension !== 'overview' && connData.length > 0) {
      svgOverlay = React.createElement('svg', {
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 2,
        },
        'aria-hidden': 'true',
      },
        connData.map(function (conn, i) {
          var active = isConnActive(conn.fromItemId, conn.toItemId);
          var strokeColor = active ? '#3B82F6' : '#9CA3AF';
          var strokeWidth = active ? 3 : 2;
          var strokeOpacity = active ? 1 : (hoveredItem ? 0.2 : 1);

          var children = [
            React.createElement('path', {
              key: 'path-' + i,
              d: conn.path,
              fill: 'none',
              stroke: strokeColor,
              strokeWidth: strokeWidth,
              opacity: strokeOpacity,
              style: { transition: reducedMotion ? 'none' : 'opacity 200ms ease, stroke 200ms ease, stroke-width 200ms ease' },
            }),
          ];

          if (conn.label) {
            var textLen = conn.label.length * 7 + 16;
            children.push(
              React.createElement('rect', {
                key: 'bg-' + i,
                x: conn.labelX - textLen / 2,
                y: conn.labelY - 10,
                width: textLen,
                height: 20,
                rx: 4,
                fill: '#FAFAFA',
                stroke: '#E5E7EB',
                strokeWidth: 1,
              }),
              React.createElement('text', {
                key: 'label-' + i,
                x: conn.labelX,
                y: conn.labelY,
                fontSize: 12,
                fill: active ? '#3B82F6' : '#6B7280',
                textAnchor: 'middle',
                dominantBaseline: 'middle',
                style: { transition: reducedMotion ? 'none' : 'fill 200ms ease' },
              }, conn.label)
            );
          }

          return React.createElement('g', { key: 'conn-' + i }, children);
        })
      );
    }

    // --- Title animation style ---
    var titleOpacity = titleProgress;
    var titleTranslateY = -12 * (1 - titleProgress);

    // --- Container layout ---
    var isOverview = dimension === 'overview';
    var subjectColumns = buildSubjectColumns(dimension, isOverview);

    // Diff count label (overview only)
    var diffCountLabel = null;
    if (isOverview) {
      diffCountLabel = React.createElement('div', {
        style: {
          fontSize: 14,
          fontWeight: 500,
          color: '#4B5563',
          marginTop: 12,
        },
      }, diffs.count + '/' + diffs.total + ' items differ');
    }

    // Two-column layout style
    var columnsStyle = {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? 24 : 24,
      position: 'relative',
    };

    // --- Main render ---
    var wrapperStyle = {
      fontFamily: '-apple-system, "SF Pro Text", "PingFang SC", sans-serif',
      background: '#FAFAFA',
      minHeight: '100%',
      padding: isMobile ? '20px 16px' : '40px 32px',
      maxWidth: 1200,
      margin: '0 auto',
    };

    var bodyStyle = {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: 24,
      marginTop: 24,
    };

    var areaStyle = {
      flex: '1 1 65%',
      minWidth: 0,
      position: 'relative',
    };

    var panelStyle = {
      flex: isMobile ? '0 0 auto' : '0 0 280px',
      maxWidth: isMobile ? '100%' : 280,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      order: isMobile ? -1 : 0,
    };

    // Detail overlay
    var detailPanel = null;
    if (hoveredDetail && !isMobile) {
      detailPanel = React.createElement('div', {
        style: {
          fontSize: 14,
          lineHeight: 1.5,
          color: '#4B5563',
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 8,
          padding: '12px 16px',
        },
      },
        React.createElement('div', { style: { fontWeight: 600, marginBottom: 4 } }, hoveredDetail.title),
        React.createElement('div', null, hoveredDetail.body)
      );
    }

    return React.createElement('div', {
      id: 'compare-explainer-root',
      style: wrapperStyle,
    },
      // Title
      React.createElement('div', {
        style: {
          marginBottom: isMobile ? 16 : 24,
          opacity: titleOpacity,
          transform: 'translateY(' + titleTranslateY + 'px)',
          transition: reducedMotion ? 'none' : 'opacity 400ms ease, transform 400ms ease',
        },
      },
        React.createElement('h2', {
          style: { fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#1F2937', letterSpacing: '-0.02em', marginBottom: 8 },
        }, title),
        React.createElement('p', {
          style: { fontSize: isMobile ? 14 : 16, color: '#6B7280', lineHeight: 1.5 },
        }, subtitle)
      ),

      // Body: compare area + panel
      React.createElement('div', { style: bodyStyle },
        // Compare area
        React.createElement('div', { style: areaStyle, ref: containerRef },
          // SVG connections overlay
          svgOverlay,
          // Subject columns
          React.createElement('div', { style: columnsStyle }, subjectColumns),
          // Diff count label
          diffCountLabel
        ),

        // Panel
        React.createElement('div', { style: panelStyle },
          // Dimension tabs
          dimTabs,
          // Panel headline
          React.createElement('div', {
            style: { fontSize: 16, fontWeight: 600, color: '#1F2937' },
          }, panelHeadline),
          // Panel body
          React.createElement('div', {
            style: { fontSize: 16, lineHeight: 1.6, color: '#4B5563' },
          }, panelBody),
          // Detail panel (hover detail)
          detailPanel,
          // CTA
          cta ? React.createElement('a', {
            href: sanitizeUrl(cta.href),
            style: {
              display: 'inline-block',
              padding: '10px 24px',
              borderRadius: 8,
              background: '#1F2937',
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: 500,
              textDecoration: 'none',
              marginTop: 8,
              transition: reducedMotion ? 'none' : 'background 200ms ease',
            },
          }, cta.label) : null
        )
      ),

      // Mobile overlay
      mobileOverlay
    );
  }

  // ---------------------------------------------------------------------------
  // Example data
  // ---------------------------------------------------------------------------
  var CompareExplainerExampleData = {
    title: 'React vs Vue: Framework Comparison',
    subtitle: 'Which frontend framework fits your project?',
    subjects: [
      { id: 'react', label: 'React', accentColor: '#61DAFB', verdict: 'Complex SPAs' },
      { id: 'vue',   label: 'Vue',   accentColor: '#42B883', verdict: 'Developer Experience' },
    ],
    dimensions: [
      { id: 'performance', label: 'Performance', headline: 'Runtime Performance',
        body: 'Both frameworks use virtual DOM for efficient UI updates, but differ in optimization strategies.' },
      { id: 'ecosystem', label: 'Ecosystem', headline: 'Ecosystem & Tooling',
        body: 'React has a larger ecosystem with more third-party libraries; Vue has a more integrated official toolchain.' },
      { id: 'developer-experience', label: 'DX', headline: 'Developer Experience',
        body: 'React favors explicit patterns with more manual control; Vue provides built-in conventions for faster onboarding.' },
      { id: 'cost', label: 'Cost', headline: 'Operational & Hiring Cost',
        body: 'React developers are more abundant and often cheaper to hire; Vue teams tend to be smaller but more cohesive.' },
    ],
    items: [
      { id: 'react-perf-1', subjectId: 'react', dimensionId: 'performance', label: 'Virtual DOM diffing', kind: 'pro',
        detail: 'React\'s Fiber scheduler enables incremental rendering, prioritizing high-impact updates.', score: 4 },
      { id: 'react-perf-2', subjectId: 'react', dimensionId: 'performance', label: 'Re-render optimization needed', kind: 'con',
        detail: 'Requires manual memoization (useMemo, useCallback) to avoid unnecessary re-renders.', score: 3 },
      { id: 'vue-perf-1', subjectId: 'vue', dimensionId: 'performance', label: 'Reactive dependency tracking', kind: 'pro',
        detail: 'Vue automatically tracks dependencies and only re-renders affected components.', score: 5 },
      { id: 'vue-perf-2', subjectId: 'vue', dimensionId: 'performance', label: 'Fine-grained reactivity', kind: 'highlight',
        detail: 'Vue 3 Proxy-based reactivity can update at the property level.', score: 5 },
      { id: 'react-eco-1', subjectId: 'react', dimensionId: 'ecosystem', label: 'Massive ecosystem', kind: 'pro',
        detail: 'Thousands of community packages for state, routing, forms, animation.', score: 5 },
      { id: 'react-eco-2', subjectId: 'react', dimensionId: 'ecosystem', label: 'No official router/state', kind: 'con',
        detail: 'No official router or state management. Teams must choose their own.', score: 3 },
      { id: 'vue-eco-1', subjectId: 'vue', dimensionId: 'ecosystem', label: 'Integrated toolchain', kind: 'pro',
        detail: 'Vue Router, Pinia, Vite all maintained by the core team.', score: 4 },
      { id: 'vue-eco-2', subjectId: 'vue', dimensionId: 'ecosystem', label: 'Smaller ecosystem', kind: 'neutral',
        detail: 'Fewer third-party packages, but most needs are covered.', score: 3 },
      { id: 'react-dx-1', subjectId: 'react', dimensionId: 'developer-experience', label: 'Flexible patterns', kind: 'pro',
        detail: 'React gives developers freedom to choose patterns, state management, and architecture.', score: 4 },
      { id: 'react-dx-2', subjectId: 'react', dimensionId: 'developer-experience', label: 'Steeper learning curve', kind: 'con',
        detail: 'Hooks, closures, and stale state traps require deep understanding to avoid bugs.', score: 2 },
      { id: 'vue-dx-1', subjectId: 'vue', dimensionId: 'developer-experience', label: 'Built-in conventions', kind: 'pro',
        detail: 'Vue\'s Options API provides a clear, conventional structure for component organization.', score: 5 },
      { id: 'vue-dx-2', subjectId: 'vue', dimensionId: 'developer-experience', label: 'Composition API migration', kind: 'neutral',
        detail: 'Teams need to decide between Options and Composition API, adding decision overhead.', score: 3 },
      { id: 'react-cost-1', subjectId: 'react', dimensionId: 'cost', label: 'Large hiring pool', kind: 'pro',
        detail: 'React dominates the market; finding React developers is significantly easier.', score: 5 },
      { id: 'react-cost-2', subjectId: 'react', dimensionId: 'cost', label: 'Higher turnover risk', kind: 'con',
        detail: 'React developers may churn faster due to broader market opportunities.', score: 3 },
      { id: 'vue-cost-1', subjectId: 'vue', dimensionId: 'cost', label: 'Smaller but cohesive teams', kind: 'pro',
        detail: 'Vue teams tend to be more stable and aligned with project conventions.', score: 4 },
      { id: 'vue-cost-2', subjectId: 'vue', dimensionId: 'cost', label: 'Smaller hiring pool', kind: 'con',
        detail: 'Fewer Vue developers available, especially in Western markets.', score: 2 },
    ],
    connections: [
      { fromSubjectId: 'react', toSubjectId: 'vue', dimensionId: 'performance',
        fromItemId: 'react-perf-1', toItemId: 'vue-perf-1', label: 'different reactivity model' },
      { fromSubjectId: 'react', toSubjectId: 'vue', dimensionId: 'ecosystem',
        fromItemId: 'react-eco-2', toItemId: 'vue-eco-1', label: 'official vs community' },
      { fromSubjectId: 'react', toSubjectId: 'vue', dimensionId: 'developer-experience',
        fromItemId: 'react-dx-2', toItemId: 'vue-dx-1', label: 'convention over freedom' },
      { fromSubjectId: 'react', toSubjectId: 'vue', dimensionId: 'cost',
        fromItemId: 'react-cost-1', toItemId: 'vue-cost-2', label: 'supply vs demand' },
    ],
    cta: { label: 'Choose your framework', href: '#' },
  };

  // ---------------------------------------------------------------------------
  // Export to window (React+Babel scope sharing)
  // ---------------------------------------------------------------------------
  Object.assign(window, {
    CompareExplainer: CompareExplainer,
    CompareExplainerExampleData: CompareExplainerExampleData,
  });

})();