import axios from "axios";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import Swal from "sweetalert2";

export function DoctorMainPageComponent() {
    const [patient, setPatient] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    console.log("Token at component load:", token);

    useEffect(() => {
        if (!token) {
            console.log("No token found. Redirecting to login.");
            navigate("/login"); // Redirect to login if no token is found
        }
    }, [token, navigate]);

    const formik = useFormik({
        initialValues: {
            patientName: "",
            petientEmail: "",
            patientContact: "",
            patientDOB: "",
            patientAddress: ""
        },
        validationSchema: yup.object({
            patientName: yup.string().required("Patient Name is required."),
            petientEmail: yup.string().email("Invalid email address").required("Patient Email is required."),
            patientContact: yup.string().required("Patient Contact is required."),
            patientDOB: yup.date().required("Patient Date of Birth is required."),
            patientAddress: yup.string().required("Patient Address is required.")
        }),
        onSubmit: async (values) => {
            console.log("Form submitted with values:", values);
            if (token) {
                console.log("Token is present. Making API call.");
                try {
                    const response = await axios({
                        method: "post",
                        url: `http://localhost:8080/patient/create`,
                        data: values,
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    console.log("Response data:", response.data);
                    setPatient(response.data);
                    Swal.fire(
                        'Welcome!',
                        'Thank you for booking an appointment successfully...',
                        'success'
                    );
                    navigate("/user");
                } catch (error) {
                    if (error.response) {
                        console.log("Error response:", error.response);
                        if (error.response.status === 401) {
                            console.log("Unauthorized: Invalid or expired token. Please log in again.");
                            localStorage.removeItem("token"); // Remove invalid token
                            navigate("/login"); // Redirect to login page
                        } else {
                            console.log("Error message:", error.response.data.message || "Something went wrong. Please try again.");
                        }
                    } else if (error.request) {
                        console.log("Error request:", error.request);
                    } else {
                        console.log("Error", error.message);
                    }
                }
            } else {
                console.log("No token found at form submission. Redirecting to login.");
                navigate("/login"); // Redirect to login if no token is found
            }
        }
    });

    return (
        <div className="container-fluid">
            <div className="row d-flex justify-content-center align-items-center vh-100">
                <div className="col-sm-6">
                    <div className="card p-4 rounded-5">
                        <h3 className="text-center fw-bold">Patient</h3>
                        <hr />
                        <form onSubmit={formik.handleSubmit}>
                            <div className="form-floating me-2 flex-grow-1">
                                <input
                                    type="text"
                                    id="patientName"
                                    name="patientName"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter The Patient Name"
                                    value={formik.values.patientName}
                                />
                                <label htmlFor="patientName">Patient Name</label>
                                {formik.touched.patientName && formik.errors.patientName ? (
                                    <div className="text-danger">{formik.errors.patientName}</div>
                                ) : null}
                            </div>

                            <div className="form-floating me-2 flex-grow-1">
                                <input
                                    type="email"
                                    id="petientEmail"
                                    name="petientEmail"
                                    className="form-control mt-3"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter The Patient Email"
                                    value={formik.values.petientEmail}
                                />
                                <label htmlFor="patientEmail">Patient Email</label>
                                {formik.touched.petientEmail && formik.errors.petientEmail ? (
                                    <div className="text-danger">{formik.errors.petientEmail}</div>
                                ) : null}
                            </div>

                            <div className="form-floating me-2 flex-grow-1">
                                <input
                                    type="text"
                                    id="patientContact"
                                    name="patientContact"
                                    className="form-control mt-3"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter The Patient Contact"
                                    value={formik.values.patientContact}
                                />
                                <label htmlFor="patientContact">Patient Contact</label>
                                {formik.touched.patientContact && formik.errors.patientContact ? (
                                    <div className="text-danger">{formik.errors.patientContact}</div>
                                ) : null}
                            </div>

                            <div className="form-floating me-2 flex-grow-1">
                                <input
                                    type="date"
                                    id="patientDOB"
                                    name="patientDOB"
                                    className="form-control mt-3"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter The Patient DOB"
                                    value={formik.values.patientDOB}
                                />
                                <label htmlFor="patientDOB">Patient DOB</label>
                                {formik.touched.patientDOB && formik.errors.patientDOB ? (
                                    <div className="text-danger">{formik.errors.patientDOB}</div>
                                ) : null}
                            </div>

                            <div className="form-floating me-2 flex-grow-1">
                                <input
                                    type="text"
                                    id="patientAddress"
                                    name="patientAddress"
                                    className="form-control mt-3"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter The Patient Address"
                                    value={formik.values.patientAddress}
                                />
                                <label htmlFor="patientAddress">Patient Address</label>
                                {formik.touched.patientAddress && formik.errors.patientAddress ? (
                                    <div className="text-danger">{formik.errors.patientAddress}</div>
                                ) : null}
                            </div>

                            <button type="submit" className="btn btn-info w-100 mt-3">Book Appointment</button>
                        </form>

                        <p className="mt-2">
                            <Link to="/user" className="text-decoration-none">Back</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
