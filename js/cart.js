/**
 * cart.js - Shopping Cart Management
 * Full cart CRUD with localStorage persistence
 */

class ShoppingCart {
  constructor() {
    this.items = [];
    this.isOpen = false;
    this.listeners = [];
  }

  init() {
    this.loadFromStorage();
    this.updateBadge();
  }

  loadFromStorage() {
    try {
      const data = localStorage.getItem("alsalahy_cart");
      if (data) {
        this.items = JSON.parse(data);
      }
    } catch (e) {
      this.items = [];
    }
  }

  saveToStorage() {
    localStorage.setItem("alsalahy_cart", JSON.stringify(this.items));
    this.saveToSupabase();
  }

  async saveToSupabase() {
    if (window.auth && window.auth.isLoggedIn()) {
      try {
        const { error } = await window.supabaseClient
          .from('users')
          .update({ cart: this.items })
          .eq('id', window.auth.currentUser.id);
        
        if (error) console.error("Error saving cart to Supabase:", error);
      } catch (e) {
        console.error("Cart Supabase error:", e);
      }
    }
  }

  async loadFromSupabase() {
    if (window.auth && window.auth.isLoggedIn()) {
      try {
        const { data, error } = await window.supabaseClient
          .from('users')
          .select('cart')
          .eq('id', window.auth.currentUser.id)
          .single();
        
        if (!error && data && data.cart) {
          // Merge or replace? User expects their saved cart. 
          // Let's merge for a better experience, or replace if current is empty.
          if (this.items.length === 0) {
            this.items = data.cart;
          } else {
            // Simple merge logic: add only items not already in cart
            data.cart.forEach(savedItem => {
              const exists = this.items.some(i => i.id === savedItem.id && i.size === savedItem.size);
              if (!exists) this.items.push(savedItem);
            });
          }
          this.saveToStorage();
          this.updateBadge();
          this.notifyListeners();
        }
      } catch (e) {
        console.error("Cart load Supabase error:", e);
      }
    }
  }

  setupRealtime() {
    if (window.auth && window.auth.isLoggedIn()) {
      const userId = window.auth.currentUser.id;
      
      // Remove previous subscription if any
      if (this.subscription) {
        window.supabaseClient.removeChannel(this.subscription);
      }

      this.subscription = window.supabaseClient
        .channel(`user-cart-${userId}`)
        .on(
          'postgres_changes',
          { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'users', 
            filter: `id=eq.${userId}` 
          },
          (payload) => {
            if (payload.new && payload.new.cart) {
              const newCart = payload.new.cart;
              // Check if actual content changed to avoid infinite loops or unnecessary renders
              if (JSON.stringify(this.items) !== JSON.stringify(newCart)) {
                this.items = newCart;
                localStorage.setItem("alsalahy_cart", JSON.stringify(this.items));
                this.updateBadge();
                this.notifyListeners();
                console.log("Cart synced in real-time from database.");
              }
            }
          }
        )
        .subscribe();
    }
  }

  addItem(product, size = "50 ml", quantity = 1) {
    const existingIndex = this.items.findIndex(
      (item) => item.id === product.id && item.size === size
    );

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name_ar: product.name_ar,
        name_en: product.name_en,
        price: product.price,
        image: product.image,
        size: size,
        quantity: quantity,
      });
    }

    this.saveToStorage();
    this.updateBadge();
    this.notifyListeners();

    // Show notification
    const name =
      i18n.getCurrentLang() === "ar" ? product.name_ar : product.name_en;
    notificationSystem.success(i18n.t("notif_added"));

    // Animate badge
    this.animateBadge();

    return true;
  }

  removeItem(id, size) {
    const index = this.items.findIndex(item => item.id === id && item.size === size);
    if (index > -1) {
      this.items.splice(index, 1);
      this.saveToStorage();
      this.updateBadge();
      this.notifyListeners();
      notificationSystem.warning(i18n.t("notif_removed"));
    }
  }

  updateQuantity(id, size, newQuantity) {
    const index = this.items.findIndex(item => item.id === id && item.size === size);
    if (index > -1) {
      if (newQuantity <= 0) {
        this.removeItem(id, size);
        return;
      }
      this.items[index].quantity = newQuantity;
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  clearCart() {
    this.items = [];
    this.saveToStorage();
    this.updateBadge();
    this.notifyListeners();
    notificationSystem.info(i18n.t("notif_cleared"));
  }

  getTotal() {
    return this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  getTotalItems() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  updateBadge() {
    const badge = document.getElementById("cart-badge");
    if (badge) {
      const count = this.getTotalItems();
      badge.textContent = count;
      badge.style.display = count > 0 ? "flex" : "none";
    }
  }

  animateBadge() {
    const badge = document.getElementById("cart-badge");
    if (badge) {
      badge.classList.remove("badge-bounce");
      void badge.offsetWidth; // Force reflow
      badge.classList.add("badge-bounce");
    }

    // Animate cart icon
    const cartIcon = document.getElementById("cart-icon-btn");
    if (cartIcon) {
      cartIcon.classList.remove("cart-shake");
      void cartIcon.offsetWidth;
      cartIcon.classList.add("cart-shake");
    }
  }

  toggleDrawer() {
    this.isOpen = !this.isOpen;
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-overlay");

    if (this.isOpen) {
      drawer.classList.add("cart-drawer-open");
      overlay.classList.add("overlay-visible");
      document.body.style.overflow = "hidden";
      this.renderCartItems();
    } else {
      drawer.classList.remove("cart-drawer-open");
      overlay.classList.remove("overlay-visible");
      document.body.style.overflow = "";
    }
  }

  renderCartItems() {
    const container = document.getElementById("cart-items-container");
    const totalEl = document.getElementById("cart-total-amount");
    const emptyState = document.getElementById("cart-empty-state");
    const cartContent = document.getElementById("cart-content");
    const lang = i18n.getCurrentLang();

    if (this.items.length === 0) {
      emptyState.style.display = "flex";
      cartContent.style.display = "none";
      return;
    }

    emptyState.style.display = "none";
    cartContent.style.display = "flex";

    container.innerHTML = this.items
      .map(
        (item, index) => `
      <div class="cart-item" data-index="${index}">
        <img src="${item.image}" alt="${lang === "ar" ? item.name_ar : item.name_en}" class="cart-item-image">
        <div class="cart-item-info">
          <h4 class="cart-item-name">${lang === "ar" ? item.name_ar : item.name_en}</h4>
          <span class="cart-item-size">${item.size}</span>
          <span class="cart-item-price">${item.price} ${i18n.t("product_currency")}</span>
        </div>
        <div class="cart-item-actions">
          <div class="quantity-controls">
            <button class="qty-btn" onclick="cart.updateQuantity(${item.id}, '${item.size}', ${item.quantity - 1})">−</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn" onclick="cart.updateQuantity(${item.id}, '${item.size}', ${item.quantity + 1})">+</button>
          </div>
          <button class="cart-item-remove" onclick="cart.removeItem(${item.id}, '${item.size}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          </button>
        </div>
      </div>
    `
      )
      .join("");

    totalEl.textContent = `${this.getTotal()} ${i18n.t("product_currency")}`;
  }

  onChange(callback) {
    this.listeners.push(callback);
  }

  notifyListeners() {
    this.listeners.forEach((cb) => cb(this.items));
    if (this.isOpen) this.renderCartItems();
  }
}

// Export singleton
window.cart = new ShoppingCart();
