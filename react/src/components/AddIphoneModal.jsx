import { useState } from "react";
import { addIphone } from "../services/api";

export default function AddIphoneModal({ onClose, onIphoneAdded }) {
  const [model, setModel] = useState("");
  const [releaseYear, setReleaseYear] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!model.trim() || !releaseYear) return;

    try {
      await addIphone({ model, release_year: parseInt(releaseYear) });
      onIphoneAdded();
      onClose();
    } catch (err) {
      alert("Failed to add iPhone: " + err.message);
    }
  };

  return (
    <div className="modal" style={{ display: "block" }}>
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <h3>Add New iPhone</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div>
            <label>Model:</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #45a049",
                fontSize: "14px"
              }}
            />
          </div>
          <div>
            <label>Release Year:</label>
            <input
              type="number"
              value={releaseYear}
              onChange={(e) => setReleaseYear(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #45a049",
                fontSize: "14px"
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button type="submit" style={{ backgroundColor: "#4CAF50", color: "#fff" }}>Add</button>
            <button type="button" onClick={onClose} style={{ backgroundColor: "#af564c", color: "#fff" }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
