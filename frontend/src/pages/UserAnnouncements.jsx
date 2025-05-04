import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles.css";

const UserAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await axios.get(`/api/announcements?userId=${userId}`);
                setAnnouncements(res.data);
            } catch (err) {
                console.error("Error fetching announcements", err);
            }
        };
        fetchAnnouncements();
    }, [userId]);

    const handleMarkAsRead = async (id) => {
        try {
            await axios.post(`/api/announcements/mark-as-read/${id}`, { userId });
            setAnnouncements(prev => prev.filter(a => a._id !== id));
        } catch (err) {
            console.error("Error marking announcement as read", err);
        }
    };

    return (
        <div className="container">
            <h2>Announcements</h2>
            {announcements.length === 0 ? (
                <p>No new announcements.</p>
            ) : (
                <div className="announcement-scrollable-container">
                    {announcements.map(a => (
                        <div key={a._id} className="announcement-card">
                            <h3>{a.title}</h3>
                            <p>{a.message}</p>
                            <small>{new Date(a.createdAt).toLocaleString()}</small>
                            <button className="delete-btn" onClick={() => handleMarkAsRead(a._id)}>
                                Mark as Read
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserAnnouncements;
