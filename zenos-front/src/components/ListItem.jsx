import React from 'react';
import './ListItem.css';

function ListItem({ name, category, address, city, avg_rating, description, onClick }) {
  // Placeholder image based on category name
  const imageUrl = `https://picsum.photos/id/${category?.id}/500/500/?`;
  return (
    <div className="list-item" onClick={onClick} style={{ cursor: 'pointer' }}>
      <img src={imageUrl} alt={name} className="list-item-avatar" />
      <div className="list-item-info">
        <div className="list-item-top">
          <div className="list-item-name">{name}</div>
          <div className="list-item-rating">{avg_rating} ★</div>
        </div>
        <div className="list-item-meta">{category?.name} {city ? `· ${city}` : ''}</div>
        {address && <div className="list-item-address">{address}</div>}
        {description && description.length > 0 && <div className="list-item-desc">{description}</div>}
      </div>
    </div>
  );
}

export default ListItem;
