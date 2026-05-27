(function () {
  'use strict';

  function parsePriceText(text) {
    if (!text) return 0;
    return parseFloat(text.replace(/[^\d.]/g, '')) || 0;
  }

  function updateBadge(priceEl) {
    // Remove any existing badge
    var prev = priceEl.previousElementSibling;
    if (prev && prev.classList.contains('lp-sale-badge')) {
      prev.remove();
    }

    var saleEl = priceEl.querySelector('.price-item--sale');
    var compareEl = priceEl.querySelector('.compare-at-price');

    if (!saleEl || !compareEl) return;

    // Horizon hides .compare-at-price when there's no sale via CSS display:none
    if (window.getComputedStyle(compareEl).display === 'none') return;

    var salePrice = parsePriceText(saleEl.textContent);
    var comparePrice = parsePriceText(compareEl.textContent);

    if (comparePrice <= 0 || salePrice <= 0 || comparePrice <= salePrice) return;

    var pct = Math.round(((comparePrice - salePrice) / comparePrice) * 100);
    if (pct <= 0) return;

    var badge = document.createElement('span');
    badge.className = 'lp-sale-badge';
    badge.textContent = '-' + pct + '% OFF';
    priceEl.insertAdjacentElement('beforebegin', badge);
  }

  function init() {
    var priceEl = document.querySelector('product-price');
    if (!priceEl) return;

    // Run on initial load
    updateBadge(priceEl);

    // Re-run whenever Horizon updates the price element (variant change)
    var observer = new MutationObserver(function () {
      updateBadge(priceEl);
    });

    observer.observe(priceEl, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
