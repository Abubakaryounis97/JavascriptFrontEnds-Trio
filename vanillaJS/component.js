const API_BASE = "http://localhost:8080";

// Grab query parameters from URL
const params = new URLSearchParams(window.location.search);
const componentId = params.get("componentId");
const iphoneId = params.get("iphoneId");

async function loadComponentDetails(id) {
  try {
    const res = await fetch(`${API_BASE}/components/${id}`);
    if (res.status === 404) {
      document.getElementById("componentDetails").innerHTML = "Component not found";
      return;
    }
    const comp = await res.json();

    // Show details (plain text, no buttons yet)
    let html = `<p><strong>ID:</strong> ${comp.id}</p>`;
    html += `<p><strong>Name:</strong> ${comp.name}</p>`;
    html += `<p><strong>Type:</strong> ${comp.type}</p>`;
    html += `<p><strong>Specs:</strong> ${comp.specs}</p>`;
    document.getElementById("componentDetails").innerHTML = html;

  } catch (err) {
    console.error("Error fetching component details:", err);
    document.getElementById("componentDetails").innerHTML = "Error loading component details";
  }
}

if (componentId) {
  loadComponentDetails(componentId);
} else {
  document.getElementById("componentDetails").innerHTML = "No component ID specified.";
}
document.getElementById("backButton").addEventListener("click", () => {
    window.location.href = `details.html?id=${iphoneId}`;
});
document.getElementById("homeButton").addEventListener("click", () => {
    window.location.href = "master.html";
});

// delete component function
const deleteButton = document.getElementById("deleteButton");
deleteButton.addEventListener("click", async () => {
  if (!componentId) return;

  const confirmDelete = confirm("Are you sure you want to delete this component?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`${API_BASE}/components/${componentId}`, {
      method: "DELETE"
    });

    if (res.status === 200 || res.status === 204) {
      alert("Component deleted successfully!");
      window.location.href = `details.html?id=${iphoneId}`; // go back to iPhone details
    } else if (res.status === 404) {
      alert("Component not found or already deleted.");
    } else {
      alert("Error deleting component.");
    }
  } catch (err) {
    console.error("Error deleting component:", err);
    alert("Error deleting component.");
  }
});

// edit components
const editButton = document.getElementById("editButton");
editButton.addEventListener("click", () => {
  const newName = prompt("Enter new component name:");
  const newType = prompt("Enter new component type:");
  const newSpecs = prompt("Enter new component specs:");

  if (!newName || !newType || !newSpecs) {
    return alert("All fields are required.");
  }

  fetch(`${API_BASE}/components/${componentId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: newName,
      type: newType,
      specs: newSpecs
    })
  })
  .then(res => {
    if (!res.ok) throw new Error("Failed to update component");
    return res.json();
  })
  .then(updatedComponent => {
    alert(`Component updated: ID ${updatedComponent.id}, Name: ${updatedComponent.name}`);
    document.getElementById("componentDetails").innerHTML = ""; // clear details
    loadComponentDetails(componentId); // refresh details
  })
  .catch(err => {
    console.error("Error updating component:", err);
    alert("Error updating component. Check console.");
  });
});
