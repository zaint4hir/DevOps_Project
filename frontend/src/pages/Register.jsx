import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles.css"; // Import global CSS

const Register = () => {
    const [user, setUser] = useState({ name: "", email: "", password: "", role: "user" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            setUser({ ...user, role: checked ? "admin" : "user" });
        } else {
            setUser({ ...user, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/auth/register", user);
            alert(res.data.msg);
            navigate("/login"); // Redirect to login after successful registration
        } catch (err) {
            alert(err.response?.data?.msg || "Registration failed");
        }
    };

    return (
        <div className="container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />

                <label className="checkbox-label">
                    <input type="checkbox" name="role" onChange={handleChange} />
                    Register as Admin
                </label>

                <button type="submit" className="submit-btn">Register</button>
            </form>
            <p>Already have an account? <a href="/login">Login</a></p>
        </div>
    );
};

export default Register;
