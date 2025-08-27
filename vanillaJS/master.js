const API_BASE = "http://localhost:8080";

let allIphones = []; // to store all iphones for searching

// Load iPhones function
async function loadIphones() {
  try {
    const res = await fetch(`${API_BASE}/iphones`);
    allIphones = await res.json(); // store the full list

    displayIphones(allIphones); // display them immediately
  } catch (err) {
    console.error("Error loading iPhones:", err);
    document.getElementById("iphoneList").innerHTML = "<li>Error loading iPhones</li>";
  }
}

// Function to render a list of iPhones
function displayIphones(listToShow) {
  const list = document.getElementById("iphoneList");
  list.innerHTML = ""; // clear previous items

  if (!listToShow || listToShow.length === 0) {
    list.innerHTML = "<li>No iPhones found</li>";
    return;
  }

  listToShow.forEach(ip => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="details.html?id=${ip.id}">(${ip.id}) Model: ${ip.model}</a>`;
    list.appendChild(li);
  });
}

// Search functionality
document.getElementById("searchInput").addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = allIphones.filter(ip => 
    ip.model.toLowerCase().includes(query) || String(ip.id).includes(query)
  );
  displayIphones(filtered);
});

window.onload = loadIphones; // automatically load on page load

// Add iPhone button functionality
// Grab elements
const modal = document.getElementById("addIphoneModal");
const openButton = document.getElementById("addIphoneButton");
const closeButton = document.querySelector(".close-button");
const confirmButton = document.getElementById("confirmAddIphone");

// Open modal
openButton.addEventListener("click", () => {
  modal.style.display = "block";
});

// Close modal
closeButton.addEventListener("click", () => {
  modal.style.display = "none";
});
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// Add iPhone on confirm
confirmButton.addEventListener("click", async () => {
  const model = document.getElementById("newIphoneModel").value.trim();
  const year = document.getElementById("newIphoneYear").value.trim();

  if (!model || !year) {
    alert("Please enter both model and release year");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/iphones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, releaseYear: parseInt(year) })
    });

    if (!res.ok) throw new Error("Failed to add iPhone");

    const newIphone = await res.json();
    alert(`iPhone added: ID ${newIphone.id}, Model: ${newIphone.model}`);

    // Close modal and clear inputs
    modal.style.display = "none";
    document.getElementById("newIphoneModel").value = "";
    document.getElementById("newIphoneYear").value = "";

    // Reload list
    loadIphones();
  } catch (err) {
    console.error("Error adding iPhone:", err);
    alert("Error adding iPhone. Check console.");
  }
});