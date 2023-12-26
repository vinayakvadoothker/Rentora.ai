// GuarantorForm.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from "../../config";
import PlacesAutocomplete from 'react-places-autocomplete';
import './GuarantorForm.css'; // Import your CSS file

const GuarantorForm = () => {
    // Extract the userid from the URL
    const { userid } = useParams();

    const navigate = useNavigate();

    const validateEmail = (email) => {
        // Regular expression for a basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const formatPhoneNumber = (value) => {
        // Remove non-numeric characters
        const numericValue = value.replace(/\D/g, '');

        // Format phone number as XXX-XXX-XXXX
        const formattedValue = numericValue.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');

        return formattedValue;
    };

    const formatMonthlyIncome = (value) => {
        // Remove non-numeric and non-dot characters
        const numericValue = value.replace(/[^\d.]/g, '');

        // Split the value into integer and decimal parts
        const [integerPart, decimalPart] = numericValue.split('.');

        // Format integer part with commas
        const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        // Combine integer and decimal parts
        const formattedValue = decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;

        return `$${formattedValue}`;
    };

    const [formData, setFormData] = useState({
        guarantor: {
            guarantorName: '',
            guarantorRelation: '',
            guarantorPhone: '',
            guarantorEmail: '',
            driversLicense: '',
            dateOfBirth: '',
            homeAddress: '',
            employerName: '',
            jobTitle: '',
            employmentLength: '',
            businessAddress: '',
            monthlyIncome: '',
            supervisorName: '',
            supervisorPhone: '',
        },
    });

    const [formAlreadyFilled, setFormAlreadyFilled] = useState(false);

    useEffect(() => {
        // Fetch and set form data when the component mounts
        const fetchData = async () => {
            try {
                const doc = await db.collection('SurveyResponses').doc(userid).get();

                if (doc.exists) {
                    const formDataFromDb = doc.data();
                    setFormData(formDataFromDb);
                    setFormAlreadyFilled(!!formDataFromDb.guarantor);
                }
            } catch (error) {
                console.error('Error fetching form data:', error);
            }
        };

        fetchData();
    }, [userid]);

    const handleGuarantorInputChange = (field, value) => {
        // Only allow numeric input for phone numbers and monthly income
        if (field === 'guarantorPhone' || field === 'supervisorPhone') {
            value = formatPhoneNumber(value);
        }

        if (field === 'monthlyIncome') {
            value = formatMonthlyIncome(value);
        }

        if (field === 'guarantorEmail') {
            if (!validateEmail(value)) {
                alert('Please enter a valid email address.');
                return;
            }
        }

        setFormData((prevData) => ({
            ...prevData,
            guarantor: {
                ...prevData.guarantor,
                [field]: value,
            },
            [field]: value, // Save the field directly under the top-level form data
        }));
    };

    const handleSubmit = () => {
        // Check if all required fields are filled
        const requiredFields = [
            'guarantorName',
            'guarantorRelation',
            'guarantorPhone',
            'guarantorEmail',
            'driversLicense',
            'dateOfBirth',
            'homeAddress',
            'employerName',
            'jobTitle',
            'employmentLength',
            'businessAddress',
            'monthlyIncome',
            'supervisorName',
            'supervisorPhone',
        ];

        const isAnyFieldEmpty = requiredFields.some((field) => !formData.guarantor[field]);

        if (isAnyFieldEmpty) {
            // If any required field is empty, show an alert
            alert('Please fill in all required fields before submitting the form.');
            return;
        }

        // Save the form data in the user's database
        db.collection('SurveyResponses')
            .doc(userid)
            .update({
                ...formData,
            })
            .then(() => {
                // Handle successful submission (e.g., show a confirmation message)
                alert('Form submitted successfully!');
                // Navigate to the next step or any other route
                navigate('/onboarding');
            })
            .catch((error) => {
                console.error('Error saving form data:', error);
                // Handle error (e.g., show an error message)
                alert('Error submitting form. Please try again.');
            });
    };

    return (
        <div className="form-container">
            <h2 className="step-title">{formData.guarantor.guarantorName} Guarantor Form</h2>
            <p className="step-description">{`You have been selected to sign as a guarantor for ${formData.firstName} ${formData.lastName}. Please confirm and fill in the following information.`}</p>

            {/* Guarantor information */}
            <div className="guarantor-section">
                <div className="input-group">
                    <div className="form-row">
                        <div className="input-group">
                            <label>Guarantor Name:</label>
                            <input
                                type="text"
                                value={formData.guarantor?.guarantorName || ''}
                                onChange={(e) => handleGuarantorInputChange('guarantorName', e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label>Guarantor Relation:</label>
                            <select
                                value={formData.guarantor?.guarantorRelation || 'Select Relation'}
                                onChange={(e) => handleGuarantorInputChange('guarantorRelation', e.target.value)}
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
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Guarantor Phone:</label>
                            <input
                                type="text"
                                value={formData.guarantor?.guarantorPhone || ''}
                                onChange={(e) => handleGuarantorInputChange('guarantorPhone', e.target.value)}
                                maxLength="12"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="input-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                value={formData.guarantor?.guarantorEmail || ''}
                                onChange={(e) => handleGuarantorInputChange('guarantorEmail', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Form fields */}
            <div className="input-group">
                <div className="form-row">
                    <div className="input-group">
                        <label>Driver's License:</label>
                        <input
                            type="text"
                            value={formData.guarantor?.driversLicense || ''}
                            onChange={(e) => handleGuarantorInputChange('driversLicense', e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label>Date of Birth:</label>
                        <input
                            type="date"
                            value={formData.guarantor?.dateOfBirth || ''}
                            onChange={(e) => handleGuarantorInputChange('dateOfBirth', e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label>Home Address:</label>
                        <PlacesAutocomplete
                            value={formData.guarantor?.homeAddress || ''}
                            onChange={(value) => handleGuarantorInputChange('homeAddress', value)}
                            onSelect={(value) => handleGuarantorInputChange('homeAddress', value)}
                            searchOptions={{
                                types: ['geocode'],
                            }}
                            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                        >
                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                <div>
                                    <input
                                        {...getInputProps({
                                            placeholder: 'Type your home address...',
                                            className: 'location-search-input',
                                        })}
                                    />
                                    <div className="autocomplete-dropdown-container">
                                        {loading && <div></div>}
                                        {suggestions.map((suggestion) => (
                                            <div
                                                {...getSuggestionItemProps(suggestion, {
                                                    style: {
                                                        backgroundColor: suggestion.active ? '#a7a9ff' : '#fff',
                                                    },
                                                })}
                                            >
                                                {suggestion.description}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </PlacesAutocomplete>
                    </div>

                </div>

                <div className="form-row">
                    <div className="input-group">
                        <label>Employer Name:</label>
                        <input
                            type="text"
                            value={formData.guarantor?.employerName || ''}
                            onChange={(e) => handleGuarantorInputChange('employerName', e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label>Job Title:</label>
                        <input
                            type="text"
                            value={formData.guarantor?.jobTitle || ''}
                            onChange={(e) => handleGuarantorInputChange('jobTitle', e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label>Length of Employment:</label>
                        <input
                            type="text"
                            value={formData.guarantor?.employmentLength || ''}
                            onChange={(e) => handleGuarantorInputChange('employmentLength', e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="input-group">
                        <label>Business Address:</label>
                        <PlacesAutocomplete
                            value={formData.guarantor?.businessAddress || ''}
                            onChange={(value) => handleGuarantorInputChange('businessAddress', value)}
                            onSelect={(value) => handleGuarantorInputChange('businessAddress', value)}
                            searchOptions={{
                                types: ['geocode'],
                            }}
                            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                        >
                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                <div>
                                    <input
                                        {...getInputProps({
                                            placeholder: 'Type your business address...',
                                            className: 'location-search-input',
                                        })}
                                    />
                                    <div className="autocomplete-dropdown-container">
                                        {loading && <div></div>}
                                        {suggestions.map((suggestion) => (
                                            <div
                                                {...getSuggestionItemProps(suggestion, {
                                                    style: {
                                                        backgroundColor: suggestion.active ? '#a7a9ff' : '#fff',
                                                    },
                                                })}
                                            >
                                                {suggestion.description}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </PlacesAutocomplete>
                    </div>

                    <div className="input-group">
                        <label>Monthly Income:</label>
                        <input
                            type="text"
                            value={formData.guarantor?.monthlyIncome || ''}
                            onChange={(e) => handleGuarantorInputChange('monthlyIncome', e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label>Supervisor's Name:</label>
                        <input
                            type="text"
                            value={formData.guarantor?.supervisorName || ''}
                            onChange={(e) => handleGuarantorInputChange('supervisorName', e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="input-group">
                        <label>Supervisor's Phone:</label>
                        <input
                            type="tel"
                            value={formData.guarantor?.supervisorPhone || ''}
                            onChange={(e) => handleGuarantorInputChange('supervisorPhone', e.target.value)}
                            maxLength="12"
                        />
                    </div>
                    {/* Add additional form fields as needed */}
                </div>
            </div>

            <button className="next-button" onClick={handleSubmit}>
                Submit
            </button>
        </div>
    );
};

export default GuarantorForm;
