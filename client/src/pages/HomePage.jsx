import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';
import { apiFetch } from '../utils/api';
import ProductCard from '../components/ProductCard';
import ParticleCanvas from '../components/ParticleCanvas';

export default function HomePage() {
  const { t, lang } = useI18n();
  const [products, setProducts] = useState([]);
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    apiFetch('/products').then(setProducts).catch(console.error);
  }, []);

  // Typing animation
  useEffect(() => {
    const text = lang === 'ar' ? 'اكتشف عالمالمنا الراقي' : 'Discover the world of refined fragrance';
    setTypedText('');
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setTypedText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 60);
    return () => clearInterval(timer);
  }, [lang]);

  return (
    <>
      {/* Hero */}
      <section className="hero" id="hero">
        <div className="hero-bg"><img src="/images/hero-bg.png" alt="Background" /></div>
        <ParticleCanvas />
        <div className="hero-content">
          <img src="/images/logo.png" alt="ALSALAHY PERFUME" className="hero-logo" />
          <h1 className="hero-title">{t('hero_title')}</h1>
          <p className="hero-subtitle">{t('hero_subtitle')}</p>
          <p className="hero-tagline">{typedText}</p>
          <Link to="/products" className="btn-hero">{t('hero_cta')}</Link>
        </div>
        <div className="hero-scroll-indicator"><span></span></div>
      </section>

      <div className="gold-separator"></div>

      {/* Featured Products */}
      <section className="section products-section" id="products">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('products_title')}</h2>
            <p className="section-subtitle">{t('products_subtitle')}</p>
          </div>
          <div className="products-grid">
            {products.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <div className="gold-separator"></div>

      {/* About Preview */}
      <section className="section about-section" id="about">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('about_title')}</h2>
          </div>
          <div className="about-content">
            <p className="about-text">{t('about_text_1')}</p>
          </div>
          <div className="about-features">
            <div className="about-feature">
              <div className="about-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              </div>
              <h3>{t('about_quality')}</h3>
              <p>{t('about_quality_desc')}</p>
            </div>
            <div className="about-feature">
              <div className="about-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" /></svg>
              </div>
              <h3>{t('about_crafted')}</h3>
              <p>{t('about_crafted_desc')}</p>
            </div>
            <div className="about-feature">
              <div className="about-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              </div>
              <h3>{t('about_lasting')}</h3>
              <p>{t('about_lasting_desc')}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
