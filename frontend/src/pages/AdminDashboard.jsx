import { useNavigate } from "react-router-dom";
import "../styles.css";

const AdminDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const goToReports = () => {
        navigate("/admin/reports");
    };

    const goToClaimHistory = () => {
        navigate("/admin/claim-history");
    };

    const goToAnalytics = () => {
        navigate("/analytics");
    };

    const goToAnnouncements = () => {
        navigate("/admin/announcements");
    };

    return (
        <div className="container">
            <h2>Admin Dashboard</h2>
            <p>Welcome, Admin. You have elevated permissions.</p>

            <div className="button-container">
                <button onClick={goToReports} className="submit-btn">View All Reports</button>
                <button onClick={goToClaimHistory} className="submit-btn">View Claim History</button>
                <button onClick={goToAnalytics} className="submit-btn">View Analytics</button>
                <button onClick={goToAnnouncements} className="submit-btn">Send Announcement</button>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
        </div>
    );
};

export default AdminDashboard;
