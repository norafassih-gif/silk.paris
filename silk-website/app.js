(function () {
  var doc = document, root = doc.documentElement, body = doc.body;
  var intro = doc.getElementById('intro');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var openTimer = null, closed = false;

  function revealHero() {
    var els = doc.querySelectorAll('.hero .reveal');
    for (var i = 0; i < els.length; i++) els[i].classList.add('in');
  }

  function finish() {
    if (closed) return; closed = true;
    if (intro) intro.parentNode.removeChild(intro);
    body.classList.remove('intro-lock');
    revealHero();
  }

  function openIntro() {
    if (!intro || closed) return;
    clearTimeout(openTimer);
    intro.classList.add('open');
    setTimeout(revealHero, 700);
    setTimeout(finish, 1750);
  }

  var seen = false;
  try { seen = sessionStorage.getItem('silkIntro') === '1'; } catch (e) {}
  var skipNow = !intro || reduce || seen || location.hash.length > 1;

  if (skipNow) {
    finish();
  } else {
    body.classList.add('intro-lock');
    openTimer = setTimeout(openIntro, 4800);
    try { sessionStorage.setItem('silkIntro', '1'); } catch (e) {}
    var skip = doc.getElementById('skip');
    if (skip) skip.addEventListener('click', function (e) { e.stopPropagation(); openIntro(); });
    intro.addEventListener('click', openIntro);
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' || e.key === 'Enter') openIntro(); });
  }

  /* apparition au scroll */
  var rev = doc.querySelectorAll('.sec .reveal, .res .reveal, .sec-head, .item');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    for (var r = 0; r < rev.length; r++) { rev[r].classList.add('reveal'); io.observe(rev[r]); }
  } else {
    for (var q = 0; q < rev.length; q++) rev[q].classList.add('in');
  }

  /* pastille active dans la barre des catégories */
  var chips = doc.querySelectorAll('.chips a[href^="#"]');
  var map = {};
  for (var c = 0; c < chips.length; c++) map[chips[c].getAttribute('href').slice(1)] = chips[c];
  var secs = [];
  for (var k in map) { var s = doc.getElementById(k); if (s) secs.push(s); }
  function mark() {
    var y = window.scrollY + 140, cur = null;
    for (var i = 0; i < secs.length; i++) if (secs[i].offsetTop <= y) cur = secs[i].id;
    for (var id in map) map[id].classList.toggle('on', id === cur);
    if (cur && map[cur] && map[cur].scrollIntoView && map[cur].parentNode.scrollWidth > map[cur].parentNode.clientWidth) {
      var p = map[cur].parentNode, el = map[cur];
      p.scrollTo({ left: el.offsetLeft - p.clientWidth / 2 + el.clientWidth / 2, behavior: 'smooth' });
    }
  }
  var tk = false;
  window.addEventListener('scroll', function () {
    if (tk) return; tk = true;
    requestAnimationFrame(function () { mark(); tk = false; });
  }, { passive: true });
  mark();
})();
