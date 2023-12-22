// OffCampusHousingFormStep1.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from "../../config";
import { useUser } from "@clerk/clerk-react";
import './styles.css'; // Import the CSS file

const OffCampusHousingFormStep1 = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    // Initialize state with default values
    const [formData, setFormData] = useState({
        schoolName: '',
    });

    useEffect(() => {
        // Fetch and set the saved data when the component mounts
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

    const saveAnswer = (event) => {
        event.preventDefault();

        const newFormData = {
            schoolName: event.target['school-name'].value,
        };

        if (user) {
            const clerkUserID = user.id;
            console.log("Clerk User ID:", clerkUserID);

            // Check if document exists
            db.collection('SurveyResponses').doc(user.id).get()
                .then((doc) => {
                    if (doc.exists) {
                        // Document exists, update it
                        db.collection('SurveyResponses').doc(user.id).update(newFormData)
                            .then(() => {
                                console.log("Document successfully updated!");
                            })
                            .catch((error) => {
                                console.error("Error updating document: ", error);
                            });
                    } else {
                        // Document does not exist, set it
                        db.collection('SurveyResponses').doc(user.id).set(newFormData)
                            .then(() => {
                                console.log("Document successfully set!");
                            })
                            .catch((error) => {
                                console.error("Error setting document: ", error);
                            });
                    }
                })
                .catch((error) => {
                    console.error('Error checking if document exists:', error);
                });
        } else {
            console.log("User not authenticated");
        }

        // Navigate to the next step
        navigate('step2');
    };

    return (
        <div className="form-container">
            <h2 className="step-title">Start By Getting Pre-Qualified</h2>
            <p className="step-description">Select Your School</p>

            {/* Dropdown for selecting the school */}
            <form onSubmit={saveAnswer}>
                <select
                    id="school-name"
                    className="input-field"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                >
                    <option value="UC Santa Cruz">UC Santa Cruz</option>
                    <option value="UCLA">UCLA</option>
                    {/* Add more options as needed */}
                </select>

                {/* Button to submit the form and navigate to the next step */}
                <button className="next-button" type="submit">
                    Start Here
                </button>
            </form>
        </div>
    );
};

export default OffCampusHousingFormStep1;
