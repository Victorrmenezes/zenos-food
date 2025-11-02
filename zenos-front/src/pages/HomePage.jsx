import React from 'react';
import BasePage from './BasePage';
import List from '../components/List';
import MapContainer from '../components/MapContainer';
import './HomePage.css';

function HomePage() {
  return (
    <BasePage>
      <div className="home-page">
        <div className="list-section">
          <List />
        </div>
        <div className="map-section">
          <MapContainer />
        </div>
      </div>
    </BasePage>
  );
}

export default HomePage;
