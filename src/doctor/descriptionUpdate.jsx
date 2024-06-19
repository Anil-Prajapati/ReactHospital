import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export function DescriptionUpdateComponent() {
    const { id } = useParams();
    const [descriptionDetails, setDescriptionDetails] = useState("");
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
        } else {
            fetchDescriptionDetails();
        }
    }, [token, navigate, id]);

    const fetchDescriptionDetails = () => {
        axios({
            method: "get",
            url: `http://localhost:8080/patient/${id}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                setDescriptionDetails(response.data.descriptionDetails);
            })
            .catch((error) => {
                handleAuthorizationError(error);
            });
    };

    const handleAuthorizationError = (error) => {
        console.log(error.response);
        if (error.response) {
            if (error.response.status === 401) {
                alert("Invalid or expired token. Try again later...");
                navigate("/login");
                localStorage.removeItem('token');
            } else {
                console.log("Error message: " + error.response.data.message + " Something went wrong. Please try again later...");
                navigate("/login");
            }
        } else if (error.request) {
            console.log("Error request: " + error.request);
            navigate("/login");
        } else {
            console.log(error.message);
            navigate("/login");
        }
    };

    const updateDescription = () => {
        axios({
            method: "put",
            url: `http://localhost:8080/patient/description/${id}/${descriptionDetails}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                console.log("Description updated successfully:", response.data);
                Swal.fire(
                    'Welcome !',
                    'Thank you for Logging in Successfully...',
                    'success'
                );
                navigate("/patient/appoiment"); 
            })
            .catch((error) => {
                handleAuthorizationError(error);
            });
    };

    return (
        <div className="container mt-4">
            <h2>Update Description</h2>
            <div className="mb-3">
                <label htmlFor="descriptionDetails" className="form-label">Description Details</label>
                <textarea
                    className="form-control"
                    id="descriptionDetails"
                    rows="5"
                    value={descriptionDetails}
                    onChange={(e) => setDescriptionDetails(e.target.value)}
                ></textarea>
            </div>
            <button className="btn btn-primary" onClick={updateDescription}>Update Description</button>
             <p className="d-flex float-end">
                <Link to="/patient/appoiment" className="text-decoration-none fw-bold"><button className="btn btn-secondary">Back</button></Link>
             </p>

            <p className="text-danger">Please Don't Remove The Your Previous Content If Remove And Update The Details Then Again Is Not Coming Means Update The Hole Details </p>
        </div>
    );
}
