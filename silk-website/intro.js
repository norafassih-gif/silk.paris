(function () {
  var d = document, root = d.documentElement, intro = d.getElementById('intro');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var closed = false, timer = null;
  function finish() {
    if (closed) return; closed = true;
    if (intro && intro.parentNode) intro.parentNode.removeChild(intro);
    root.classList.remove('intro-lock');
  }
  function openIntro() {
    if (!intro || closed) return;
    clearTimeout(timer);
    intro.classList.add('open');
    setTimeout(finish, 1750);
  }
  var seen = false;
  try { seen = sessionStorage.getItem('silkIntro') === '1'; } catch (e) {}
  if (!intro || reduce || seen || location.hash.length > 1) { finish(); return; }
  try { sessionStorage.setItem('silkIntro', '1'); } catch (e) {}
  timer = setTimeout(openIntro, 4800);
  var skip = d.getElementById('skip');
  if (skip) skip.addEventListener('click', function (e) { e.stopPropagation(); openIntro(); });
  intro.addEventListener('click', openIntro);
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape' || e.key === 'Enter') openIntro(); });
})();
