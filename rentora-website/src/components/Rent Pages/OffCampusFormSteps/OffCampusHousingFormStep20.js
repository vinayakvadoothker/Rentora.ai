// OffCampusHousingFormStep20.js

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
    const [showModal, setShowModal] = useState(false);

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
            const certificateURL = await uploadFileToStorage(user.id, file);
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
            return '';
        }
    };

    const handleNext = () => {
        console.log('Navigating to the next step');
        navigate('/rent/off-campus/step21');
    };

    const [modalUrl, setModalUrl] = useState("");  // Store the URL of the link to display in the modal

    const openModal = (url) => {
      setModalUrl(url);
      setShowModal(true);
    };
  
    const closeModal = () => {
      setModalUrl(""); // Clear the modal URL when closing
      setShowModal(false);
    };
  
    const handleLinkClick = (newSrc) => {
        window.open(newSrc, '_blank');
      };
  



    return (
        <div className="form-container" style={{ marginTop: '35px' }}>
          <h2 className="step-title">Rental Workshop Certificate</h2>
          <p className="step-description">
            Please Complete the Following Workshop and Upload Your Certificate
          </p>
    
          <button onClick={() => handleLinkClick("https://canvas.ucsc.edu/enroll/7DWCHX")}>
            Open Workshop
          </button>
    
          {showModal && (
            <div className="modal-background">
              <div className="modal-content">
                <iframe
                  title="Workshop Content"
                  src={modalUrl}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                />
                <button onClick={closeModal} className="close-button">Close</button>
              </div>
            </div>
          )}

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
