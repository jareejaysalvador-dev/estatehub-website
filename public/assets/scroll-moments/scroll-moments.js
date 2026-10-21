/*! HERRA Scroll Moments 1.3.0 | HERRA V1.3 | dependency-free | contains no user-facing strings */
(function (root, factory) {
  var api = factory(root);
  if (typeof module === 'object' && module.exports) { module.exports = api; }
  else { root.ScrollMoments = api; }
})(typeof window !== 'undefined' ? window : globalThis, function (win) {
  'use strict';

  var VERSION = '1.3.0';

  /* ---------- pure math (unit tested in Node) ---------- */

  function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }

  // Pinned track: 0 when the track top reaches the viewport top,
  // 1 when the sticky stage is about to release at the end of the track.
  function trackProgress(top, trackH, stageH) {
    var span = trackH - stageH;
    if (span <= 0) { return top < 0 ? 1 : 0; }
    return clamp((0 - top) / span, 0, 1);
  }

  // Unpinned section: 0 when its top touches the viewport bottom,
  // 1 when its bottom leaves the viewport top.
  function viewProgress(top, height, viewportH) {
    var total = height + viewportH;
    if (total <= 0) { return 0; }
    return clamp((viewportH - top) / total, 0, 1);
  }

  // Chapter i owns [i/n, (i+1)/n]; neighbours crossfade across a window of overlap/n.
  function chapterOpacities(p, n, overlap) {
    var out = [], w = Math.max(overlap / n, 1e-6); // overlap 0 means a hard cut: never divide by zero
    for (var i = 0; i < n; i++) {
      var start = i / n, end = (i + 1) / n;
      var fadeIn = i === 0 ? 1 : clamp((p - (start - w / 2)) / w, 0, 1);
      var fadeOut = i === n - 1 ? 1 : clamp(((end + w / 2) - p) / w, 0, 1);
      out.push(Math.min(fadeIn, fadeOut));
    }
    return out;
  }

  function chapterLocal(p, n, i) { return clamp(p * n - i, 0, 1); }

  // Camera moves stay inside the bleed: base scale 1.04 hides edges, pans never exceed the extra scale.
  var CAMERA = {
    none: function () { return 'scale(1.04)'; },
    push: function (t) { return 'scale(' + (1.04 + 0.04 * t).toFixed(4) + ')'; },
    pull: function (t) { return 'scale(' + (1.08 - 0.04 * t).toFixed(4) + ')'; },
    'pan-left': function (t) { return 'scale(1.06) translate3d(' + (1.5 - 3 * t).toFixed(3) + '%,0,0)'; },
    'pan-right': function (t) { return 'scale(1.06) translate3d(' + (-1.5 + 3 * t).toFixed(3) + '%,0,0)'; }
  };
  function cameraTransform(kind, t) {
    var f = Object.prototype.hasOwnProperty.call(CAMERA, kind) ? CAMERA[kind] : CAMERA.none;
    return f(clamp(t, 0, 1));
  }

  function frameIndex(p, count) { return count <= 1 ? 0 : Math.round(clamp(p, 0, 1) * (count - 1)); }

  // Every 8th frame, then the last frame, then every 4th, 2nd and the rest.
  function loadOrder(count) {
    var seen = [], order = [], steps = [8, 4, 2, 1];
    function add(i) { if (i >= 0 && i < count && !seen[i]) { seen[i] = true; order.push(i); } }
    for (var s = 0; s < steps.length; s++) {
      for (var i = 0; i < count; i += steps[s]) { add(i); }
      if (s === 0) { add(count - 1); }
    }
    return order;
  }

  function nearestLoaded(target, flags) {
    if (flags[target]) { return target; }
    var n = Math.max(flags.length, target + 1);
    for (var d = 1; d < n; d++) {
      if (flags[target - d]) { return target - d; }
      if (flags[target + d]) { return target + d; }
    }
    return -1;
  }

  function decodedWindow(w, h, capBytes) { return Math.max(1, Math.floor(capBytes / (w * h * 4))); }

  function depthShift(p, depth, maxShiftPx) { return (clamp(p, 0, 1) - 0.5) * 2 * clamp(depth, 0, 1) * maxShiftPx + 0; } // + 0 turns negative zero into zero

  function coverRect(srcW, srcH, dstW, dstH) {
    var s = Math.max(dstW / srcW, dstH / srcH);
    var w = srcW * s, h = srcH * s;
    return { x: (dstW - w) / 2, y: (dstH - h) / 2, w: w, h: h };
  }

  function frameUrl(pattern, index, start, pad) {
    var n = String(index + start);
    while (n.length < pad) { n = '0' + n; }
    return pattern.replace('{i}', n);
  }

  function staticReason(env) {
    if (!env.hasAPIs) { return 'no-support'; }
    if (env.reducedMotion) { return 'reduced-motion'; }
    if (env.saveData || /(^|-)2g$/.test(env.effectiveType || '')) { return 'data-saver'; }
    if (env.isFrames && typeof env.deviceMemory === 'number' && env.deviceMemory <= 2) { return 'low-memory'; }
    if (env.viewportH < 400) { return 'viewport'; } // recalibrated 480 -> 400 on 2026-10-19 (QA_LOG r5: 720p laptops); also also MIN_HEIGHT in the runtime and the check in scroll-moments-head.js
    if (env.stickyBlocked) { return 'sticky-blocked'; }
    if (env.specInvalid) { return 'spec'; }
    return null;
  }

  var pure = {
    clamp: clamp, trackProgress: trackProgress, viewProgress: viewProgress,
    chapterOpacities: chapterOpacities, chapterLocal: chapterLocal, cameraTransform: cameraTransform,
    frameIndex: frameIndex, loadOrder: loadOrder, nearestLoaded: nearestLoaded,
    decodedWindow: decodedWindow, depthShift: depthShift, coverRect: coverRect,
    frameUrl: frameUrl, staticReason: staticReason
  };

  var api = { version: VERSION, pure: pure };

  /* ---------- runtime (browser only) ---------- */
  var doc = win.document;
  if (doc) {
    var MOBILE_MAX = 767;
    var MEMORY_CAP = { mobile: 64 * 1048576, desktop: 160 * 1048576 };
    var MIN_HEIGHT = 400;      // recalibrated 480 -> 400 on 2026-10-19 (QA_LOG r5) (also in staticReason above and in scroll-moments-head.js): below this viewport height every moment gets its static equivalent
    var SEEK_GUARD_MS = 10000; // starting value: a seek that has not drawn its target by then resolves false
    var DEPTH_SHIFT = 0.15;    // starting value: the farthest an M4 layer of depth 1 moves from its resting place, each way, as a share of the section height
    var moments = [];
    var byId = {};
    var active = [];
    var rafId = 0;
    var listening = false;
    var lastW = 0;
    var loaded = doc.readyState === 'complete';

    var num = function (el, name, dflt) { var v = parseFloat(el.getAttribute(name)); return isFinite(v) ? v : dflt; };
    var isMobileViewport = function () { return win.innerWidth <= MOBILE_MAX; };
    var idle = function (fn) { if (win.requestIdleCallback) { win.requestIdleCallback(fn, { timeout: 1000 }); } else { win.setTimeout(fn, 200); } };

    // True while a text field (or a select, textarea, contenteditable) has focus, which is when a soft keyboard may be open.
    var editing = function () {
      var a = doc.activeElement;
      if (!a) { return false; }
      return a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.tagName === 'SELECT' || !!a.isContentEditable;
    };

    var setState = function (m, state, reason) {
      m.state = state;
      m.reason = reason || null;
      m.el.setAttribute('data-sm-state', state);
      if (reason) { m.el.setAttribute('data-sm-reason', reason); } else { m.el.removeAttribute('data-sm-reason'); }
      try { m.el.dispatchEvent(new win.CustomEvent('sm:state', { bubbles: true, detail: { id: m.id, state: m.state, reason: m.reason } })); } catch (e) { /* old browser: attributes still carry the state */ }
    };

    var setStatic = function (m, reason) {
      var i = active.indexOf(m);
      if (i >= 0) { active.splice(i, 1); }
      m.el.classList.remove('sm-is-active');
      if (m.mech && m.mech.teardown && m.state !== 'idle') { try { m.mech.teardown(m); } catch (e) { /* already static */ } }
      setState(m, 'static', reason);
      var w = m.waiters; m.waiters = [];
      w.forEach(function (fn) { fn(false); });
    };

    // Static after an exception. The message stays readable through report(id).error; the engine never writes to the console.
    var failMoment = function (m, e) {
      m.error = String(e && e.message ? e.message : e);
      setStatic(m, 'error');
    };

    // Does an ancestor of the sticky stage stop it from sticking to the viewport? The walk starts at the stage's parent
    // (the track), so overflow on the track or the section counts. overflow: clip is fine. body is skipped when html is
    // overflow: visible on both axes, because then the body value propagates to the viewport and sticky still works.
    var stickyBlocked = function (el) {
      var hs = win.getComputedStyle(doc.documentElement);
      var bodyPropagates = hs.overflowX === 'visible' && hs.overflowY === 'visible';
      for (var p = el.parentElement; p && p !== doc.documentElement; p = p.parentElement) {
        if (p === doc.body && bodyPropagates) { continue; }
        var cs = win.getComputedStyle(p);
        if (/^(hidden|auto|scroll)$/.test(cs.overflowX) || /^(hidden|auto|scroll)$/.test(cs.overflowY)) { return true; }
      }
      return false;
    };

    // The fixed layers must fit the safe box (100svh). Judged for the kinds that use it (pin and frames), never for depth.
    // checkHeight adds the "viewport shorter than MIN_HEIGHT" rule.
    var viewportUnfit = function (m, checkHeight) {
      if (m.kind === 'depth') { return false; }
      if (checkHeight && win.innerHeight < MIN_HEIGHT) { return true; }
      var safe = m.el.querySelector('.sm-safe');
      return !!(safe && safe.scrollHeight > safe.clientHeight + 1);
    };

    // A chapter clip must not keep playing once its moment is static or off screen (MEMORABLE_MOMENTS M7: pauses when offscreen).
    var pauseClips = function (m) {
      if (!m.chapters) { return; }
      m.chapters.forEach(function (ch) { var v = ch.querySelector("video"); if (v && !v.paused) { v.pause(); } });
    };

    var MECH = {};

    MECH.pin = {
      valid: function (m) {
        m.track = m.el.querySelector('.sm-track');
        m.stage = m.el.querySelector('.sm-stage');
        m.chapters = Array.prototype.slice.call(m.el.querySelectorAll('.sm-chapter'));
        return !!(m.track && m.stage && m.chapters.length >= 2);
      },
      setup: function (m) {
        m.overlap = clamp(num(m.el, 'data-sm-overlap', 0.2), 0, 1); // a share of a chapter: 0 is a hard cut, 1 the widest crossfade
        m.stageH = m.stage.offsetHeight;
      },
      resize: function (m) { m.stageH = m.stage.offsetHeight; },
      update: function (m) {
        var r = m.track.getBoundingClientRect();
        var p = trackProgress(r.top, r.height, m.stageH);
        m.progress = p;
        var ops = chapterOpacities(p, m.chapters.length, m.overlap);
        for (var i = 0; i < m.chapters.length; i++) {
          var ch = m.chapters[i];
          ch.style.opacity = ops[i].toFixed(3);
          var media = ch.firstElementChild;
          if (media && media.tagName !== 'FIGCAPTION') {
            media.style.transform = cameraTransform(ch.getAttribute('data-sm-motion') || 'none', chapterLocal(p, m.chapters.length, i));
          }
          var vid = ch.querySelector('video');
          if (vid) {
            if (ops[i] > 0.5) { if (vid.paused) { var pr = vid.play(); if (pr && pr.catch) { pr.catch(function () {}); } } }
            else if (!vid.paused) { vid.pause(); }
          }
        }
        m.el.style.setProperty('--sm-p', p.toFixed(4));
      },
      teardown: function (m) {
        m.chapters.forEach(function (ch) {
          ch.style.opacity = '';
          var media = ch.firstElementChild;
          if (media) { media.style.transform = ''; }
        });
        pauseClips(m);
        m.el.style.removeProperty('--sm-p');
      },
      // The target frame is drawn when the page is within 1 px of where the target is NOW and the measured progress is within
      // about 1 px of the scroll span of the target. Progress alone is clamped to 0..1, so a page that is still scrolling toward
      // the end of the track from beyond it would already look settled; the position check catches that. The target position is
      // recomputed on every call and never stored: scroll anchoring moves the page when content above the moment changes size,
      // and a position stored at seek time would then be stale.
      settled: function (m) {
        var span = m.track.getBoundingClientRect().height - m.stageH;
        if (span <= 0) { return true; }
        if (Math.abs(win.pageYOffset - Math.round(MECH.pin.seekY(m, m.target))) > 1) { return false; }
        return Math.abs(m.progress - m.target) * span <= 1;
      },
      seekY: function (m, p) {
        var r = m.track.getBoundingClientRect();
        return r.top + win.pageYOffset + clamp(p, 0, 1) * (r.height - m.stageH);
      }
    };

    MECH.depth = {
      valid: function (m) {
        m.layers = Array.prototype.slice.call(m.el.querySelectorAll('[data-sm-depth]'));
        return m.layers.length >= 2 && m.layers.length <= 4;
      },
      setup: function () {},
      update: function (m) {
        var r = m.el.getBoundingClientRect();
        var p = viewProgress(r.top, r.height, win.innerHeight);
        m.progress = p;
        var maxShift = DEPTH_SHIFT * r.height;
        var limit = isMobileViewport() ? 2 : 4;
        var moving = 0;
        for (var i = 0; i < m.layers.length; i++) {
          var layer = m.layers[i];
          var d = num(layer, 'data-sm-depth', 0);
          if (d > 0 && moving < limit) {
            moving++;
            layer.style.transform = 'translate3d(0,' + depthShift(p, d, maxShift).toFixed(2) + 'px,0)';
          } else {
            layer.style.transform = '';
          }
        }
      },
      teardown: function (m) { m.layers.forEach(function (layer) { layer.style.transform = ''; }); },
      // Same contract as MECH.pin.settled: the layers are drawn at the target when the page is within 1 px of where the target is
      // NOW and the measured progress is within about 1 px of the scroll span of the target. The span is the denominator that
      // viewProgress uses (section height plus viewport height). Progress alone is clamped to 0..1, so a seek that starts from far
      // below the section would already look settled while the page is still scrolling up to it; the position check catches that.
      // The target position is recomputed on every call and never stored (scroll anchoring can move the page under a seek).
      settled: function (m) {
        var span = m.el.getBoundingClientRect().height + win.innerHeight;
        if (span <= 0) { return true; }
        if (Math.abs(win.pageYOffset - Math.round(MECH.depth.seekY(m, m.target))) > 1) { return false; }
        return Math.abs(m.progress - m.target) * span <= 1;
      },
      seekY: function (m, p) {
        var r = m.el.getBoundingClientRect();
        var top = win.innerHeight - clamp(p, 0, 1) * (r.height + win.innerHeight);
        return r.top + win.pageYOffset - top;
      }
    };

    /* ---------- S2 frame sequence (M7 scrub mode) ----------
       A scrub moment is a pinned track (MECH.pin owns the progress and the seek position) whose stage shows ONE frame of a
       pre-rendered sequence on a canvas. Frames are fetched coarse first (loadOrder), a few at a time, once the section is
       within a viewport of the screen and the page has loaded. A frame is decoded on demand, and only the frames nearest to
       the current position stay decoded (decodedWindow of the memory cap). Every numeric threshold here is a starting value
       (recalibrate from real builds): FRAME_REQUESTS, FRAME_COUNT, FRAME_PAD and FRAME_SIZE below, and the values reused
       from elsewhere in this file: the coarse load steps 8, 4, 2, 1 (loadOrder), MEMORY_CAP (64 MB mobile, 160 MB desktop)
       and the 1000 ms idle timeout (idle). */
    var FRAME_REQUESTS = 4;                    // starting value: frame requests in flight at once
    var FRAME_COUNT = { min: 24, max: 1000 };  // starting values: frames in a sequence
    var FRAME_PAD = { min: 1, max: 8 };        // starting values: digits of the zero padded frame number
    var FRAME_SIZE = { min: 16, max: 8192 };   // starting values: declared frame width and height in px

    // A frame attribute. An absent one takes its default. A PRESENT one that does not parse to a finite number ("Infinity",
    // "1e999", "abc", "") is refused (NaN, which every range check rejects), so bad author input makes the moment static with
    // reason spec instead of silently becoming the default. Like num(), parseFloat reads "4px" as 4.
    var given = function (el, name, dflt) {
      if (!el.hasAttribute(name)) { return dflt; }
      var v = parseFloat(el.getAttribute(name));
      return isFinite(v) ? v : NaN;
    };
    var intIn = function (v, range) { return Number.isInteger(v) && v >= range.min && v <= range.max; };

    // Failures name the frame (its zero based index, then its file name) so report(id).error says which one. A failure that arrives
    // after the moment already went static does nothing: no second sm:state event and the first message stays.
    var frameError = function (f, i, e) {
      var name = frameUrl(f.pattern, i, f.start, f.pad).split('/').pop();
      return 'frame ' + i + ' (' + name + '): ' + String(e && e.message ? e.message : e);
    };
    var failFrame = function (m, message) { if (m.state !== 'static') { failMoment(m, message); } };

    var paint = function (m, i) {
      var f = m.frames;
      if (f.painted === i) { return; }
      var bmp = f.bitmaps.get(i);
      var c = m.canvas;
      var r = coverRect(f.w, f.h, c.width, c.height);
      // Each paint REPLACES the picture: a frame with transparency must not show the previous frame through it.
      m.ctx.clearRect(0, 0, c.width, c.height);
      m.ctx.drawImage(bmp, r.x, r.y, r.w, r.h);
      f.painted = i;
      if (!m.shown) { m.shown = true; c.style.opacity = '1'; }
    };

    var evict = function (m, center) {
      var f = m.frames;
      while (f.bitmaps.size > f.window) {
        var far = -1, dist = -1;
        f.bitmaps.forEach(function (b, k) { var d = Math.abs(k - center); if (d > dist) { dist = d; far = k; } });
        var old = f.bitmaps.get(far);
        if (old && old.close) { old.close(); }
        f.bitmaps.delete(far);
        f.decodedFlags[far] = false;
      }
    };

    var decode = function (m, i) {
      var f = m.frames;
      if (f.decoding >= 0 || !f.blobs[i] || f.bitmaps.has(i)) { return; }
      f.decoding = i;
      var done = function (bmp) {
        f.decoding = -1;
        if (m.state === 'static') { if (bmp.close) { bmp.close(); } return; }
        f.bitmaps.set(i, bmp);
        f.decodedFlags[i] = true;
        evict(m, frameIndex(m.progress, f.count));
        schedule();
      };
      // .then(done).catch(fail), not .then(done, fail): an exception inside done must end the moment too
      var fail = function (e) { f.decoding = -1; failFrame(m, frameError(f, i, e)); };
      if (win.createImageBitmap) { win.createImageBitmap(f.blobs[i]).then(done).catch(fail); }
      else {
        var url = win.URL.createObjectURL(f.blobs[i]);
        var img = new win.Image();
        img.src = url;
        img.decode().then(function () { win.URL.revokeObjectURL(url); done(img); }).catch(fail);
      }
    };

    var pump = function (m) {
      var f = m.frames;
      while (f.inflight < FRAME_REQUESTS && f.queue.length && m.state !== 'static') {
        var i = f.queue.shift();
        f.inflight++;
        fetchFrame(m, i);
      }
    };

    var fetchFrame = function (m, i) {
      var f = m.frames;
      var counted = true; // this request still counts against FRAME_REQUESTS; release() gives the slot back exactly once
      var release = function () { if (counted) { counted = false; f.inflight--; } };
      try {
        win.fetch(frameUrl(f.pattern, i, f.start, f.pad))
          .then(function (res) { if (!res.ok) { throw new Error('HTTP ' + res.status); } return res.blob(); })
          .then(function (blob) {
            release();
            if (m.state === 'static') { return; }
            f.blobs[i] = blob;
            f.loaded[i] = true;
            f.loadedCount++;
            f.bytes += blob.size;
            if (m.state === 'loading') { setState(m, 'ready'); }
            schedule();
            pump(m);
          })
          .catch(function (e) { release(); failFrame(m, frameError(f, i, e)); });
      } catch (e) { release(); failFrame(m, frameError(f, i, e)); } // fetch itself missing or throwing
    };

    MECH.frames = {
      valid: function (m) {
        m.canvas = m.el.querySelector('canvas.sm-canvas');
        m.track = m.el.querySelector('.sm-track');
        m.stage = m.el.querySelector('.sm-stage');
        var pre = isMobileViewport() ? 'data-sm-frames-mobile' : 'data-sm-frames';
        var pattern = m.el.getAttribute(pre);
        if (!pattern) { return false; }
        m.frames = {
          pattern: pattern, count: given(m.el, pre + '-count', 0), start: given(m.el, pre + '-start', 1),
          pad: given(m.el, pre + '-pad', 4), w: given(m.el, pre + '-width', 0), h: given(m.el, pre + '-height', 0)
        };
        var f = m.frames;
        return !!(m.canvas && m.canvas.getContext && m.track && m.stage && pattern.split('{i}').length === 2 &&
          intIn(f.count, FRAME_COUNT) && intIn(f.pad, FRAME_PAD) && Number.isInteger(f.start) && f.start >= 0 &&
          intIn(f.w, FRAME_SIZE) && intIn(f.h, FRAME_SIZE));
      },
      setup: function (m) {
        var f = m.frames;
        f.loaded = []; f.decodedFlags = []; f.blobs = []; f.bitmaps = new Map();
        f.loadedCount = 0; f.bytes = 0; f.painted = -1; f.started = false; f.inflight = 0; f.decoding = -1;
        f.queue = loadOrder(f.count);
        f.window = decodedWindow(f.w, f.h, isMobileViewport() ? MEMORY_CAP.mobile : MEMORY_CAP.desktop);
        m.ctx = m.canvas.getContext('2d');
        MECH.pin.setup(m);
        MECH.frames.resize(m);
      },
      resize: function (m) {
        MECH.pin.resize(m);
        var f = m.frames;
        var r = m.canvas.getBoundingClientRect();
        if (!r.width || !r.height) { return; }
        var s = Math.min(Math.min(win.devicePixelRatio || 1, 2), Math.max(f.w / r.width, f.h / r.height));
        var w = Math.round(r.width * s);
        var h = Math.round(r.height * s);
        // Assigning canvas.width or height clears the canvas, even to the same value. Mobile browsers fire resize while the
        // address bar collapses, so only touch the canvas when its backing size really changes.
        if (w === m.canvas.width && h === m.canvas.height) { return; }
        m.canvas.width = w;
        m.canvas.height = h;
        f.painted = -1;
      },
      update: function (m) {
        var r = m.track.getBoundingClientRect();
        var p = trackProgress(r.top, r.height, m.stageH);
        m.progress = p;
        m.el.style.setProperty('--sm-p', p.toFixed(4)); // the same progress variable the pin writes, so CSS can drive captions from a scrub too
        var f = m.frames;
        var idx = frameIndex(p, f.count);
        var want = nearestLoaded(idx, f.loaded);
        // Until the canvas has shown a frame, the poster (frame 0) is on screen: do not replace it with a frame that is farther
        // from the current position than frame 0 is (the first frame to arrive is not always the nearest one).
        if (want < 0 || (!m.shown && Math.abs(want - idx) > idx)) { return; }
        if (f.bitmaps.has(want)) { paint(m, want); return; }
        decode(m, want);
        var have = nearestLoaded(idx, f.decodedFlags);
        if (have >= 0) { paint(m, have); }
      },
      // The pin check (the page is where the target is NOW, and the progress agrees) AND the frame for that position is the one
      // on the canvas. While that frame has not loaded or decoded, painted is a nearer frame and seek keeps waiting.
      settled: function (m) { return MECH.pin.settled(m) && m.frames.painted === frameIndex(m.progress, m.frames.count); },
      onNear: function (m) {
        var f = m.frames;
        if (!loaded || f.started || m.state === 'static') { return; }
        f.started = true;
        idle(function () { pump(m); });
      },
      teardown: function (m) {
        var f = m.frames;
        if (f && f.bitmaps) {
          f.bitmaps.forEach(function (b) { if (b.close) { b.close(); } });
          f.bitmaps.clear();
          f.queue = [];
          f.blobs = [];
        }
        if (m.canvas) { m.canvas.style.opacity = ''; m.canvas.width = 0; } // 0 frees the backing store of a static moment
        if (f) { f.painted = -1; } // a static moment must not report a painted frame
        m.el.style.removeProperty('--sm-p');
      },
      seekY: function (m, p) { return MECH.pin.seekY(m, p); }
    };

    var kindOf = function (el) {
      var t = el.getAttribute('data-sm');
      if (t === 'M1') { return 'pin'; }
      if (t === 'M4') { return 'depth'; }
      if (t === 'M7') {
        var mode = el.getAttribute('data-sm-mode');
        if (mode === 'scrub') { return 'frames'; }
        if (mode === 'chapter') { return 'pin'; }
      }
      return null;
    };

    var readEnv = function (m) {
      var conn = win.navigator.connection;
      var mq = win.matchMedia ? win.matchMedia('(prefers-reduced-motion: reduce)') : null;
      var specInvalid = !m.mech || !m.mech.valid(m); // valid() also records m.stage, which the sticky walk starts from
      return {
        hasAPIs: !!(win.IntersectionObserver && win.requestAnimationFrame && win.CSS && win.CSS.supports && win.CSS.supports('position', 'sticky') && win.CSS.supports('overflow', 'clip')),
        reducedMotion: !!(mq && mq.matches),
        saveData: !!(conn && conn.saveData),
        effectiveType: conn ? conn.effectiveType : '',
        deviceMemory: win.navigator.deviceMemory,
        viewportH: win.innerHeight,
        isFrames: m.kind === 'frames',
        stickyBlocked: m.kind !== 'depth' && stickyBlocked(m.stage || m.el),
        specInvalid: specInvalid
      };
    };

    var flushSettle = function (m) {
      if (!m.waiters.length) { return; }
      if (m.mech.settled && !m.mech.settled(m)) { return; }
      var w = m.waiters; m.waiters = [];
      w.forEach(function (fn) { fn(true); });
    };

    var tick = function () {
      rafId = 0;
      for (var i = 0; i < active.length; i++) {
        var m = active[i];
        var t0 = win.performance.now();
        try { m.mech.update(m); } catch (e) { failMoment(m, e); i--; continue; }
        var dt = win.performance.now() - t0;
        if (dt > m.longest) { m.longest = dt; }
        flushSettle(m);
      }
    };

    var schedule = function () { if (!rafId && active.length) { rafId = win.requestAnimationFrame(tick); } };

    var observe = function (m) {
      var near = new win.IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { m.near = true; if (m.mech.onNear && m.state !== 'static') { m.mech.onNear(m); } }
        });
      }, { rootMargin: '100% 0px 100% 0px' });
      var vis = new win.IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          var i = active.indexOf(m);
          if (e.isIntersecting && m.state !== 'static') {
            if (i < 0) { active.push(m); m.el.classList.add('sm-is-active'); }
            schedule();
          } else if (!e.isIntersecting && i >= 0) {
            active.splice(i, 1);
            m.el.classList.remove('sm-is-active');
            pauseClips(m);
          }
        });
      });
      near.observe(m.el);
      vis.observe(m.el);
    };

    var listen = function () {
      if (listening) { return; }
      listening = true;
      lastW = win.innerWidth;
      win.addEventListener('scroll', schedule, { passive: true });
      win.addEventListener('resize', function () {
        // A soft keyboard changes the height without changing the width, so "viewport shorter than MIN_HEIGHT" is judged
        // only when the width changed (rotation, a real window resize). Layouts that resize with the keyboard (some Android
        // WebViews, interactive-widget=resizes-content) also shrink the svh safe box, so while a field has focus both viewport
        // checks are skipped. The first resize after the field loses focus judges again. Static is terminal until reload.
        var typing = editing();
        var widthChanged = win.innerWidth !== lastW;
        if (!typing) { lastW = win.innerWidth; } // "since the last judged check": a rotation made while a field has focus is judged after blur
        moments.forEach(function (m) {
          if (m.state === 'static') { return; }
          if (m.mech.resize) { m.mech.resize(m); }
          if (!typing && viewportUnfit(m, widthChanged)) { setStatic(m, 'viewport'); }
        });
        schedule();
      }, { passive: true });
      var mq = win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)');
      if (mq) {
        var onChange = function (e) { if (e.matches) { moments.forEach(function (m) { if (m.state !== 'static') { setStatic(m, 'reduced-motion'); } }); } };
        if (mq.addEventListener) { mq.addEventListener('change', onChange); } else if (mq.addListener) { mq.addListener(onChange); }
      }
      win.addEventListener('load', function () {
        loaded = true;
        moments.forEach(function (m) {
          if (m.state === 'static') { return; }
          // Fonts and images without dimensions may have grown the fixed layers since setup.
          if (viewportUnfit(m, false)) { setStatic(m, 'viewport'); return; }
          if (m.near && m.mech && m.mech.onNear) { m.mech.onNear(m); }
        });
      });
    };

    var init = function (scope) {
      var root = scope || doc;
      var html = doc.documentElement;
      var live = html.getAttribute('data-sm') === 'live';
      var els = Array.prototype.slice.call(root.querySelectorAll('[data-sm]'));
      if (root !== doc && root.matches && root.matches('[data-sm]')) { els.unshift(root); } // a moment passed as its own scope
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (el === html || el.__sm) { continue; }
        var kind = kindOf(el);
        var m = {
          id: el.getAttribute('data-sm-id') || ('sm-' + moments.length), el: el, kind: kind,
          mech: kind ? MECH[kind] : null, state: 'idle', reason: null, progress: 0, target: 0,
          longest: 0, waiters: [], near: false, error: null
        };
        el.__sm = m;
        moments.push(m);
        byId[m.id] = m;
        try {
          var reason = live ? staticReason(readEnv(m)) : (html.getAttribute('data-sm-reason') || 'spec');
          if (!reason && viewportUnfit(m, true)) { reason = 'viewport'; }
          if (reason) { setStatic(m, reason); continue; }
          m.mech.setup(m);
          setState(m, m.kind === 'frames' ? 'loading' : 'ready');
          observe(m);
        } catch (e) { failMoment(m, e); }
      }
      listen();
      schedule();
      return moments.length;
    };

    var seek = function (id, p) {
      var m = byId[id];
      if (!m) { return Promise.reject(new Error('unknown moment ' + id)); }
      if (m.state === 'static') { return Promise.resolve(false); }
      m.target = clamp(p, 0, 1);
      return new Promise(function (resolve) {
        var timer = win.setTimeout(function () {
          var k = m.waiters.indexOf(fin);
          if (k >= 0) { m.waiters.splice(k, 1); }
          resolve(false);
        }, SEEK_GUARD_MS);
        function fin(ok) { win.clearTimeout(timer); resolve(ok); }
        m.waiters.push(fin);
        // Jump at once even when the page animates its own scrolling; settled() then confirms the frame is drawn.
        var y = Math.round(m.mech.seekY(m, m.target));
        try { win.scrollTo({ top: y, left: 0, behavior: 'instant' }); } catch (e) { win.scrollTo(0, y); }
        if (active.indexOf(m) < 0 && m.state !== 'static') { active.push(m); m.el.classList.add('sm-is-active'); }
        schedule();
      });
    };

    var report = function (id) {
      var m = byId[id];
      if (!m) { return null; }
      var r = { version: VERSION, id: m.id, kind: m.kind, state: m.state, reason: m.reason, progress: m.progress, longestFrameMs: Math.round(m.longest * 100) / 100, error: m.error || null };
      if (m.kind === 'frames' && m.frames && m.frames.bitmaps) {
        var f = m.frames;
        r.framesTotal = f.count; r.framesLoaded = f.loadedCount; r.bytesLoaded = f.bytes; r.painted = f.painted;
        r.decoded = f.bitmaps.size; r.decodedBytes = f.bitmaps.size * f.w * f.h * 4; r.decodedCap = f.window * f.w * f.h * 4;
      }
      return r;
    };

    api.init = init;
    api.seek = seek;
    api.report = report;
    win.ScrollMoments = api; // also when a CommonJS module object hides the global from the UMD wrapper, so the head script finds the engine

    if (doc.readyState === 'loading') { doc.addEventListener('DOMContentLoaded', function () { init(); }); }
    else { init(); }
  }

  return api;
});
