import React, { useEffect, useRef, useState } from 'react';
import List from './List';
import ProductListItem from './ProductListItem';

// Optional local cache helpers for products
function readLocalProducts() {
  try {
    const cached = localStorage.getItem('products');
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}
function writeLocalProducts(data) {
  try {
    localStorage.setItem('products', JSON.stringify(data));
  } catch {}
}

/**
 * ProductList: generic wrapper around List.
 * Props:
 * - fetchProducts?: async function returning array
 * - onSelect?: function(product)
 * If fetchProducts isn't provided, it will only render products from localStorage (if any).
 */
function ProductList({ fetchProducts, onSelect }) {
  const [products, setProducts] = useState(() => readLocalProducts() || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (!fetchProducts) return () => { mounted.current = false; };

    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProducts();
        if (mounted.current) {
          setProducts(Array.isArray(data) ? data : (data?.data ?? []));
          writeLocalProducts(Array.isArray(data) ? data : (data?.data ?? []));
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch products', err);
        if (mounted.current) {
          setError('Failed to load products');
          setLoading(false);
        }
      }
    };
    run();
    return () => { mounted.current = false; };
  }, [fetchProducts]);

  return (
    <List
      title=""
      items={products}
      loading={loading}
      error={error}
      emptyText="Nenhum produto encontrado."
      renderItem={(p, idx) => (
        <ProductListItem key={p.id || idx} {...p} onClick={() => onSelect && onSelect(p)} />
      )}
    />
  );
}

export default ProductList;
