import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from "../../config";
import { useUser } from "@clerk/clerk-react";
import './styles.css'; // Import the CSS file

const OffCampusHousingFormStep14 = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [errorMessage] = useState('');
    const [formData, setFormData] = useState({
        monthlyIncome: [],
    });

    useEffect(() => {
        // Fetch and set the saved data when the component mounts
        if (user) {
            db.collection('SurveyResponses')
                .doc(user.id)
                .get()
                .then((doc) => {
                    if (doc.exists) {
                        const savedData = doc.data().monthlyIncome || [];
    
                        // Map the saved data to set initial form data
                        const initialFormData = savedData.map(entry => {
                            const source = entry.source || 'Select Source';
                            const otherSource = source === 'Other' ? entry.otherSource : '';
    
                            // If the source is not one of the predefined options, set it to "Other"
                            const isCustomSource = !['Employment', 'Parents', 'Student Loans', 'Scholarship', 'Other'].includes(source);
                            if (isCustomSource) {
                                return {
                                    source: 'Other',
                                    otherSource: source,
                                    amount: entry.amount || '',
                                };
                            }
    
                            return {
                                source: source,
                                otherSource: otherSource,
                                amount: entry.amount || '',
                            };
                        });
    
                        console.log('Initial Form Data:', initialFormData);
    
                        setFormData(prevData => ({
                            ...prevData,
                            monthlyIncome: initialFormData,
                        }));
                    }
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [user]);
    

    const formatCurrency = (value) => {
        // Convert the value to a number
        const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));

        // Check if it's a valid number
        if (!isNaN(numericValue)) {
            // Format the number as currency (USD) with commas
            return numericValue.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            });
        }

        // If the value is not a valid number, return it as is
        return value;
    };

    const handleInputChange = (index, field, value) => {
        setFormData((prevData) => {
            const updatedMonthlyIncome = [...prevData.monthlyIncome];
            updatedMonthlyIncome[index][field] = field === 'amount' ? formatCurrency(value) : value;
            return {
                ...prevData,
                monthlyIncome: updatedMonthlyIncome,
            };
        });
    };

    const handleAddEntry = () => {
        setFormData((prevData) => ({
            ...prevData,
            monthlyIncome: [...prevData.monthlyIncome, {
                source: 'Select Source',
                amount: '',
                otherSource: '',
            }],
        }));
    };

    const handleDeleteEntry = (index) => {
        setFormData((prevData) => {
            const updatedMonthlyIncome = [...prevData.monthlyIncome];
            updatedMonthlyIncome.splice(index, 1);
            return {
                ...prevData,
                monthlyIncome: updatedMonthlyIncome,
            };
        });
    };

    const saveAnswer = () => {
        // Validation logic here
        const isValid = formData.monthlyIncome.every(entry => entry.source !== '' && entry.amount !== '');

        if (!isValid) {
            // Display a popup or show an error message
            alert('Please choose a source type and provide the amount for each entry before proceeding.');
            return;
        }

        const isOtherSourceEmpty = formData.monthlyIncome.some(entry => entry.source === 'Other' && entry.otherSource === '');

        if (isOtherSourceEmpty) {
            // Display an alert for entries with source set to "Other" and empty otherSource
            alert('Please specify the "Other" source before proceeding.');
            return;
        }

        // Check for undefined or empty source values
        const isSourceUndefined = formData.monthlyIncome.some(entry => entry.source === undefined || entry.source === '' || entry.source === 'Select Source');

        if (isSourceUndefined) {
            // Display an alert for entries with undefined, empty, or "Select Source" values
            alert('Please choose a valid source type for each entry before proceeding.');
            return;
        }

        // Check for undefined or empty amount values
        const isAmountUndefined = formData.monthlyIncome.some(entry => entry.amount === undefined || entry.amount === '');

        if (isAmountUndefined) {
            // Display an alert for entries with undefined or empty amount values
            alert('Please provide a valid amount for each entry before proceeding.');
            return;
        }

        const formattedData = {
            monthlyIncome: formData.monthlyIncome.map(entry => ({
                source: entry.source === 'Other' ? entry.otherSource : entry.source,
                amount: formatCurrency(entry.amount),
            })),
        };

        console.log("Formatted Data:", formattedData);

        db.collection('SurveyResponses')
            .doc(user.id)
            .update(formattedData)
            .then(() => {
                console.log("Document successfully updated!");
                // Navigate to the next step (Step 15 or any other step)
                navigate('/rent/off-campus/step15');
            })
            .catch((error) => {
                console.error("Error updating document: ", error);
            });
    };

    return (
        <div className="form-container" style={{ marginTop: '55px' }}>
            <h2 className="step-title">Monthly Income</h2>
            <p className="step-description">Please Add Your Monthly Income:</p>

            {Array.isArray(formData.monthlyIncome) && formData.monthlyIncome.map((entry, index) => (
                <div key={index} className="monthly-income-entry">
                    <div className="form-row">
                        <label>Source:</label>
                        <select
                            value={entry.source}
                            onChange={(e) => handleInputChange(index, 'source', e.target.value)}
                        >
                            <option value="Select Source" disabled hidden>Select Source</option>
                            <option value="Employment">Employment</option>
                            <option value="Parents">Parents</option>
                            <option value="Student Loans">Student Loans</option>
                            <option value="Scholarship">Scholarship</option>
                            <option value="Other">Other</option>
                        </select>
                        {entry.source === 'Other' && (
                            <input
                                type="text"
                                value={entry.otherSource || ''}
                                onChange={(e) => handleInputChange(index, 'otherSource', e.target.value)}
                                placeholder="Specify Other Source"
                            />
                        )}
                        <label className="end-label">Amount:</label>
                        <input
                            type="text"
                            value={entry.amount}
                            onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
                        />
                        <button onClick={() => handleDeleteEntry(index)} className='end-label'> - </button>
                    </div>
                </div>
            ))}

            <div className="add-another-container">
                <button onClick={handleAddEntry}>+ Add Another</button>
            </div>

            <Link to="/rent/off-campus/step13">
                <span className="back-button">{'<-'}</span>
            </Link>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <button
                className="next-button"
                onClick={saveAnswer}
                disabled={formData.monthlyIncome.some(entry => entry.source === '' || entry.source === 'Select Source')}
            >
                Next
            </button>
        </div>
    );
};

export default OffCampusHousingFormStep14;
