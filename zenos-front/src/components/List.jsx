import React from 'react';
import ListItem from './ListItem';
import './List.css';

const contacts = [
  {
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    name: 'JENSON DELANEY',
    email: 'jenson.delaney@mail.com',
    unread: 3,
  },
  {
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    name: 'AMAYA COFFEY',
    email: 'amaya.coffey@mail.com',
    unread: 1,
  },
  {
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    name: 'HABIB JOYCE',
    email: 'habib.joyce@mail.com',
    unread: 5,
  },
  {
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    name: 'LILLY-ANN ROCHE',
    email: 'lilly-ann.roche@mail.com',
    unread: 8,
  },
  {
    avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
    name: 'GIULIA HAWORTH',
    email: 'giulia.haworth@mail.com',
    unread: 3,
  },
  {
    avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
    name: 'DAWSON HUMPHREY',
    email: 'dawson.humphrey@mail.com',
    unread: 2,
  },
  {
    avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
    name: 'REILLY MCCULLOUGH',
    email: 'reilly.mccullough@mail.com',
    unread: 3,
  },
];

function List() {
  const totalUnread = contacts.reduce((sum, c) => sum + c.unread, 0);

  return (
    <div className="list-container">
      <div className="list-header">Restaurantes</div>
      <div className="list-items">
        {contacts.map((contact, idx) => (
          <ListItem key={idx} {...contact} />
        ))}
      </div>
      <div className="list-footer">{totalUnread} unread messages in total</div>
    </div>
  );
}

export default List;
