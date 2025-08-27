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
