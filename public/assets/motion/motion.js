/* HERRA motion kit (V2.0): reveals, staggers, a scroll-linked text fill and band transitions, driven by data attributes.
   Load as a classic script with defer, after motion.css. No dependency, no network, no console output. It writes only class names,
   data-mo attributes and the custom properties --i, --l, --n, --mo-d and --mo-p; all animation itself is opacity and transform in
   motion.css.

   Markup:   data-reveal="fade | rise | words | lines | fill | wipe"   data-reveal-delay="ms"   data-stagger="ms" on a container
             data-transition="band" on a section   data-no-reveal on anything that must never be touched
   Safety:   an element that is, or contains, a link, button, form control, nav, summary or a price is never gated: it is shown at once
             and listed by Motion.report().skipped (a conforming build has none; remove the data-reveal instead).
   Motion off (reduced motion, data saver, no IntersectionObserver): nothing is hidden and nothing moves. */
(function () {
  'use strict';
  var VERSION = '1.1.0';
  var d = document, w = window, root = d.documentElement;
  var SKIP = 'a, button, input, select, textarea, form, nav, summary, [role="button"], [data-no-reveal]';
  var PRICE = /[₱$€£¥]\s?\d|\b(?:PHP|USD|EUR|GBP|JPY)\s?\d|\d\s?(?:pesos?|php|usd)\b/i;
  var KINDS = { fade: 1, rise: 1, words: 1, lines: 1, fill: 1, wipe: 1 };
  var SPLIT = { words: 1, lines: 1, fill: 1 };
  var mq = w.matchMedia ? w.matchMedia.bind(w) : null;
  var reduce = mq ? mq('(prefers-reduced-motion: reduce)') : null;
  var saver = mq ? mq('(prefers-reduced-data: reduce)') : null;
  var skipped = [], fills = [], all = [], io = null, ticking = false;

  function markReady() { root.setAttribute('data-mo-ready', ''); }
  function show(el, state) { el.classList.add('mo-in'); el.setAttribute('data-mo', state); }

  // The head script already gave the page back (this script was blocked or slow): leave it at rest. Hiding content a second time would flicker.
  var released = root.hasAttribute('data-mo-released');
  if (released || !('IntersectionObserver' in w) || (reduce && reduce.matches) || (saver && saver.matches)) {
    root.classList.remove('mo-on');
    markReady();
    w.Motion = { version: VERSION, active: false, released: released, report: function () { return { version: VERSION, active: false, revealed: 0, pending: 0, skipped: [] }; } };
    return;
  }
  root.classList.add('mo-on');

  // Wrap every word in <span class="mo-m"><span class="mo-w">; spaces stay real text so copying and reading aloud are unchanged.
  function split(el) {
    var n = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (k) {
        if (k.nodeType === 3) {
          var frag = d.createDocumentFragment();
          k.nodeValue.split(/(\s+)/).forEach(function (part) {
            if (!part) { return; }
            if (/^\s+$/.test(part)) { frag.appendChild(d.createTextNode(' ')); return; }
            var m = d.createElement('span'), wd = d.createElement('span');
            m.className = 'mo-m'; wd.className = 'mo-w';
            wd.style.setProperty('--i', String(n++));
            wd.textContent = part;
            m.appendChild(wd); frag.appendChild(m);
          });
          node.replaceChild(frag, k);
        } else if (k.nodeType === 1 && k.tagName !== 'BR') { walk(k); }
      });
    })(el);
    el.style.setProperty('--n', String(n));
  }

  // Line index of every word, measured when the element is about to reveal (the layout is final by then).
  function markLines(el) {
    var words = el.querySelectorAll('.mo-w'), last = null, line = -1;
    for (var i = 0; i < words.length; i++) {
      var top = words[i].parentNode.offsetTop;
      if (last === null || Math.abs(top - last) > 2) { line++; last = top; }
      words[i].style.setProperty('--l', String(line));
    }
  }

  function guard(el) {
    if (el.hasAttribute('data-no-reveal')) { return 'opt-out'; }
    if (el.matches(SKIP) || el.querySelector(SKIP)) { return 'interactive'; }
    if (PRICE.test(el.textContent)) { return 'price'; }
    return '';
  }

  var targets = Array.prototype.slice.call(d.querySelectorAll('[data-reveal], [data-transition="band"]'));
  targets.forEach(function (el) {
    var band = el.getAttribute('data-transition') === 'band' && !el.hasAttribute('data-reveal');
    var kind = band ? 'band' : el.getAttribute('data-reveal');
    if (!band) {
      var why = !KINDS[kind] ? 'unknown' : guard(el);
      if (why) { show(el, 'skipped:' + why); skipped.push({ tag: el.tagName.toLowerCase(), kind: kind, reason: why }); return; }
    }
    if (SPLIT[kind]) { split(el); }
    var own = Number(el.getAttribute('data-reveal-delay'));
    if (own > 0) { el.style.setProperty('--mo-d', own + 'ms'); }
    el.setAttribute('data-mo', 'pending');
    all.push({ el: el, kind: kind });
    if (kind === 'fill') { fills.push(el); }
  });

  // data-stagger on a container: its reveal descendants step in order (at most 8 steps, so a long list never waits long)
  Array.prototype.forEach.call(d.querySelectorAll('[data-stagger]'), function (c) {
    var step = Number(c.getAttribute('data-stagger')) || 80, k = 0;
    Array.prototype.forEach.call(c.querySelectorAll('[data-reveal]'), function (el) {
      if (el.getAttribute('data-mo') !== 'pending') { return; }
      var base = Number(el.getAttribute('data-reveal-delay')) || 0;
      el.style.setProperty('--mo-d', (base + Math.min(k++, 8) * step) + 'ms');
    });
  });

  function reveal(item) {
    if (item.kind === 'lines') { markLines(item.el); }
    w.requestAnimationFrame(function () { show(item.el, 'in'); });
  }

  io = new w.IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) { return; }
      io.unobserve(e.target);
      for (var i = 0; i < all.length; i++) { if (all[i].el === e.target && all[i].kind !== 'fill') { reveal(all[i]); break; } }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
  all.forEach(function (item) { if (item.kind !== 'fill') { io.observe(item.el); } });

  // fill: --mo-p runs from 0 (the element's top at 85 percent of the viewport) to 1 (its bottom at 35 percent)
  function updateFills() {
    ticking = false;
    var vh = w.innerHeight;
    fills.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) { return; }
      var p = (vh * 0.85 - r.top) / (vh * 0.5 + r.height);
      p = p < 0 ? 0 : (p > 1 ? 1 : p);
      el.style.setProperty('--mo-p', p.toFixed(4));
      el.setAttribute('data-mo', 'in');
    });
  }
  function requestFill() { if (!ticking) { ticking = true; w.requestAnimationFrame(updateFills); } }
  if (fills.length) {
    w.addEventListener('scroll', requestFill, { passive: true });
    w.addEventListener('resize', requestFill, { passive: true });
    requestFill();
  }

  function motionOff() {
    root.classList.remove('mo-on');
    if (io) { io.disconnect(); }
    all.forEach(function (item) { show(item.el, 'in'); });
  }
  [reduce, saver].forEach(function (m) {
    if (!m) { return; }
    if (m.addEventListener) { m.addEventListener('change', function () { if (m.matches) { motionOff(); } }); }
    else if (m.addListener) { m.addListener(function () { if (m.matches) { motionOff(); } }); }
  });

  w.Motion = {
    version: VERSION, active: true, released: false,
    report: function () {
      var done = 0, pending = 0;
      all.forEach(function (item) { if (item.el.getAttribute('data-mo') === 'in') { done++; } else { pending++; } });
      return { version: VERSION, active: root.classList.contains('mo-on'), revealed: done, pending: pending, skipped: skipped.slice() };
    }
  };
  markReady();
})();
