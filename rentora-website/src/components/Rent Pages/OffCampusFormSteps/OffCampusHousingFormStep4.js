// OffCampusHousingFormStep4.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from "@clerk/clerk-react";
import { db } from "../../config";
import './styles.css'; // Import the CSS file

const OffCampusHousingFormStep4 = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  // Initialize state with default value from Clerk
  const [formData, setFormData] = useState({
    phone: user?.phoneNumber || '',
  });

  // Initialize state for phone validation
  const [isValidPhone, setIsValidPhone] = useState(true);

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
    // Validate the phone number format
    const phoneRegex = /^\d{10}$/;
    const isValid = phoneRegex.test(formData.phone);

    if (!isValid) {
      // Set validation error
      setIsValidPhone(false);
      return;
    }

    // Clear validation error
    setIsValidPhone(true);

    // Save the answer for Step 4
    const newFormData = {
      phone: formData.phone !== undefined ? formData.phone : '',
      // Add more fields as needed
    };

    if (user) {
      const clerkUserID = user.id;
      console.log("Clerk User ID:", clerkUserID);

      // Update the document with the new data for Step 4
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

    // Navigate to the next step or wherever needed
    navigate('/rent/off-campus/step5');
  };

  return (
    <div className="form-container">
      <h2 className="step-title">Confirm Phone Number</h2>
      <p className="step-description">Confirm This Is Your Phone Number*</p>

      {/* Input field for phone number with default value and validation */}
      <input
        type="text"
        placeholder="Phone Number"
        className={`input-field ${!isValidPhone ? 'invalid-phone' : ''}`}
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      />
      {!isValidPhone && <p className="validation-error">Please enter a valid phone number (10 digits).</p>}

      {/* Back button to navigate to the previous step */}
      <Link to="/rent/off-campus/step3">
        <span className="back-button">{'<-'}</span>
      </Link>

      {/* Button to navigate to the next step */}
      <button className="next-button" onClick={handleNext}>
        Next
      </button>
    </div>
  );
};

export default OffCampusHousingFormStep4;
