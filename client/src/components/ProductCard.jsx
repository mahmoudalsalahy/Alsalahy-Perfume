import { Link } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { t, lang } = useI18n();
  const { addItem } = useCart();

  const name = lang === 'ar' ? product.name_ar : product.name_en;
  const notes = lang === 'ar' ? product.notes_ar : product.notes_en;
  const price = product.price_50ml;
  const originalPrice = product.original_price_50ml ?? product.old_price_50ml ?? null;
  const discountPercentage = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;
  const sizeLabel = '50 ml';

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name_ar: product.name_ar,
      name_en: product.name_en,
      price: price,
      image: product.image,
    }, sizeLabel);
  };

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <div className="product-badges">
          <span className="product-badge product-badge-size">{sizeLabel}</span>
          {discountPercentage > 0 && (
            <span className="product-badge product-badge-discount">-{discountPercentage}%</span>
          )}
        </div>
        <img src={product.image} alt={name} className="product-image" loading="lazy" />
        <div className="product-overlay">
          <Link to={`/products/${product.id}`} className="btn-product-detail">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <span>{t('product_details')}</span>
          </Link>
        </div>
      </div>
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <p className="product-notes">{notes}</p>
        <div className="product-bottom">
          <div className="product-price-block">
            {originalPrice && originalPrice > price && (
              <span className="product-price-old">{originalPrice} <small>{t('product_currency')}</small></span>
            )}
            <span className="product-price-tag">{price} <small>{t('product_currency')}</small></span>
          </div>
          <button className="btn-add-cart" onClick={handleAdd}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
            <span>{t('product_add_cart')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
