// src/pages/Dashboard.jsx
import React from "react";

const Dashboard = () => {
    const handleNavigate = (path) => {
        window.location.href = path;
    };

    return (
        <div className="container">
            <h2>Dashboard</h2>
            <div className="button-container">
                <button className="report-btn" onClick={() => handleNavigate("/report-lost")}>
                    Report Lost Item
                </button>
                <button className="report-btn" onClick={() => handleNavigate("/report-found")}>
                    Report Found Item
                </button>
                <button className="report-btn" onClick={() => handleNavigate("/search-lost")}>
                    Search Lost Items
                </button>
                <button className="report-btn" onClick={() => handleNavigate("/search-found")}>
                    Search Found Items
                </button>
                <button className="report-btn" onClick={() => handleNavigate("/user/announcements")}>
                    View Announcements
                </button>
                <button className="logout-btn" onClick={() => handleNavigate("/login")}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
