import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from "@clerk/clerk-react";
import { db } from "../../config";
import './styles.css';

const OffCampusHousingFormStep22 = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    const [guarantorFormFilled, setGuarantorFormFilled] = useState(false);

    useEffect(() => {
        // Fetch and check if the guarantor form is filled when the component mounts
        const fetchData = async () => {
            if (user) {
                try {
                    const doc = await db.collection('SurveyResponses').doc(user.id).get();

                    if (doc.exists) {
                        const formDataFromDb = doc.data();
                        setGuarantorFormFilled(!!formDataFromDb.guarantorFormFilled);
                    }
                } catch (error) {
                    console.error('Error fetching guarantor form data:', error);
                }
            }
        };

        fetchData();
    }, [user]);

    return (
        <div className="form-container" style={{ marginTop: '35px', width: '1000px' }}>
            <h2 className="step-title">Guarantor Confirmation</h2>
            <p className="step-description">Status of the Guarantor Form:</p>

            <div className="status-indicator">
                {guarantorFormFilled ? (
                    <span className="check-mark">&#10004;</span> // Green check mark
                ) : (
                    <span className="red-x">&#10006;</span> // Red 'x'
                )}
            </div>

            {guarantorFormFilled && (
                <button className="submit-button" onClick={() => navigate('/onboarding')}>
                    Submit
                </button>
            )}

            <Link to="/rent/off-campus/step21">
                <span className="back-button">{'<-'}</span>
            </Link>
        </div>
    );
};

export default OffCampusHousingFormStep22;
