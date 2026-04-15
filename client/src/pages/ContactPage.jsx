import { useState } from 'react';
import { useI18n } from '../context/I18nContext';
import { useNotification } from '../context/NotificationContext';
import { apiFetch } from '../utils/api';

export default function ContactPage() {
  const { t } = useI18n();
  const { success } = useNotification();
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiFetch('/contact', { method: 'POST', body: JSON.stringify(form) });
      success(t('notif_contact_sent'));
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="section contact-section" style={{ paddingTop: '140px' }}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t('contact_title')}</h2>
          <p className="section-subtitle">{t('contact_subtitle')}</p>
        </div>
        <div className="contact-grid">
          <form className="contact-form" onSubmit={handleSubmit}>
            <input type="text" className="contact-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder={t('contact_name')} required />
            <input type="email" className="contact-input" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder={t('contact_email')} required />
            <textarea className="contact-input" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder={t('contact_message')} required />
            <button type="submit" className="btn-contact-submit">{t('contact_send')}</button>
          </form>
          <div className="contact-info">
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
              </div>
              <div>
                <div className="contact-info-label">{t('contact_phone_label')}</div>
                <div className="contact-info-value" dir="ltr">{t('contact_phone_val')}</div>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div>
                <div className="contact-info-label">{t('contact_email_label')}</div>
                <div className="contact-info-value">{t('contact_email_val')}</div>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div>
                <div className="contact-info-label">{t('contact_address_label')}</div>
                <div className="contact-info-value">{t('contact_address_val')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
