/* HERRA motion kit (V2.0): paste inline in <head>, before any stylesheet. It turns the hidden start state on before first paint, only
   when motion is allowed. If motion.js has not taken over within 1 second it gives the page back and marks <html data-mo-released>, so a
   blocked or slow script never hides content past the 1.2 s rule, and a script that arrives later leaves the page at rest. */
(function () {
  var r = document.documentElement, mq = window.matchMedia;
  if (!window.IntersectionObserver || !mq || mq('(prefers-reduced-motion: reduce)').matches || mq('(prefers-reduced-data: reduce)').matches) { return; }
  r.classList.add('mo-on');
  setTimeout(function () { if (!r.hasAttribute('data-mo-ready')) { r.classList.remove('mo-on'); r.setAttribute('data-mo-released', ''); } }, 1000);
})();
