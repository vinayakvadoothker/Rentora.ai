// OffCampusPage.js
import React, { useState, useEffect } from 'react';
import { useClerk } from '@clerk/clerk-react';
import { Route, Routes, Link, Navigate } from 'react-router-dom';
import { db } from "../config";
import { useUser } from "@clerk/clerk-react";
import OffCampusHousingFormStep1 from './OffCampusFormSteps/OffCampusHousingFormStep1';
import OffCampusHousingFormStep2 from './OffCampusFormSteps/OffCampusHousingFormStep2';
import OffCampusHousingFormStep3 from './OffCampusFormSteps/OffCampusHousingFormStep3';
import OffCampusHousingFormStep4 from './OffCampusFormSteps/OffCampusHousingFormStep4';
import OffCampusHousingFormStep5 from './OffCampusFormSteps/OffCampusHousingFormStep5';


const OffCampusPage = () => {
  const { user } = useUser();
  const saveAnswer = (event) => {

      event.preventDefault();
    
      const elementsArray = [...event.target.elements];
    
      const formData = elementsArray.reduce((accumulator, currentValue) => {
        if (currentValue.id) {
          accumulator[currentValue.id] = currentValue.value;
        }
    
        return accumulator;
      }, {});
        if (user) {
            // Access the Clerk user ID
            const clerkUserID = user.id;
            console.log("Clerk User ID:", clerkUserID);
          
            // Now you can use the clerkUserID as needed in your application
          } else {
            // User is not authenticated, handle accordingly
            console.log("User not authenticated");
          }
          db.collection('SurveyResponses').doc(user.id).set(formData);
      
          //db.collection("SurveyResponses").add(formData);
        };
  const [isFormCompleted, setFormCompleted] = useState(false);
  const { session } = useClerk();

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
