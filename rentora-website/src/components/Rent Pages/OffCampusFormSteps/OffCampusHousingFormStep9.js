import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from "../../config";
import { useUser } from "@clerk/clerk-react";
import './styles.css'; // Import the CSS file

const OffCampusHousingFormStep9 = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize state with default values
  const [formData, setFormData] = useState({
    major: '',
  });

  const majorChoices = [
    'Computer Science',
    'Biology',
    'Psychology',
    'Engineering',
    'Business Administration',
    'Political Science',
    'English',
    'Chemistry',
    'Mathematics',
    'Economics',
    'History',
    'Physics',
    'Sociology',
    'Communications',
    'Art History',
    'Philosophy',
    'Marketing',
    'Graphic Design',
    'Environmental Science',
    'Nursing',
    'International Relations',
    'Computer Engineering',
    'Criminal Justice',
    'Music',
    'Civil Engineering',
    'Astronomy',
    'Dance',
    'Anthropology',
    'Finance',
    'Journalism',
    'Mechanical Engineering',
    'Geology',
    'Theater',
    'Linguistics',
    'Supply Chain Management',
    'Neuroscience',
    'Human Resource Management',
    'Graphic Communication',
    'Public Health',
    'Aerospace Engineering',
    'Religious Studies',
    'Real Estate',
    'Biomedical Engineering',
    'Women Studies',
    'Information Systems',
    'Education',
    'Industrial Engineering',
    'Social Work',
    'Astrophysics',
    'Fashion Design',
    'Global Studies',
    'Chemical Engineering',
    'Public Relations',
    'Sports Management',
    'Biochemistry',
    'Fine Arts',
    'Urban Planning',
    'Materials Science',
    'Business Analytics',
    'Health Science',
    'Computer Information Systems',
    'Interior Design',
    'Ethnic Studies',
    'Biotechnology',
    'Hospitality Management',
    'Cognitive Science',
    'International Business',
    'Healthcare Administration',
    'Robotics Engineering',
    'French',
    'Spanish',
    'Japanese',
    'Chinese',
    'Italian',
    'German',
    'Russian',
    'Arabic',
    'Korean',
    'Portuguese',
    'Dental Hygiene',
    'Meteorology',
    'Political Economy',
    'Marine Biology',
    'Behavioral Science',
    'Data Science',
    'Culinary Arts',
    'Philosophy of Science',
    'Wildlife Biology',
    'Forensic Science',
    'Quantitative Economics',
    'Artificial Intelligence',
    'Criminal Psychology',
    'Geophysics',
    'Media Studies',
    'Geography',
    'Interior Architecture',
    'Public Policy',
    'Textile Design',
    'Human Biology',
    'Sound Engineering',
    'Archeology',
    'Kinesiology',
    'Music Production',
    'Biostatistics',
    'Food Science',
    'Public Administration',
    'Aviation Management',
    'Landscape Architecture',
    'Digital Marketing',
    'Industrial Design',
    'Social Media Management',
    'Forestry',
    'Neurobiology',
    'Behavioral Economics',
    'Environmental Engineering',
    'Medical Illustration',
    'Agricultural Science',
    'Welding Engineering',
    'Comparative Literature',
    'Architectural Engineering',
    'Urban Design',
    'Environmental Policy',
    'Public Relations',
    'Art Therapy',
    'Biomedical Physics',
    'Political Philosophy',
    'Sustainable Agriculture',
    'Theoretical Physics',
    'Aviation Science',
    'Data Analytics',
    'Consumer Science',
    'Educational Technology',
    'Neuroethics',
    'Space Science',
    'Gerontology',
    'Intelligence Studies',
    'Maritime Studies',
    'Medical Physics',
    'Rhetoric and Composition',
    'Risk Management',
    'Space Engineering',
    'Telecommunications',
    'Applied Linguistics',
    'Computational Mathematics',
    'Entertainment Management',
    'Health Informatics',
    'Medical Laboratory Science',
    'Music Therapy',
    'Public History',
    'Risk Analysis',
    'Speech Pathology',
    'Sport Psychology',
    'Technical Writing',
    'Urban Studies',
  ];

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
    // Save the major information to the database
    if (user && formData.major !== '') {
      db.collection('SurveyResponses')
        .doc(user.id)
        .update({ major: formData.major })
        .then(() => {
          console.log("Document successfully updated!");
          // Navigate to the next step (Step 10 or any other step)
          navigate('/rent/off-campus/step10');
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    } else {
      setErrorMessage("Please select a valid major");
    }
  };

  const isNextButtonDisabled = formData.major === ''; // Disable if no major is selected

  return (
    <div className="form-container">
      <h2 className="step-title">Major/Area Of Study</h2>
      <p className="step-description">
        Select your major or proposed major if you haven't declared yet:
      </p>

      {/* Dropdown for selecting the major */}
      <select
        id="major"
        className="input-field"
        value={formData.major}
        onChange={(e) => {
          setFormData((prevData) => ({
            ...prevData,
            major: e.target.value,
          }));
          setErrorMessage(''); // Clear error message when the user makes a selection
        }}
      >
        <option value="">Select a Major</option>
        {majorChoices.map((major) => (
          <option key={major} value={major}>
            {major}
          </option>
        ))}
      </select>

      {/* Back button to navigate to the previous step */}
      <Link to="/rent/off-campus/step8">
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

export default OffCampusHousingFormStep9;
