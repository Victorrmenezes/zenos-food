import React from 'react';
import ListItem from './ListItem';

function ProductListItem({ id, name, description, price, rating, establishment, onClick }) {
  const imageUrl = `https://picsum.photos/id/${id}/500/500/?`;
  const priceText = typeof price === 'number' || (typeof price === 'string' && price)
    ? `R$ ${Number(price).toFixed(2)}`
    : undefined;
  const meta = [priceText, establishment?.name].filter(Boolean).join(' · ');
  return (
    <ListItem
      imageUrl={imageUrl}
      title={name}
      rating={rating}
      meta={meta}
      description={description}
      onClick={onClick}
    />
  );
}

export default ProductListItem;
