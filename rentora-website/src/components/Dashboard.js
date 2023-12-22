import React from 'react';
import { SignedIn } from '@clerk/clerk-react';

const Dashboard = ({ onClose }) => {

  return (
    <SignedIn>
    <div>
      {/* Add your dashboard components here */}
    </div>
    </SignedIn>
  );
};

export default Dashboard;
