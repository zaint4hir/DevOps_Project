import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const SendAnnouncement = () => {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/announcements", { title, message });
            alert("Announcement sent!");
            navigate("/admin-dashboard");
        } catch (err) {
            console.error(err);
            alert("Failed to send announcement");
        }
    };

    return (
        <div className="container">
            <h2>Send System Announcement</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                />
                <textarea 
                    placeholder="Message" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    rows="5"
                    required 
                />
                <button type="submit" className="submit-btn">Send Announcement</button>
            </form>
        </div>
    );
};

export default SendAnnouncement;
