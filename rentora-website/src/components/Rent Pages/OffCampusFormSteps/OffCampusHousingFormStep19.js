import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from "@clerk/clerk-react";
import { db, storage } from "../../config";
import './styles.css';

const OffCampusHousingFormStep19 = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [fileUrls, setFileUrls] = useState([]);

  useEffect(() => {
    if (user) {
      db.collection('SurveyResponses')
        .doc(user.id)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const formData = doc.data();
            if (formData.lettersOfReference && Array.isArray(formData.lettersOfReference)) {
              setFileUrls([...formData.lettersOfReference]);
            }
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, [user]);

  const handleFileChange = async (e) => {
    try {
      const files = e.target.files;

      if (!files) {
        console.error("No files selected");
        return;
      }

      const newUrls = [];

      for (const file of files) {
        // Upload file to storage
        const storageRef = storage.ref(`userLettersOfReference/${user.id}/${file.name}`);
        await storageRef.put(file);

        // Get the storage URL
        const downloadURL = await storageRef.getDownloadURL();
        
        // Add the URL to the array
        newUrls.push(downloadURL);
      }

      setFileUrls((prevUrls) => [...prevUrls, ...newUrls]);
    } catch (error) {
      console.error("Error in handleFileChange:", error);
    }
  };

  const handleRemoveFile = (index) => {
    setFileUrls((prevUrls) => {
      const updatedUrls = [...prevUrls];
      updatedUrls.splice(index, 1);
      return updatedUrls;
    });
  };

  const handleNext = async () => {
    if (user) {
      const newFormData = {
        lettersOfReference: fileUrls,
      };

      await db.collection('SurveyResponses').doc(user.id).update(newFormData);
    }

    // Navigate to the next step
    navigate('/rent/off-campus/step20');
  };

  return (
    <div className="form-container" style={{ marginTop: '35px' }}>
      <h2 className="step-title">Letters of Reference</h2>
      <p className="step-description">Please Upload Any Letters of Reference (Optional)</p>

      {fileUrls.map((url, index) => (
        <div key={index} className="image-preview-container">
          <img
            src={url}
            alt={`Preview ${index + 1}`}
            className="image-preview"
          />
          <button onClick={() => handleRemoveFile(index)} className="remove-button">
            Remove
          </button>
        </div>
      ))}

      <div className="file-input-container">
        <input
          type="file"
          accept="*"
          onChange={handleFileChange}
          className="input-field file-input"
          multiple
        />
      </div>

      <Link to="/rent/off-campus/step18">
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

export default OffCampusHousingFormStep19;
