// OffCampusHousingFormStep5.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from "@clerk/clerk-react";
import { db, storage } from "../../config";
import './styles.css';

const OffCampusHousingFormStep5 = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    profilePicture: user?.imageUrl ?? 'url_to_default_image.jpg',
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (user) {
      db.collection('SurveyResponses').doc(user.id).get()
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
      profilePicture: file.name,
      file: file,
    });
  };

  const uploadClerkProfileImage = async () => {
    try {
      const clerkProfileImageURL = user?.imageUrl
      
      console.log("Attempting to download Clerk profile image from:", clerkProfileImageURL || "URL not available");
  
      if (clerkProfileImageURL) {
        const response = await fetch(clerkProfileImageURL);
        const blob = await response.blob();
  
        const storageRef = storage.ref(`userProfilePictures/${user.id}/clerkProfileImage.jpg`);
        const snapshot = await storageRef.put(blob);
        console.log('Clerk profile image uploaded successfully!', snapshot);
  
        const downloadURL = await storageRef.getDownloadURL();
        setFormData({
          ...formData,
          profilePicture: downloadURL,
        });
  
        await db.collection('SurveyResponses').doc(user.id).update(formData);
        console.log("Document successfully updated!");
      } else {
        console.log("Clerk profile image URL not available. Using default image or handle accordingly.");
      }
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };
  

  const handleNext = async () => {
    if (user) {
      const clerkUserID = user.id;
      console.log("Clerk User ID:", clerkUserID);
  
      const newFormData = {
        profilePicture: formData.file
          ? await uploadFileToStorage(user.id, formData.file)
          : user?.imageUrl ?? 'url_to_default_image.jpg',
      };
  
      await db.collection('SurveyResponses').doc(user.id).update(newFormData);
      console.log("Document successfully updated!");
    } else {
      console.log("User not authenticated");
    }
  
    navigate('/rent/off-campus/step6');
  };
  
  const uploadFileToStorage = async (userId, file) => {
    const storageRef = storage.ref(`userProfilePictures/${userId}/${file.name}`);
    try {
      const snapshot = await storageRef.put(file);
      console.log('File uploaded successfully!', snapshot);
  
      const downloadURL = await storageRef.getDownloadURL();
      return downloadURL;
    } catch (error) {
      console.error("Error uploading file: ", error);
      return 'url_to_default_image.jpg'; // fallback to default image URL
    }
  };
  
  

  return (
    <div className="form-container" style={{ marginTop: '35px' }}>
      <h2 className="step-title">Upload Profile Picture</h2>
      <p className="step-description">Please Upload a Professional Picture For The Cover Of Your Application *</p>

      {imagePreview ? (
        <img
          src={imagePreview}
          alt="Preview"
          className="image-preview"
        />
      ) : (
        <img
          src={user?.imageUrl}
          alt="Profile"
          style={styles.profileImage}
        />
      )}

      <div className="file-input-container">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="input-field file-input"
        />
      </div>

      <Link to="/rent/off-campus/step4">
        <span className="back-button">{'<-'}</span>
      </Link>

      <button className="next-button" onClick={handleNext}>
        Next
      </button>
    </div>
  );
};

const styles = {
  profileImage: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
};

export default OffCampusHousingFormStep5;
