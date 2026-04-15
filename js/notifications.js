/**
 * notifications.js - Professional Toast Notification System
 * Animated, auto-dismissing notifications with progress bar
 */

class NotificationSystem {
  constructor() {
    this.container = null;
    this.queue = [];
    this.maxVisible = 4;
    this.defaultDuration = 3500;
  }

  init() {
    this.container = document.createElement("div");
    this.container.id = "notification-container";
    this.container.className = "notification-container";
    document.body.appendChild(this.container);
  }

  /**
   * Show a notification
   * @param {string} message - The message to display
   * @param {string} type - 'success' | 'error' | 'warning' | 'info'
   * @param {number} duration - Auto-dismiss duration in ms
   */
  show(message, type = "success", duration = this.defaultDuration) {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;

    const icons = {
      success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>`,
      error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>`,
      warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
      info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>`,
    };

    notification.innerHTML = `
      <div class="notification-icon">${icons[type]}</div>
      <div class="notification-content">
        <p class="notification-message">${message}</p>
      </div>
      <button class="notification-close" onclick="notificationSystem.dismiss(this.parentElement)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <div class="notification-progress">
        <div class="notification-progress-bar" style="animation-duration: ${duration}ms"></div>
      </div>
    `;

    // Add to container
    this.container.appendChild(notification);

    // Trigger enter animation
    requestAnimationFrame(() => {
      notification.classList.add("notification-enter");
    });

    // Auto dismiss
    const timer = setTimeout(() => {
      this.dismiss(notification);
    }, duration);

    notification._timer = timer;

    // Pause on hover
    notification.addEventListener("mouseenter", () => {
      clearTimeout(notification._timer);
      const progressBar = notification.querySelector(
        ".notification-progress-bar"
      );
      if (progressBar) progressBar.style.animationPlayState = "paused";
    });

    notification.addEventListener("mouseleave", () => {
      const progressBar = notification.querySelector(
        ".notification-progress-bar"
      );
      if (progressBar) progressBar.style.animationPlayState = "running";
      notification._timer = setTimeout(() => {
        this.dismiss(notification);
      }, 1500);
    });

    return notification;
  }

  dismiss(notification) {
    if (!notification || notification._dismissing) return;
    notification._dismissing = true;

    clearTimeout(notification._timer);
    notification.classList.add("notification-exit");

    notification.addEventListener("animationend", () => {
      if (notification.parentElement) {
        notification.parentElement.removeChild(notification);
      }
    });
  }

  success(message, duration) {
    return this.show(message, "success", duration);
  }

  error(message, duration) {
    return this.show(message, "error", duration);
  }

  warning(message, duration) {
    return this.show(message, "warning", duration);
  }

  info(message, duration) {
    return this.show(message, "info", duration);
  }
}

// Export singleton
window.notificationSystem = new NotificationSystem();
