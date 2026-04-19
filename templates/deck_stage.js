/**
 * Deck Stage — Fixed-size slide presentation stage with scaling, keyboard nav,
 * slide-count overlay, localStorage persistence, and print-to-PDF support.
 *
 * Usage: <deck-stage> wraps <section> elements as slides (1920x1080 fixed canvas).
 * Load via: <script src="deck_stage.js"></script>
 */

class DeckStage extends HTMLElement {
  constructor() {
    super();
    this.currentSlide = 0;
    this.slides = [];
  }

  connectedCallback() {
    this.slides = Array.from(this.querySelectorAll(':scope > section'));
    if (this.slides.length === 0) return;

    // Restore position
    const saved = localStorage.getItem('cc-deck-position');
    if (saved !== null) this.currentSlide = Math.min(parseInt(saved), this.slides.length - 1);

    // Tag slides
    this.slides.forEach((s, i) => {
      s.style.display = i === this.currentSlide ? '' : 'none';
      if (!s.hasAttribute('data-screen-label')) {
        s.setAttribute('data-screen-label', `${String(i + 1).padStart(2, '0')}`);
      }
      s.setAttribute('data-om-validate', '');
    });

    this._build();
    this._scale();
    this._postIndex();

    window.addEventListener('resize', () => this._scale());
    document.addEventListener('keydown', (e) => this._onKey(e));
  }

  _build() {
    // Inner canvas
    this.canvas = document.createElement('div');
    this.canvas.style.cssText = 'width:1920px;height:1080px;position:relative;transform-origin:top left;';

    // Move slides into canvas
    this.slides.forEach(s => this.canvas.appendChild(s));
    this.appendChild(this.canvas);

    // Slide counter overlay
    this.counter = document.createElement('div');
    this.counter.style.cssText = 'position:fixed;bottom:12px;left:50%;transform:translateX(-50%);' +
      'font:13px/1 system-ui,sans-serif;color:rgba(255,255,255,.6);z-index:100;pointer-events:none;';
    this._updateCounter();
    this.appendChild(this.counter);

    // Prev/Next buttons (outside scaled element)
    const btnStyle = 'position:fixed;top:50%;transform:translateY(-50%);z-index:100;' +
      'width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,.2);' +
      'background:rgba(0,0,0,.4);color:#fff;font-size:20px;cursor:pointer;display:flex;' +
      'align-items:center;justify-content:center;';

    this.prevBtn = document.createElement('button');
    this.prevBtn.innerHTML = '‹';
    this.prevBtn.style.cssText = btnStyle + 'left:12px;';
    this.prevBtn.onclick = () => this.go(this.currentSlide - 1);

    this.nextBtn = document.createElement('button');
    this.nextBtn.innerHTML = '›';
    this.nextBtn.style.cssText = btnStyle + 'right:12px;';
    this.nextBtn.onclick = () => this.go(this.currentSlide + 1);

    this.appendChild(this.prevBtn);
    this.appendChild(this.nextBtn);
  }

  _scale() {
    if (!this.canvas) return;
    const sx = window.innerWidth / 1920;
    const sy = window.innerHeight / 1080;
    const scale = Math.min(sx, sy);
    this.canvas.style.transform = `scale(${scale})`;
    this.style.width = '100vw';
    this.style.height = '100vh';
    this.style.background = '#000';
    this.style.overflow = 'hidden';
  }

  _onKey(e) {
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); this.go(this.currentSlide + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); this.go(this.currentSlide - 1); }
    if (e.key === 'Home') { e.preventDefault(); this.go(0); }
    if (e.key === 'End') { e.preventDefault(); this.go(this.slides.length - 1); }
  }

  go(index) {
    if (index < 0 || index >= this.slides.length) return;
    this.slides[this.currentSlide].style.display = 'none';
    this.currentSlide = index;
    this.slides[this.currentSlide].style.display = '';
    this._updateCounter();
    this._postIndex();
    localStorage.setItem('cc-deck-position', String(index));
  }

  _updateCounter() {
    if (this.counter) {
      this.counter.textContent = `${this.currentSlide + 1} / ${this.slides.length}`;
    }
  }

  _postIndex() {
    window.postMessage({ slideIndexChanged: this.currentSlide }, '*');
  }
}

customElements.define('deck-stage', DeckStage);

// Print: one page per slide
if (typeof window !== 'undefined') {
  window.addEventListener('beforeprint', () => {
    const stage = document.querySelector('deck-stage');
    if (!stage) return;
    stage.slides.forEach(s => { s.style.display = ''; s.style.pageBreakAfter = 'always'; });
  });
  window.addEventListener('afterprint', () => {
    const stage = document.querySelector('deck-stage');
    if (!stage) return;
    stage.slides.forEach((s, i) => {
      s.style.display = i === stage.currentSlide ? '' : 'none';
      s.style.pageBreakAfter = '';
    });
  });
}
