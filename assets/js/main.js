(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Footer year */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* Mobile navigation */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('.nav-toggle-label').textContent = open ? 'Close' : 'Menu';
      nav.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    window.matchMedia('(min-width: 900px)').addEventListener('change', function (e) {
      if (e.matches) setOpen(false);
    });
  }

  /* Sticky header shadow */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Smooth scroll for in-page anchors (CSS handles most; this moves focus too) */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href').slice(1);
      var target = id && document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      if (history.pushState) history.pushState(null, '', '#' + id);
    });
  });

  /* FAQ accordion: enhances .faq-item markup (heading + .faq-answer) into accessible buttons */
  var chevron = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6"/></svg>';
  var faqButtons = [];
  document.querySelectorAll('.faq-item').forEach(function (item, i) {
    var heading = item.querySelector('h3');
    var answer = item.querySelector('.faq-answer');
    if (!heading || !answer) return;
    var qId = 'faq-q-' + (i + 1);
    var aId = 'faq-a-' + (i + 1);
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'faq-question';
    btn.id = qId;
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', aId);
    btn.innerHTML = '<span></span>' + chevron;
    btn.firstChild.textContent = heading.textContent;
    heading.textContent = '';
    heading.appendChild(btn);
    answer.id = aId;
    answer.setAttribute('role', 'region');
    answer.setAttribute('aria-labelledby', qId);
    answer.hidden = true;
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      answer.hidden = open;
    });
    btn.addEventListener('keydown', function (e) {
      var idx = faqButtons.indexOf(btn);
      var next = null;
      if (e.key === 'ArrowDown') next = faqButtons[(idx + 1) % faqButtons.length];
      else if (e.key === 'ArrowUp') next = faqButtons[(idx - 1 + faqButtons.length) % faqButtons.length];
      else if (e.key === 'Home') next = faqButtons[0];
      else if (e.key === 'End') next = faqButtons[faqButtons.length - 1];
      if (next) { e.preventDefault(); next.focus(); }
    });
    faqButtons.push(btn);
  });
})();
