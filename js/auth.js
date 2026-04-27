/**
 * auth.js - Authentication System
 * Email/Phone/Google login/register with localStorage
 */

class AuthSystem {
  constructor() {
    this.currentUser = null;
    this.isModalOpen = false;
    this.activeTab = "login";
  }

  init() {
    this.loadUser();
    this.updateUI();
  }

  loadUser() {
    try {
      const data = localStorage.getItem("alsalahy_user");
      if (data) {
        this.currentUser = JSON.parse(data);
      }
    } catch (e) {
      this.currentUser = null;
    }
  }

  saveUser(user) {
    this.currentUser = user;
    localStorage.setItem("alsalahy_user", JSON.stringify(user));
  }

  isLoggedIn() {
    return this.currentUser !== null;
  }

  register(name, email, phone, password) {
    // Get existing users
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem("alsalahy_users") || "[]");
    } catch (e) {
      users = [];
    }

    // Check if email already exists
    if (users.find((u) => u.email === email)) {
      notificationSystem.error(i18n.t("notif_register_error"));
      return false;
    }

    const user = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      password,
      createdAt: new Date().toISOString(),
    };

    users.push(user);
    localStorage.setItem("alsalahy_users", JSON.stringify(users));

    // Auto login
    this.saveUser({ id: user.id, name: user.name, email: user.email, phone: user.phone });
    this.updateUI();
    this.closeModal();
    notificationSystem.success(i18n.t("notif_register_success"));
    return true;
  }

  login(email, password) {
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem("alsalahy_users") || "[]");
    } catch (e) {
      users = [];
    }

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      this.saveUser({ id: user.id, name: user.name, email: user.email, phone: user.phone });
      this.updateUI();
      this.closeModal();
      notificationSystem.success(i18n.t("notif_login_success"));
      return true;
    } else {
      notificationSystem.error(i18n.t("notif_login_error"));
      // Shake the form
      const form = document.querySelector(".auth-form.active");
      if (form) {
        form.classList.add("shake");
        setTimeout(() => form.classList.remove("shake"), 600);
      }
      return false;
    }
  }

  loginWithGoogle() {
    if (typeof google === 'undefined') {
      notificationSystem.error("Google Auth is not loaded yet.");
      return;
    }

    if (!this.googleTokenClient) {
      this.googleTokenClient = google.accounts.oauth2.initTokenClient({
        client_id: '615668254223-ibnjd02vks5iihcamhrcvnb05id8s434.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        callback: (response) => {
          if (response && response.access_token) {
            fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${response.access_token}` }
            })
            .then(res => res.json())
            .then(data => {
              const user = {
                id: "google_" + data.sub,
                name: data.name,
                email: data.email,
                phone: ""
              };
              this.saveUser(user);
              this.updateUI();
              this.closeModal();
              notificationSystem.success(i18n.t("notif_login_success"));
            })
            .catch(err => {
              console.error(err);
              notificationSystem.error(i18n.t("notif_login_error"));
            });
          }
        },
      });
    }

    this.googleTokenClient.requestAccessToken();
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem("alsalahy_user");
    this.updateUI();
    notificationSystem.info(i18n.t("notif_logout_success"));
  }

  updateUI() {
    const loginBtn = document.getElementById("auth-login-btn");
    const userMenu = document.getElementById("user-menu");
    const userName = document.getElementById("user-name");

    if (this.isLoggedIn()) {
      if (loginBtn) loginBtn.style.display = "none";
      if (userMenu) userMenu.style.display = "flex";
      if (userName) userName.textContent = this.currentUser.name;
    } else {
      if (loginBtn) loginBtn.style.display = "flex";
      if (userMenu) userMenu.style.display = "none";
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
