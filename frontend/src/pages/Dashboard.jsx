import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const Dashboard = () => {
    const navigate = useNavigate();

    // Redirect to login if user is not authenticated
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="container">
            <h2>Welcome to Your Dashboard</h2>
            <p>Select an option below:</p>

            {/* Button container for centering */}
            <div className="button-container">
                <button className="report-btn" onClick={() => navigate("/report-lost")}>Report a Lost Item</button>
                <button className="report-btn" onClick={() => navigate("/report-found")}>Report a Found Item</button>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

export default Dashboard;
