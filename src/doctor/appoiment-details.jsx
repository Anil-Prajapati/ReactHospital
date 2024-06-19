import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from 'react-paginate';
import '../security/login.css'

export function PatientAppoimentComponent() {
    const [appoiment, setAppoiment] = useState([]);
    const token = localStorage.getItem('token');
    const [selectedStatus, setSelectedStatus] = useState({});
    const [pageNumber, setPageNumber] = useState(0);
    const itemsPerPage = 13;
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [searchText, setSearchText] = useState('');
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
                setAppoiment(response.data);
                setFilteredAppointments(response.data);
            }).catch((error) => {
                handleAuthorizationError(error);
            });
        } else {
            navigate("/login");
        }
    }, [token, navigate]);

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
        const filtered = appoiment.filter(appointment =>
            appointment.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
            appointment.patientDate.toLowerCase().includes(searchText.toLowerCase()) ||
            appointment.patientAddress.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredAppointments(filtered)
    }, [searchText, appoiment]);

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
                setAppoiment((prevState) =>
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

    const handleLogout = (()=>{
        localStorage.removeItem("token");
        navigate("/login")
    })

    return (
        <div className="container-fluid" id="appoiment">
            <div className="row">
                <div className="col-sm-6">
                    <div className="mt-3">
                        <h4 className="fw-bold" id="appoimentHeading">Appoiment Details Here!</h4>
                    </div>
                </div>
                <div className="col-sm-6 mt-3 d-flex align-items-center">
                    <input
                        type="text"
                        id="serachBox"
                        className="form-control me-3"
                        placeholder="Search by Patient Name"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <button className="btn btn-outline-dark me-3">Serach</button>
                    <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
                </div>
            </div>
            <table className="table table-striped table-hover" id="tableColor">
                <thead class="table-dark">
                    <tr>
                        <th>PatientName</th>
                        <th>PatientEmail</th>
                        <th>PatientContact</th>
                        <th>PatientDate</th>
                        <th>PatientDOB</th>
                        <th>PatientAddress</th>
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
                            <td>{data.paidAmount}</td>
                            <td><Link to={`/descriptionUpdate/${data.id}/${data.descriptionDetails}`}><button className="btn btn-success">Description Upadte</button></Link></td>
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
