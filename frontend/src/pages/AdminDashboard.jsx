import { useNavigate } from "react-router-dom";
import "../styles.css";

const AdminDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div className="container">
            <h2>Admin Dashboard</h2>
            <p>Welcome, Admin. You have elevated permissions.</p>

            <div className="button-container">
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>

            {/* Add your admin tools here, like viewing all users, managing found items, etc. */}
        </div>
    );
};

export default AdminDashboard;
