import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const ReportLost = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        dateLost: "",
        image: null
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = localStorage.getItem("userId"); // Get User ID from localStorage
        if (!userId) {
            alert("User ID not found. Please log in again.");
            navigate("/login");
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("title", formData.title);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("location", formData.location);
            formDataToSend.append("dateLost", formData.dateLost);
            formDataToSend.append("image", formData.image);
            formDataToSend.append("userId", userId); // Attach User ID

            await axios.post("http://localhost:5000/api/lost-items/report", formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert("Lost item reported successfully!");
            navigate("/dashboard");
        } catch (err) {
            alert("Error reporting lost item.");
        }
    };

    return (
        <div className="container">
            <h2>Report a Lost Item</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" placeholder="Item Title" onChange={handleChange} required />
                <textarea name="description" placeholder="Description" onChange={handleChange} required />
                <input type="text" name="location" placeholder="Last Seen Location" onChange={handleChange} required />
                <label> Date Lost
                <input type="date" name="dateLost" onChange={handleChange} required />
                </label>
                <input type="file" name="image"  placeholder="imageplace" accept="image/*" onChange={handleFileChange} />

                <div className="button-container">
                    <button className="submit-btn" type="submit">Submit</button>
                    <button className="back-btn" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
                </div>
            </form>
        </div>
    );
};

export default ReportLost;
// Report lost