import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from "../../config";
import { useUser } from "@clerk/clerk-react";
import './styles.css';

const OffCampusHousingFormStep11 = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({
        employmentHistory: [],
    });

    useEffect(() => {
        if (user) {
            db.collection('SurveyResponses')
                .doc(user.id)
                .get()
                .then((doc) => {
                    if (doc.exists) {
                        setFormData(prevData => ({
                            ...prevData,
                            employmentHistory: doc.data().employmentHistory || [],
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

    const saveAnswer = () => {
        const isValid = formData.employmentHistory.every(entry =>
            validateDates(entry.startDate, entry.endDate, entry.present)
        );

        if (isValid) {
            const updatedFormData = {
                employmentHistory: formData.employmentHistory.map(entry => ({
                    ...entry,
                    endDate: entry.present ? 'Present' : entry.endDate,
                })),
            };

            db.collection('SurveyResponses')
                .doc(user.id)
                .update(updatedFormData)
                .then(() => {
                    console.log("Document successfully updated!");
                    navigate('/rent/off-campus/step12');
                })
                .catch((error) => {
                    console.error("Error updating document: ", error);
                });
        } else {
            setErrorMessage("Please ensure that Start Date and End Date are provided and that End Date is after Start Date for all entries, or set it to 'Present' if you are still working there");
        }
    };

    const handleAddEntry = () => {
        setFormData((prevData) => ({
            ...prevData,
            employmentHistory: [...prevData.employmentHistory, {
                employer: '',
                title: '',
                startDate: '',
                endDate: '',
                present: false, // Default 'present' to false
            }],
        }));
    };

    const handleDeleteEntry = (index) => {
        setFormData((prevData) => {
            const updatedEmploymentHistory = [...prevData.employmentHistory];
            updatedEmploymentHistory.splice(index, 1);
            return {
                ...prevData,
                employmentHistory: updatedEmploymentHistory,
            };
        });
    };

    const handleInputChange = (index, field, value) => {
        setFormData((prevData) => {
            const updatedEmploymentHistory = [...prevData.employmentHistory];
            updatedEmploymentHistory[index][field] = value;

            // If 'Present' checkbox is checked, set the present field to true
            if (field === 'present' && value) {
                updatedEmploymentHistory[index].present = true;
                updatedEmploymentHistory[index].endDate = 'Present'; // Set end date to 'Present'
            } else if (field === 'endDate' && updatedEmploymentHistory[index].present) {
                // If endDate is manually selected after 'Present' checkbox was checked, uncheck the 'Present' checkbox
                updatedEmploymentHistory[index].present = false;
            }

            return {
                ...prevData,
                employmentHistory: updatedEmploymentHistory,
            };
        });
    };

    return (
        <div className="form-container" style={{ marginTop: '35px' }}>
            <h2 className="step-title">Employment History</h2>
            <p className="step-description">Please Add Your Previous and Current Employment History</p>

            {Array.isArray(formData.employmentHistory) && formData.employmentHistory.map((entry, index) => (
                <div key={index} className="employment-entry">
                    <div className="form-row">
                        <label>Employer:</label>
                        <input
                            type="text"
                            value={entry.employer}
                            onChange={(e) => handleInputChange(index, 'employer', e.target.value)}
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
                            <span></span>
                        ) : (
                            <input
                                type="date"
                                value={entry.endDate}
                                onChange={(e) => handleInputChange(index, 'endDate', e.target.value)}
                            />
                        )}
                        <label className="end-label">
                            <input
                                type="checkbox"
                                checked={entry.present}
                                onChange={(e) => handleInputChange(index, 'present', e.target.checked)}
                            />
                            Present
                        </label>
                    </div>
                </div>
            ))}
            <div className="add-another-container">
                <button onClick={handleAddEntry}>+ Add Another</button>
            </div>

            <Link to="/rent/off-campus/step10">
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

export default OffCampusHousingFormStep11;
