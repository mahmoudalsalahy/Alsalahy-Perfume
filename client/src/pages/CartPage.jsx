import { Link } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { t, lang } = useI18n();
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCart();

  return (
    <section className="section" style={{ paddingTop: '140px', minHeight: '80vh' }}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t('cart_title')}</h2>
        </div>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '80px', height: '80px', color: '#777', opacity: 0.3, margin: '0 auto' }}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
            <h3 style={{ color: '#b0b0b0', marginTop: '16px' }}>{t('cart_empty')}</h3>
            <p style={{ color: '#777', margin: '8px 0 24px' }}>{t('cart_empty_msg')}</p>
            <Link to="/products" className="btn-hero" style={{ opacity: 1 }}>{t('view_all_products')}</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
            <div>
              {items.map((item, index) => (
                <div className="cart-item" key={`${item.id}-${item.size}`} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', background: '#1e1e1e', borderRadius: '12px', marginBottom: '12px', border: '1px solid rgba(201,168,76,0.15)' }}>
                  <img src={item.image} alt={lang === 'ar' ? item.name_ar : item.name_en} style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <h4 className="cart-item-name">{lang === 'ar' ? item.name_ar : item.name_en}</h4>
                    <span className="cart-item-size">{item.size}</span>
                    <span className="cart-item-price" style={{ display: 'block' }}>{item.price} {t('product_currency')}</span>
                  </div>
                  <div className="quantity-controls">
                    <button className="qty-btn" onClick={() => updateQuantity(index, item.quantity - 1)}>−</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(index, item.quantity + 1)}>+</button>
                  </div>
                  <button className="cart-item-remove" onClick={() => removeItem(index)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '20px', height: '20px' }}><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  </button>
                </div>
              ))}
            </div>
            <div style={{ background: '#1e1e1e', borderRadius: '12px', padding: '24px', border: '1px solid rgba(201,168,76,0.15)', alignSelf: 'start', position: 'sticky', top: '100px' }}>
              <h3 style={{ marginBottom: '16px', color: '#c9a84c' }}>{t('order_summary')}</h3>
              {items.map(item => (
                <div key={`${item.id}-${item.size}`} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: '#b0b0b0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span>{lang === 'ar' ? item.name_ar : item.name_en} × {item.quantity}</span>
                  <span>{item.price * item.quantity}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0 0', marginTop: '12px', borderTop: '1px solid rgba(201,168,76,0.15)', fontWeight: 700, fontSize: '1.2rem', color: '#c9a84c' }}>
                <span>{t('cart_total')}</span>
                <span>{getTotal()} {t('product_currency')}</span>
              </div>
              <Link to="/checkout" className="btn-checkout" style={{ display: 'block', textAlign: 'center', marginTop: '20px' }}>{t('cart_checkout')}</Link>
              <button className="btn-clear-cart" onClick={clearCart} style={{ width: '100%', marginTop: '10px' }}>{t('cart_clear')}</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
