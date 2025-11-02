import React from 'react';
import BasePage from './BasePage';
import EstablishmentList from '../components/EstablishmentList';
import './HomePage.css';
import DetailedItem from '../components/DetailedItem';

function HomePage() {
  const [selectedEstablishment, setSelectedEstablishment] = React.useState(null);
  return (
    <BasePage>
      <div className="home-page">
        <div className="list-section">
          <EstablishmentList onSelect={setSelectedEstablishment} />
        </div>
        <div className="map-section">
          {selectedEstablishment && <DetailedItem establishment={selectedEstablishment} />}
        </div>
      </div>
    </BasePage>
  );
}

export default HomePage;
