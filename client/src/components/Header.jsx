import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { t, toggleLanguage } = useI18n();
  const { getTotalItems, toggleDrawer } = useCart();
  const { isLoggedIn, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [badgeBounce, setBadgeBounce] = useState(false);
  const location = useLocation();
  const totalItems = getTotalItems();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Badge bounce animation on item count change
  useEffect(() => {
    if (totalItems > 0) {
      setBadgeBounce(true);
      const timer = setTimeout(() => setBadgeBounce(false), 500);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  const closeMobile = () => setMobileOpen(false);
  const isActive = (path) => location.pathname === path ? 'nav-active' : '';

  return (
    <>
      <header className={`main-header ${scrolled ? 'header-scrolled' : ''}`} id="main-header">
        <div className="container header-inner">
          <Link to="/" className="logo">
            <img src="/images/logo.png" alt="ALSALAHY PERFUME" />
          </Link>

          <nav className="nav-desktop">
            <Link to="/" className={`nav-link ${isActive('/')}`}>{t('nav_home')}</Link>
            <Link to="/products" className={`nav-link ${isActive('/products')}`}>{t('nav_products')}</Link>
            <Link to="/about" className={`nav-link ${isActive('/about')}`}>{t('nav_about')}</Link>
            <Link to="/contact" className={`nav-link ${isActive('/contact')}`}>{t('nav_contact')}</Link>
          </nav>

          <div className="header-actions">
            <button className="lang-toggle-btn" onClick={toggleLanguage}>{t('lang_toggle')}</button>

            <button className="icon-btn" onClick={toggleDrawer} aria-label="Cart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
              {totalItems > 0 && <span className={`cart-badge ${badgeBounce ? 'badge-bounce' : ''}`}>{totalItems}</span>}
            </button>

            {!isLoggedIn ? (
              <Link to="/login" className="icon-btn" aria-label="Login">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </Link>
            ) : (
              <div className="user-menu" style={{ display: 'flex' }}>
                <span className="user-name">{user.name}</span>
                <button onClick={logout} id="logout-btn">{t('nav_logout')}</button>
              </div>
            )}

            <div className={`hamburger ${mobileOpen ? 'active' : ''}`} onClick={() => setMobileOpen(!mobileOpen)}>
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${mobileOpen ? 'mobile-menu-open' : ''}`}>
        <Link to="/" className="nav-link" onClick={closeMobile}>{t('nav_home')}</Link>
        <Link to="/products" className="nav-link" onClick={closeMobile}>{t('nav_products')}</Link>
        <Link to="/about" className="nav-link" onClick={closeMobile}>{t('nav_about')}</Link>
        <Link to="/contact" className="nav-link" onClick={closeMobile}>{t('nav_contact')}</Link>
      </div>
    </>
  );
}
