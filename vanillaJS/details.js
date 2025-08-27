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
        // components.forEach(c => {
        //   const li = document.createElement("li");
        //   li.innerHTML = `${c.type}`;
        //   li.style.cursor = "pointer";

        //   // Click event to show component details
        //   li.addEventListener("click", () => {
        //     let html = `<p><strong>ID:</strong> ${c.id}</p>`;
        //     html += `<p><strong>Name:</strong> ${c.name}</p>`;
        //     html += `<p><strong>Type:</strong> ${c.type}</p>`;
        //     html += `<p><strong>Specs:</strong> ${c.specs}</p>`;
        //     document.getElementById("componentDetails").innerHTML = html;
        //   });

        //   list.appendChild(li);
        // });

    } catch (err) {
        console.error("Error fetching components:", err);
        document.getElementById("componentsList").innerHTML = "<li>Error loading components.</li>";
    }
});
