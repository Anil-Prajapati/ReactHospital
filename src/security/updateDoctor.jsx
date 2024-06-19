import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export function UpdateDoctor() {
    const [update, setUpdate] = useState({
        id: 0,
        shiftTime: "",
        doctorFee: "",
    });

    const [error, setError] = useState({
        shiftTime: "",
        doctorFee: "",
    });

    const navigate = useNavigate();
    const { id } = useParams();
    const token = localStorage.getItem("token");

    function handleShiftTimeChange(e) {
        const value = e.target.value;
        setUpdate((prevState) => ({
            ...prevState,
            shiftTime: value,
        }));
        setError((prevState) => ({
            ...prevState,
            shiftTime: value ? "" : "Must change the value of the field",
        }));
    }

    function handleDoctorFeeChange(e) {
        const value = e.target.value;
        setUpdate((prevState) => ({
            ...prevState,
            doctorFee: value,
        }));
        setError((prevState) => ({
            ...prevState,
            doctorFee: value ? "" : "Must change the doctor fee",
        }));
    }

    useEffect(() => {
        if (token) {
            axios({
                method: "get",
                url: `http://localhost:8080/doctor/${id}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    const { id, shiftTime, doctorFee } = response.data;
                    setUpdate({
                        id,
                        shiftTime,
                        doctorFee,
                    });
                })
                .catch((error) => {
                    console.log(error);
                    alert("Failed to fetch doctor's details: " + error);
                });
        }
    }, [id, token]);

    function handleSubmit(e) {
        e.preventDefault();

        if (!token) {
            alert("No authorization token found. Please log in.");
            return;
        }

        console.log("Token:", token);
        console.log("Updating Doctor with:", update);

        axios({
            method: "put",
            url: `http://localhost:8080/update/${update.id}/${encodeURIComponent(
                update.shiftTime
            )}/${encodeURIComponent(update.doctorFee)}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log(response.data);
                navigate("/admin");
            })
            .catch((error) => {
                console.error("Error updating doctor:", error);
                if (error.response && error.response.status === 401) {
                    console.log("Unauthorized: Invalid or expired token. Please log in again.");
                } else {
                    console.log("Something went wrong: " + error.message);
                    navigate("/admin");
                }
            });
    }

    return (
        <div className="container-fluid" id="updateDoctor">
            <div className="row mt-3 d-flex justify-content-center align-items-center vh-100">
                <div className="col-sm-6">
                    <div className="card p-3 shadow rounded-4 bg-body-secondary">
                        <h3 className="text-center fw-bold">Update Details</h3>
                        <hr />
                        <form onSubmit={handleSubmit}>
                            <div className="mt-3">
                                <label htmlFor="id">Doctor ID</label>
                                <input
                                    type="text"
                                    id="id"
                                    name="id"
                                    className="form-control"
                                    value={update.id}
                                    readOnly
                                />

                                <label htmlFor="shiftTime">Shift Time</label>
                                <input
                                    type="text"
                                    id="shiftTime"
                                    name="shiftTime"
                                    className="form-control"
                                    value={update.shiftTime}
                                    onChange={handleShiftTimeChange}
                                />
                                {error.shiftTime && (
                                    <div className="text-danger">{error.shiftTime}</div>
                                )}

                                <label htmlFor="doctorFee">Doctor Fee</label>
                                <input
                                    type="text"
                                    id="doctorFee"
                                    name="doctorFee"
                                    className="form-control"
                                    value={update.doctorFee}
                                    onChange={handleDoctorFeeChange}
                                />
                                {error.doctorFee && (
                                    <div className="text-danger">{error.doctorFee}</div>
                                )}
                            </div>

                            <button type="submit" className="btn btn-outline-secondary mt-2 w-100">
                                Update
                            </button>
                        </form>

                        <p>
                            <Link to="/admin" className="text-decoration-none m-2">AdminPannel</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
