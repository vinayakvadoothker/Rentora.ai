import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from "@clerk/clerk-react";
import { db } from "../../config";
import './styles.css';

const OffCampusHousingFormStep21 = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    const [guarantorName, setGuarantorName] = useState('');
    const [guarantorRelation, setGuarantorRelation] = useState('');
    const [guarantorPhone, setGuarantorPhone] = useState('');
    const [guarantorEmail, setGuarantorEmail] = useState('');

    useEffect(() => {
        // Fetch and set guarantor information when the component mounts
        const fetchData = async () => {
            if (user) {
                try {
                    const doc = await db.collection('SurveyResponses').doc(user.id).get();

                    if (doc.exists) {
                        const guarantorData = doc.data().guarantor;

                        if (guarantorData) {
                            setGuarantorName(guarantorData.guarantorName || '');
                            setGuarantorRelation(guarantorData.guarantorRelation || '');
                            setGuarantorPhone(guarantorData.guarantorPhone || '');
                            setGuarantorEmail(guarantorData.guarantorEmail || '');
                        }
                    }
                } catch (error) {
                    console.error('Error fetching guarantor data:', error);
                }
            }
        };

        fetchData();
    }, [user]);

    useEffect(() => {
        // Save guarantor information whenever there's a change
        saveGuarantorInfo();
    }, [guarantorName, guarantorRelation, guarantorPhone, guarantorEmail]);

    const validatePhoneNumber = (phoneNumber) => {
        return /^\d{3}-\d{3}-\d{4}$/.test(phoneNumber);
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const formatPhoneNumber = (value) => {
        const sanitizedValue = value.replace(/[^0-9]/g, '');
        const formattedValue = sanitizedValue.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        return formattedValue;
    };

    const saveGuarantorInfo = async () => {
        if (user) {
            const formattedPhoneNumber = formatPhoneNumber(guarantorPhone);

            if (
                guarantorName.trim() !== '' &&
                guarantorRelation !== 'Select Relation' &&
                validatePhoneNumber(formattedPhoneNumber) &&
                validateEmail(guarantorEmail)
            ) {
                const guarantorData = {
                    guarantorName,
                    guarantorRelation,
                    guarantorPhone: formattedPhoneNumber,
                    guarantorEmail,
                };

                await db.collection('SurveyResponses').doc(user.id).update({
                    guarantor: guarantorData,
                });
            }
        }
    };

    const handleNext = () => {
        // Validation logic here
        saveGuarantorInfo();

        // Navigate to the next step
        navigate('/rent/off-campus/step22');
    };

    return (
        <div className="form-container" style={{ marginTop: '35px', width: '1000px' }}>
            <h2 className="step-title">Letter of Guarantor</h2>
            <p className="step-description">Please Add A Guarantor Who Will Fill Out the Guarantor Form</p>

            <div className="input-group">
                <div className="name-relation-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        value={guarantorName}
                        onChange={(e) => setGuarantorName(e.target.value)}
                    />

                    <label>Relation:</label>
                    <select
                        value={guarantorRelation}
                        onChange={(e) => setGuarantorRelation(e.target.value)}
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
                </div>

                <div className="input-group-phone-email">
                    <label>Phone Number:</label>
                    <input
                        type="tel"
                        value={formatPhoneNumber(guarantorPhone)}
                        onChange={(e) => {
                            const sanitizedValue = e.target.value.replace(/[^0-9]/g, '');
                            setGuarantorPhone(sanitizedValue);
                        }}
                        maxLength="12"
                    />

                    <label>Email:</label>
                    <input
                        type="email"
                        value={guarantorEmail}
                        onChange={(e) => setGuarantorEmail(e.target.value)}
                    />
                </div>
            </div>

            <Link to="/rent/off-campus/step20">
                <span className="back-button">{'<-'}</span>
            </Link>

            <button className="next-button" onClick={handleNext}>
                Next
            </button>
        </div>
    );
};

export default OffCampusHousingFormStep21;
