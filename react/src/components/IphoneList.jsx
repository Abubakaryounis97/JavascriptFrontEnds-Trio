import { useState, useEffect } from "react";
import { getIphones } from "../services/api";
import { useNavigate } from "react-router-dom";
import AddIphoneModal from "./AddIphoneModal";

export default function IphoneList() {
  const [iphones, setIphones] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // search state
  const navigate = useNavigate();

  const fetchIphones = () => {
    getIphones()
      .then(setIphones)
      .catch(err => setError(err.message));
  };

  useEffect(() => {
    fetchIphones();
  }, []);

  const handleClick = (id) => {
    navigate(`/iphones/${id}`);
  };

  // Filter iPhones based on search term
  const filteredIphones = iphones.filter(phone =>
    phone.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(phone.release_year).includes(searchTerm)
  );

  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ position: "relative", padding: "20px" }}>
     

      {/* Search bar */}
      <input
        id="searchInput" // your CSS already styles this
        type="text"
        placeholder="Search by model or release year..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "15px", display: "block" }}
      />

      {/* Add iPhone button */}
      <button
        id="addIphoneButton"
        onClick={() => setShowModal(true)}
      >
        + Add iPhone
      </button>

      {showModal && (
        <AddIphoneModal
          onClose={() => setShowModal(false)}
          onIphoneAdded={fetchIphones}
        />
      )}

      {/* iPhone list */}
      <ul id="iphoneList">
        {filteredIphones.map(phone => (
          <li
            key={phone.id}
            onClick={() => handleClick(phone.id)}
            style={{ cursor: "pointer" }}
          >
            {phone.model} ({phone.releaseYear})
          </li>
        ))}
      </ul>
    </div>
  );
}
