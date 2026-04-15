/**
 * animations.js - Scroll & Interaction Animations
 * Uses IntersectionObserver for scroll-triggered animations
 */

class AnimationSystem {
  constructor() {
    this.observer = null;
    this.particleCanvas = null;
    this.particleCtx = null;
    this.particles = [];
    this.animFrameId = null;
  }

  init() {
    this.setupScrollAnimations();
    this.setupParticles();
    this.setupSmoothScroll();
    this.setupScrollTopButton();
    this.setupHeaderScroll();
    this.setupRippleEffect();
    this.setupHeroTyping();
  }

  // --- Scroll-triggered reveal animations ---
  setupScrollAnimations() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            // Only unobserve if not a repeating animation
            if (!entry.target.dataset.repeat) {
              this.observer.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    // Observe all animatable elements
    document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
      this.observer.observe(el);
    });
  }

  // --- Gold particle effect in hero ---
  setupParticles() {
    this.particleCanvas = document.getElementById("particle-canvas");
    if (!this.particleCanvas) return;

    this.particleCtx = this.particleCanvas.getContext("2d");
    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());

    // Create particles
    for (let i = 0; i < 60; i++) {
      this.particles.push({
        x: Math.random() * this.particleCanvas.width,
        y: Math.random() * this.particleCanvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: -Math.random() * 0.8 - 0.2,
        opacity: Math.random() * 0.6 + 0.2,
        color: Math.random() > 0.5 ? "#c9a84c" : "#d4af37",
      });
    }

    this.animateParticles();
  }

  resizeCanvas() {
    if (!this.particleCanvas) return;
    const hero = document.getElementById("hero");
    if (hero) {
      this.particleCanvas.width = hero.offsetWidth;
      this.particleCanvas.height = hero.offsetHeight;
    }
  }

  animateParticles() {
    if (!this.particleCtx || !this.particleCanvas) return;

    this.particleCtx.clearRect(
      0,
      0,
      this.particleCanvas.width,
      this.particleCanvas.height
    );

    this.particles.forEach((p) => {
      this.particleCtx.beginPath();
      this.particleCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.particleCtx.fillStyle = p.color;
      this.particleCtx.globalAlpha = p.opacity;
      this.particleCtx.fill();

      // Add glow
      this.particleCtx.shadowColor = p.color;
      this.particleCtx.shadowBlur = 10;

      p.x += p.speedX;
      p.y += p.speedY;

      // Reset particle if out of bounds
      if (p.y < -10) {
        p.y = this.particleCanvas.height + 10;
        p.x = Math.random() * this.particleCanvas.width;
      }
      if (p.x < -10 || p.x > this.particleCanvas.width + 10) {
        p.x = Math.random() * this.particleCanvas.width;
      }
    });

    this.particleCtx.globalAlpha = 1;
    this.particleCtx.shadowBlur = 0;

    this.animFrameId = requestAnimationFrame(() => this.animateParticles());
  }

  // --- Smooth scrolling ---
  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          // Close mobile menu if open
          const mobileMenu = document.getElementById("mobile-menu");
          if (mobileMenu?.classList.contains("mobile-menu-open")) {
            mobileMenu.classList.remove("mobile-menu-open");
            document.getElementById("hamburger")?.classList.remove("active");
          }
        }
      });
    });
  }

  // --- Scroll to top button ---
  setupScrollTopButton() {
    const btn = document.getElementById("scroll-top-btn");
    if (!btn) return;

    window.addEventListener("scroll", () => {
      if (window.scrollY > 600) {
        btn.classList.add("visible");
      } else {
        btn.classList.remove("visible");
      }
    });

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // --- Header background on scroll ---
  setupHeaderScroll() {
    const header = document.getElementById("main-header");
    if (!header) return;

    window.addEventListener("scroll", () => {
      if (window.scrollY > 80) {
        header.classList.add("header-scrolled");
      } else {
        header.classList.remove("header-scrolled");
      }
    });
  }

  // --- Button ripple effect ---
  setupRippleEffect() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".ripple-btn");
      if (!btn) return;

      const ripple = document.createElement("span");
      ripple.className = "ripple-effect";
      const rect = btn.getBoundingClientRect();
      ripple.style.left = e.clientX - rect.left + "px";
      ripple.style.top = e.clientY - rect.top + "px";
      btn.appendChild(ripple);

      setTimeout(() => ripple.remove(), 700);
    });
  }

  // --- Hero typing animation ---
  setupHeroTyping() {
    const el = document.getElementById("hero-tagline");
    if (!el) return;

    const textAr = "اكتشف عالم الأناقة والفخامة";
    const textEn = "Discover elegance and luxury";
    const text = i18n.getCurrentLang() === "ar" ? textAr : textEn;

    el.textContent = "";
    let charIndex = 0;

    const type = () => {
      if (charIndex < text.length) {
        el.textContent += text.charAt(charIndex);
        charIndex++;
        setTimeout(type, 60);
      }
    };

    // Start after a delay
    setTimeout(type, 1000);

    // Re-type on language change
    i18n.onLanguageChange((lang) => {
      const newText = lang === "ar" ? textAr : textEn;
      el.textContent = "";
      let idx = 0;
      const retype = () => {
        if (idx < newText.length) {
          el.textContent += newText.charAt(idx);
          idx++;
          setTimeout(retype, 60);
        }
      };
      setTimeout(retype, 300);
    });
  }

  // --- Product card 3D tilt ---
  setupProductTilt() {
    document.querySelectorAll(".product-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform =
          "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
      });
    });
  }
}

// Export singleton
window.animations = new AnimationSystem();
