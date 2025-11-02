import React from 'react';
import './ListItem.css';

function ListItem({ avatar, name, email, unread }) {
  return (
    <div className="list-item">
      <img src={avatar} alt={name} className="list-item-avatar" />
      <div className="list-item-info">
        <div className="list-item-name">{name}</div>
        <div className="list-item-email">{email}</div>
      </div>
      <div className="list-item-unread">
        {unread > 0 && (
          <span className="list-item-unread-badge">{unread} new messages</span>
        )}
      </div>
    </div>
  );
}

export default ListItem;
