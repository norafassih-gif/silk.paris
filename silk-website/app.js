(function () {
  var doc = document, root = doc.documentElement, body = doc.body;
  var done = false;
  function revealHero() {
    if (done) return; done = true;
    var els = doc.querySelectorAll('.hero .reveal');
    for (var i = 0; i < els.length; i++) els[i].classList.add('in');
  }
  doc.addEventListener('silk-intro-done', revealHero);
  doc.addEventListener('silk-intro-open', function () { setTimeout(revealHero, 700); });
  setTimeout(revealHero, 7000);

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
