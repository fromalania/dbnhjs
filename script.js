(function () {
  function loadCart() {
    try {
      return JSON.parse(localStorage.getItem('artCart') || '{"items":[],"total":0}');
    } catch (e) {
      return {items: [], total: 0};
    }
  }

  function saveCart(cart) {
    localStorage.setItem('artCart', JSON.stringify(cart));
  }

  function updateCartCount() {
    var cart = loadCart();
    var count = cart.items.reduce(function (sum, item) { return sum + item.qty; }, 0);
    var el = document.getElementById('cart-count');
    if (el) el.textContent = count;
  }

  function renderCartPage() {
    var cartItemsEl = document.getElementById('cart-items');
    var totalCountEl = document.getElementById('cart-total-count');
    var totalPriceEl = document.getElementById('cart-total-price');
    if (!cartItemsEl || !totalCountEl || !totalPriceEl) return;

    var cart = loadCart();
    if (!cart.items.length) {
      cartItemsEl.textContent = 'Корзина пока пуста. Добавьте товар из каталога.';
      totalCountEl.textContent = '0';
      totalPriceEl.textContent = '0 ₽';
      return;
    }

    var html = '<ul class="cart-list">';
    cart.items.forEach(function (item) {
      html += '<li>' + item.title + ' — ' + item.qty + ' шт. × ' + item.price + ' ₽</li>';
    });
    html += '</ul>';
    cartItemsEl.innerHTML = html;

    var count = cart.items.reduce(function (sum, item) { return sum + item.qty; }, 0);
    var sum = cart.items.reduce(function (s, item) { return s + item.qty * item.price; }, 0);

    totalCountEl.textContent = String(count);
    totalPriceEl.textContent = sum + ' ₽';

    var checkoutTotal = document.getElementById('checkout-total-price');
    if (checkoutTotal) checkoutTotal.textContent = sum + ' ₽';
  }

  function setupAddToCartButtons() {
    var buttons = document.querySelectorAll('.add-to-cart');
    if (!buttons.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cart = loadCart();
        var id = btn.getAttribute('data-product') || 'unknown';
        var price = parseInt(btn.getAttribute('data-price') || '0', 10) || 0;
        var titleEl = btn.closest('.product-card, .product-main');
        var title = 'Товар';
        if (titleEl) {
          var h = titleEl.querySelector('h1, h2, .product-title');
          if (h) title = h.textContent.trim();
        }

        var existing = cart.items.find(function (item) { return item.id === id; });
        if (existing) {
          existing.qty += 1;
        } else {
          cart.items.push({id: id, title: title, price: price, qty: 1});
        }
        saveCart(cart);
        updateCartCount();
        renderCartPage();
      });
    });
  }

  function setupCatalogFilters() {
    var toggle = document.querySelector('.catalog-filter-toggle');
    var filters = document.getElementById('catalog-filters');
    var grid = document.getElementById('product-grid');
    if (!grid) return;

    var searchInput = document.getElementById('search-input');
    var categorySelect = document.getElementById('category-filter');

    function applyFilters() {
      var search = (searchInput && searchInput.value.toLowerCase()) || '';
      var category = (categorySelect && categorySelect.value) || 'all';
      var cards = grid.querySelectorAll('.product-card');
      cards.forEach(function (card) {
        var name = (card.getAttribute('data-name') || '').toLowerCase();
        var cat = card.getAttribute('data-category') || 'all';
        var okCat = category === 'all' || category === cat;
        var okSearch = !search || name.indexOf(search) !== -1;
        card.style.display = okCat && okSearch ? '' : 'none';
      });
    }

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (categorySelect) categorySelect.addEventListener('change', applyFilters);

    if (toggle && filters) {
      toggle.addEventListener('click', function () {
        filters.classList.toggle('open');
      });
    }

    applyFilters();
  }

  function setupFeedbackForm() {
    var form = document.getElementById('feedback-form');
    var statusEl = document.getElementById('form-status');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (statusEl) {
        statusEl.textContent = 'Форма отправлена (учебный пример, данные никуда не уходят).';
      }
      form.reset();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    updateCartCount();
    renderCartPage();
    setupAddToCartButtons();
    setupCatalogFilters();
    setupFeedbackForm();
  });
})();
