import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from "../../config";
import { useUser } from "@clerk/clerk-react";
import './styles.css'; // Import the CSS file

const OffCampusHousingFormStep8 = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize state with default values
  const [formData, setFormData] = useState({
    residence: '', // Add a property for residence
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
    // Save the residence information to the database
    if (user && formData.residence !== '') {
      db.collection('SurveyResponses')
        .doc(user.id)
        .update({ residence: formData.residence })
        .then(() => {
          console.log("Document successfully updated!");
          // Navigate to the next step (Step 9 or any other step)
          navigate('/rent/off-campus/step9');
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    } else {
      setErrorMessage("Please select a valid residence");
    }
  };

  const isNextButtonDisabled = formData.residence === ''; // Disable if no residence is selected

  // List of states
  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida',
    'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
    'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma',
    'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah',
    'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

  // List of top 30 countries
  const top30Countries = [
    'China', 'India', 'South Korea', 'Taiwan', 'Vietnam', 'Saudi Arabia', 'Iran', 'Canada', 'Mexico', 'Brazil',
    'Colombia', 'Ecuador', 'Germany', 'France', 'Italy', 'Spain', 'United Kingdom', 'Nigeria', 'Kenya', 'Ghana',
    'Egypt', 'South Africa', 'Australia', 'Japan', 'Indonesia', 'Malaysia', 'Thailand', 'Philippines', 'Singapore'
  ];

  return (
    <div className="form-container">
      <h2 className="step-title">What State or Country Are You From?</h2>
      <p className="step-description">Choose the most recent State/Country of Residence:</p>

      {/* Dropdown for selecting the residence */}
      <select
        id="residence"
        className="input-field"
        value={formData.residence}
        onChange={(e) => {
          setFormData((prevData) => ({
            ...prevData,
            residence: e.target.value,
          }));
          setErrorMessage(''); // Clear error message when the user makes a selection
        }}
      >
        <option value="">Select a Residence</option>
        {states.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
        <optgroup label="Countries">
          {top30Countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </optgroup>
      </select>

      {/* Back button to navigate to the previous step */}
      <Link to="/rent/off-campus/step7">
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

export default OffCampusHousingFormStep8;
