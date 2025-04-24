import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const SearchForLostItem = () => {
    const [query, setQuery] = useState(""); // Query for search input
    const [lostItems, setLostItems] = useState([]); // Store all lost items from DB
    const [selectedItem, setSelectedItem] = useState(null); // Store selected item
    const [error, setError] = useState(""); // Store error message

    const navigate = useNavigate(); // For navigation

    // Fetch all lost items from the backend on component mount
    useEffect(() => {
        const fetchLostItems = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/lost-items/");
                setLostItems(response.data);  // Populate lost items
            } catch (err) {
                console.error("Error fetching lost items:", err);
                setError("There was an error fetching lost items.");
            }
        };
        fetchLostItems();
    }, []); // Run only once when the component is mounted

    // Handle when the user selects an item from the dropdown
    const handleSelect = (e) => {
        const itemId = e.target.value;
        const item = lostItems.find((item) => item._id === itemId);
        setSelectedItem(item);  // Set selected item
    };

    // Handle search input change and filter items based on query
    const handleSearch = (e) => {
        setQuery(e.target.value); // Update query state
        // Fetch filtered results based on search query
        const fetchFilteredItems = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/lost-items/search?q=${e.target.value}`);
                setLostItems(response.data);  // Populate filtered lost items
            } catch (err) {
                console.error("Error fetching filtered lost items:", err);
                setError("There was an error searching for lost items.");
            }
        };
        fetchFilteredItems();
    };

    // Prevent form submission when clicking the back button
    const handleBackClick = (e) => {
        e.preventDefault(); // Prevent form submission
        navigate("/dashboard"); // Navigate to the dashboard
    };

    return (
        <div className="container">
            <h2>Search for Lost Items</h2>

            {/* Search input for filtering lost items */}
            <form>
                <input
                    type="text"
                    value={query}
                    onChange={handleSearch}
                    placeholder="Search by title, description, or location"
                />

                {/* Dropdown for selecting lost items */}
                <select
                    onChange={handleSelect}
                    value={selectedItem ? selectedItem._id : ""}
                >
                    <option value="">Select a lost item</option>
                    {lostItems.map((item) => (
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
                            <p><strong>Lost on:</strong> {new Date(selectedItem.dateLost).toLocaleDateString()}</p>
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

export default SearchForLostItem;
