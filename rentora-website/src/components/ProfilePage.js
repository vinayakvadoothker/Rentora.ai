// ProfilePage.js
import React, { useRef } from 'react';
import { useClerk } from '@clerk/clerk-react';

const ProfilePage = () => {
  const { user } = useClerk();
  const fileInputRef = useRef(null);

  // Dummy data for demonstration, replace with actual user data
  const userProfile = {
    firstName: user?.firstName ?? 'John',
    lastName: user?.lastName ?? 'Doe',
    email: user?.primaryEmailAddress?.email ?? 'john.doe@example.com',
    phoneNumber: user?.primaryPhoneNumber?.phoneNumber ?? '123-456-7890',
    profileImage: user?.imageUrl ?? 'url_to_default_image.jpg',
    housingPreferences: user?.housingPreferences ?? 'Your housing preferences here',
  };

  // Function to handle editing the profile image
  const handleEditProfileImage = () => {
    // Trigger file input click
    fileInputRef.current.click();
  };

  // Function to handle file selection
  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      try {
        // Call setProfileImage with the selected file
        const uploadedImage = await user.setProfileImage({ file });

        // You can update the UI or handle success as needed
        window.location.reload();
        console.log('Image uploaded successfully:', uploadedImage);
      } catch (error) {
        // Handle error
        console.error('Error uploading image:', error);
      }
    }
  };

  return (
    <div style={styles.container} className="form-container">
      {/* Profile Image with Edit Button */}
      <div style={styles.imageContainer}>
        <img src={userProfile.profileImage} alt="Profile" style={styles.profileImage} />
        <div style={styles.editImageButtonContainer}>
          <button onClick={handleEditProfileImage} style={styles.editImageButton}>
            Edit
          </button>
        </div>
        {/* File input for profile image */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>

      {/* User Name */}
      <div style={styles.nameContainer}>
        <h2 style={styles.userName}>
          <strong>{userProfile.firstName} {userProfile.lastName}</strong>
        </h2>
        <p style={styles.username}>{user?.username && <em>{user.username}</em>}</p>
      </div>

      {/* Contact Info */}
      <div style={styles.contactContainer}>
        <p style={styles.contactInfo}>Email: {userProfile.email}</p>
        <p style={styles.contactInfo}>Phone: {userProfile.phoneNumber}</p>
      </div>

      {/* Preferences for Housing Types */}
      <div style={styles.preferencesContainer}>
        <h3 style={styles.preferencesHeading}>Housing Preferences</h3>
        <p style={styles.preferencesText}>{userProfile.housingPreferences}</p>
      </div>
    </div>
  );
};

export default ProfilePage;

// Updated Styling
const styles = {
  container: {
    textAlign: 'center',
    padding: '50px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '700px', // Increased width
  },
  imageContainer: {
    position: 'relative',
    marginBottom: '20px',
  },
  profileImage: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
  },
  editImageButton: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    transform: 'translate(-520%, 50%)', // Center the button
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    padding: '8px', // Smaller padding
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontFamily: 'monospace',
    fontSize: '12px', // Smaller font size
  },
  nameContainer: {
    marginBottom: '10px',
  },
  userName: {
    fontSize: '24px',
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  username: {
    fontSize: '14px', // Smaller font size
    fontStyle: 'italic',
  },
  contactContainer: {
    marginBottom: '20px',
  },
  contactInfo: {
    fontSize: '16px',
    marginBottom: '10px',
    fontFamily: 'monospace',
  },
  portfolioContainer: {
    marginBottom: '20px',
  },
  portfolioHeading: {
    fontSize: '18px',
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  socialLink: {
    fontSize: '16px',
    margin: '5px 0',
    fontFamily: 'monospace',
  },
  preferencesContainer: {
    marginTop: '20px',
  },
  preferencesHeading: {
    fontSize: '18px',
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  preferencesText: {
    fontSize: '16px',
    fontFamily: 'monospace',
  },
};
