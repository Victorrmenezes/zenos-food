import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './NavBar.css';

function NavBar({ onToggleNav, isNavVisible }) {
  const { user, handleLogout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <button 
          className="toggle-button" 
          onClick={onToggleNav}
          aria-label="Toggle navigation menu"
        >
          {isNavVisible ? '✕' : '☰'}
        </button>
        <Link to="/" className="navbar-logo">
          Zenos Food
        </Link>
      </div>

      <div className="navbar-search">
        <input
          type="search"
          placeholder="Buscar restaurantes..."
          className="search-input"
        />
      </div>

      <div className="navbar-menu">
        {user ? (
          <>
            <Link to="/profile" className="navbar-item">
              {user.name || user.email || 'Perfil'}
            </Link>
            <button onClick={handleLogout} className="navbar-item btn-link">
              Sair
            </button>
          </>
        ) : (
          <Link to="/login" className="navbar-item">
            Entrar
          </Link>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
