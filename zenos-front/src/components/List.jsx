import React, { useState, useEffect, useRef } from 'react';
import ListItem from './ListItem';
import { getEstablishments } from '../api/reviews';

let inMemoryEstablishments = [];

function readLocalCache() {
  try {
    const cached = localStorage.getItem('establishments');
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

function writeLocalCache(data) {
  try {
    localStorage.setItem('establishments', JSON.stringify(data));
  } catch {}
}

function List({ onSelect }) {
  const [establishments, setEstablishments] = useState(() => inMemoryEstablishments || readLocalCache() || []);
  const [loading, setLoading] = useState(!establishments || establishments.length === 0);
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (inMemoryEstablishments && inMemoryEstablishments.length > 0) {
      setLoading(false);
      setEstablishments(inMemoryEstablishments);
      return () => (mounted.current = false);
    }
    const cached = readLocalCache();
    if (cached && cached.length > 0) {
      inMemoryEstablishments = cached;
      if (mounted.current) {
        setEstablishments(cached);
        setLoading(false);
      }
    }
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await getEstablishments();
        const data = resp.data || [];
        inMemoryEstablishments = data;
        writeLocalCache(data);
        if (mounted.current) {
          setEstablishments(data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch establishments', err);
        if (mounted.current) {
          setError('Failed to load establishments');
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    <div className="list-container">
      <div className="list-header">Restaurantes</div>
      {loading && <div className="list-loading">Carregando estabelecimentos...</div>}
      {error && <div className="list-error">{error}</div>}
      <div className="list-items">
        {establishments && establishments.length > 0 ? (
          establishments.map((est, idx) => (
            <ListItem key={est.id || idx} {...est} onClick={() => onSelect && onSelect(est)} />
          ))
        ) : (
          !loading && <div className="list-empty">Nenhum estabelecimento encontrado.</div>
        )}
      </div>
    </div>
  );
}

export default List;
