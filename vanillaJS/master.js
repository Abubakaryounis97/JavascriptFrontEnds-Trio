const API_BASE = "http://localhost:8080";

async function loadIphones() {
  try {
    const res = await fetch(`${API_BASE}/iphones`);
    const iphones = await res.json();

    const list = document.getElementById("iphoneList");
    list.innerHTML = "";

    if (!iphones || iphones.length === 0) {
      list.innerHTML = "<li>No iPhones found</li>";
      return;
    }

    iphones.forEach(ip => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="details.html?id=${ip.id}">${ip.id} (Model: ${ip.model})</a>`;
      list.appendChild(li);
    });
  } catch (err) {
    console.error("Error loading iPhones:", err);
  }
}

window.onload = loadIphones;
