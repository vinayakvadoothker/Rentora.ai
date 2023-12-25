import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from "../../config";
import { useUser } from "@clerk/clerk-react";
import './styles.css'; // Import the CSS file

const OffCampusHousingFormStep12 = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({
        activitiesHistory: [],
    });

    useEffect(() => {
        // Fetch and set the saved data when the component mounts
        if (user) {
            db.collection('SurveyResponses')
                .doc(user.id)
                .get()
                .then((doc) => {
                    if (doc.exists) {
                        setFormData(prevData => ({
                            ...prevData,
                            activitiesHistory: doc.data().activitiesHistory || [],
                        }));
                    }
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [user]);

    const validateDates = (start, end, isPresent) => {
        return isPresent || (start && end && new Date(start) <= new Date(end));
    };

    // ... (existing code)

    const saveAnswer = () => {
        // Validate dates before updating the document
        const isValid = formData.activitiesHistory.length === 0 ||
            formData.activitiesHistory.every(entry =>
                validateDates(entry.startDate, entry.endDate, entry.present)
            );

        if (isValid) {
            const formattedData = {
                activitiesHistory: formData.activitiesHistory.map(entry => ({
                    organization: entry.organization,
                    title: entry.title,
                    startDate: entry.startDate,
                    endDate: entry.present ? 'Present' : entry.endDate,
                    present: entry.present,
                })),
            };

            console.log("Formatted Data:", formattedData);

            db.collection('SurveyResponses')
                .doc(user.id)
                .update(formattedData)
                .then(() => {
                    console.log("Document successfully updated!");
                    navigate('/rent/off-campus/step13');
                })
                .catch((error) => {
                    console.error("Error updating document: ", error);
                });
        } else {
            setErrorMessage("Please ensure that Start Date and End Date are provided and that End Date is after Start Date for all entries, or set it to 'Present' if you are still involved");
        }
    };

    const handleAddEntry = () => {
        setFormData((prevData) => ({
            ...prevData,
            activitiesHistory: [...prevData.activitiesHistory, {
                organization: '',
                title: '',
                startDate: '',
                endDate: '',
                present: false, // Add the "Present" checkbox status
            }],
        }));
    };

    const handleDeleteEntry = (index) => {
        setFormData((prevData) => {
            const updatedActivitiesHistory = [...prevData.activitiesHistory];
            updatedActivitiesHistory.splice(index, 1);
            return {
                ...prevData,
                activitiesHistory: updatedActivitiesHistory,
            };
        });
    };

    const handleInputChange = (index, field, value) => {
        setFormData((prevData) => {
            const updatedActivitiesHistory = [...prevData.activitiesHistory];
            updatedActivitiesHistory[index][field] = value;

            // If 'Present' checkbox is checked, clear the endDate value
            if (field === 'present' && value) {
                updatedActivitiesHistory[index].endDate = 'Present';
            }

            return {
                ...prevData,
                activitiesHistory: updatedActivitiesHistory,
            };
        });
    };

    console.log("Form Data:", formData);

    return (
        <div className="form-container" style={{ marginTop: '55px' }}>
            <h2 className="step-title">Extracurricular Activities</h2>
            <p className="step-description">Please Add Your Extracurricular Activities:</p>

            {Array.isArray(formData.activitiesHistory) && formData.activitiesHistory.map((entry, index) => (
                <div key={index} className="activities-entry">
                    <div className="form-row">
                        <label>Organization:</label>
                        <input
                            type="text"
                            value={entry.organization}
                            onChange={(e) => handleInputChange(index, 'organization', e.target.value)}
                        />
                        <label className="end-label">Title:</label>
                        <input
                            type="text"
                            value={entry.title}
                            onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                        />
                        <button onClick={() => handleDeleteEntry(index)} className='end-label'> - </button>
                    </div>
                    <div className="form-row">
                        <label>Start:</label>
                        <input
                            type="date"
                            value={entry.startDate}
                            onChange={(e) => handleInputChange(index, 'startDate', e.target.value)}
                        />
                        <label className="end-label">End:</label>
                        {entry.present ? (
                            <React.Fragment>
                                <span className="present-checkbox">Present</span>
                                <input
                                    type="checkbox"
                                    checked={entry.present}
                                    onChange={(e) => handleInputChange(index, 'present', e.target.checked)}
                                />
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <input
                                    type="date"
                                    value={entry.endDate}
                                    onChange={(e) => handleInputChange(index, 'endDate', e.target.value)}
                                />
                                <label className="end-label">
                                    <input
                                        type="checkbox"
                                        checked={entry.present}
                                        onChange={(e) => handleInputChange(index, 'present', e.target.checked)}
                                    />
                                    Present
                                </label>
                            </React.Fragment>
                        )}
                    </div>
                </div>
            ))}

            <div className="add-another-container">
                <button onClick={handleAddEntry}>+ Add Another</button>
            </div>

            <Link to="/rent/off-campus/step11">
                <span className="back-button">{'<-'}</span>
            </Link>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <button
                className="next-button"
                onClick={saveAnswer}
            >
                Next
            </button>
        </div>
    );
};

export default OffCampusHousingFormStep12;
