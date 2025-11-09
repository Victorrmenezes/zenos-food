import React from 'react';
import ListItem from './ListItem';

function EstablishmentListItem({ id, name, category, address, city, avg_rating, description, onClick }) {
  const imageUrl = `https://picsum.photos/id/${category?.id ?? id}/500/500/?`;
  const meta = `${category?.name ?? ''}${city ? (category?.name ? ' · ' : '') + city : ''}`;
  return (
    <ListItem
      imageUrl={imageUrl}
      title={name}
      rating={avg_rating}
      meta={meta}
      address={address}
      onClick={onClick}
    />
  );
}

export default EstablishmentListItem;
