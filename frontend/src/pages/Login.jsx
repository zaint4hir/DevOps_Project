import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const Login = () => {
    const [user, setUser] = useState({ email: "", password: "" });
    const [error, setError] = useState(""); // Store error message
    const [loading, setLoading] = useState(false); // Track loading state
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
    
        try {
            const res = await axios.post("/api/auth/login", user);
    
            // Store values
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userId", res.data.user.id);
            localStorage.setItem("role", res.data.user.role); // Store role
    
            // Redirect based on role
            if (res.data.user.role === "admin") {
                navigate("/admin-dashboard");
            } else {
                navigate("/dashboard");
            }
    
        } catch (err) {
            setError(err.response?.data?.msg || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                
                {error && <p className="error">{error}</p>} {/* Show error message */}

                <div className="button-container">
                    <button className="login-btn" type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </div>
            </form>
            <p>Don't have an account? <a href="/register">Register</a></p>
        </div>
    );
};

export default Login;
