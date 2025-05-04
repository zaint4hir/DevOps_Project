import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import "../styles.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AnalyticsPage = () => {
    const [matchedCount, setMatchedCount] = useState(0);
    const [reportsPerMonth, setReportsPerMonth] = useState([]);
    const [heatmapData, setHeatmapData] = useState({});
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const matchedRes = await axios.get("/api/matches");
                setMatchedCount(matchedRes.data.length);

                const reportsRes = await axios.get("/api/lost-items/reports-per-month");
                const foundReportsRes = await axios.get("/api/found-items/reports-per-month");

                const combinedReports = [...reportsRes.data.lostReports, ...foundReportsRes.data.foundReports];
                const monthlyCounts = {};

                combinedReports.forEach(report => {
                    const month = report._id;
                    monthlyCounts[month] = (monthlyCounts[month] || 0) + report.count;
                });

                setReportsPerMonth(monthlyCounts);

                const heatmapRes = await axios.get("/api/lost-items/heatmap");
                const parsedHeatmap = {};
                heatmapRes.data.locations.forEach(entry => {
                        parsedHeatmap[entry._id] = entry.count;
                    });
                setHeatmapData(parsedHeatmap);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch analytics.");
            }
        };

        fetchAnalytics();
    }, []);

    const handleBackClick = () => {
        navigate("/admin-dashboard");
    };

    const months = [
        "", "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const barData = {
        labels: Object.keys(reportsPerMonth).map(monthNum => months[monthNum]),
        datasets: [
            {
                label: "Reports per Month",
                data: Object.values(reportsPerMonth),
                backgroundColor: "rgba(75, 192, 192, 0.7)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1
            }
        ]
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: "Reports per Month" }
        }
    };

    return (
        <div className="analytics-container1">
            <h2>Admin Analytics Dashboard</h2>

            {error && <p className="error-message1">{error}</p>}

            <div className="analytics-section1">
                <h3>Total Items Matched</h3>
                <div className="analytics-card1">{matchedCount}</div>
            </div>

            <div className="analytics-section1">
                <h3>Reports per Month</h3>
                <div className="analytics-graph1">
                    <Bar data={barData} options={barOptions} />
                </div>
            </div>

            <div className="analytics-section1">
                <h3>Heatmap - Most Frequent Locations</h3>
                <div className="heatmap-table1">
                    <table className="styled-table1">
                        <thead>
                            <tr>
                                <th>Location</th>
                                <th>Number of Reports</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(heatmapData).map(([location, count]) => (
                                <tr key={location}>
                                    <td>{location}</td>
                                    <td>{count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="button-container1">
                <button className="back-btn1" onClick={handleBackClick}>Back to Dashboard</button>
            </div>
        </div>
    );
};

export default AnalyticsPage;
