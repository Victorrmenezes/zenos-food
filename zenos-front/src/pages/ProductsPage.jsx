import BasePage from './BasePage';
import ProductList from '../components/ProductList';
import './HomePage.css';
import { getProducts } from '../api/reviews';
import { useSearchParams } from 'react-router-dom';
import React from 'react';

function ProductsPage() {
  const [searchParams] = useSearchParams();
  const establishmentId = searchParams.get('establishment_id');
  const fetcher = establishmentId ? () => getProducts(establishmentId) : undefined;

  const [basket, setBasket] = React.useState(() => {
    try {
      const raw = localStorage.getItem('basket');
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });

  const persistBasket = (next) => {
    setBasket(next);
    try { localStorage.setItem('basket', JSON.stringify(next)); } catch {}
  };

  const addToBasket = (product) => {
    if (!product) return;
    persistBasket(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, qty: (p.qty || 1) + 1 } : p);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromBasket = (id) => {
    persistBasket(prev => prev.filter(p => p.id !== id));
  };

  const updateQty = (id, delta) => {
    persistBasket(prev => prev.flatMap(p => {
      if (p.id !== id) return [p];
      const nextQty = (p.qty || 1) + delta;
      if (nextQty <= 0) return []; // remove
      return [{ ...p, qty: nextQty }];
    }));
  };

  const total = basket.reduce((sum, p) => sum + ((Number(p.price) || 0) * (p.qty || 1)), 0);

  return (
    <BasePage>
      <div className="products-layout" style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <ProductList fetchProducts={fetcher} onAdd={addToBasket} />
        </div>
  <div className="basket-panel" style={{ width: '340px', background: '#fff', borderRadius: '16px', boxShadow: '0 2px 8px rgba(20,61,107,0.08)', padding: '16px', border: '1.5px solid #eaf4ff', position: 'sticky', top: '80px' }}>
          <h2 style={{ margin: '0 0 12px', fontFamily: 'Georgia, serif', color: '#143d6b' }}>Carrinho</h2>
          {basket.length === 0 && <div style={{ color: '#143d6b', background: '#eaf4ff', padding: '12px', borderRadius: '12px' }}>Nenhum produto.</div>}
          {basket.map(item => (
            <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px', borderBottom: '1px solid #eaf4ff', paddingBottom: '8px' }}>
              <div style={{ fontWeight: 600, color: '#143d6b' }}>{item.name}</div>
              <div style={{ fontSize: '0.85rem', color: '#1a1a1a' }}>R$ {(Number(item.price) || 0).toFixed(2)} · Qty: {item.qty}</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-link" style={{ padding: '4px 12px' }} onClick={() => updateQty(item.id, 1)}>+</button>
                <button className="btn-link" style={{ padding: '4px 12px' }} onClick={() => updateQty(item.id, -1)}>-</button>
                <button className="btn-link" style={{ padding: '4px 12px' }} onClick={() => removeFromBasket(item.id)}>Remover</button>
              </div>
            </div>
          ))}
          <div style={{ marginTop: '8px', fontWeight: 600, color: '#143d6b' }}>Total: R$ {total.toFixed(2)}</div>
          {basket.length > 0 && (
            <button type="button" className="btn-link" style={{ marginTop: '12px', width: '100%' }} onClick={() => alert('Checkout não implementado ainda.')}>Finalizar compra</button>
          )}
        </div>
      </div>
    </BasePage>
  );
}

export default ProductsPage;
