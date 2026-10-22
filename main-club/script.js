(function () {
  var root = document.querySelector('.shd-mclub');
  if (!root) return;
  var KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_referrer', 'gclid', 'yclid', 'fbclid', 'erid', 'from'];
  var STORE = 'walkwalk_utm', params = [], NB = '\u00a0';
  try {
    var q = new URLSearchParams(window.location.search);
    for (var k = 0; k < KEYS.length; k++) { var v = q.get(KEYS[k]); if (v) params.push([KEYS[k], v]); }
    if (params.length) sessionStorage.setItem(STORE, JSON.stringify(params));
    else params = JSON.parse(sessionStorage.getItem(STORE) || '[]');
  } catch (err) {}
  function withUtm(href) {
    if (!params.length || href.indexOf('walk-walk.ru') < 0) return href;
    try { var u = new URL(href); for (var i = 0; i < params.length; i++) if (!u.searchParams.has(params[i][0])) u.searchParams.set(params[i][0], params[i][1]); return u.toString(); } catch (e) { return href; }
  }
  function goal(name) { try { if (window.ym) window.ym(94057307, 'reachGoal', 'main-club-' + name); } catch (e) {} }
  var links = root.querySelectorAll('a[href*="walk-walk.ru"]');
  for (var l = 0; l < links.length; l++) links[l].setAttribute('href', withUtm(links[l].getAttribute('href')));
  var terms = root.querySelectorAll('.term'), cta = root.querySelector('#mcCta');
  function txt(id, t) { var el = root.querySelector('#' + id); if (el) el.textContent = t; }
  function select(btn) {
    for (var i = 0; i < terms.length; i++) {
      var on = terms[i] === btn;
      terms[i].classList.toggle('is-on', on);
      terms[i].setAttribute('aria-checked', on ? 'true' : 'false');
      terms[i].setAttribute('tabindex', on ? '0' : '-1');
    }
    txt('mcCtaTerm', btn.getAttribute('data-term').replace(' ', NB));
    txt('mcCtaPrice', btn.getAttribute('data-price').replace(' ', NB) + NB + '\u20bd');
    txt('mcInst', btn.getAttribute('data-inst').replace(/\B(?=(\d{3})+$)/, NB) + NB + '\u20bd');
    cta.setAttribute('href', withUtm(btn.getAttribute('data-href')));
    cta.setAttribute('data-goal', btn.getAttribute('data-goal'));
  }
  for (var s = 0; s < terms.length; s++) {
    terms[s].addEventListener('click', function () { select(this); });
    terms[s].addEventListener('keydown', function (e) {
      var list = Array.prototype.slice.call(terms), idx = list.indexOf(this), to = -1;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') to = (idx + 1) % list.length;
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') to = (idx - 1 + list.length) % list.length;
      if (to >= 0) { e.preventDefault(); select(list[to]); list[to].focus(); }
    });
  }
  var on = root.querySelector('.term.is-on'); if (on) select(on);
  root.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-goal]');
    if (a) goal(a === cta ? 'buy-' + a.getAttribute('data-goal') : a.getAttribute('data-goal'));
  });
})();
