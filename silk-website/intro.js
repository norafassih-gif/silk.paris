(function () {
  var d = document, root = d.documentElement, intro = d.getElementById('intro');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var closed = false, timer = null, started = false;
  function finish() {
    if (closed) return; closed = true;
    if (intro && intro.parentNode) intro.parentNode.removeChild(intro);
    root.classList.remove('intro-lock', 'intro-hide');
    d.dispatchEvent(new Event('silk-intro-done'));
  }
  function openIntro() {
    if (!intro || closed) return;
    clearTimeout(timer);
    root.classList.remove('intro-hide');
    intro.classList.add('open');
    d.dispatchEvent(new Event('silk-intro-open'));
    setTimeout(finish, 1750);
  }
  var seen = false;
  try { seen = sessionStorage.getItem('silkIntro') === '1'; } catch (e) {}
  if (!intro || reduce || seen || location.hash.length > 1) { finish(); return; }
  try { sessionStorage.setItem('silkIntro', '1'); } catch (e) {}
  /* l'animation ne demarre que quand le logo est decode : plus de saccades au chargement */
  function go() {
    if (started || closed) return; started = true;
    intro.classList.add('go');
    timer = setTimeout(openIntro, 4300);
  }
  var img = intro.querySelector('.logo-spin');
  if (img && img.decode) { img.decode().then(function () { requestAnimationFrame(go); }, go); }
  else { go(); }
  setTimeout(go, 1500);
  var skip = d.getElementById('skip');
  if (skip) skip.addEventListener('click', function (e) { e.stopPropagation(); openIntro(); });
  intro.addEventListener('click', openIntro);
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' || e.key === 'Enter') openIntro(); });
})();
