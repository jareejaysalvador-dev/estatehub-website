/*! HERRA Scroll Moments 1.3.0 | pre-paint decision. Inline this file in <head> before any stylesheet. */
(function (d, w) {
  var r = '';
  try {
    var c = w.navigator.connection;
    var ok = 'IntersectionObserver' in w && 'requestAnimationFrame' in w && w.CSS && w.CSS.supports && w.CSS.supports('position', 'sticky') && w.CSS.supports('overflow', 'clip');
    if (!ok) { r = 'no-support'; }
    else if (w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches) { r = 'reduced-motion'; }
    else if (c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ''))) { r = 'data-saver'; }
    else if (w.innerHeight < 480) { r = 'viewport'; } // starting value 480; also in staticReason and MIN_HEIGHT in scroll-moments.js
  } catch (e) { r = 'error'; }
  if (r) { d.documentElement.setAttribute('data-sm-reason', r); }
  d.documentElement.setAttribute('data-sm', r ? 'static' : 'live');
  if (!r) {
    // The live layout is committed before paint. If the engine never ran (script missing, blocked or broken), go back to static.
    w.addEventListener('load', function () {
      if (!(w.ScrollMoments && w.ScrollMoments.init)) {
        d.documentElement.setAttribute('data-sm-reason', 'error');
        d.documentElement.setAttribute('data-sm', 'static');
      }
    });
  }
})(document, window);
