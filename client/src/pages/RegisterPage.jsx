import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export default function RegisterPage() {
  const { t } = useI18n();
  const { register, loginWithGoogle } = useAuth();
  const { error: showError } = useNotification();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      showError(t('notif_password_mismatch'));
      return;
    }
    const ok = await register(form.name, form.email, form.phone, form.password);
    if (ok) navigate('/');
  };

  const handleGoogle = async () => {
    const ok = await loginWithGoogle();
    if (ok) navigate('/');
  };

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <section className="section" style={{ paddingTop: '140px', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src="/images/logo.png" alt="ALSALAHY" className="auth-modal-logo" style={{ margin: '0 auto 16px' }} />
          <h2 className="section-title">{t('auth_register_title')}</h2>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: '32px' }}>
          <div className="auth-form-group">
            <label>{t('auth_name')}</label>
            <input type="text" className="auth-input" value={form.name} onChange={e => update('name', e.target.value)} placeholder={t('auth_name')} required />
          </div>
          <div className="auth-form-group">
            <label>{t('auth_email')}</label>
            <input type="email" className="auth-input" value={form.email} onChange={e => update('email', e.target.value)} placeholder={t('auth_email')} required />
          </div>
          <div className="auth-form-group">
            <label>{t('auth_phone')}</label>
            <input type="tel" className="auth-input" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder={t('auth_phone')} />
          </div>
          <div className="auth-form-group">
            <label>{t('auth_password')}</label>
            <input type="password" className="auth-input" value={form.password} onChange={e => update('password', e.target.value)} placeholder={t('auth_password')} required />
          </div>
          <div className="auth-form-group">
            <label>{t('auth_confirm_password')}</label>
            <input type="password" className="auth-input" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} placeholder={t('auth_confirm_password')} required />
          </div>

          <button type="submit" className="btn-auth-submit">{t('auth_register_btn')}</button>

          <div className="auth-divider"><span>{t('auth_or')}</span></div>

          <button type="button" className="btn-google" onClick={handleGoogle}>
            <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.43 3.44 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            <span>{t('auth_google')}</span>
          </button>

          <div className="auth-switch">
            <span>{t('auth_have_account')} </span>
            <Link to="/login">{t('auth_login_btn')}</Link>
          </div>
        </form>
      </div>
    </section>
  );
}
