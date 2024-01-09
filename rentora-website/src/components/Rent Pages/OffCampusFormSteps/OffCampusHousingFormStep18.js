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
    photoIdType: '',
    photoIdNumber: '',
    issuingGovernment: '', // New state for issuing government
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
              setImagePreview(storedData.governmentId);
            }
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, [user]);

  useEffect(() => {
    // Save photoIdType, photoIdNumber, and issuingGovernment to the database whenever they change
    if (user) {
      const updateData = {};
      
      if (formData.photoIdType) {
        updateData.photoIdType = formData.photoIdType;
      }

      if (formData.photoIdNumber) {
        updateData.photoIdNumber = formData.photoIdNumber;
      }

      if (formData.issuingGovernment) {
        updateData.issuingGovernment = formData.issuingGovernment;
      }

      if (Object.keys(updateData).length > 0) {
        // Only update if there is data to update
        db.collection('SurveyResponses').doc(user.id).update(updateData)
          .then(() => {
            console.log('Photo ID Type, Number, and Issuing Government saved to the database');
          })
          .catch((error) => {
            console.error('Error saving Photo ID Type, Number, and Issuing Government:', error);
          });
      }
    }
  }, [user, formData.photoIdType, formData.photoIdNumber, formData.issuingGovernment]);

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

  const handlePhotoIdTypeChange = (e) => {
    const selectedType = e.target.value;
    setFormData({
      ...formData,
      photoIdType: selectedType,
    });
  };

  const handlePhotoIdNumberChange = (e) => {
    const number = e.target.value;
    setFormData({
      ...formData,
      photoIdNumber: number,
    });
  };

  const handleIssuingGovernmentChange = (e) => {
    const selectedGovernment = e.target.value;
    setFormData({
      ...formData,
      issuingGovernment: selectedGovernment,
    });
  };

  const handleNext = async () => {
    if (!formData.photoIdType || !formData.photoIdNumber || !formData.issuingGovernment) {
      // Display an alert if any of the required fields are not filled
      alert('Please fill in all required fields.');
      return;
    }

    if (user) {
      if (formData.file) {
        const newFormData = {
          governmentId: await uploadFileToStorage(user.id, formData.file),
          photoIdType: formData.photoIdType,
          photoIdNumber: formData.photoIdNumber,
          issuingGovernment: formData.issuingGovernment,
        };

        await db.collection('SurveyResponses').doc(user.id).update(newFormData);
      }
    }

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
      return '';
    }
  };

  const top50Countries = [
    "United States", "China", "India", "Indonesia", "Pakistan", "Brazil", "Nigeria", "Bangladesh", "Russia", "Mexico",
    "Japan", "Ethiopia", "Philippines", "Egypt", "Vietnam", "DR Congo", "Turkey", "Iran", "Germany", "Thailand",
    "United Kingdom", "France", "Italy", "Tanzania", "South Africa", "Myanmar", "Kenya", "South Korea", "Colombia", "Spain",
    "Uganda", "Argentina", "Algeria", "Sudan", "Ukraine", "Iraq", "Afghanistan", "Poland", "Canada", "Morocco", "Saudi Arabia",
    "Uzbekistan", "Malaysia", "Peru", "Angola", "Ghana", "Mozambique", "Yemen", "Nepal", "Venezuela"
  ];

  return (
<div className="form-container" style={{ width: '50%', margin: '60px auto', maxHeight: '80vh', overflowY: 'auto', padding: '20px' }}>
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

      <div className="select-container">
        <label htmlFor="photoIdType">Select Photo ID Type:</label>
        <select
          id="photoIdType"
          name="photoIdType"
          value={formData.photoIdType}
          onChange={handlePhotoIdTypeChange}
          className="input-field"
        >
          <option value="">Select Type</option>
          <option value="driverLicense">Driver's License</option>
          <option value="passport">Passport</option>
        </select>
      </div>

      <div className="input-container">
        <label htmlFor="photoIdNumber">Photo ID Number:</label>
        <input
          type="text"
          id="photoIdNumber"
          name="photoIdNumber"
          value={formData.photoIdNumber}
          onChange={handlePhotoIdNumberChange}
          className="input-field"
        />
      </div>

      {/* Add dropdown for Issuing Government */}
      <div className="select-container">
        <label htmlFor="issuingGovernment">Issuing Government:</label>
        <select
          id="issuingGovernment"
          name="issuingGovernment"
          value={formData.issuingGovernment}
          onChange={handleIssuingGovernmentChange}
          className="input-field"
        >
          <option value="">Select Government</option>
          {top50Countries.map((country, index) => (
            <option key={index} value={country}>
              {country}
            </option>
          ))}
        </select>
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