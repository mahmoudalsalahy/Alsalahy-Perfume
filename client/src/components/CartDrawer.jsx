import { Link } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { t, lang } = useI18n();
  const { items, removeItem, updateQuantity, clearCart, getTotal, drawerOpen, closeDrawer } = useCart();

  return (
    <>
      <div className={`modal-overlay ${drawerOpen ? 'overlay-visible' : ''}`} onClick={closeDrawer}></div>
      <div className={`cart-drawer ${drawerOpen ? 'cart-drawer-open' : ''}`}>
        <div className="cart-drawer-header">
          <div className="cart-drawer-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
            <span>{t('cart_title')}</span>
          </div>
          <button className="cart-close-btn" onClick={closeDrawer}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty-state" style={{ display: 'flex' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
            <h3 className="cart-empty-title">{t('cart_empty')}</h3>
            <p className="cart-empty-msg">{t('cart_empty_msg')}</p>
          </div>
        ) : (
          <div className="cart-content" style={{ display: 'flex' }}>
            <div className="cart-items-container">
              {items.map((item, index) => (
                <div className="cart-item" key={`${item.id}-${item.size}`}>
                  <img src={item.image} alt={lang === 'ar' ? item.name_ar : item.name_en} className="cart-item-image" />
                  <div className="cart-item-info">
                    <h4 className="cart-item-name">{lang === 'ar' ? item.name_ar : item.name_en}</h4>
                    <span className="cart-item-size">{item.size}</span>
                    <span className="cart-item-price">{item.price} {t('product_currency')}</span>
                  </div>
                  <div className="cart-item-actions">
                    <div className="quantity-controls">
                      <button className="qty-btn" onClick={() => updateQuantity(index, item.quantity - 1)}>−</button>
                      <span className="qty-value">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(index, item.quantity + 1)}>+</button>
                    </div>
                    <button className="cart-item-remove" onClick={() => removeItem(index)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <div className="cart-total-row">
                <span className="cart-total-label">{t('cart_total')}</span>
                <span className="cart-total-amount">{getTotal()} {t('product_currency')}</span>
              </div>
              <div className="cart-footer-btns">
                <Link to="/checkout" className="btn-checkout" onClick={closeDrawer}>{t('cart_checkout')}</Link>
                <div className="btn-cart-secondary">
                  <button className="btn-clear-cart" onClick={clearCart}>{t('cart_clear')}</button>
                  <button className="btn-continue" onClick={closeDrawer}>{t('cart_continue')}</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
