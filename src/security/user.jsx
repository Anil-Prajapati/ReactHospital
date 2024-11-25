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
                url: "https://hospital-jgla.onrender.com/patient/admin/all",
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
            url: `https://hospital-jgla.onrender.com/api/names/${username}`,
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
        const filterData = doctor.filter(filterDatas => {
            return (
                filterDatas.doctorName.toLowerCase().includes(searchText.toLowerCase()) ||
                filterDatas.doctorSpecialization.toLowerCase().includes(searchText.toLowerCase()) ||
                filterDatas.doctorEmail.toLowerCase().includes(searchText.toLowerCase())
            );
        });
        setFilteredAppointments(filterData); // Update filtered data state
    }, [searchText, doctor]);

    const logoutMethod = (() => {
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
            <div className="row align-items-center mb-3 mt-2 bg-dark p-2">
                <div className="col-sm-8">
                    <div className="d-flex justify-content-between align-items-center">
                        <h3 className="text-info fw-bold mb-0" id="Infomation">Information</h3>
                        <div className="ms-3" style={{ width: '50%' }}>
                            <input
                                type="text"
                                id="boxShadow"
                                className="form-control"
                                placeholder="Search by Doctor Name & Specilization & Email"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-sm-4 d-flex justify-content-end align-items-center">
                    <span className="me-3 fw-bold fs-5 d-flex align-items-center text-light">
                        <i className="bi bi-person-circle me-2"></i>{login.userName}
                    </span>
                    <button onClick={logoutMethod} className="btn btn-outline-danger">Logout</button>
                </div>
            </div>
            <div className="mt-4">
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
