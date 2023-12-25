import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from "../../config";
import { useUser } from "@clerk/clerk-react";
import './styles.css'; // Import the CSS file

const OffCampusHousingFormStep17 = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [errorMessage] = useState('');
    const [formData, setFormData] = useState({
        references: [],
    });
    const MAX_REFERENCES = 3;


    useEffect(() => {
        // Fetch and set the saved data when the component mounts
        if (user) {
            db.collection('SurveyResponses')
                .doc(user.id)
                .get()
                .then((doc) => {
                    if (doc.exists) {
                        const savedData = doc.data().references || [];

                        setFormData(prevData => ({
                            ...prevData,
                            references: savedData,
                        }));
                    }
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [user]);

    const handleInputChange = (index, field, value) => {
        setFormData((prevData) => {
            const updatedReferences = [...prevData.references];
            let formattedValue = value;

            // Auto-format the phone number as XXX-XXX-XXXX
            if (field === 'phoneNumber') {
                const sanitizedValue = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters

                if (sanitizedValue.length <= 3) {
                    formattedValue = sanitizedValue;
                } else if (sanitizedValue.length <= 6) {
                    formattedValue = `${sanitizedValue.slice(0, 3)}-${sanitizedValue.slice(3)}`;
                } else if (sanitizedValue.length <= 8) {
                    formattedValue = `${sanitizedValue.slice(0, 3)}-${sanitizedValue.slice(3, 6)}-${sanitizedValue.slice(6)}`;
                } else {
                    formattedValue = `${sanitizedValue.slice(0, 3)}-${sanitizedValue.slice(3, 6)}-${sanitizedValue.slice(6, 10)}`;
                }
            }

            updatedReferences[index][field] = formattedValue;

            return {
                ...prevData,
                references: updatedReferences,
            };
        });
    };

    const handleAddReference = () => {
        setFormData((prevData) => ({
            ...prevData,
            references: [...prevData.references, {
                name: '',
                relation: 'Select Relation',
                phoneNumber: '',
                email: '',
            }],
        }));
    };

    const handleDeleteReference = (index) => {
        setFormData((prevData) => {
            const updatedReferences = [...prevData.references];
            updatedReferences.splice(index, 1);
            return {
                ...prevData,
                references: updatedReferences,
            };
        });
    };

    const validatePhoneNumber = (phoneNumber) => {
        // Validate if the phone number has exactly 10 digits and contains only numbers
        return /^\d{3}-\d{3}-\d{4}$/.test(phoneNumber);
    };

    const validateEmail = (email) => {
        // Basic email format validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const saveAnswer = () => {
        // Validation logic here
        const isReferenceDataValid = formData.references.every((reference, index) => {
            console.log(`Checking reference ${index + 1}`);
            console.log('Name:', reference.name.trim() !== '');
            console.log('Relation:', reference.relation !== 'Select Relation');
            console.log('Phone Number:', validatePhoneNumber(reference.phoneNumber));
            console.log('Email:', validateEmail(reference.email));
        
            return (
                reference.name.trim() !== '' &&
                reference.relation !== 'Select Relation' &&
                validatePhoneNumber(reference.phoneNumber) &&
                validateEmail(reference.email)
            );
        });
        
        console.log('isReferenceDataValid:', isReferenceDataValid);
    
        console.log('isReferenceDataValid:', isReferenceDataValid);
    
        if (!isReferenceDataValid) {
            // Display an alert or error message
            alert('Please provide valid information for each reference before proceeding.');
            return;
        }
    
        const formattedData = {
            references: formData.references.map(reference => ({
                name: reference.name.trim(),
                relation: reference.relation,
                phoneNumber: reference.phoneNumber,
                email: reference.email.trim(),
            })),
        };
    
        console.log("Formatted Data:", formattedData);
    
        db.collection('SurveyResponses')
            .doc(user.id)
            .update({ references: formattedData.references })
            .then(() => {
                console.log("Document successfully updated!");
                // Navigate to the next step or any other step
                navigate('/rent/off-campus/step18');
            })
            .catch((error) => {
                console.error("Error updating document: ", error);
            });
    };


    return (
        <div className="form-container" style={{ marginTop: '55px', width:'1000px' }}>
            <h2 className="step-title">References</h2>
            <p className="step-description">Please Add All Your References (Up To 3)</p>

            {formData.references.slice(0, MAX_REFERENCES).map((reference, index) => (
                <div key={index} className="reference-entry" style={{ marginBottom: '15px' }}>
                <div className="input-group">
                        <div className="name-relation-group">
                            <label>Name:</label>
                            <input
                                type="text"
                                value={reference.name}
                                onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                            />

                            <label>Relation:</label>
                            <select
                                value={reference.relation}
                                onChange={(e) => handleInputChange(index, 'relation', e.target.value)}
                            >
                                <option value="Select Relation" disabled hidden>Select Relation</option>
                                <option value="Friend">Friend</option>
                                <option value="Mother">Mother</option>
                                <option value="Father">Father</option>
                                <option value="Brother">Brother</option>
                                <option value="Sister">Sister</option>
                                <option value="Uncle">Uncle</option>
                                <option value="Aunt">Aunt</option>
                                <option value="Colleague">Colleague</option>
                                <option value="Neighbor">Neighbor</option>
                                <option value="Spouse">Spouse</option>
                                <option value="Child">Child</option>
                                <option value="Relative">Relative</option>
                                <option value="Other">Other</option>
                                {/* Add more relation options as needed */}
                            </select>

                            <button onClick={() => handleDeleteReference(index)}> - </button>
                        </div>

                        <div className="input-group-phone-email">
                            <label>Phone Number:</label>
                            <input
                                type="tel"
                                value={reference.phoneNumber}
                                onChange={(e) => {
                                    // Allow only numbers in the phone number input
                                    const sanitizedValue = e.target.value.replace(/[^0-9]/g, '');
                                    handleInputChange(index, 'phoneNumber', sanitizedValue);
                                }}
                                maxLength="12"
                            />

                            <label>Email:</label>
                            <input
                                type="email"
                                value={reference.email}
                                onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            ))}

            {formData.references.length < MAX_REFERENCES && (
                <div className="add-another-container">
                    <button onClick={handleAddReference}>+ Add Another</button>
                </div>
            )}

            <Link to="/rent/off-campus/step16">
                <span className="back-button">{'<-'}</span>
            </Link>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <button className="next-button" onClick={saveAnswer}>
                Next
            </button>
        </div>
    );
};

export default OffCampusHousingFormStep17;