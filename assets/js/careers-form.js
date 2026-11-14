(function () {
  'use strict';

  var CAREERS_EMAIL = 'info@neemahomecare.org';

  var form = document.getElementById('career-form');
  if (!form) return;
  var statusBox = document.getElementById('career-status');

  /* ------------------------------------------------------------------
   * submitApplication(data)
   * The ONE place that decides where application data goes.
   *
   * Current behavior (no backend): opens the applicant's email app with a
   * pre-filled message to CAREERS_EMAIL.
   *
   * To connect a real service later (Formspree, Netlify Forms, custom API),
   * replace the body and return a Promise that resolves on success:
   *
   *   return fetch('https://formspree.io/f/YOUR_FORM_ID', {
   *     method: 'POST',
   *     headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
   *     body: JSON.stringify(data)
   *   }).then(function (r) { if (!r.ok) throw new Error('Failed'); });
   * ------------------------------------------------------------------ */
  function submitApplication(data) {
    var none = '(not provided)';
    var lines = [
      'CAREGIVER APPLICATION',
      '',
      'Full legal name: ' + data.fullName,
      'Email: ' + data.email,
      'Phone: ' + data.phone,
      'City of residence: ' + data.city,
      'Years of experience: ' + (data.experience || none),
      'Preferred weekly hours: ' + (data.hours || none),
      '',
      'Credentials: ' + (data.credentials.join(', ') || none),
      'Preferred locations: ' + (data.locations.join(', ') || none),
      'Availability: ' + (data.availability.join(', ') || none),
      '',
      'Relevant experience:',
      data.summary || none,
      '',
      'Additional information:',
      data.extra || none,
      '',
      'Applicant confirmed their information may be reviewed for recruitment purposes.'
    ];
    var href = 'mailto:' + CAREERS_EMAIL +
      '?subject=' + encodeURIComponent('Caregiver application: ' + data.fullName) +
      '&body=' + encodeURIComponent(lines.join('\n'));
    window.location.href = href;
    return Promise.resolve();
  }

  var validators = {
    fullName: function (v) { return v.trim() ? '' : 'Please enter your full legal name.'; },
    email: function (v) {
      if (!v.trim()) return 'Please enter your email address.';
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address, like name@example.com.';
    },
    phone: function (v) {
      if (!v.trim()) return 'Please enter a phone number.';
      return v.replace(/\D/g, '').length >= 10 ? '' : 'Please enter a 10-digit phone number, for example (206) 555-0123.';
    },
    city: function (v) { return v.trim() ? '' : 'Please enter the city you live in.'; },
    consent: function (v) { return v ? '' : 'Please check this box to continue.'; }
  };

  function getValue(name) {
    var el = form.elements[name];
    if (!el) return '';
    if (el.type === 'checkbox') return el.checked ? 'yes' : '';
    return el.value;
  }

  function getChecked(name) {
    return Array.prototype.slice.call(form.querySelectorAll('input[name="' + name + '"]:checked'))
      .map(function (el) { return el.value; });
  }

  function fieldWrap(name) { return form.querySelector('[data-field="' + name + '"]'); }

  function setError(name, message) {
    var wrap = fieldWrap(name);
    if (!wrap) return;
    wrap.querySelector('.error-msg').textContent = message;
    wrap.classList.toggle('has-error', !!message);
    wrap.querySelectorAll('input, select, textarea').forEach(function (el) {
      if (message) el.setAttribute('aria-invalid', 'true');
      else el.removeAttribute('aria-invalid');
    });
  }

  function validateField(name) {
    var message = validators[name](getValue(name));
    setError(name, message);
    return !message;
  }

  Object.keys(validators).forEach(function (name) {
    var wrap = fieldWrap(name);
    if (!wrap) return;
    wrap.addEventListener('focusout', function () {
      if (getValue(name) || wrap.classList.contains('has-error')) validateField(name);
    });
    wrap.addEventListener('change', function () {
      if (wrap.classList.contains('has-error')) validateField(name);
    });
  });

  function showStatus(type, text) {
    statusBox.hidden = false;
    statusBox.className = 'form-status is-' + type;
    statusBox.textContent = text;
    statusBox.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    statusBox.hidden = true;

    var firstInvalid = null;
    Object.keys(validators).forEach(function (name) {
      if (!validateField(name) && !firstInvalid) firstInvalid = name;
    });
    if (firstInvalid) {
      var target = fieldWrap(firstInvalid).querySelector('input, select, textarea');
      if (target) target.focus();
      return;
    }

    var data = {
      fullName: getValue('fullName').trim(),
      email: getValue('email').trim(),
      phone: getValue('phone').trim(),
      city: getValue('city').trim(),
      experience: getValue('experience'),
      hours: getValue('hours').trim(),
      credentials: getChecked('credentials'),
      locations: getChecked('locations'),
      availability: getChecked('availability'),
      summary: getValue('summary').trim(),
      extra: getValue('extra').trim()
    };

    submitApplication(data).then(function () {
      showStatus('success', 'Thank you, ' + data.fullName + '. Your email app should now open with your application ready to send. If it does not, please email ' + CAREERS_EMAIL + ' or call (206) 474-7034.');
      form.reset();
    }).catch(function () {
      showStatus('error', 'Sorry, something went wrong. Please email ' + CAREERS_EMAIL + ' or call (206) 474-7034.');
    });
  });
})();
