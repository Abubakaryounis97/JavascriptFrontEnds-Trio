import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function IphoneDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [iphone, setIphone] = useState(null);
  const [components, setComponents] = useState([]);
  const [showComponents, setShowComponents] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showComponentModal, setShowComponentModal] = useState(false);
  const [componentMode, setComponentMode] = useState("add"); // "add" or "edit"
  const [editedIphone, setEditedIphone] = useState({ model: "", releaseYear: "" });
  const [editedComponent, setEditedComponent] = useState({ type: "", specs: "" });
  const [error, setError] = useState(null);

  // Fetch iPhone details from backend
  useEffect(() => {
    fetch(`http://localhost:8080/iphones/${id}`)
      .then(res => res.json())
      .then(data => {
        setIphone(data);
        setEditedIphone({ model: data.model, releaseYear: data.releaseYear });
      })
      .catch(err => setError(err.message));
  }, [id]);

  // Fetch components for this iPhone
  const fetchComponents = () => {
    fetch(`http://localhost:8080/components/iphone/${id}`)
      .then(res => res.json())
      .then(data => setComponents(data))
      .catch(err => setError(err.message));
  };

  const handleShowComponents = () => {
    if (!showComponents) fetchComponents();
    setShowComponents(!showComponents);
    setSelectedComponent(null);
  };

  // iPhone Edit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editedIphone.model.trim()) return setError("Model is required");
    if (!editedIphone.releaseYear || editedIphone.releaseYear < 2000 || editedIphone.releaseYear > new Date().getFullYear())
      return setError("Enter a valid release year");

    fetch(`http://localhost:8080/iphones/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedIphone),
    })
      .then(res => res.json())
      .then(updated => {
        setIphone(updated);
        setShowEditModal(false);
        setError(null);
      })
      .catch(err => setError(err.message));
  };

  // Delete iPhone
  const handleDeleteIphone = () => {
    if (window.confirm("Are you sure you want to delete this iPhone?")) {
      fetch(`http://localhost:8080/iphones/${id}`, { method: "DELETE" })
        .then(res => {
          if (!res.ok) throw new Error("Failed to delete iPhone");
          navigate("/");
        })
        .catch(err => setError(err.message));
    }
  };

  // Add/Edit Component
  const handleComponentSubmit = (e) => {
    e.preventDefault();
    if (!editedComponent.type.trim()) return setError("Type is required");

    const method = componentMode === "add" ? "POST" : "PUT";
    const url = componentMode === "add" 
                ? `http://localhost:8080/components`
                : `http://localhost:8080/components/${selectedComponent.id}`;

    const body = componentMode === "add"
                 ? { ...editedComponent, iphone_id: id }
                 : editedComponent;

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then(res => res.json())
      .then(() => {
        fetchComponents();
        setShowComponentModal(false);
        setSelectedComponent(null);
        setEditedComponent({ type: "", specs: "" });
        setError(null);
      })
      .catch(err => setError(err.message));
  };

  // Delete Component
  const handleDeleteComponent = (compId) => {
    if (window.confirm("Are you sure you want to delete this component?")) {
      fetch(`http://localhost:8080/components/${compId}`, { method: "DELETE" })
        .then(() => {
          fetchComponents();
          setSelectedComponent(null);
        })
        .catch(err => setError(err.message));
    }
  };

  if (error) return (
    <div style={{ padding: "20px" }}>
      <p style={{ color: "red", backgroundColor: "#ffe6e6", padding: "10px", borderRadius: "4px" }}>
        Error: {error}
      </p>
      <button onClick={() => setError(null)}>Clear Error</button>
    </div>
  );

  if (!iphone) return (
    <div style={{ padding: "20px" }}>
      <p>Loading...</p>
    </div>
  );

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", textAlign: "left", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: "20px" }}>iPhone Details</h1>

      {/* Top Buttons */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button onClick={() => navigate("/")} style={{ backgroundColor: "#28a745", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          ← Back
        </button>
        <button onClick={() => setShowEditModal(true)} style={{ backgroundColor: "#28a745", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Edit
        </button>
        <button onClick={handleDeleteIphone} style={{ marginLeft: "auto", backgroundColor: "#dc3545", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Delete
        </button>
      </div>

      {/* iPhone Details Box */}
      <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", marginBottom: "20px", border: "1px solid #e0e0e0" }}>
        <p><strong>Model:</strong> {iphone.model}</p>
        <p><strong>ID:</strong> {iphone.id}</p>
        <p><strong>Release Year:</strong> {iphone.releaseYear}</p>
      </div>

      {/* Components Buttons */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <button onClick={handleShowComponents} style={{ padding: "8px 16px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          {showComponents ? "Hide Components" : "Show Components"}
        </button>
        <button onClick={() => { setComponentMode("add"); setEditedComponent({ type: "", specs: "" }); setShowComponentModal(true); }} style={{ padding: "8px 16px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Add Component
        </button>
      </div>

      {/* Components List */}
      {showComponents && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {components.length === 0 ? <li>No components for this iPhone.</li> : components.map(c => (
            <li key={c.id} style={{ cursor: "pointer", marginBottom: "8px", padding: "10px", backgroundColor: selectedComponent?.id === c.id ? "#e3f2fd" : "#f8f9fa", border: "1px solid #dee2e6", borderRadius: "4px" }}
              onClick={() => setSelectedComponent(selectedComponent?.id === c.id ? null : c)}
            >
              <strong>{c.type}</strong>
              {selectedComponent?.id === c.id && (
                <div style={{ marginTop: "10px" }}>
                  <p><strong>Specs:</strong> {c.specs || "N/A"}</p>
                  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <button onClick={(e) => { e.stopPropagation(); setComponentMode("edit"); setEditedComponent({ type: c.type, specs: c.specs }); setShowComponentModal(true); }} style={{ padding: "6px 12px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                      Edit
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteComponent(c.id); }} style={{ padding: "6px 12px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* iPhone Edit Modal */}
      {showEditModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}
          onClick={e => { if (e.target === e.currentTarget) setShowEditModal(false); }}>
          <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", maxWidth: "500px", width: "90%", position: "relative" }}>
            <span onClick={() => setShowEditModal(false)} style={{ position: "absolute", top: "10px", right: "15px", fontSize: "28px", fontWeight: "bold", cursor: "pointer", color: "#aaa" }}>×</span>
            <h2>Edit iPhone</h2>
            <div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Model:</label>
                <input type="text" value={editedIphone.model} onChange={e => setEditedIphone(prev => ({ ...prev, model: e.target.value }))} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Release Year:</label>
                <input type="number" value={editedIphone.releaseYear} onChange={e => setEditedIphone(prev => ({ ...prev, releaseYear: e.target.value }))} min="2000" max={new Date().getFullYear()} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
              </div>
              <div style={{ textAlign: "right" }}>
                <button onClick={() => setShowEditModal(false)} style={{ backgroundColor: "#6c757d", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px", marginRight: "10px", cursor: "pointer" }}>Cancel</button>
                <button onClick={handleEditSubmit} style={{ backgroundColor: "#28a745", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer" }}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Component Add/Edit Modal */}
      {showComponentModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}
          onClick={e => { if (e.target === e.currentTarget) setShowComponentModal(false); }}>
          <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", maxWidth: "500px", width: "90%", position: "relative" }}>
            <span onClick={() => setShowComponentModal(false)} style={{ position: "absolute", top: "10px", right: "15px", fontSize: "28px", fontWeight: "bold", cursor: "pointer", color: "#aaa" }}>×</span>
            <h2>{componentMode === "add" ? "Add Component" : "Edit Component"}</h2>
            <div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Type:</label>
                <input type="text" value={editedComponent.type} onChange={e => setEditedComponent(prev => ({ ...prev, type: e.target.value }))} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Specs:</label>
                <input type="text" value={editedComponent.specs} onChange={e => setEditedComponent(prev => ({ ...prev, specs: e.target.value }))} style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }} />
              </div>
              <div style={{ textAlign: "right" }}>
                <button onClick={() => setShowComponentModal(false)} style={{ backgroundColor: "#6c757d", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px", marginRight: "10px", cursor: "pointer" }}>Cancel</button>
                <button onClick={handleComponentSubmit} style={{ backgroundColor: "#28a745", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer" }}>{componentMode === "add" ? "Add" : "Save"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
