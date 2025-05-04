import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const ReportFound = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        dateFound: "",
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

        const userId = localStorage.getItem("userId");
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
            formDataToSend.append("dateFound", formData.dateFound);
            formDataToSend.append("image", formData.image);
            formDataToSend.append("userId", userId);

            await axios.post("/api/found-items/report", formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert("Found item reported successfully!");
            navigate("/dashboard");
        } catch (err) {
            alert("Error reporting found item.");
        }
    };

    return (
        <div className="container">
            <h2>Report a Found Item</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" placeholder="Item Title" onChange={handleChange} required />
                <textarea name="description" placeholder="Description" onChange={handleChange} required />
                <input type="text" name="location" placeholder="Found At Location" onChange={handleChange} required />
                <label>Date Found
                <input type="date" name="dateFound" onChange={handleChange} required />
                </label>
                <input type="file" name="image" placeholder="imageplace" accept="image/*" onChange={handleFileChange} />

                <div className="button-container">
                    <button className="submit-btn" type="submit">Submit</button>
                    <button className="back-btn" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
                </div>
            </form>
        </div>
    );
};

export default ReportFound;
