document.documentElement.classList.remove('no-js');

/* Mobile nav + search toggles */
function bindToggle(triggerSelector, panelId) {
  var triggers = document.querySelectorAll(triggerSelector);
  var panel = document.getElementById(panelId);
  if (!panel) return;
  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var isHidden = panel.hasAttribute('hidden');
      if (isHidden) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
      triggers.forEach(function (t) { t.setAttribute('aria-expanded', String(isHidden)); });
    });
  });
}
bindToggle('[data-mobile-nav-toggle]', 'MobileNav');
bindToggle('[data-search-toggle]', 'HeaderSearch');
bindToggle('[data-cart-toggle]', 'CartDrawer');

/* FAQ accordion */
document.querySelectorAll('[data-faq-toggle]').forEach(function (button) {
  button.addEventListener('click', function () {
    var answer = button.nextElementSibling;
    var expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    if (answer) {
      if (expanded) {
        answer.setAttribute('hidden', '');
      } else {
        answer.removeAttribute('hidden');
      }
    }
  });
});

/* Product gallery thumbnails */
(function () {
  var mainImage = document.getElementById('MainProductImage');
  var thumbs = document.querySelectorAll('[data-thumb]');
  if (!mainImage || !thumbs.length) return;
  thumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      mainImage.src = thumb.getAttribute('data-full-src');
      thumbs.forEach(function (t) { t.classList.remove('is-active'); });
      thumb.classList.add('is-active');
    });
  });
})();

/* Urgency countdown timer */
(function () {
  document.querySelectorAll('[data-countdown]').forEach(function (banner) {
    var minutes = parseInt(banner.getAttribute('data-countdown-minutes'), 10) || 60;
    var storageKey = 'countdown-' + window.location.pathname;
    var endTime = Number(sessionStorage.getItem(storageKey));
    if (!endTime || endTime < Date.now()) {
      endTime = Date.now() + minutes * 60 * 1000;
      sessionStorage.setItem(storageKey, String(endTime));
    }
    var timerEl = banner.querySelector('[data-countdown-timer]');
    if (!timerEl) return;
    function tick() {
      var remaining = Math.max(0, endTime - Date.now());
      var totalSeconds = Math.floor(remaining / 1000);
      var h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
      var m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
      var s = String(totalSeconds % 60).padStart(2, '0');
      timerEl.textContent = h + ':' + m + ':' + s;
      if (remaining <= 0) clearInterval(intervalId);
    }
    tick();
    var intervalId = setInterval(tick, 1000);
  });
})();

/* Variant selection: keep the hidden variant id select in sync with option pickers */
(function () {
  var form = document.getElementById('MainProductForm');
  if (!form) return;
  var optionSelectors = form.querySelectorAll('[data-option-selector]');
  var variantSelect = form.querySelector('[data-variant-id-select]');
  var addToCartBtn = form.querySelector('[data-add-to-cart]');
  if (!optionSelectors.length || !variantSelect) return;

  function currentOptionValues() {
    return Array.prototype.map.call(optionSelectors, function (select) { return select.value; }).join(',');
  }

  function syncVariant() {
    var values = currentOptionValues();
    var match = null;
    Array.prototype.forEach.call(variantSelect.options, function (option) {
      if (option.getAttribute('data-option-values') === values) match = option;
    });
    if (match) {
      variantSelect.value = match.value;
      if (addToCartBtn) addToCartBtn.removeAttribute('disabled');
    } else if (addToCartBtn) {
      addToCartBtn.setAttribute('disabled', '');
    }
  }

  optionSelectors.forEach(function (select) {
    select.addEventListener('change', syncVariant);
  });
})();

/* Add to cart via AJAX + open drawer, or fallback to full page submit */
(function () {
  var form = document.getElementById('MainProductForm');
  if (!form) return;
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var button = form.querySelector('[data-add-to-cart]');
    var textEl = button ? button.querySelector('[data-add-to-cart-text]') : null;
    var originalText = textEl ? textEl.textContent : null;
    if (button) button.setAttribute('disabled', '');
    if (textEl) textEl.textContent = 'Añadiendo…';

    fetch(window.Shopify && window.Shopify.routes ? window.Shopify.routes.root + 'cart/add.js' : '/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        id: form.querySelector('[data-variant-id-select]').value,
        quantity: form.querySelector('input[name="quantity"]').value
      })
    })
      .then(function (response) { return response.json(); })
      .then(function () { return fetch('/cart.js'); })
      .then(function (response) { return response.json(); })
      .then(function (cart) {
        document.querySelectorAll('[data-cart-count]').forEach(function (el) { el.textContent = cart.item_count; });
        var drawer = document.getElementById('CartDrawer');
        if (drawer) {
          drawer.removeAttribute('hidden');
        } else {
          window.location.href = '/cart';
        }
      })
      .catch(function () {
        form.submit();
      })
      .finally(function () {
        if (button) button.removeAttribute('disabled');
        if (textEl && originalText) textEl.textContent = originalText;
      });
  });
})();

/* Cart quantity / remove (drawer + cart page) */
(function () {
  function updateCartLine(line, quantity) {
    return fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ line: line, quantity: quantity })
    }).then(function () { window.location.reload(); });
  }

  document.querySelectorAll('[data-quantity-input]').forEach(function (input) {
    input.addEventListener('change', function () {
      updateCartLine(input.getAttribute('data-line'), input.value);
    });
  });

  document.querySelectorAll('[data-remove-item]').forEach(function (button) {
    button.addEventListener('click', function () {
      updateCartLine(button.getAttribute('data-line'), 0);
    });
  });
})();
