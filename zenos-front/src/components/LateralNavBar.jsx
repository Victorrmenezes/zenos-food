import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './LateralNavBar.css';

function LateralNavBar({ isVisible, onToggle }) {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/restaurants', label: 'Restaurantes', icon: '🍽️' },
    { path: '/favorites', label: 'Favoritos', icon: '⭐' },
    { path: '/orders', label: 'Pedidos', icon: '📋' },
  ];

  return (
    <aside className={`lateral-navbar ${isVisible ? 'visible' : ''}`}>
      <nav className="lateral-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`lateral-nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="item-icon">{item.icon}</span>
            <span className="item-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default LateralNavBar;
