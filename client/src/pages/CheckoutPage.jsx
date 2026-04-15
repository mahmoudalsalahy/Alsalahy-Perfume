import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { apiFetch } from '../utils/api';

export default function CheckoutPage() {
  const { t, lang } = useI18n();
  const { items, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { success, warning } = useNotification();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: '', city: '', notes: '' });
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.city) {
      warning(t('notif_fill_fields'));
      return;
    }
    if (items.length === 0) {
      warning(t('notif_cart_empty_order'));
      return;
    }
    try {
      await apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify({
          customer_name: form.name, phone: form.phone, address: form.address,
          city: form.city, notes: form.notes, user_id: user?.id || null,
          items: items.map(i => ({ product_id: i.id, size: i.size, quantity: i.quantity, price: i.price }))
        })
      });
      setOrderPlaced(true);
      clearCart();
      success(t('notif_order_placed'));
    } catch (err) {
      console.error(err);
    }
  };

  if (orderPlaced) {
    return (
      <section className="section" style={{ paddingTop: '140px', minHeight: '80vh' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '500px' }}>
          <div className="success-checkmark animate" style={{ transform: 'scale(1)', margin: '0 auto 24px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>{t('order_success_title')}</h2>
          <p style={{ color: '#b0b0b0', marginBottom: '32px' }}>{t('order_success_msg')}</p>
          <button className="btn-hero" style={{ opacity: 1 }} onClick={() => navigate('/')}>{t('order_back_home')}</button>
        </div>
      </section>
    );
  }

  return (
    <section className="section" style={{ paddingTop: '140px', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="section-header"><h2 className="section-title">{t('order_title')}</h2></div>
        <form onSubmit={handleSubmit}>
          {[
            { key: 'name', label: t('order_name'), type: 'text' },
            { key: 'phone', label: t('order_phone'), type: 'tel' },
            { key: 'address', label: t('order_address'), type: 'text' },
            { key: 'city', label: t('order_city'), type: 'text' },
          ].map(f => (
            <div className="order-form-group" key={f.key}>
              <label>{f.label}</label>
              <input type={f.type} className="order-input" value={form[f.key]} onChange={(e) => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.label} required />
            </div>
          ))}
          <div className="order-form-group">
            <label>{t('order_notes')}</label>
            <textarea className="order-input" value={form.notes} onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))} placeholder={t('order_notes')} />
          </div>

          <div className="order-summary">
            <h4 className="order-summary-title">{t('order_summary')}</h4>
            {items.map(item => (
              <div className="order-summary-item" key={`${item.id}-${item.size}`}>
                <span>{lang === 'ar' ? item.name_ar : item.name_en} × {item.quantity}</span>
                <span>{item.price * item.quantity} {t('product_currency')}</span>
              </div>
            ))}
            <div className="order-summary-total">
              <span>{t('cart_total')}</span>
              <span>{getTotal()} {t('product_currency')}</span>
            </div>
          </div>

          <div className="order-form-btns">
            <button type="submit" className="btn-order-submit">{t('order_submit')}</button>
            <button type="button" className="btn-order-cancel" onClick={() => navigate('/cart')}>{t('order_cancel')}</button>
          </div>
        </form>
      </div>
    </section>
  );
}
