import React, { useEffect, useState } from 'react';
import { Doughnut, Pie, Line, Bar, PolarArea, Radar, Scatter } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';

export function DashboardComponent() {
    const token = localStorage.getItem("token");
    const [data, setData] = useState(null);
    const [lineChartData, setLineChartData] = useState(null);

    useEffect(() => {
        axios({
            method: "get",
            url: `http://localhost:8080/patient/amount`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((response) => {
            setData(response.data);
            setLineChartData({
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                    {
                        label: 'Profit',
                        data: [65, 59, 80, 81, 56, 55, 40], // Sample data, replace with actual data
                        fill: false,
                        borderColor: 'green',
                        tension: 0.1
                    },
                    {
                        label: 'Loss',
                        data: [45, 50, 60, 45, 55, 65, 50], // Sample data, replace with actual data
                        fill: false,
                        borderColor: 'red',
                        tension: 0.1
                    },
                    {
                        label: 'Total Amount',
                        data: [80, 85, 95, 90, 100, 110, 105], // Sample data, replace with actual data
                        fill: false,
                        borderColor: 'blue',
                        tension: 0.1
                    },
                    {
                        label: 'Average',
                        data: [75, 75, 75, 75, 75, 75, 75], // Sample data, replace with actual data
                        fill: false,
                        borderColor: 'orange',
                        tension: 0.1
                    }
                ]
            });
        })
        .catch((error) => {
            alert("Something went wrong: " + error.message);
        });
    }, [token]);

    const doughnutData = {
        labels: ['Total Paid Amount', 'Average Paid Amount', 'Profit', 'Loss'],
        datasets: [
            {
                label: 'Financial Summary',
                data: [
                    data ? data.totalPaidAmount : 0,
                    data ? data.averagePaidAmount : 0,
                    data ? data.profit : 0,
                    data ? data.loss : 0
                ],
                backgroundColor: ['green', 'orange', 'blue', 'red'],
                hoverOffset: 4
            }
        ]
    };

    const pieData = {
        labels: ['Total Paid Amount', 'Average Paid Amount', 'Profit', 'Loss'],
        datasets: [
            {
                label: 'Financial Summary',
                data: [
                    data ? data.totalPaidAmount : 0,
                    data ? data.averagePaidAmount : 0,
                    data ? data.profit : 0,
                    data ? data.loss : 0
                ],
                backgroundColor: ['green', 'orange', 'blue', 'red'],
                hoverOffset: 4
            }
        ]
    };

    const barData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Sales',
                data: [65, 59, 80, 81, 56, 55, 40],
                backgroundColor: 'green'
            }
        ]
    };

    const polarAreaData = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
        datasets: [
            {
                label: 'My Polar Area Chart',
                data: [11, 16, 7, 3, 14],
                backgroundColor: ['red', 'blue', 'yellow', 'green', 'purple']
            }
        ]
    };

    const radarData = {
        labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
        datasets: [
            {
                label: 'My Radar Chart',
                data: [65, 59, 90, 81, 56, 55, 40],
                backgroundColor: 'green'
            }
        ]
    };

    const scatterData = {
        datasets: [
            {
                label: 'Scatter Dataset',
                data: [
                    { x: 65, y: 75 },
                    { x: 59, y: 49 },
                    { x: 80, y: 90 },
                    { x: 81, y: 29 },
                    { x: 56, y: 36 },
                    { x: 55, y: 25 },
                    { x: 40, y: 18 },
                ],
                backgroundColor: 'green'
            }
        ]
    };

    return (
        <div className="container-fluid mt-3">
            <div className="row">
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Doughnut Chart</h5>
                            <Doughnut data={doughnutData} />
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Pie Chart</h5>
                            <Pie data={pieData} />
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Radar Chart</h5>
                            <Radar data={radarData} />
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Scatter Chart</h5>
                            <Scatter data={scatterData} />
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Line Chart</h5>
                            {lineChartData && <Line data={lineChartData} />}
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Bar Chart</h5>
                            <Bar data={barData} />
                        </div>
                    </div>
                </div>
                {/*<div className="col-lg-4 col-md-6 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Polar Area Chart</h5>
                            <PolarArea data={polarAreaData} />
                        </div>
                    </div>
                </div>*/}
            </div>
        </div>
    );
}
