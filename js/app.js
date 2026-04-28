/**
 * app.js - Main Application Logic
 * Initializes all modules and manages product data
 */

// Product Data Fallback
const productsFallback = [
  {
    id: 1,
    name_ar: "توتِّي",
    name_en: "TOTTI",
    desc_ar:
      "عطر خشبي زهري فاخر بلمسة عصرية، يفتتح بانتعاش البرغموت وزهر البرتقال، ويستقر على قاعدة دافئة من الأخشاب والباتشولي ولمسة مسكية جذابة.",
    desc_en:
      "A refined woody floral fragrance with a modern opening of bergamot and orange blossom, settling into warm woods, patchouli, and an alluring musky trail.",
    notes_ar: "البرغموت • زهر البرتقال • الأخشاب الدافئة • الباتشولي • المسك",
    notes_en: "Bergamot • Orange Blossom • Warm Woods • Patchouli • Musk",
    price: 299,
    originalPrice: 349,
    image: "images/totti.png",
    sizes: ["50 ml"],
    prices: { "50 ml": 299 },
  },
  {
    id: 2,
    name_ar: "بسيوني",
    name_en: "Basiony",
    desc_ar:
      "عطر فاخر يلتقي فيه انتعاش الكمثرى واللافندر بحرارة القرفة، ثم يذوب في سحابة دافئة ولذيذة من الكراميل والفانيليا والعسل لحضور جذاب يدوم طويلاً.",
    desc_en:
      "A luxurious fragrance where fresh pear and lavender meet the warmth of cinnamon, then melt into a rich trail of caramel, vanilla, and honey for a lasting captivating presence.",
    notes_ar: "الكمثرى • اللافندر • القرفة • الكراميل • الفانيليا • العسل",
    notes_en: "Pear • Lavender • Cinnamon • Caramel • Vanilla • Honey",
    price: 299,
    originalPrice: 349,
    image: "images/basiony.png",
    sizes: ["50 ml"],
    prices: { "50 ml": 299 },
  },
  {
    id: 3,
    name_ar: "الفؤاد",
    name_en: "Al-Fouad",
    desc_ar:
      "عطر فاخر يجمع انتعاش المريمية بحدة الزنجبيل ولمسة توابل دافئة، قبل أن يستقر على فيتيفر مدخن يمنحك حضوراً رجولياً غامضاً يدوم طويلاً.",
    desc_en:
      "A refined scent blending the freshness of sage with sharp ginger and warm spices, settling into smoky vetiver for a bold, masculine presence that lasts.",
    notes_ar: "المريمية • الزنجبيل • التوابل الدافئة • الفيتيفر • الأخشاب المدخنة",
    notes_en: "Sage • Ginger • Warm Spices • Vetiver • Smoky Woods",
    price: 299,
    originalPrice: 349,
    image: "images/al-fouad.png",
    sizes: ["50 ml"],
    prices: { "50 ml": 299 },
  },
];

let products = productsFallback;

// ===== App Initialization =====
document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelector(".modal-product-notes-label")
    ?.setAttribute("data-i18n", "product_notes_label");

  // Init core display modules immediately
  i18n.init();
  notificationSystem.init();
  cart.init();
  animations.init();

  // Setup basic event listeners
  setupNavigation();
  setupLanguageToggle();
  setupCartDrawer();
  setupAuthModal();
  setupProductCards(); // Render fallback items visually immediately
  setupOrderModal();
  setupContactForm();
  setupMobileMenu();

  // Reveal page immediately to prevent any perceived slowness or blank screen
  document.body.classList.add("loaded");
  setTimeout(() => animations.setupProductTilt(), 300);

  // Background Database and Authentication Loading
  if (window.supabaseClient) {
    // Auth init (takes time)
    if (window.auth) {
      window.auth.init().catch(err => console.error("Auth init async error:", err));
    }
    
    // Fetch products in background, then update UI silently
    window.supabaseClient.from('products').select('*')
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          products = data;
          renderProducts(); // Refresh products with real data
        }
      })
      .catch(err => console.error("Supabase products background fetch error:", err));
  }
});

// ===== Navigation =====
function setupNavigation() {
  // Highlight active nav link on scroll
  const sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY + 100;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          link.classList.add("nav-active");
        } else {
          link.classList.remove("nav-active");
        }
      }
    });
  });
}

// ===== Language Toggle =====
function setupLanguageToggle() {
  const toggleBtn = document.getElementById("lang-toggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      // Add transition class
      document.body.classList.add("lang-transitioning");
      setTimeout(() => {
        i18n.toggleLanguage();
        // Re-render dynamic content
        updateDynamicContent();
        setTimeout(() => {
          document.body.classList.remove("lang-transitioning");
        }, 300);
      }, 150);
    });
  }
}

function updateDynamicContent() {
  // Re-render product cards
  renderProducts();
  // Re-render cart if open
  if (cart.isOpen) cart.renderCartItems();
  // Update auth UI
  if (window.auth) auth.updateUI();
}

function getDiscountPercentage(currentPrice, originalPrice) {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

function getProductPriceMarkup(product, price = product.price) {
  const originalPrice = product.originalPrice;
  const currency = i18n.t("product_currency");

  if (!originalPrice || originalPrice <= price) {
    return `<span class="product-price-tag">${price} <small>${currency}</small></span>`;
  }

  return `
    <div class="product-price-block">
      <span class="product-price-old">${originalPrice} <small>${currency}</small></span>
      <span class="product-price-tag">${price} <small>${currency}</small></span>
    </div>
  `;
}

function getModalPriceMarkup(product, price = product.price) {
  const originalPrice = product.originalPrice;
  const currency = i18n.t("product_currency");

  if (!originalPrice || originalPrice <= price) {
    return `<span class="modal-price-current">${price} ${currency}</span>`;
  }

  return `
    <span class="modal-price-old">${originalPrice} ${currency}</span>
    <span class="modal-price-current">${price} ${currency}</span>
  `;
}

// ===== Product Cards =====
function renderProducts() {
  const container = document.getElementById("products-grid");
  if (!container) return;
  const lang = i18n.getCurrentLang();

  container.innerHTML = products
    .map(
      (product, index) => {
        const discountPercentage = getDiscountPercentage(product.price, product.originalPrice);
        const sizesArray = product.sizes ? product.sizes : ["50 ml"];
        const sizeLabel = sizesArray[0] || "50 ml";

        return `
    <div class="product-card reveal-on-scroll" style="animation-delay: ${index * 0.08}s">
      <div class="product-image-wrapper">
        <div class="product-badges">
          <span class="product-badge product-badge-size">${sizeLabel}</span>
          ${discountPercentage > 0 ? `<span class="product-badge product-badge-discount">-${discountPercentage}%</span>` : ""}
        </div>
        <img src="${product.image}" alt="${lang === "ar" ? product.name_ar : product.name_en}" class="product-image">
        <div class="product-overlay">
          <button class="btn-product-detail ripple-btn" onclick="openProductModal(${product.id})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <span>${i18n.t("product_details")}</span>
          </button>
        </div>
      </div>
      <div class="product-info">
        <h3 class="product-name">${lang === "ar" ? product.name_ar : product.name_en}</h3>
        <p class="product-notes">${lang === "ar" ? product.notes_ar : product.notes_en}</p>
        <div class="product-bottom">
          ${getProductPriceMarkup(product)}
          <button class="btn-add-cart ripple-btn" onclick="addToCart(${product.id})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
            <span>${i18n.t("product_add_cart")}</span>
          </button>
        </div>
      </div>
    </div>
  `;
      }
    )
    .join("");

  // Re-observe new elements and re-setup tilt
  document.querySelectorAll(".product-card.reveal-on-scroll").forEach((el) => {
    if (animations.observer) animations.observer.observe(el);
  });
  animations.setupProductTilt();
}

function setupProductCards() {
  renderProducts();
}

// ===== Add to Cart =====
function addToCart(productId, size = "50 ml") {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const pricesObj = product.prices || {};
  const price = pricesObj[size] || product.price;
  cart.addItem({ ...product, price }, size);
}

// ===== Product Detail Modal =====
function openProductModal(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const lang = i18n.getCurrentLang();
  const modal = document.getElementById("product-modal");
  const overlay = document.getElementById("product-overlay");

  document.getElementById("modal-product-image").src = product.image;
  document.getElementById("modal-product-name").textContent =
    lang === "ar" ? product.name_ar : product.name_en;
  document.getElementById("modal-product-desc").textContent =
    lang === "ar" ? product.desc_ar : product.desc_en;
  document.getElementById("modal-product-notes").textContent =
    lang === "ar" ? product.notes_ar : product.notes_en;

  // Size selector
  const sizeContainer = document.getElementById("modal-size-selector");
  const sizesArray = product.sizes ? product.sizes : ["50 ml"];
  const pricesObj = product.prices || {};

  sizeContainer.innerHTML = sizesArray
    .map(
      (s, i) => `
    <button class="size-btn ${i === 0 ? "active" : ""}" data-size="${s}" data-price="${pricesObj[s] || product.price}" onclick="selectSize(this, ${product.id})">
      ${s}
    </button>
  `
    )
    .join("");

  // Price
  document.getElementById("modal-product-price").innerHTML = getModalPriceMarkup(product);

  // Reset quantity
  document.getElementById("modal-quantity").textContent = "1";

  modal.classList.add("modal-open");
  overlay.classList.add("overlay-visible");
  document.body.style.overflow = "hidden";
}

function closeProductModal() {
  const modal = document.getElementById("product-modal");
  const overlay = document.getElementById("product-overlay");
  modal.classList.remove("modal-open");
  overlay.classList.remove("overlay-visible");
  document.body.style.overflow = "";
}

function selectSize(btn, productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  document.querySelectorAll(".size-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");

  const price = Number(btn.dataset.price);
  document.getElementById("modal-product-price").innerHTML = getModalPriceMarkup(product, price);
}

function changeModalQuantity(delta) {
  const el = document.getElementById("modal-quantity");
  let qty = parseInt(el.textContent) + delta;
  if (qty < 1) qty = 1;
  if (qty > 10) qty = 10;
  el.textContent = qty;
}

function addToCartFromModal() {
  const activeSize = document.querySelector(".size-btn.active");
  const size = activeSize ? activeSize.dataset.size : "50 ml";
  const qty = parseInt(document.getElementById("modal-quantity").textContent);
  const productName = document.getElementById("modal-product-name").textContent;

  // Find product by name
  const lang = i18n.getCurrentLang();
  const product = products.find(
    (p) => (lang === "ar" ? p.name_ar : p.name_en) === productName
  );

  if (product) {
    const price = activeSize ? parseInt(activeSize.dataset.price) : product.price;
    cart.addItem({ ...product, price }, size, qty);
    closeProductModal();
  }
}

// ===== Cart Drawer =====
function setupCartDrawer() {
  const cartBtn = document.getElementById("cart-icon-btn");
  const closeBtn = document.getElementById("cart-close-btn");
  const overlay = document.getElementById("cart-overlay");
  const clearBtn = document.getElementById("cart-clear-btn");
  const checkoutBtn = document.getElementById("cart-checkout-btn");
  const continueBtn = document.getElementById("cart-continue-btn");

  cartBtn?.addEventListener("click", () => cart.toggleDrawer());
  closeBtn?.addEventListener("click", () => cart.toggleDrawer());
  overlay?.addEventListener("click", () => {
    if (cart.isOpen) cart.toggleDrawer();
  });
  clearBtn?.addEventListener("click", () => cart.clearCart());
  checkoutBtn?.addEventListener("click", () => {
    cart.toggleDrawer();
    openOrderModal();
  });
  continueBtn?.addEventListener("click", () => cart.toggleDrawer());
}

// ===== Order Modal =====
function setupOrderModal() {
  const cancelBtn = document.getElementById("order-cancel-btn");
  const overlay = document.getElementById("order-overlay");

  cancelBtn?.addEventListener("click", closeOrderModal);
  overlay?.addEventListener("click", closeOrderModal);

  const form = document.getElementById("order-form");
  form?.addEventListener("submit", handleOrderSubmit);
}

function openOrderModal() {
  if (cart.items.length === 0) {
    notificationSystem.warning(i18n.t("notif_cart_empty_order"));
    return;
  }

  const modal = document.getElementById("order-modal");
  const overlay = document.getElementById("order-overlay");

  // Render order summary
  const summaryContainer = document.getElementById("order-summary-items");
  const lang = i18n.getCurrentLang();

  summaryContainer.innerHTML = cart.items
    .map(
      (item) => `
    <div class="order-summary-item">
      <span>${lang === "ar" ? item.name_ar : item.name_en} × ${item.quantity}</span>
      <span>${item.price * item.quantity} ${i18n.t("product_currency")}</span>
    </div>
  `
    )
    .join("");

  document.getElementById("order-total-amount").textContent = `${cart.getTotal()} ${i18n.t("product_currency")}`;

  // Pre-fill if logged in
  if (window.auth && window.auth.isLoggedIn()) {
    document.getElementById("order-name").value = window.auth.currentUser.name || "";
    document.getElementById("order-phone").value = window.auth.currentUser.phone || "";
  }

  modal.classList.add("modal-open");
  overlay.classList.add("overlay-visible");
  document.body.style.overflow = "hidden";
}

function closeOrderModal() {
  const modal = document.getElementById("order-modal");
  const overlay = document.getElementById("order-overlay");
  const successView = document.getElementById("order-success");
  const formView = document.getElementById("order-form-view");

  modal.classList.remove("modal-open");
  overlay.classList.remove("overlay-visible");
  document.body.style.overflow = "";

  // Reset views
  setTimeout(() => {
    if (successView) successView.style.display = "none";
    if (formView) formView.style.display = "block";
  }, 300);
}

async function handleOrderSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("order-name").value.trim();
  const phone = document.getElementById("order-phone").value.trim();
  const address = document.getElementById("order-address").value.trim();
  const city = document.getElementById("order-city").value.trim();
  const notes = document.getElementById("order-notes")?.value.trim() || "";

  if (!name || !phone || !address || !city) {
    notificationSystem.warning(i18n.t("notif_fill_fields"));
    return;
  }

  try {
    const total = cart.getTotal();
    const user_id = window.auth && window.auth.currentUser ? window.auth.currentUser.id : null;
    
    // 1. Insert Order Status
    const { data: orderData, error: orderError } = await window.supabaseClient
      .from('orders')
      .insert([{
        user_id,
        customer_name: name,
        phone,
        address,
        city,
        notes,
        total,
        status: 'pending'
      }])
      .select();
      
    if (orderError) throw orderError;
    const orderId = orderData[0].id;
    
    // 2. Insert Order Items
    const orderItems = cart.items.map(item => ({
      order_id: orderId,
      product_id: item.id,
      size: item.size,
      quantity: item.quantity,
      price: item.price
    }));
    
    if (orderItems.length > 0) {
      const { error: itemsError } = await window.supabaseClient
        .from('order_items')
        .insert(orderItems);
        
      if (itemsError) throw itemsError;
    }

    // 3. Send WhatsApp notification with order details
    const itemsList = cart.items.map((item, i) => {
      const itemName = item.name_ar || item.name_en;
      return `  ${i + 1}. ${itemName} | ${item.size} | ×${item.quantity} | ${item.price * item.quantity} جنيه`;
    }).join('\n');

    const whatsappMsg = 
`🛒 *طلب جديد #${orderId}*
━━━━━━━━━━━━━━━
👤 *الاسم:* ${name}
📞 *الهاتف:* ${phone}
🏙️ *المدينة:* ${city}
📍 *العنوان:* ${address}
${notes ? `📝 *ملاحظات:* ${notes}` : ''}
━━━━━━━━━━━━━━━
📦 *المنتجات:*
${itemsList}
━━━━━━━━━━━━━━━
💰 *الإجمالي:* ${total} جنيه
━━━━━━━━━━━━━━━`;

    const whatsappUrl = `https://wa.me/201558118597?text=${encodeURIComponent(whatsappMsg)}`;
    window.open(whatsappUrl, '_blank');

    // Show success
    const successView = document.getElementById("order-success");
    const formView = document.getElementById("order-form-view");

    if (formView) formView.style.display = "none";
    if (successView) successView.style.display = "flex";

    // Animate checkmark
    setTimeout(() => {
      successView?.querySelector(".success-checkmark")?.classList.add("animate");
    }, 100);

    // Clear cart and notify
    cart.items = [];
    cart.saveToStorage();
    cart.updateBadge();
    notificationSystem.success(i18n.t("notif_order_placed"));

    // Reset form
    document.getElementById("order-form").reset();

  } catch (err) {
    console.error("Order submit error:", err);
    notificationSystem.error(i18n.t("notif_login_error") || "حدث خطأ أثناء إرسال الطلب. حاول مجدداً.");
  }
}

// ===== Auth Modal =====
function setupAuthModal() {
  if (!window.auth) return;
  const loginBtn = document.getElementById("auth-login-btn");
  const overlay = document.getElementById("auth-overlay");
  const closeBtn = document.getElementById("auth-close-btn");
  const loginTabBtn = document.getElementById("login-tab-btn");
  const registerTabBtn = document.getElementById("register-tab-btn");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const googleLoginBtn = document.getElementById("google-login-btn");
  const googleRegisterBtn = document.getElementById("google-register-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const switchToRegister = document.getElementById("switch-to-register");
  const switchToLogin = document.getElementById("switch-to-login");

  loginBtn?.addEventListener("click", () => auth.openModal("login"));
  overlay?.addEventListener("click", () => auth.closeModal());
  closeBtn?.addEventListener("click", () => auth.closeModal());

  loginTabBtn?.addEventListener("click", () => auth.switchTab("login"));
  registerTabBtn?.addEventListener("click", () => auth.switchTab("register"));

  loginForm?.addEventListener("submit", (e) => auth.handleLoginSubmit(e));
  registerForm?.addEventListener("submit", (e) => auth.handleRegisterSubmit(e));

  googleLoginBtn?.addEventListener("click", () => auth.loginWithGoogle());
  googleRegisterBtn?.addEventListener("click", () => auth.loginWithGoogle());

  logoutBtn?.addEventListener("click", () => auth.logout());

  switchToRegister?.addEventListener("click", (e) => {
    e.preventDefault();
    auth.switchTab("register");
  });
  switchToLogin?.addEventListener("click", (e) => {
    e.preventDefault();
    auth.switchTab("login");
  });
}

// ===== Contact Form =====
function setupContactForm() {
  const form = document.getElementById("contact-form");
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const name = form.querySelector('input[type="text"]')?.value.trim();
    const email = form.querySelector('input[type="email"]')?.value.trim();
    const message = form.querySelector('textarea')?.value.trim();
    
    if (!name || !email || !message) {
      notificationSystem.warning(i18n.t("notif_fill_fields"));
      return;
    }

    try {
      const { error } = await window.supabaseClient.from('contact_messages').insert([{
        name, email, message
      }]);
      
      if (error) throw error;
      
      notificationSystem.success(i18n.t("notif_contact_sent"));
      form.reset();
    } catch (err) {
      console.error("Contact form error:", err);
      notificationSystem.error(i18n.t("notif_login_error") || "حدث خطأ أثناء إرسال رسالتك.");
    }
  });
}

// ===== Mobile Menu =====
function setupMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");

  hamburger?.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    mobileMenu.classList.toggle("mobile-menu-open");
  });

  // Close menu on link click
  mobileMenu?.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      mobileMenu.classList.remove("mobile-menu-open");
    });
  });
}
