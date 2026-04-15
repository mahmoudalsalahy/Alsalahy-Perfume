import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';
import { useCart } from '../context/CartContext';
import { apiFetch } from '../utils/api';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { t, lang } = useI18n();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('50ml');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    apiFetch(`/products/${id}`).then(setProduct).catch(console.error);
  }, [id]);

  if (!product) return <div className="section" style={{ paddingTop: '140px', textAlign: 'center' }}>Loading...</div>;

  const name = lang === 'ar' ? product.name_ar : product.name_en;
  const desc = lang === 'ar' ? product.desc_ar : product.desc_en;
  const notes = lang === 'ar' ? product.notes_ar : product.notes_en;
  const sizes = [
    { label: '30ml', price: product.price_30ml },
    { label: '50ml', price: product.price_50ml },
    { label: '100ml', price: product.price_100ml },
  ];
  const currentPrice = sizes.find(s => s.label === selectedSize)?.price || product.price_50ml;

  const handleAdd = () => {
    addItem({
      id: product.id,
      name_ar: product.name_ar,
      name_en: product.name_en,
      price: currentPrice,
      image: product.image,
    }, selectedSize, quantity);
  };

  return (
    <section className="section" style={{ paddingTop: '120px' }}>
      <div className="container">
        <Link to="/products" className="nav-link" style={{ marginBottom: '24px', display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
          ← {t('back_to_products')}
        </Link>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', marginTop: '24px' }}>
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(201,168,76,0.15)' }}>
            <img src={product.image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <h1 className="modal-product-name" style={{ fontSize: '2.2rem' }}>{name}</h1>
            <p className="modal-product-desc" style={{ margin: '16px 0' }}>{desc}</p>
            <p className="modal-product-notes-label">{t('product_notes_label')}</p>
            <p className="modal-product-notes" style={{ marginBottom: '32px' }}>{notes}</p>

            <div className="size-selector" style={{ marginBottom: '24px' }}>
              <p className="size-selector-label">{t('product_size')}</p>
              <div className="size-buttons">
                {sizes.map(s => (
                  <button key={s.label} className={`size-btn ${selectedSize === s.label ? 'active' : ''}`} onClick={() => setSelectedSize(s.label)}>{s.label}</button>
                ))}
              </div>
            </div>

            <div className="modal-quantity-row" style={{ marginBottom: '32px' }}>
              <div>
                <p className="size-selector-label">{t('product_quantity')}</p>
                <div className="quantity-controls">
                  <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                  <span className="qty-value">{quantity}</span>
                  <button className="qty-btn" onClick={() => setQuantity(q => Math.min(10, q + 1))}>+</button>
                </div>
              </div>
              <div className="modal-price">{currentPrice} {t('product_currency')}</div>
            </div>

            <button className="modal-add-cart-btn" onClick={handleAdd}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
              <span>{t('product_add_cart')}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
