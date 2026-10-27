(function () {
  'use strict';

  var BUSINESS_EMAIL = 'NEEMAHomeCare26@gmail.com';

  var form = document.getElementById('contact-form');
  if (!form) return;

  var statusBox = document.getElementById('form-status');

  /* ------------------------------------------------------------------
   * submitForm(data)
   * The ONE place that decides where form data goes.
   *
   * Current behavior (no backend): opens the visitor's email app with a
   * pre-filled message to the business email.
   *
   * To connect a real service later, replace the body of this function
   * and return a Promise that resolves on success / rejects on failure:
   *
   *   Formspree:
   *     return fetch('https://formspree.io/f/YOUR_FORM_ID', {
   *       method: 'POST',
   *       headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
   *       body: JSON.stringify(data)
   *     }).then(function (r) { if (!r.ok) throw new Error('Failed'); });
   *
   *   Netlify Forms: add data-netlify="true" and a hidden "form-name" input
   *   to the form, then POST URL-encoded data to "/" with fetch.
   *
   *   Custom API: fetch('/api/contact', { method: 'POST', ... }) the same way.
   * ------------------------------------------------------------------ */
  function submitForm(data) {
    var lines = [
      'Name: ' + data.name,
      'Phone: ' + data.phone,
      'Email: ' + data.email,
      'Who needs care: ' + data.whoNeedsCare,
      'Type of care needed: ' + data.careType,
      'Preferred contact method: ' + data.contactMethod,
      '',
      'Message:',
      data.message || '(none)'
    ];
    var subject = 'Care inquiry from ' + data.name;
    var href = 'mailto:' + BUSINESS_EMAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(lines.join('\n'));
    window.location.href = href;
    return Promise.resolve();
  }

  var validators = {
    name: function (v) { return v.trim() ? '' : 'Please enter your name.'; },
    phone: function (v) {
      if (!v.trim()) return 'Please enter a phone number.';
      return v.replace(/\D/g, '').length >= 10 ? '' : 'Please enter a 10-digit phone number, for example (206) 555-0123.';
    },
    email: function (v) {
      if (!v.trim()) return 'Please enter your email address.';
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address, like name@example.com.';
    },
    whoNeedsCare: function (v) { return v ? '' : 'Please choose who needs care.'; },
    careType: function (v) { return v ? '' : 'Please choose the type of care needed.'; },
    contactMethod: function (v) { return v ? '' : 'Please choose how you would like us to reach you.'; },
    consent: function (v) { return v ? '' : 'Please check the box so we know we may contact you.'; }
  };

  function getValue(name) {
    var els = form.elements[name];
    if (!els) return '';
    if (els.type === 'checkbox') return els.checked ? 'yes' : '';
    if (els.length && els[0] && els[0].type === 'radio') {
      for (var i = 0; i < els.length; i++) if (els[i].checked) return els[i].value;
      return '';
    }
    return els.value;
  }

  function fieldWrap(name) {
    return form.querySelector('[data-field="' + name + '"]');
  }

  function setError(name, message) {
    var wrap = fieldWrap(name);
    if (!wrap) return;
    var msg = wrap.querySelector('.error-msg');
    msg.textContent = message;
    wrap.classList.toggle('has-error', !!message);
    var inputs = wrap.querySelectorAll('input, select, textarea');
    inputs.forEach(function (el) {
      if (message) el.setAttribute('aria-invalid', 'true');
      else el.removeAttribute('aria-invalid');
    });
  }

  function validateField(name) {
    var message = validators[name](getValue(name));
    setError(name, message);
    return !message;
  }

  function validateAll() {
    var firstInvalid = null;
    Object.keys(validators).forEach(function (name) {
      if (!validateField(name) && !firstInvalid) firstInvalid = name;
    });
    return firstInvalid;
  }

  function showStatus(type, text) {
    statusBox.hidden = false;
    statusBox.className = 'form-status is-' + type;
    statusBox.textContent = text;
    statusBox.focus();
  }

  Object.keys(validators).forEach(function (name) {
    var wrap = fieldWrap(name);
    if (!wrap) return;
    wrap.addEventListener('focusout', function (e) {
      // Wait until focus leaves the whole field (matters for radio groups).
      if (wrap.contains(e.relatedTarget)) return;
      if (getValue(name) || wrap.classList.contains('has-error')) validateField(name);
    });
    wrap.addEventListener('change', function () {
      if (wrap.classList.contains('has-error')) validateField(name);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    statusBox.hidden = true;

    var firstInvalid = validateAll();
    if (firstInvalid) {
      var wrap = fieldWrap(firstInvalid);
      var target = wrap.querySelector('input, select, textarea');
      if (target) target.focus();
      return;
    }

    var data = {
      name: getValue('name').trim(),
      phone: getValue('phone').trim(),
      email: getValue('email').trim(),
      whoNeedsCare: getValue('whoNeedsCare'),
      careType: getValue('careType'),
      contactMethod: getValue('contactMethod'),
      message: getValue('message').trim()
    };

    submitForm(data).then(function () {
      showStatus('success', 'Thank you, ' + data.name + '. Your email app should now open with your message ready to send. If it does not, please email ' + BUSINESS_EMAIL + ' or call (206) 474-7034.');
      form.reset();
    }).catch(function () {
      showStatus('error', 'Sorry, something went wrong. Please call (206) 474-7034 or email ' + BUSINESS_EMAIL + '.');
    });
  });
})();
