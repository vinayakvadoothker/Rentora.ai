import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from "../../config";
import { useUser } from "@clerk/clerk-react";
import './styles.css'; // Import the CSS file

const OffCampusHousingFormStep7 = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  // Initialize state with default values
  const [formData, setFormData] = useState({
    studentId: '',
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

  const saveAnswer = () => {
    // Save the student ID to the database
    if (user && /^[0-9]+$/.test(formData.studentId)) {
      db.collection('SurveyResponses')
        .doc(user.id)
        .update({ studentId: formData.studentId })
        .then(() => {
          console.log("Document successfully updated!");
          // Navigate to the next step based on schoolName
          if (formData.schoolName === 'UC Santa Cruz') {
            navigate('/rent/off-campus/step8'); // Redirect to Step 8
          } else {
            navigate('/rent/off-campus/step5'); // Redirect to Step 5
          }
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    }
  };

  const handleInputChange = (e) => {
    // Allow only numbers to be typed
    const inputValue = e.target.value;
    if (/^[0-9]*$/.test(inputValue)) {
      setFormData((prevData) => ({
        ...prevData,
        studentId: inputValue,
      }));
    }
  };

  const isNextButtonDisabled = formData.studentId === '';

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
        onChange={handleInputChange}
      />

      {/* Back button to navigate to the previous step */}
      <Link to={formData.schoolName === 'UC Santa Cruz' ? "/rent/off-campus/step6" : "/rent/off-campus/step5"}>
        <span className="back-button">{'<-'}</span>
      </Link>

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
