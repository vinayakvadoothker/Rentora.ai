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
    middleInitial: user?.middleName ? user.middleName.charAt(0).toUpperCase() : '',
    dateOfBirth: user?.dateOfBirth || '', // Add the dateOfBirth field
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
    // Validate that First Name, Last Name, and Date of Birth are filled out
    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth) {
      alert("Please enter your First Name, Last Name, and Date of Birth.");
      return;
    }

    // Save the answer for Step 2
    const newFormData = {
      firstName: formData.firstName !== undefined ? formData.firstName : '',
      lastName: formData.lastName !== undefined ? formData.lastName : '',
      middleInitial: formData.middleInitial !== undefined ? formData.middleInitial : '',
      dateOfBirth: formData.dateOfBirth !== undefined ? formData.dateOfBirth : '', // Add the dateOfBirth field
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
    <div className="form-container" style={{ marginTop: '60px' }}>
      <h2 className="step-title">Name and Date of Birth</h2>
      <p className="step-description">Confirm This Is Your Legal Name and Enter Your Date of Birth*</p>

      {/* Input fields for first name, middle initial, last name, and date of birth with default values */}
      <input
        type="text"
        placeholder="First Name"
        className="input-field"
        value={formData.firstName}
        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
      />
      <input
        type="text"
        placeholder="Middle Initial (Optional)"
        maxLength={1}
        className="input-field"
        value={formData.middleInitial}
        onChange={(e) => setFormData({ ...formData, middleInitial: e.target.value.toUpperCase() })}
      />
      <input
        type="text"
        placeholder="Last Name"
        className="input-field"
        value={formData.lastName}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
      />

      {/* Label for Date of Birth */}
      <label htmlFor="dateOfBirth">Enter Date of Birth:</label>

      {/* Input field for Date of Birth */}
      <input
        type="date"
        id="dateOfBirth"
        placeholder="Date of Birth"
        className="input-field"
        value={formData.dateOfBirth}
        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
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
