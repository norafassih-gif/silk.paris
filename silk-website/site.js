/* SILK PARIS - scripts du site */
(function () {
  'use strict';

  /* ---------- Menu burger (mobile) ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Réservation : pas de date passée ---------- */
  var date = document.getElementById('resa-date');
  if (date) {
    var d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    date.min = d.toISOString().slice(0, 10);
  }

  /* ---------- Carrousel desserts ----------
     Pour changer les desserts : remplacer les fichiers
     images/desserts/dessert-1.webp, dessert-2.webp, dessert-3.webp.
     Une photo absente est simplement retirée du carrousel. */
  document.querySelectorAll('[data-carousel]').forEach(function (root) {
    var track = root.querySelector('.carousel-track');
    var dotsBox = root.querySelector('.carousel-dots');
    var prev = root.querySelector('.prev');
    var next = root.querySelector('.next');
    var rtl = document.documentElement.dir === 'rtl';
    var index = 0;
    var timer = null;

    function slides() { return Array.prototype.slice.call(track.querySelectorAll('.carousel-slide')); }

    function build() {
      var list = slides();
      if (!list.length) { root.closest('section').classList.add('desserts-empty'); return; }
      dotsBox.innerHTML = '';
      list.forEach(function (_, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', String(i + 1));
        b.addEventListener('click', function () { go(i); restart(); });
        dotsBox.appendChild(b);
      });
      root.classList.toggle('single', list.length < 2);
      if (index >= list.length) index = 0;
      go(index);
    }

    function go(i) {
      var list = slides();
      if (!list.length) return;
      index = (i + list.length) % list.length;
      // En arabe (RTL) les diapositives défilent dans l'autre sens
      track.style.transform = 'translateX(' + (rtl ? 1 : -1) * index * 100 + '%)';
      list.forEach(function (s, n) { s.setAttribute('aria-hidden', n === index ? 'false' : 'true'); });
      Array.prototype.forEach.call(dotsBox.children, function (dot, n) {
        dot.setAttribute('aria-current', n === index ? 'true' : 'false');
      });
    }

    function restart() {
      clearInterval(timer);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      timer = setInterval(function () { if (slides().length > 1) go(index + 1); }, 5000);
    }

    // Photo manquante : on retire la diapositive
    slides().forEach(function (s) {
      var img = s.querySelector('img');
      img.addEventListener('error', function () { s.remove(); build(); });
    });

    prev.addEventListener('click', function () { go(index - 1); restart(); });
    next.addEventListener('click', function () { go(index + 1); restart(); });

    // Glisser au doigt
    var x0 = null;
    track.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      x0 = null;
      if (Math.abs(dx) < 40) return;
      var forward = rtl ? dx > 0 : dx < 0;
      go(index + (forward ? 1 : -1));
      restart();
    }, { passive: true });

    root.addEventListener('mouseenter', function () { clearInterval(timer); });
    root.addEventListener('mouseleave', restart);

    build();
    restart();
  });
})();
