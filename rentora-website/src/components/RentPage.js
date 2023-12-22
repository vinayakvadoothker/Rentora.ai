// Import necessary modules
import React from 'react';
import { useParams } from 'react-router-dom';
import OffCampusHousingPage from './Rent Pages/OffCampusPage';
import ForAllPage from './Rent Pages/ForAllPage';

// RentPage component
const RentPage = () => {
  // Get the current sub-tab from the URL
  const { subTab } = useParams();

  return (
    <div>
      {/* Subheader for Rent tab */}
      <Subheader subTab={subTab} />

      {/* Content based on the selected sub-tab */}
      {renderSubTabContent(subTab)}
    </div>
  );
};

// Subheader component
const Subheader = ({ subTab }) => {
  return (
    <div>
      {/* Display the appropriate subheader based on the selected sub-tab */}
      {subTab === 'off-campus' && <h2>Off-Campus Housing</h2>}
      {subTab === 'for-all' && <h2>For-All</h2>}
    </div>
  );
};

// Function to render content based on the selected sub-tab
const renderSubTabContent = (subTab) => {
  switch (subTab) {
    case 'off-campus':
      return <OffCampusHousingPage />;
    case 'for-all':
      return <ForAllPage />;
    default:
      // Handle default case or render a placeholder component
      return;
  }
};

// Export the RentPage component
export default RentPage;
