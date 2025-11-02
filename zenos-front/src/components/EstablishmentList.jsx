import React, { useEffect, useRef, useState } from 'react';
import List from './List';
import EstablishmentListItem from './EstablishmentListItem';
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

function EstablishmentList({ onSelect }) {
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
    <List
      title=""
      items={establishments}
      loading={loading}
      error={error}
      emptyText="Nenhum estabelecimento encontrado."
      renderItem={(est, idx) => (
        <EstablishmentListItem key={est.id || idx} {...est} onClick={() => onSelect && onSelect(est)} />
      )}
    />
  );
}

export default EstablishmentList;
