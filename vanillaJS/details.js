const API_BASE = "http://localhost:8080";

// Get iPhone ID from URL query string
const params = new URLSearchParams(window.location.search);
const iphoneId = params.get("id");

async function loadIphoneDetails(id) {
    try {
        // Fetch iPhone info
        const res = await fetch(`${API_BASE}/iphones/${id}`);
        if (res.status === 404) {
            document.getElementById("iphoneDetails").innerHTML = "iPhone not found";
            return;
        }
        const ip = await res.json();

        // Display ID, full name, and release year
        let html = `<p><strong>ID:</strong> ${ip.id}</p>`;
        html += `<p><strong>Full Name:</strong> ${ip.model}</p>`;
        html += `<p><strong>Release Year:</strong> ${ip.releaseYear}</p>`;

        document.getElementById("iphoneDetails").innerHTML = html;
    } catch (err) {
        console.error("Error fetching iPhone details:", err);
        document.getElementById("iphoneDetails").innerHTML = "Error loading iPhone details";
    }
}
document.getElementById("backButton").addEventListener("click", () => {
    window.location.href = "master.html";
});

if (iphoneId) {
    loadIphoneDetails(iphoneId);
} else {
    document.getElementById("iphoneDetails").innerHTML = "No iPhone ID specified.";
}

// component details
document.getElementById("showComponentsButton").addEventListener("click", async () => {
    if (!iphoneId) return;

    try {
        const res = await fetch(`${API_BASE}/components/iphone/${iphoneId}`);
        const components = await res.json();

        const list = document.getElementById("componentsList");
        list.innerHTML = ""; // clear previous list
        document.getElementById("componentDetails").innerHTML = ""; // clear previous detail

        if (components.length === 0) {
            list.innerHTML = "<li>No components found</li>";
            return;
        }
        components.forEach(c => {
            const li = document.createElement("li");
            // make each component a clickable link
            li.innerHTML = `<a href="component.html?iphoneId=${iphoneId}&componentId=${c.id}">${c.type}</a>`;
            list.appendChild(li);
        });
      

    } catch (err) {
        console.error("Error fetching components:", err);
        document.getElementById("componentsList").innerHTML = "<li>Error loading components.</li>";
    }
});
// delete function
const deleteButton = document.getElementById("deleteButton");

deleteButton.addEventListener("click", async () => {
  if (!iphoneId) return;

  const confirmDelete = confirm("Are you sure you want to delete this iPhone?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`${API_BASE}/iphones/${iphoneId}`, {
      method: "DELETE"
    });

    if (res.status === 200 || res.status === 204) {
      alert("iPhone deleted successfully!");
      window.location.href = "master.html"; // go back to master list
    } else if (res.status === 404) {
      alert("iPhone not found or already deleted.");
    } else {
      alert("Error deleting iPhone.");
    }
  } catch (err) {
    console.error("Error deleting iPhone:", err);
    alert("Error deleting iPhone.");
  }
});
// Grab modal elements
const editButton = document.getElementById("editButton");
const editModal = document.getElementById("editIphoneModal");
const closeEdit = document.querySelector(".close-edit");
const confirmEdit = document.getElementById("confirmEditIphone");

// Open modal and prefill inputs
editButton.addEventListener("click", () => {
  document.getElementById("editIphoneModel").value = document.querySelector("#iphoneDetails p:nth-child(2)").textContent.replace("Full Name: ", "");
  document.getElementById("editIphoneYear").value = document.querySelector("#iphoneDetails p:nth-child(3)").textContent.replace("Release Year: ", "");
  editModal.style.display = "block";
});

// Close modal
closeEdit.addEventListener("click", () => {
  editModal.style.display = "none";
});

// Save changes
confirmEdit.addEventListener("click", async () => {
  const model = document.getElementById("editIphoneModel").value;
  const year = parseInt(document.getElementById("editIphoneYear").value);

  try {
    const res = await fetch(`${API_BASE}/iphones/${iphoneId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, releaseYear: year })
    });

    if (res.status === 200) {
      const updated = await res.json();
      alert("iPhone updated successfully!");
      editModal.style.display = "none";
      loadIphoneDetails(iphoneId); // refresh details
    } else {
      alert("Error updating iPhone.");
    }
  } catch (err) {
    console.error("Error updating iPhone:", err);
    alert("Error updating iPhone.");
  }
});

// Optional: click outside modal to close
window.addEventListener("click", (e) => {
  if (e.target === editModal) editModal.style.display = "none";
});