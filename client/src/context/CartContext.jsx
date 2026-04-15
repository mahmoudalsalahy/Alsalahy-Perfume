import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useI18n } from './I18nContext';
import { useNotification } from './NotificationContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { t, lang } = useI18n();
  const { success, warning, info } = useNotification();
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('alsalahy_cart') || '[]'); }
    catch { return []; }
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('alsalahy_cart', JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product, size = '50ml', quantity = 1) => {
    setItems(prev => {
      const existing = prev.findIndex(i => i.id === product.id && i.size === size);
      if (existing > -1) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], quantity: updated[existing].quantity + quantity };
        return updated;
      }
      return [...prev, {
        id: product.id,
        name_ar: product.name_ar,
        name_en: product.name_en,
        price: product.price,
        image: product.image,
        size,
        quantity
      }];
    });
    success(t('notif_added'));
  }, [t, success]);

  const removeItem = useCallback((index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
    warning(t('notif_removed'));
  }, [t, warning]);

  const updateQuantity = useCallback((index, newQty) => {
    if (newQty <= 0) {
      setItems(prev => prev.filter((_, i) => i !== index));
      warning(t('notif_removed'));
      return;
    }
    setItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], quantity: newQty };
      return updated;
    });
  }, [t, warning]);

  const clearCart = useCallback(() => {
    setItems([]);
    info(t('notif_cleared'));
  }, [t, info]);

  const getTotal = useCallback(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const getTotalItems = useCallback(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const toggleDrawer = useCallback(() => setDrawerOpen(prev => !prev), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, clearCart,
      getTotal, getTotalItems, drawerOpen, toggleDrawer, closeDrawer
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
