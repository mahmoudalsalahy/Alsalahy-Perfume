import { useI18n } from '../context/I18nContext';

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <>
      <section className="section about-section" style={{ paddingTop: '140px' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('about_title')}</h2>
          </div>
          <div className="about-content">
            <p className="about-text">{t('about_text_1')}</p>
            <p className="about-text">{t('about_text_2')}</p>
          </div>
          <div className="about-features">
            <div className="about-feature">
              <div className="about-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3>{t('about_quality')}</h3>
              <p>{t('about_quality_desc')}</p>
            </div>
            <div className="about-feature">
              <div className="about-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
              </div>
              <h3>{t('about_crafted')}</h3>
              <p>{t('about_crafted_desc')}</p>
            </div>
            <div className="about-feature">
              <div className="about-feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
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
