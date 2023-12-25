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
      // Display validation error using alert
      alert("Please enter a valid phone number with 10 digits.");
      return;
    }

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

  const handleInputChange = (e) => {
    // Allow only numbers to be typed
    const inputValue = e.target.value;
    if (/^[0-9]*$/.test(inputValue)) {
      setFormData((prevData) => ({
        ...prevData,
        phone: inputValue,
      }));
    }
  };

  return (
    <div className="form-container">
      <h2 className="step-title">Confirm Phone Number</h2>
      <p className="step-description">Confirm This Is Your Phone Number*</p>

      {/* Input field for phone number with default value and validation */}
      <input
        type="text"
        placeholder="Phone Number"
        className="input-field"
        value={formData.phone}
        onChange={handleInputChange}
      />

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
