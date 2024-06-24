import axios from "axios";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link, useNavigate } from "react-router-dom";

export function UserComponent() {

    const [appoiment, setAppoiment] = useState([]);
    const [doctor, setDoctor] = useState([]);
    const [login, setLogin] = useState("")
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [pageNumber, setPageNumber] = useState(0);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [searchText, setSearchText] = useState('');
    const itemsPerPage = 10;

    useEffect(() => {
        if (token) {
            axios({
                method: "get",
                url: "http://localhost:8080/patient/admin/all",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                setDoctor(response.data);
                setFilteredAppointments(response.data)
                setAppoiment(response.data)
            }).catch((error) => {
                console.error("Error fetching data:", error);

            });
        }
    }, []);

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

    useEffect(() => {
        const filtered = appoiment.filter(appointment =>
            (appointment.patientName && appointment.patientName.toLowerCase().includes(searchText.toLowerCase())) ||
            (appointment.patientDate && appointment.patientDate.toLowerCase().includes(searchText.toLowerCase())) ||
            (appointment.patientAddress && appointment.patientAddress.toLowerCase().includes(searchText.toLowerCase()))
        );
        // Rest of your code
    }, [searchText, appoiment]);

    const logoutMethod= (()=>{
        localStorage.removeItem('token');
        navigate('/login')
    })

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
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <div class="container-fluid p-0">
                    <a class="navbar-brand" href="#">
                        <img src="logo.jpg" alt="Logo" style={{ width: '30px', height: 'auto' }} />
                    </a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0 ">
                            <li class="nav-item">
                                <Link to="/registerDoctor" className="text-decoration-none"><a class="nav-link active" aria-current="page" href="#">AddDoctor</a></Link>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link active" aria-current="page" href="#">Delete</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link active" aria-current="page" href="#">Update</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link active" aria-current="page" href="#">profile</a>
                            </li>
                        </ul>

                        <ul className="navbar-nav">
                            <li className="nav-item d-flex">
                                <button onClick={logoutMethod} className="btn btn-outline-danger m-1">Logout</button>
                                <td className="mt-2 me-2 fw-bold fs-5"><i class="bi bi-person-circle ">{login.userName}</i></td>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="mt-3 float-end">
                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Search by Patient Name"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>
            <div className="mt-4">
                <h3 className="text-info fw-bold">Information</h3>
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
                    <tbody>
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
                                        <Link to="/user/doctor"><button className="btn btn-success">Book Appoiment</button></Link>
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
            </div>
        </div>
    );
}
