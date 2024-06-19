import axios from "axios"
import { useFormik } from "formik"
import { Link, useNavigate } from "react-router-dom"
import { number } from "yup"
import Swal from "sweetalert2";
import * as yup from "yup"
import '../security/login.css'

export function AddDoctorComponent() {

    const token = localStorage.getItem("token"); 
    const navigate = useNavigate()
    const formik = useFormik({
        initialValues: {
            doctorName: "",
            doctorEmail: "",
            doctorSpecialization: "",
            doctorEducation: "",
            contactNumber: "",
            shiftTime: "",
            doctorAvailable: "",
            doctorFee: number,
            joinDate: new Date().toISOString().split('T')[0],
            doctorRating: ""
        },

        validationSchema: yup.object({
            doctorName: yup.string().required("User Name must be required..."),
            doctorSpecialization: yup.string().required("Specialization is requied"),
            doctorEducation: yup.string().required("Education is Requied..."),
            shiftTime: yup.string().required("shift time is requied..."),
            doctorAvailable: yup.string().required("doctor availability is requied to Enter"),
            doctorFee: yup.number().required("Fee must Requied..."),
            doctorEmail: yup.string().required("Please enter the email").matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'),
            contactNumber: yup.string().required("Phone number must be required"),
            doctorRating: yup.string().required("Requied...")
        }),

        onSubmit: (values) => {
            axios({
                method: "post",
                url: "http://localhost:8080/create",
                headers: {
                    Authorization: `Bearer ${token}` 
                },
                data: values
            }).then((response) => {
                console.log(response.data);
                Swal.fire(
                    'Thanks For Your Registration!',
                    'Your data is submitted successfully...',
                    'success'
                )
                navigate("/admin")

            }).catch((error) => {
                console.error("There was an error submitting the form:", error);
                if (error.response) {
                    console.error("Server responded with:", error.response.data);
                    alert("Server error: " + error.response.data.message);
                } else if (error.request) {
                    console.error("No response received:", error.request);
                    alert("No response from server. Please try again later.");
                } else {
                    console.error("Error setting up request:", error.message);
                    alert("Error: " + error.message);
                }
            });
        }
    })

    return (
        <div className="container-fluid" id="addDoctor">
            <div className="row d-flex justify-content-center align-items-center vh-100">
                <div className="col-sm-6">
                    <div className="card  p-4 shadow" id="doctorRegister">
                        <h3 className="text-center fw-bold bg-light" id="registerHeading">Register !!!</h3>
                        <hr />
                        <form onSubmit={formik.handleSubmit}>
                            <div className="d-flex flex-row">
                                <div className="form-floating me-2 flex-grow-1">
                                    <input type="text"
                                        id="doctorName"
                                        name="doctorName"
                                        className="form-control"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="Enter Name"
                                        value={formik.values.doctorName} />
                                    <label htmlFor="userName">UserName</label>
                                    {formik.touched.doctorName && formik.errors.doctorName ? (
                                        <div className="text-danger">{formik.errors.doctorName}</div>
                                    ) : null}
                                </div>
                                <div className="form-floating flex-grow-1">
                                    <input type="email"
                                        id="doctorEmail"
                                        name="doctorEmail"
                                        className="form-control"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="Enter password"
                                        value={formik.values.doctorEmail} />
                                    <label htmlFor="password">Email</label>
                                    {formik.touched.doctorEmail && formik.errors.doctorEmail ? (
                                        <div className="text-danger">{formik.errors.doctorEmail}</div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="form-floating flex-grow-1 mt-2">
                                <input type="number"
                                    id="doctorFee"
                                    name="doctorFee"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter doctorFee"
                                    value={formik.values.doctorFee} />
                                <label htmlFor="doctorFee">Doctor Fee</label>
                                {formik.touched.doctorFee && formik.errors.doctorFee ? (
                                    <div className="text-danger">{formik.errors.doctorFee}</div>
                                ) : null}
                            </div>
                            <div className="d-flex row-flex mt-2">
                                <div className="form-floating me-2 flex-grow-1">
                                    <input type="text"
                                        id="doctorEducation"
                                        name="doctorEducation"
                                        className="form-control"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="Enter date"
                                        value={formik.values.doctorEducation} />
                                    <label htmlFor="date">Doctor Education</label>
                                    {formik.touched.doctorEducation && formik.errors.doctorEducation ? (
                                        <div className="text-danger">{formik.errors.doctorEducation}</div>
                                    ) : null}
                                </div>
                                <div className="form-floating me-2 flex-grow-1">
                                    <input type="text"
                                        id="doctorSpecialization"
                                        name="doctorSpecialization"
                                        className="form-control"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="Date Of Birth"
                                        value={formik.values.doctorSpecialization} />
                                    <label htmlFor="dob">Doctor Specialization</label>
                                    {formik.touched.doctorSpecialization && formik.errors.doctorSpecialization ? (
                                        <div className="text-danger">{formik.errors.doctorSpecialization}</div>
                                    ) : null}
                                </div>
                            </div>
                            <div className="form-floating flex-grow-1 mt-2">
                                <input type="text"
                                    id="contactNumber"
                                    name="contactNumber"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter phoneNumber"
                                    value={formik.values.phoneNumber} />
                                <label htmlFor="contactNumber">PhoneNumber</label>
                                {formik.touched.contactNumber && formik.errors.contactNumber ? (
                                    <div className="text-danger">{formik.errors.contactNumber}</div>
                                ) : null}
                            </div>

                            <div className="form-floating flex-grow-1 mt-2">
                                <input type="text"
                                    id="shiftTime"
                                    name="shiftTime"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter shiftTime"
                                    value={formik.values.shiftTime} />
                                <label htmlFor="contactNumber">Shift Time</label>
                                {formik.touched.shiftTime && formik.errors.shiftTime ? (
                                    <div className="text-danger">{formik.errors.shiftTime}</div>
                                ) : null}
                            </div>
                            <div className="form-floating flex-grow-1 mt-2">
                                <input type="text"
                                    id="doctorAvailable"
                                    name="doctorAvailable"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter Monday To Thursday"
                                    value={formik.values.doctorAvailable} />
                                <label htmlFor="doctorAvailable">Doctor Available</label>
                                {formik.touched.doctorAvailable && formik.errors.doctorAvailable ? (
                                    <div className="text-danger">{formik.errors.doctorAvailable}</div>
                                ) : null}
                            </div>

                            <div className="form-floating flex-grow-1 mt-2">
                                <input type="text"
                                    id="doctorRating"
                                    name="doctorRating"
                                    className="form-control"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter 4.5"
                                    value={formik.values.doctorRating} />
                                <label htmlFor="doctorRating">Doctor Rating</label>
                                {formik.touched.doctorRating && formik.errors.doctorRating ? (
                                    <div className="text-danger">{formik.errors.doctorRating}</div>
                                ) : null}
                            </div>
                            <button type="submit" className="btn btn-outline-primary mt-3 w-100">Register</button>
                        </form>
                        <p className="mt-2">
                            <Link to="/admin" className="text-dark fw-bold text-decoration-none">AdminPannel</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}