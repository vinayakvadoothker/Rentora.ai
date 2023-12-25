// OffCampusPage.js
import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import OffCampusHousingFormStep1 from './OffCampusFormSteps/OffCampusHousingFormStep1';
import OffCampusHousingFormStep2 from './OffCampusFormSteps/OffCampusHousingFormStep2';
import OffCampusHousingFormStep3 from './OffCampusFormSteps/OffCampusHousingFormStep3';
import OffCampusHousingFormStep4 from './OffCampusFormSteps/OffCampusHousingFormStep4';
import OffCampusHousingFormStep5 from './OffCampusFormSteps/OffCampusHousingFormStep5';
import OffCampusHousingFormStep6 from './OffCampusFormSteps/OffCampusHousingFormStep6';
import OffCampusHousingFormStep7 from './OffCampusFormSteps/OffCampusHousingFormStep7';
import OffCampusHousingFormStep8 from './OffCampusFormSteps/OffCampusHousingFormStep8';
import OffCampusHousingFormStep9 from './OffCampusFormSteps/OffCampusHousingFormStep9';
import OffCampusHousingFormStep10 from './OffCampusFormSteps/OffCampusHousingFormStep10';
import OffCampusHousingFormStep11 from './OffCampusFormSteps/OffCampusHousingFormStep11';
import OffCampusHousingFormStep12 from './OffCampusFormSteps/OffCampusHousingFormStep12';
import OffCampusHousingFormStep13 from './OffCampusFormSteps/OffCampusHousingFormStep13';
import OffCampusHousingFormStep14 from './OffCampusFormSteps/OffCampusHousingFormStep14';
import OffCampusHousingFormStep15 from './OffCampusFormSteps/OffCampusHousingFormStep15';
import OffCampusHousingFormStep16 from './OffCampusFormSteps/OffCampusHousingFormStep16';
import OffCampusHousingFormStep17 from './OffCampusFormSteps/OffCampusHousingFormStep17';
import OffCampusHousingFormStep18 from './OffCampusFormSteps/OffCampusHousingFormStep18';
import OffCampusHousingFormStep19 from './OffCampusFormSteps/OffCampusHousingFormStep19';
import OffCampusHousingFormStep20 from './OffCampusFormSteps/OffCampusHousingFormStep20';
import OffCampusHousingFormStep21 from './OffCampusFormSteps/OffCampusHousingFormStep21';


const OffCampusPage = () => {
  const [isFormCompleted, setFormCompleted] = useState(false);

  useEffect(() => {
    // You can implement additional logic here if needed
  }, []);

  // Function to mark the form as completed
  const completeForm = () => {
    // You can implement the logic to mark the form as completed in your application
    setFormCompleted(true);
  };

  // If the user hasn't completed the form, show the form completion popup
  if (!isFormCompleted) {
    return (
      <div>
        <Routes>
          <Route path="/" element={<OffCampusHousingFormStep1 onComplete={completeForm} />} />
          <Route path="step2" element={<OffCampusHousingFormStep2 onComplete={completeForm} />} />
          <Route path="step3" element={<OffCampusHousingFormStep3 onComplete={completeForm} />} />
          <Route path="step4" element={<OffCampusHousingFormStep4 onComplete={completeForm} />} />
          <Route path="step5" element={<OffCampusHousingFormStep5 onComplete={completeForm} />} />
          <Route path="step6" element={<OffCampusHousingFormStep6 onComplete={completeForm} />} />
          <Route path="step7" element={<OffCampusHousingFormStep7 onComplete={completeForm} />} />
          <Route path="step8" element={<OffCampusHousingFormStep8 onComplete={completeForm} />} />
          <Route path="step9" element={<OffCampusHousingFormStep9 onComplete={completeForm} />} />
          <Route path="step10" element={<OffCampusHousingFormStep10 onComplete={completeForm} />} />
          <Route path="step11" element={<OffCampusHousingFormStep11 onComplete={completeForm} />} />
          <Route path="step12" element={<OffCampusHousingFormStep12 onComplete={completeForm} />} />
          <Route path="step13" element={<OffCampusHousingFormStep13 onComplete={completeForm} />} />
          <Route path="step14" element={<OffCampusHousingFormStep14 onComplete={completeForm} />} />
          <Route path="step15" element={<OffCampusHousingFormStep15 onComplete={completeForm} />} />
          <Route path="step16" element={<OffCampusHousingFormStep16 onComplete={completeForm} />} />
          <Route path="step17" element={<OffCampusHousingFormStep17 onComplete={completeForm} />} />
          <Route path="step18" element={<OffCampusHousingFormStep18 onComplete={completeForm} />} />
          <Route path="step19" element={<OffCampusHousingFormStep19 onComplete={completeForm} />} />
          <Route path="step20" element={<OffCampusHousingFormStep20 onComplete={completeForm} />} />
          <Route path="step21" element={<OffCampusHousingFormStep21 onComplete={completeForm} />} />

        </Routes>
      </div>
    );
  }

  return (
    <div>
      {/* Render the houses or other content for users who have completed the form */}
      <h2>Off-Campus Housing Listings</h2>
      {/* Add your logic to display the houses or other content */}
    </div>
  );
};

export default OffCampusPage;
