import React, { useEffect, useState, useRef } from 'react';
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
  const imageSetRef = useRef(false);

  useEffect(() => {
    const userId = user?.id;

    if (userId) {
      console.log('Fetching data for user:', user);

      db.collection('SurveyResponses')
        .doc(userId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log('Document found in the database:', doc.data());

            const storedFormData = doc.data();
            if (storedFormData && storedFormData.profilePicture) {
              console.log('Using profile picture from the stored form data:', storedFormData.profilePicture);
              setFormData({
                profilePicture: storedFormData.profilePicture,
              });

              if (imagePreview) {
                setImagePreview(null);
              }
              
              imageSetRef.current = true;
            } else {
              console.log('No profile picture found in the stored form data. Using Clerk image.');
              setFormData({
                profilePicture: user.imageUrl ?? 'url_to_default_image.jpg',
              });
            }
          } else {
            console.log('No document found in the database. Using Clerk image.');
            setFormData({
              profilePicture: user.imageUrl ?? 'url_to_default_image.jpg',
            });
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          console.log('Using Clerk image due to an error.');
          setFormData({
            profilePicture: user.imageUrl ?? 'url_to_default_image.jpg',
          });
        });
    }
  }, [user, imagePreview]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
  
    const reader = new FileReader();
    reader.onloadend = async () => {
      setImagePreview(reader.result);
  
      // Upload the file to storage immediately
      const downloadURL = await uploadFileToStorage(user?.id, file);
      setFormData({
        ...formData,
        profilePicture: downloadURL,
        file: file,
      });
    };
  
    if (file) {
      reader.readAsDataURL(file);
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
      return 'url_to_default_image.jpg';
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
          src={formData.profilePicture}
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
