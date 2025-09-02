import { Routes, Route } from "react-router-dom";
import IphoneList from "./components/IphoneList";
import IphoneDetails from "./components/IphoneDetails";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>iPhones</h1>
      <Routes>
        <Route path="/" element={<IphoneList />} />
        <Route path="/iphones/:id" element={<IphoneDetails />} />
      </Routes>
    </div>
  );
}

export default App;
