import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const ViewClaimHistory = () => {
    const [matches, setMatches] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const res = await axios.get("/api/matches");
                setMatches(res.data);
            } catch (err) {
                console.error("Error fetching matches:", err);
                setError("Failed to load claim history.");
            }
        };

        fetchMatches();
    }, []);

    const handleBackClick = () => {
        navigate("/admin-dashboard");
    };

    return (
        <div className="container-1">
            <h2 className="header-1">Claim History</h2>
            {error && <p className="error-message-1">{error}</p>}
            {matches.length === 0 ? (
                <p>No claim history available.</p>
            ) : (
                <div className="table-container-1">
                    <table className="styled-table-1">
                        <thead>
                            <tr>
                                <th>Lost Item ID</th>
                                <th>Found Item ID</th>
                                <th>Lost User</th>
                                <th>Found User</th>
                                <th>Date Matched</th>
                            </tr>
                        </thead>
                        <tbody>
                            {matches.map(match => (
                                <tr key={match._id}>
                                    <td>{match.lostItemId?.title || "N/A"}</td>
                                    <td>{match.foundItemId?.title || "N/A"}</td>
                                    <td>{match.lostUserName}</td>
                                    <td>{match.foundUserName}</td>
                                    <td>{new Date(match.dateMatched).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div className="button-container-1">
                <button className="back-btn-1" onClick={handleBackClick}>Back to Dashboard</button>
            </div>
        </div>
    );
};

export default ViewClaimHistory;
