import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from 'react-paginate';
import '../security/login.css';

export function PatientAppoimentComponent() {
    const [appointments, setAppointments] = useState([]);
    const [login, setLogin] = useState("");
    const token = localStorage.getItem('token');
    const [selectedStatus, setSelectedStatus] = useState({});
    const [pageNumber, setPageNumber] = useState(0);
    const itemsPerPage = 13;
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [date, setDate] = useState('');
    const [doctorName, setDoctorName] = useState('');
     const [doctorsList, setDoctorsList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            axios({
                method: "get",
                url: `http://localhost:8080/patient/all`,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                console.log(response.data);
                setAppointments(response.data);
                setFilteredAppointments(response.data);
                setDoctorsList(response.data);
            }).catch((error) => {
                handleAuthorizationError(error);
            });
        } else {
            navigate("/login");
        }
    }, [token, navigate]);

    useEffect(() => {
        const username = localStorage.getItem('username');
        console.log("This is the localStorage Name : " + username);
        if (!username) {
            navigate("/login")
            return;
        }

        axios({
            method: "get",
            url: `http://localhost:8080/api/names/${username}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            console.log("this is the login details...")
            setLogin(response.data)
            console.log(response.data)

        }).catch((error) => {
            console.error("Error fetching data:", error);
            navigate("/login")
        })
    }, [])

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

    useEffect(() => {
        const filtered = appointments.filter(appointment => {
            const appointmentDate = new Date(appointment.patientDate).toLocaleDateString('en-CA');
            const searchTextMatch = appointment.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
                appointment.patientAddress.toLowerCase().includes(searchText.toLowerCase());
            const dateMatch = !date || appointmentDate === date;
            const doctorNameMatch = !doctorName || appointment.doctorName.toLowerCase().includes(doctorName.toLowerCase());
            return searchTextMatch && dateMatch && doctorNameMatch;
        });

        setFilteredAppointments(filtered);
    }, [searchText, date, doctorName, appointments]);

    useEffect(() => {
        if (appointments.length > 0) {
            const uniqueDoctors = [...new Set(appointments
                .filter(appointment => appointment.doctorName) // Filter out undefined or falsy values
                .map(appointment => appointment.doctorName))];
            
            console.log("Unique Doctors:", uniqueDoctors);
            
            const formattedDoctorsList = uniqueDoctors.map((name, index) => ({ id: index + 1, doctorName: name }));
            console.log("Formatted Doctors List:", formattedDoctorsList);

            setDoctorsList(formattedDoctorsList);
        }
    }, [appointments]);


    const handleDoctorChange = (e) => {
        setDoctorName(e.target.value);
    };

    const handleStatusChange = (id, patientstatus) => {
        setSelectedStatus((prevState) => ({
            ...prevState,
            [id]: patientstatus
        }));
    };

    const saveStatus = (id) => {
        const patientstatus = selectedStatus[id];
        const tokens = localStorage.getItem("token");

        axios({
            method: "put",
            url: `http://localhost:8080/patient/${id}/completed`,
            headers: {
                Authorization: `Bearer ${tokens}`
            },
            data: { patientstatus }
        })
            .then((response) => {
                console.log("Status updated successfully:", response.data);
                setAppointments((prevState) =>
                    prevState.map((app) =>
                        app.id === id ? { ...app, patientstatus } : app
                    )
                );
                setSelectedStatus((prevState) => ({
                    ...prevState,
                    [id]: undefined
                }));
            })
            .catch((error) => {
                handleAuthorizationError(error);
            });
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-CA', options);
    };

    const pageCount = Math.ceil(filteredAppointments.length / itemsPerPage);
    const handlePageClick = ({ selected }) => {
        setPageNumber(selected);
    };

    const offset = pageNumber * itemsPerPage;
    const currentPageData = filteredAppointments.slice(offset, offset + itemsPerPage);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <div className="container-fluid" id="appoiment">
            <div className="container-fluid mt-2">
                <div className="row p-3 bg-dark s shadow">
                    <div className="col-lg-3 col-md-6 col-sm-12">
                        <div className="">
                            <h4 className="fw-bold" id="appointmentHeading">Appointment Details Here!</h4>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12 d-flex">
                        <div className=" me-2">
                            <input
                                type="date"
                                id="dateFilter"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        <div className="">
                        <select
                                id="doctorNameFilter"
                                value={doctorName}
                                onChange={handleDoctorChange}
                                className="form-control"
                            >
                                <option value="">Select Doctor</option>
                                {doctorsList.map(doctor => (
                                    <option key={doctor.id} value={doctor.doctorName}>{doctor.doctorName}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="col-lg-5 col-md-12  d-flex">
                        <input
                            type="text"
                            id="searchBox"
                            className="form-control me-3"
                            placeholder="Search by Patient Name"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <button className="btn btn-outline-primary me-3">Search</button>
                        <button className="btn btn-outline-danger me-2" onClick={handleLogout}>Logout</button>
                        <div className="fw-bold fs-5 d-flex align-items-center text-light">
                            <i className="bi bi-person-circle me-2 text-light"></i>
                            {login.userName}
                        </div>
                    </div>
                </div>
            </div>

            <table className="table table-striped table-hover mt-3" id="tableColor">
                <thead className="table-dark">
                    <tr>
                        <th>PatientName</th>
                        <th>PatientEmail</th>
                        <th>PatientContact</th>
                        <th>PatientDate</th>
                        <th>PatientDOB</th>
                        <th>PatientAddress</th>
                        <th>DoctorName</th>
                        <th>Amount</th>
                        <th>DescriptionDetails</th>
                        <th>PatientStatus</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentPageData.map((data) => (
                        <tr key={data.id}>
                            <td>{data.patientName}</td>
                            <td>{data.petientEmail}</td>
                            <td>{data.patientContact}</td>
                            <td>{formatDate(data.patientDate)}</td>
                            <td>{formatDate(data.patientDOB)}</td>
                            <td>{data.patientAddress}</td>
                            <td>{data.doctorName}</td>
                            <td>{data.paidAmount}</td>
                            <td><Link to={`/descriptionUpdate/${data.id}/${data.descriptionDetails}`}><button className="btn btn-success">Description Update</button></Link></td>
                            <td className="text-success">{data.patientstatus}</td>
                            <td>
                                <select
                                    value={selectedStatus[data.id] || data.patientstatus}
                                    onChange={(e) => handleStatusChange(data.id, e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="completed">Completed</option>
                                </select>
                                {selectedStatus[data.id] && selectedStatus[data.id] !== data.patientstatus && (
                                    <button
                                        className="btn btn-primary m-2"
                                        onClick={() => saveStatus(data.id)}
                                    >
                                        Update
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination-container">
                <ReactPaginate
                    previousLabel={<button className="btn btn-outline-dark m-2">Previous</button>}
                    nextLabel={<button className="btn btn-outline-dark m-2">Next</button>}
                    breakClassName={'break-me'}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination'}
                    activeClassName={'active'}
                />
            </div>
        </div>
    );
}
