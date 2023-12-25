import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from "@clerk/clerk-react";
import { db, storage } from "../../config";
import './styles.css';

const OffCampusHousingFormStep18 = () => {
    
  const { user } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    governmentId: '',
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (user) {
      db.collection('SurveyResponses')
        .doc(user.id)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const storedData = doc.data();
            setFormData(storedData);

            if (storedData.governmentId) {
              // If there's an existing government ID, set the image preview
              setImagePreview(storedData.governmentId);
            }
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }

    setFormData({
      ...formData,
      governmentId: file.name,
      file: file,
    });
  };

  const handleNext = async () => {
    if (user) {
      // Check if a new file is selected
      if (formData.file) {
        // Continue with the logic to upload the government ID
        const newFormData = {
          governmentId: await uploadFileToStorage(user.id, formData.file),
        };
  
        // Update the document with the new data
        await db.collection('SurveyResponses').doc(user.id).update(newFormData);
      }
    }
  
    // Navigate to the next step
    navigate('/rent/off-campus/step19');
  };

  const uploadFileToStorage = async (userId, file) => {
    const storageRef = storage.ref(`userGovernmentIds/${userId}/${file.name}`);
    try {
      const snapshot = await storageRef.put(file);
      console.log('File uploaded successfully!', snapshot);

      const downloadURL = await storageRef.getDownloadURL();
      return downloadURL;
    } catch (error) {
      console.error("Error uploading file: ", error);
      return ''; // fallback to an empty string or handle accordingly
    }
  };

  return (
    <div className="form-container" style={{ marginTop: '35px' }}>
      <h2 className="step-title">Photo ID</h2>
      <p className="step-description">Please Upload a Government-Issued Photo ID*</p>

      {imagePreview && (
        <img
          src={imagePreview}
          alt="Preview"
          className="image-preview"
        />
      )}

      <div className="file-input-container">
        <input
          type="file"
          accept="*"
          onChange={handleFileChange}
          className="input-field file-input"
        />
      </div>

      <Link to="/rent/off-campus/step17">
        <span className="back-button">{'<-'}</span>
      </Link>

      <button
        className="next-button"
        onClick={handleNext}
        disabled={!formData.governmentId}
      >
        Next
      </button>
    </div>
  );
};

export default OffCampusHousingFormStep18;
