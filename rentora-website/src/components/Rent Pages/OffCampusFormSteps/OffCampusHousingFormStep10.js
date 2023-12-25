import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from "../../config";
import { useUser } from "@clerk/clerk-react";
import './styles.css'; // Import the CSS file

const OffCampusHousingFormStep10 = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [setShowMessagePopup] = useState(false); // Added state for popup message
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    // Fetch and set the saved data when the component mounts
    if (user) {
      db.collection('SurveyResponses')
        .doc(user.id)
        .get()
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

  const saveAnswer = () => {
    // Validate start and end dates
    const isValid = validateDates(formData.startDate, formData.endDate);

    if (user && isValid) {
      db.collection('SurveyResponses')
        .doc(user.id)
        .update({
          startDate: formData.startDate,
          endDate: formData.endDate,
        })
        .then(() => {
          console.log("Document successfully updated!");
          // Navigate to the next step (Step 11 or any other step)
          navigate('/rent/off-campus/step11');
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    } else {
      // Show error message popup
      setShowMessagePopup(true);
    }
  };

  const validateDates = (start, end) => {
    // Validate if start date is before end date
    if (start && end && new Date(start) > new Date(end)) {
      setErrorMessage("End date must be after the Start date");
      return false;
    }

    // Validate if both dates are filled
    if (!start || !end) {
      setErrorMessage("Please enter both Start and End dates");
      return false;
    }

    // Clear error message if dates are valid
    setErrorMessage('');
    return true;
  };

  return (
    <div className="form-container" style={{ marginTop: '70px', width: '500px' }}>
      <h2 className="step-title">Time At {formData.schoolName}</h2>
      <p className="step-description">Start Date - Proposed End Date</p>

      {/* Date picker for start date */}
      <div className="date-picker-container">
        <label htmlFor="startDate">Start Date:</label>
        <input
          type="date"
          id="startDate"
          className="input-field"
          value={formData.startDate}
          onChange={(e) => {
            setFormData((prevData) => ({
              ...prevData,
              startDate: e.target.value,
            }));
            setErrorMessage('');
          }}
        />
      </div>

      {/* Date picker for end date */}
      <div className="date-picker-container">
        <label htmlFor="endDate">End Date:</label>
        <input
          type="date"
          id="endDate"
          className="input-field"
          value={formData.endDate}
          onChange={(e) => {
            setFormData((prevData) => ({
              ...prevData,
              endDate: e.target.value,
            }));
            setErrorMessage('');
          }}
        />
      </div>

      {/* Back button to navigate to the previous step */}
      <Link to="/rent/off-campus/step9">
        <span className="back-button">{'<-'}</span>
      </Link>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Button to submit the form and navigate to the next step */}
      <button
        className="next-button"
        onClick={saveAnswer}
      >
        Next
      </button>


    </div>
  );
};

export default OffCampusHousingFormStep10;
