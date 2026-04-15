import { useState, useEffect } from 'react';
import { useI18n } from '../context/I18nContext';
import { apiFetch } from '../utils/api';
import ProductCard from '../components/ProductCard';

export default function ProductsPage() {
  const { t } = useI18n();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    apiFetch('/products').then(setProducts).catch(console.error);
  }, []);

  return (
    <section className="section products-section" style={{ paddingTop: '140px' }}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t('products_title')}</h2>
          <p className="section-subtitle">{t('products_subtitle')}</p>
        </div>
        <div className="products-grid">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}
