import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from "@clerk/clerk-react";
import { db } from "../../config";
import './styles.css';

const OffCampusHousingDashboard = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    const [offCampusFormDone, setOffCampusFormDone] = useState(false);

    useEffect(() => {
        // Fetch and check if the off-campus form is done when the component mounts
        const fetchData = async () => {
            if (user) {
                try {
                    const doc = await db.collection('SurveyResponses').doc(user.id).get();

                    if (doc.exists) {
                        const formDataFromDb = doc.data();
                        const isFormDone = formDataFromDb?.offcampusformdone || false;
                        setOffCampusFormDone(isFormDone);
                        console.log("Off-Campus Form Data:", isFormDone);

                        // Redirect logic based on the value of offCampusFormDone
                        if (!isFormDone) {
                            // Redirect to Step 1 if the form is not done
                            console.log("Redirecting to Step 1: Off-Campus Form not done");
                            navigate('/rent/off-campus/step1');
                        }
                    } else {
                        // Redirect to Step 1 if the document doesn't exist
                        console.log("Redirecting to Step 1: Document not found");
                        navigate('/rent/off-campus/step1');
                    }
                } catch (error) {
                    console.error('Error fetching form data:', error);
                }
            } else {
                // Redirect to Step 1 if there is no user
                console.log("Redirecting to Step 1: No user");
                navigate('/rent/off-campus/step1');
            }
        };

        fetchData();
    }, [user, navigate]);

    return (
        <div className="form-container" style={{ marginTop: '35px', width: '1000px' }}>
            <h2 className="step-title">Off-Campus Housing Dashboard</h2>
            <p className="step-description">Your Off-Campus Housing Listings</p>

            {/* Your listings or dashboard content goes here */}

            <Link to="/rent/off-campus/step1">
                <span className="back-button">{'<-'}</span>
            </Link>
        </div>
    );
};

export default OffCampusHousingDashboard;
