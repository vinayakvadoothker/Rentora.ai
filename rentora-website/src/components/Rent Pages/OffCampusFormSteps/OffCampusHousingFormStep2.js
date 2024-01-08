// OffCampusHousingFormStep2.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from "@clerk/clerk-react";
import { db } from "../../config";
import './styles.css'; // Import the CSS file

const OffCampusHousingFormStep2 = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  // Initialize state with default values
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    middleName: user?.middleName || '',
  });

  useEffect(() => {
    // Fetch and set the saved data when the component mounts
    if (user) {
      db.collection('SurveyResponses').doc(user.id).get()
        .then((doc) => {
          if (doc.exists) {
            setFormData(doc.data());
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, [user]);

  const handleNext = () => {
    // Save the answer for Step 2
    const newFormData = {
      firstName: formData.firstName !== undefined ? formData.firstName : '',
      lastName: formData.lastName !== undefined ? formData.lastName : '',
      middleName: formData.middleName !== undefined ? formData.middleName : '',
      // Add more fields as needed
    };

    if (user) {
      const clerkUserID = user.id;
      console.log("Clerk User ID:", clerkUserID);

      // Update the document with the new data for Step 2
      db.collection('SurveyResponses').doc(user.id).update(newFormData)
        .then(() => {
          console.log("Document successfully updated!");
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    } else {
      console.log("User not authenticated");
    }

    // Navigate to the next step
    navigate('/rent/off-campus/step3');
  };

  return (
    <div className="form-container">
      <h2 className="step-title">Confirm Name</h2>
      <p className="step-description">Confirm This Is Your Legal Name*</p>

      {/* Input fields for first name, middle name, and last name with default values */}
      <input
        type="text"
        placeholder="First Name"
        className="input-field"
        value={formData.firstName}
        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
      />
      <input
        type="text"
        placeholder="Middle Name (Optional)"
        className="input-field"
        value={formData.middleName}
        onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
      />
      <input
        type="text"
        placeholder="Last Name"
        className="input-field"
        value={formData.lastName}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
      />

      {/* Back button to navigate to the previous step */}
      <Link to="/rent/off-campus/step1">
        <span className="back-button">{'<-'}</span>
      </Link>

      {/* Button to navigate to the next step */}
      <button className="next-button" onClick={handleNext}>
        Next
      </button>
    </div>
  );
};

export default OffCampusHousingFormStep2;
