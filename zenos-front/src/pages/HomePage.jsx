import React from 'react';
import BasePage from './BasePage';
import List from '../components/List';
import MapContainer from '../components/MapContainer';
import './HomePage.css';
import DetailedItem from '../components/DetailedItem';

function HomePage() {
  const [selectedEstablishment, setSelectedEstablishment] = React.useState(null);
  return (
    <BasePage>
      <div className="home-page">
        <div className="list-section">
          <List onSelect={setSelectedEstablishment} />
        </div>
        <div className="map-section">
          {selectedEstablishment && <DetailedItem establishment={selectedEstablishment} />}
        </div>
      </div>
    </BasePage>
  );
}

export default HomePage;
