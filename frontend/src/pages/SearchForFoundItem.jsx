import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const SearchForFoundItem = () => {
    const [query, setQuery] = useState(""); // Query for search input
    const [foundItems, setFoundItems] = useState([]); // Store all found items from DB
    const [selectedItem, setSelectedItem] = useState(null); // Store selected item
    const [error, setError] = useState(""); // Store error message

    const navigate = useNavigate(); // For navigation

    // Fetch all found items from the backend on component mount
    useEffect(() => {
        const fetchFoundItems = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/found-items");
                setFoundItems(response.data);  // Populate found items
            } catch (err) {
                console.error("Error fetching found items:", err);
                setError("There was an error fetching found items.");
            }
        };
        fetchFoundItems();
    }, []); // Run only once when the component is mounted

    // Handle when the user selects an item from the dropdown
    const handleSelect = (e) => {
        const itemId = e.target.value;
        const item = foundItems.find((item) => item._id === itemId);
        setSelectedItem(item);  // Set selected item
    };

    // Prevent form submission when clicking the back button
    const handleBackClick = (e) => {
        e.preventDefault(); // Prevent form submission
        navigate("/dashboard"); // Navigate to the dashboard
    };

    return (
        <div className="container">
            <h2>Search for Found Items</h2>

            {/* Dropdown for selecting found items */}
            <form>
                <select
                    onChange={handleSelect}
                    value={selectedItem ? selectedItem._id : ""}
                >
                    <option value="">Select a found item</option>
                    {foundItems.map((item) => (
                        <option key={item._id} value={item._id}>
                            {item.title} - {item.location}
                        </option>
                    ))}
                </select>

                <div className="button-container">
                    <button
                        className="back-btn"
                        onClick={handleBackClick} // Ensure it doesn't submit the form
                    >
                        Back to Dashboard
                    </button>
                </div>
            </form>

            {/* Display selected item details */}
            {selectedItem && (
                <div className="search-results">
                    <h3>Item Details:</h3>
                    <ul>
                        <li>
                            <h4>{selectedItem.title}</h4>
                            <p>{selectedItem.description}</p>
                            <p><strong>Location:</strong> {selectedItem.location}</p>
                            <p><strong>Found on:</strong> {new Date(selectedItem.dateFound).toLocaleDateString()}</p>
                            {selectedItem.image && (
                                <img
                                    src={`http://localhost:5000/uploads/${selectedItem.image}`}
                                    alt={selectedItem.title}
                                    className="found-item-image"
                                />
                            
                            )}
                        </li>
                    </ul>
                </div>
            )}

            {/* Display error message if exists */}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default SearchForFoundItem;
