/* ==========================================================================
   СТЕП С НУЛЯ — поведение страницы
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Проброс рекламных меток в ссылки оплаты ---------- */
  var KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'erid'];
  var DOMAIN = 'walk-walk.ru';
  var params = [];
  try {
    var q = new URLSearchParams(window.location.search);
    for (var i = 0; i < KEYS.length; i++) { var v = q.get(KEYS[i]); if (v) params.push([KEYS[i], v]); }
  } catch (err) {}

  function withUtm(href) {
    if (!params.length || !href || href.indexOf(DOMAIN) === -1) return href;
    try {
      var u = new URL(href, window.location.href);
      for (var i = 0; i < params.length; i++) if (!u.searchParams.has(params[i][0])) u.searchParams.set(params[i][0], params[i][1]);
      return u.toString();
    } catch (err) { return href; }
  }
  function decorate() {
    var links = document.querySelectorAll('a[href*="' + DOMAIN + '"]');
    for (var i = 0; i < links.length; i++) links[i].setAttribute('href', withUtm(links[i].getAttribute('href')));
  }
  decorate();
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href*="' + DOMAIN + '"]') : null;
    if (a) a.setAttribute('href', withUtm(a.getAttribute('href')));
  }, true);

  /* ---------- Цели Яндекс.Метрики (счётчик стоит на стороне сайта) ---------- */
  var METRIKA_ID = 94057307;
  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-goal]') : null;
    if (!el) return;
    try { if (typeof window.ym === 'function') window.ym(METRIKA_ID, 'reachGoal', 'step-' + el.getAttribute('data-goal')); } catch (err) {}
  });

  /* ---------- Срок клубного тарифа ----------
     Переключатель меняет цену, подпись и кнопку: на кнопке всегда написано,
     что именно покупается и за сколько. */
  var segs = document.querySelectorAll('.plan--best .seg__btn');
  var price = document.getElementById('clubPrice');
  var per = document.getElementById('clubPer');
  var cta = document.getElementById('clubCta');
  var ctaTerm = document.getElementById('clubCtaTerm');
  var ctaPrice = document.getElementById('clubCtaPrice');
  var NB = ' ';
  function monthsWord(n) { return n === 3 ? 'месяца' : 'месяцев'; }
  function select(btn) {
    for (var i = 0; i < segs.length; i++) {
      var on = segs[i] === btn;
      segs[i].classList.toggle('is-on', on);
      segs[i].setAttribute('aria-checked', on ? 'true' : 'false');
      segs[i].setAttribute('tabindex', on ? '0' : '-1');
    }
    var m = +btn.getAttribute('data-months');
    var p = btn.getAttribute('data-price').replace(' ', NB);
    var pm = btn.getAttribute('data-per').replace(' ', NB);
    if (price) price.textContent = p + NB + '₽';
    if (per) per.textContent = 'за' + NB + m + NB + monthsWord(m) + ' · ≈' + NB + pm + NB + '₽ в' + NB + 'месяц';
    if (ctaTerm) ctaTerm.textContent = m + NB + monthsWord(m);
    if (ctaPrice) ctaPrice.textContent = p + NB + '₽';
    if (cta) cta.setAttribute('href', withUtm(btn.getAttribute('data-href')));
  }
  for (var s = 0; s < segs.length; s++) {
    segs[s].addEventListener('click', function () { select(this); });
    segs[s].addEventListener('keydown', function (e) {
      var list = Array.prototype.slice.call(segs), idx = list.indexOf(this), to = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') to = (idx + 1) % list.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') to = (idx - 1 + list.length) % list.length;
      if (to > -1) { e.preventDefault(); select(list[to]); list[to].focus(); }
    });
  }
  var on = document.querySelector('.plan--best .seg__btn.is-on');
  if (on) select(on);

  /* ---------- Плавный переход по якорям (на Тильде scroll-behavior не доходит) ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var t = document.getElementById(a.getAttribute('href').slice(1));
    if (!t) return;
    e.preventDefault();
    var top = t.getBoundingClientRect().top + window.pageYOffset - 12;
    try { window.scrollTo({ top: top, behavior: 'smooth' }); } catch (err) { window.scrollTo(0, top); }
  });
})();
