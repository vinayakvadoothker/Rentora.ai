import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from "../../config";
import { useUser } from "@clerk/clerk-react";
import './styles.css'; // Import the CSS file

const OffCampusHousingFormStep7 = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize state with default values
  const [formData, setFormData] = useState({
    studentId: '',
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
    // Save the student ID to the database
    if (user && /^[0-9]+$/.test(formData.studentId)) {
      db.collection('SurveyResponses')
        .doc(user.id)
        .update({ studentId: formData.studentId })
        .then(() => {
          console.log("Document successfully updated!");
          // Navigate to the next step (Step 8 or any other step)
          navigate('/rent/off-campus/step8');
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    } else {
      setErrorMessage("Please input a valid numeric Student ID");
    }
  };

  const isNextButtonDisabled = formData.studentId === '' || !/^[0-9]+$/.test(formData.studentId);

  return (
    <div className="form-container">
      <h2 className="step-title">What Is Your {formData.schoolName} ID #</h2>
      <p className="step-description">Please input your college ID:</p>

      {/* Input field for entering the student ID */}
      <input
        type="text"
        id="studentId"
        className="input-field"
        value={formData.studentId}
        onChange={(e) => {
          setFormData((prevData) => ({
            ...prevData,
            studentId: e.target.value,
          }));
          setErrorMessage('Please input a valid numeric Student ID'); // Clear error message when the user makes an input
        }}
      />

      {/* Back button to navigate to the previous step */}
      <Link to="/rent/off-campus/step6">
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

export default OffCampusHousingFormStep7;
