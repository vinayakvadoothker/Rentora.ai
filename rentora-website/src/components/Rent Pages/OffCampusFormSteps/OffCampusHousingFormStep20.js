import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from "@clerk/clerk-react";
import { db, storage } from "../../config";
import './styles.css';

const OffCampusHousingFormStep20 = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [certificateFile, setCertificateFile] = useState(null);
  const [certificateUrlFromDb, setCertificateUrlFromDb] = useState(null);

  useEffect(() => {
    if (user) {
      db.collection('SurveyResponses')
        .doc(user.id)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const formData = doc.data();
            setCertificateUrlFromDb(formData.rentalWorkshopCertificate);
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, [user]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Continue with the logic to upload the certificate
      const certificateURL = await uploadFileToStorage(user.id, file);

      // Update the document with the certificate URL
      await db.collection('SurveyResponses').doc(user.id).update({
        rentalWorkshopCertificate: certificateURL,
      });

      setCertificateUrlFromDb(certificateURL);
    }
  };

  const uploadFileToStorage = async (userId, file) => {
    const storageRef = storage.ref(`userCertificates/${userId}/${file.name}`);
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

  const handleNext = () => {
    console.log('Navigating to the next step');
    // Navigate to the next step
    navigate('/rent/off-campus/step21');
  };

  return (
    <div className="form-container" style={{ marginTop: '35px' }}>
      <h2 className="step-title">Rental Workshop Certificate</h2>
      <p className="step-description">
        Please Complete the Following Workshop and Upload Your Certificate
      </p>

      <button
        className="popup-button"
        onClick={() => window.open('https://canvas.ucsc.edu/enroll/7DWCHX', '_blank')}
      >
        Open Workshop Popup
      </button>

      {certificateUrlFromDb && (
        <div className="image-preview-container">
          <img
            src={certificateUrlFromDb}
            alt="Certificate Preview"
            className="image-preview"
          />
        </div>
      )}

      {certificateFile && (
        <div className="image-preview-container">
          <img
            src={URL.createObjectURL(certificateFile)}
            alt="Certificate Preview"
            className="certificate-preview"
          />
        </div>
      )}

      <div className="file-input-container">
        <input
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="input-field file-input"
        />
      </div>

      <Link to="/rent/off-campus/step19">
        <span className="back-button">{'<-'}</span>
      </Link>

      <button
        className="next-button"
        onClick={handleNext}
      >
        Next
      </button>
    </div>
  );
};

export default OffCampusHousingFormStep20;
