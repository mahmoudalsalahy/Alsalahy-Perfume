/**
 * auth.js - Authentication System
 * Email/Phone/Google login/register with Supabase Auth
 */

class AuthSystem {
  constructor() {
    this.currentUser = null;
    this.isModalOpen = false;
    this.activeTab = "login";
  }

  async init() {
    // Set up auth state listener
    window.supabaseClient.auth.onAuthStateChange((event, session) => {
      if (session && session.user) {
        this.saveUserFromSession(session.user);
      } else {
        this.currentUser = null;
        this.updateUI();
      }
    });

    // Initial session load
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    if (session && session.user) {
      this.saveUserFromSession(session.user);
      
      // Clear the long Supabase token hash from the URL for a cleaner look
      if (window.location.hash && window.location.hash.includes('access_token')) {
        window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
      }
    }
  }

  async saveUserFromSession(user) {
    // Extract metadata
    const name = user.user_metadata?.name || user.user_metadata?.full_name || "المستخدم";
    const phone = user.user_metadata?.phone || "";
    
    this.currentUser = {
      id: user.id,
      name,
      email: user.email,
      phone
    };
    this.updateUI();
    
    // Load saved cart from cloud
    if (window.cart) {
      window.cart.loadFromSupabase();
      window.cart.setupRealtime();
    }

    // Save/update user profile in Supabase users table
    try {
      const { error } = await window.supabaseClient.from('users').upsert({
        id: user.id,
        name,
        email: user.email,
        phone
      }, { onConflict: 'id' });

      if (error) throw error;
    } catch (err) {
      console.error("Error saving user to database:", err);
    }
  }

  isLoggedIn() {
    return this.currentUser !== null;
  }

  async register(name, email, phone, password) {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const { data, error } = await window.supabaseClient.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          emailRedirectTo: window.location.origin + window.location.pathname,
          data: {
            name,
            phone
          }
        }
      });

      if (error) throw error;

      if (data.session) {
        await this.saveUserFromSession(data.user);
        this.closeModal();
        notificationSystem.success(i18n.t("notif_register_success") || "تم التسجيل بنجاح");
      } else {
        this.closeModal();
        notificationSystem.success(i18n.t("notif_register_check_email"));
      }
      return true;
    } catch (err) {
      console.error(err);
      notificationSystem.error(err.message || i18n.t("notif_register_error"));
      return false;
    }
  }

  async login(email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    try {
      const { data, error } = await window.supabaseClient.auth.signInWithPassword({
        email: normalizedEmail,
        password
      });

      if (error) throw error;

      this.closeModal();
      notificationSystem.success(i18n.t("notif_login_success"));
      return true;
    } catch (err) {
      console.error(err);
      const message = (err.message || "").toLowerCase();

      if (message.includes("email not confirmed")) {
        await this.resendConfirmationEmail(normalizedEmail);
        notificationSystem.warning(i18n.t("notif_login_email_not_confirmed"));
      } else if (message.includes("email not found") || message.includes("user not found")) {
        notificationSystem.error(i18n.t("notif_login_auth_user_missing"));
      } else {
        notificationSystem.error(err.message || i18n.t("notif_login_error"));
      }
      
      const form = document.querySelector(".auth-form.active");
      if (form) {
        form.classList.add("shake");
        setTimeout(() => form.classList.remove("shake"), 600);
      }
      return false;
    }
  }

  async resendConfirmationEmail(email) {
    try {
      const { error } = await window.supabaseClient.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: window.location.origin + window.location.pathname
        }
      });

      if (error) throw error;
    } catch (err) {
      console.error("Error resending confirmation email:", err);
    }
  }

  async loginWithGoogle() {
    try {
      const { data, error } = await window.supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + window.location.pathname
        }
      });
      if (error) throw error;
    } catch (err) {
      console.error(err);
      notificationSystem.error(i18n.t("notif_login_error") || "Error logging in with Google");
    }
  }

  async logout() {
    await window.supabaseClient.auth.signOut();
    this.currentUser = null;
    this.updateUI();
    if (window.cart) {
      window.cart.items = [];
      window.cart.saveToStorage();
      window.cart.updateBadge();
      window.cart.notifyListeners();
    }
    notificationSystem.info(i18n.t("notif_logout_success"));
  }

  updateUI() {
    const loginBtn = document.getElementById("auth-login-btn");
    const userMenu = document.getElementById("user-menu");
    const userName = document.getElementById("user-name");
    const mobileOrdersBtn = document.getElementById("mobile-show-orders-btn");

    if (this.isLoggedIn()) {
      if (loginBtn) loginBtn.style.display = "none";
      if (userMenu) userMenu.style.display = "flex";
      if (userName) userName.textContent = this.currentUser.name;
      if (mobileOrdersBtn) mobileOrdersBtn.style.display = "block";
    } else {
      if (loginBtn) loginBtn.style.display = "flex";
      if (userMenu) userMenu.style.display = "none";
      if (mobileOrdersBtn) mobileOrdersBtn.style.display = "none";
    }
  }

  openModal(tab = "login") {
    this.activeTab = tab;
    const modal = document.getElementById("auth-modal");
    const overlay = document.getElementById("auth-overlay");

    if (modal && overlay) {
      modal.classList.add("modal-open");
      overlay.classList.add("overlay-visible");
      document.body.style.overflow = "hidden";
      this.switchTab(tab);
    }
  }

  closeModal() {
    const modal = document.getElementById("auth-modal");
    const overlay = document.getElementById("auth-overlay");

    if (modal && overlay) {
      modal.classList.remove("modal-open");
      overlay.classList.remove("overlay-visible");
      document.body.style.overflow = "";
    }
  }

  switchTab(tab) {
    this.activeTab = tab;
    const loginTab = document.getElementById("login-tab-btn");
    const registerTab = document.getElementById("register-tab-btn");
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    if (tab === "login") {
      loginTab?.classList.add("active");
      registerTab?.classList.remove("active");
      loginForm?.classList.add("active");
      registerForm?.classList.remove("active");
    } else {
      registerTab?.classList.add("active");
      loginTab?.classList.remove("active");
      registerForm?.classList.add("active");
      loginForm?.classList.remove("active");
    }
  }

  handleLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
      notificationSystem.warning(i18n.t("notif_fill_fields"));
      return;
    }

    this.login(email, password);
  }

  handleRegisterSubmit(e) {
    e.preventDefault();
    const name = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const phone = document.getElementById("register-phone").value.trim();
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("register-confirm-password").value;

    if (!name || !email || !password) {
      notificationSystem.warning(i18n.t("notif_fill_fields"));
      return;
    }

    if (password !== confirmPassword) {
      notificationSystem.error(i18n.t("notif_password_mismatch"));
      return;
    }

    this.register(name, email, phone, password);
  }
}

// Export singleton
window.auth = new AuthSystem();
