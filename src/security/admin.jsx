import axios from "axios";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link, useNavigate } from "react-router-dom";
import '../security/login.css'

export function AdminComponent() {

    const [doctor, setDoctor] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [total, setTotal] = useState([])
    const [pageNumber, setPageNumber] = useState(0);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const itemsPerPage = 9;

    function logoutMethod() {
        localStorage.removeItem("token")
        navigate("/login")
    }

    useEffect(() => {
        if (token) {
            axios({
                method: "get",
                url: "http://localhost:8080/all",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                setDoctor(response.data);
                setFilteredAppointments(response.data)
            }).catch((error) => {
                console.error("Error fetching data:", error);
                navigate("/login")
            });
        }
    }, []);

    useEffect(() => {
        axios(
            {
                method: "get",
                url: `http://localhost:8080/patient/amount`,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        ).then((response) => {
            console.log(response.data)
            setTotal(response.data)
        }).catch((error) => {
            alert("samethink wan't wrong" + error.message)
        })
    }, [])

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


    return (
        <div className="container-fluid">
            <nav className="navbar navbar-expand-lg navbar-light bg-dark fixed-top">
                <div className="container-fluid p-0">
                    <a className="navbar-brand m-1" href="#">
                        <img src="logo.jpg" alt="Logo" style={{ width: '35px', height: 'auto' }} className="rounded-3" />
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item m-1">
                                <Link to="/registerDoctor" className="text-decoration-none"><button className="btn btn-outline-info">Add Doctor</button></Link>
                            </li>
                            <li className="nav-item m-1">
                                <Link to="/patient/appoiment" className="text-decoration-none me-1"><button className="btn btn-outline-info">Appoiment</button></Link>
                            </li>
                            <li className="nav-item m-1">
                                <Link to="/admin/dashboard" className="text-decoration-none me-1"><button className="btn btn-outline-info">Dashboard</button></Link>
                            </li>
                        </ul>
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <button onClick={logoutMethod} className="btn btn-outline-danger m-1">Logout</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="" id="tablsCSS">
                <h3 className="text-info fw-bold"  id="adminCSS">INFORMATION</h3>
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>DoctorName</th>
                            <th>Available</th>
                            <th>Education</th>
                            <th>Email</th>
                            <th>Fee</th>
                            <th>ContactNumber</th>
                            <th>Ratting</th>
                            <th>Speciliazation</th>
                            <th>JoinDate</th>
                            <th>ShiftTime</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        {
                            currentPageData.map((data) => (
                                <tr key={data.id}>
                                    <td>{data.doctorName}</td>
                                    <td>{data.doctorAvailable}</td>
                                    <td>{data.doctorEducation}</td>
                                    <td>{data.doctorEmail}</td>
                                    <td>{data.doctorFee}</td>
                                    <td>{data.contactNumber}</td>
                                    <td>{data.doctorRating}</td>
                                    <td>{data.doctorSpecialization}</td>
                                    <td>{formatDate(data.joinDate)}</td>
                                    <td>{data.shiftTime}</td>
                                    <td>
                                        <Link to={`/delete/${data.id}`}><button className="btn btn-danger">Delete</button></Link>
                                    </td>
                                    <td>
                                        <Link to={`/update/${data.id}/${data.shiftTime}/${data.doctorFee}`} className="text-decoration-none"><button className="btn btn-secondary">Update</button></Link>
                                    </td>
                                </tr>
                            ))
                        }
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

                <div className="row">
                    <div className="col-sm-3">
                        <div className="card bg-primary p-4 mt-2">
                            <div className="card-body">
                                <h5 className="text-center">Total: {total.totalPaidAmount}</h5>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-3">
                        <div className="card bg-success p-4 mt-2">
                            <div className="card-body">
                                <h5 className="text-center">Profit: {total.profit}</h5>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-3">
                        <div className="card bg-primary p-4 mt-2">
                            <div className="card-body">
                                <h5 className="text-center">Loss: {total.loss}</h5>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-3">
                        <div className="card bg-success p-4 mt-2">
                            <div className="card-body">
                                <h5 className="text-center">Average: {total.averagePaidAmount}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
