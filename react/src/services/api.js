const API_URL = "http://localhost:8080"; // change if backend runs elsewhere

// Fetch all iPhones
export async function getIphones() {
  const res = await fetch(`${API_URL}/iphones`);
  if (!res.ok) throw new Error("Failed to fetch iPhones");
  return res.json();
}
// post iphone 
export async function addIphone(data) {
  const res = await fetch(`${API_URL}/iphones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add iPhone");
  return res.json();
}
