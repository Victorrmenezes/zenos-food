import React from 'react';
import '../pages/Profile.css';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const auth = useAuth();
  const user = auth?.user;

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <p className="profile-empty">You are not signed in.</p>
        </div>
      </div>
    );
  }

  const displayName = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || user.name || 'User';

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2 className="profile-name">{displayName}</h2>
        <p className="profile-email">{user.email || '—'}</p>
      </div>
    </div>
  );
}

export default Profile;
