import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from "../../config";
import { useUser } from "@clerk/clerk-react";
import './styles.css'; // Import the CSS file

const OffCampusHousingFormStep6 = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize state with default values
  const [formData, setFormData] = useState({
    college: '',
    schoolName: '', // Add schoolName to formData
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

  useEffect(() => {
    // Check if the schoolName is not UC Santa Cruz, then navigate to the next step
    if (formData.schoolName !== 'UC Santa Cruz' && formData.schoolName !== '') {
      navigate('/rent/off-campus/step7'); // Navigate to the next step
    }
  }, [formData.schoolName, navigate]);

  const saveAnswer = () => {
    // Save the selected college to the database
    if (user && formData.college !== '') {
      db.collection('SurveyResponses')
        .doc(user.id)
        .update({ college: formData.college })
        .then(() => {
          console.log("Document successfully updated!");
          // Navigate to the next step (Step 7)
          navigate('/rent/off-campus/step7');
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    } else {
      setErrorMessage("Please select a valid college");
    }
  };

  const isNextButtonDisabled = formData.college === 'Select A College'; // Disable if the default option is selected

  return (
    <div className="form-container">
      <h2 className="step-title">College Affiliation</h2>
      <p className="step-description">Select your college:</p>

      {/* Dropdown for selecting the college */}
      <select
        id="college"
        className="input-field"
        value={formData.college}
        onChange={(e) => {
          setFormData((prevData) => ({
            ...prevData,
            college: e.target.value,
          }));
          setErrorMessage(''); // Clear error message when the user makes a selection
        }}
      >
        <option value="">Select a College</option>
        <option value="Cowell College">Cowell College</option>
        <option value="Stevenson College">Stevenson College</option>
        <option value="Merrill College">Merrill College</option>
        <option value="Crown College">Crown College</option>
        <option value="College 9">College 9</option>
        <option value="John R. Lewis College">John R. Lewis College</option>
        <option value="Kresge College">Kresge College</option>
        <option value="Porter College">Porter College</option>
        <option value="Rachel Carson College">Rachel Carson College</option>
        <option value="Oakes College">Oakes College</option>
      </select>

      {/* Back button to navigate to the previous step */}
      <Link to="/rent/off-campus/step5">
        <span className="back-button">{'<-'}</span>
      </Link>

      {/* Display error message if any */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Button to submit the form and navigate to the next step */}
      <button
        className="next-button"
        onClick={saveAnswer}
        disabled={isNextButtonDisabled}
      >
        Next
      </button>
    </div>
  );
};

export default OffCampusHousingFormStep6;
