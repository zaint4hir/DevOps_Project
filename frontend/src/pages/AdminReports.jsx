import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const AdminReports = () => {
    const [lostItems, setLostItems] = useState([]);
    const [foundItems, setFoundItems] = useState([]);
    const [error, setError] = useState("");
    const [users, setUsers] = useState({});
    const [matchingItemId, setMatchingItemId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const [lostRes, foundRes] = await Promise.all([
                    axios.get("/api/lost-items"),
                    axios.get("/api/found-items")
                ]);

                setLostItems(lostRes.data);
                setFoundItems(foundRes.data);

                const lostUserPromises = lostRes.data.map((item) =>
                    axios.get(`/api/auth/user/${item.userId}`)
                );
                const lostUserResponses = await Promise.all(lostUserPromises);

                const foundUserPromises = foundRes.data.map((item) =>
                    axios.get(`/api/auth/user/${item.userId}`)
                );
                const foundUserResponses = await Promise.all(foundUserPromises);

                const usersMap = {};
                [...lostUserResponses, ...foundUserResponses].forEach((res) => {
                    usersMap[res.data._id] = res.data.name;
                });

                setUsers(usersMap);
            } catch (err) {
                console.error("Error fetching reports:", err);
                setError("There was an error fetching the reports.");
            }
        };

        fetchItems();
    }, []);

    const handleBackClick = (e) => {
        e.preventDefault();
        navigate("/admin-dashboard");
    };

    const handleEditClick = (itemId) => {
        console.log("Edit item with ID:", itemId);
    };

    const handleDeleteClick = async (itemId, type) => {
        try {
            const endpoint = type === "lost"
                ? `/api/lost-items/${itemId}`
                : `/api/found-items/${itemId}`;

            await axios.delete(endpoint);
            if (type === "lost") {
                setLostItems(prev => prev.filter(item => item._id !== itemId));
            } else {
                setFoundItems(prev => prev.filter(item => item._id !== itemId));
            }
        } catch (err) {
            setError("Error deleting item.");
            console.error(err);
        }
    };

    const handleMatchClick = (itemId) => {
        setMatchingItemId(prev => (prev === itemId ? null : itemId));
    };

    const handleMatchSubmit = async (lostItem, foundItemId) => {
        const foundItem = foundItems.find(item => item._id === foundItemId);

        if (!foundItem) {
            alert("Invalid found item selected.");
            return;
        }

        try {
            await axios.post("/api/matches", {
                lostItemId: lostItem._id,
                foundItemId: foundItem._id,
                lostUserId: lostItem.userId,
                foundUserId: foundItem.userId,
                lostUserName: users[lostItem.userId] || "Unknown",
                foundUserName: users[foundItem.userId] || "Unknown"
            });

            alert("Match saved successfully!");
            setMatchingItemId(null);
        } catch (err) {
            console.error("Match failed", err);
            setError("Error creating match.");
        }
    };

    return (
        <div className="container">
            <h2>Admin Reports</h2>

            {error && <p className="error-message">{error}</p>}

            <div className="report-section">
                <h3>Lost Items</h3>
                <ul className="item-list">
                    {lostItems.length === 0 ? (
                        <li>No lost items reported.</li>
                    ) : (
                        lostItems.map((item) => (
                            <li key={item._id}>
                                <h4>{item.title}</h4>
                                <p><strong>User:</strong> {users[item.userId] || "Unknown"}</p>
                                <p>{item.location}</p>
                                <p>{new Date(item.dateLost).toLocaleDateString()}</p>
                                <div className="action-buttons">
                                    <button className="action-btn" onClick={() => handleEditClick(item._id)}>Edit</button>
                                    <button className="action-btn delete-btn" onClick={() => handleDeleteClick(item._id, "lost")}>Delete</button>
                                    <button className="action-btn match-btn" onClick={() => handleMatchClick(item._id)}>Match</button>
                                </div>

                                {matchingItemId === item._id && (
                                    <div className="match-select">
                                        <label>Select Found Item:</label>
                                        <select
                                            size="5"
                                            onChange={(e) => handleMatchSubmit(item, e.target.value)}
                                            style={{ width: "100%", marginTop: "5px" }}
                                        >
                                            {foundItems.map(found => (
                                                <option key={found._id} value={found._id}>
                                                    {found.title} - {new Date(found.dateFound).toLocaleDateString()}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </li>
                        ))
                    )}
                </ul>
            </div>

            <div className="report-section">
                <h3>Found Items</h3>
                <ul className="item-list">
                    {foundItems.length === 0 ? (
                        <li>No found items reported.</li>
                    ) : (
                        foundItems.map((item) => (
                            <li key={item._id}>
                                <h4>{item.title}</h4>
                                <p><strong>User:</strong> {users[item.userId] || "Unknown"}</p>
                                <p>{item.location}</p>
                                <p>{new Date(item.dateFound).toLocaleDateString()}</p>
                                <div className="action-buttons">
                                    <button className="action-btn" onClick={() => handleEditClick(item._id)}>Edit</button>
                                    <button className="action-btn delete-btn" onClick={() => handleDeleteClick(item._id, "found")}>Delete</button>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            <div className="button-container">
                <button className="back-btn" onClick={handleBackClick}>
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default AdminReports;
