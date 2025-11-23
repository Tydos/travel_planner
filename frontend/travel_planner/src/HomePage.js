import React, { useEffect, useState } from "react";
import axios from "axios";

function HomePage() {
  const [res, setRes] = useState([]);
  const [cities, setCities] = useState([]);
  const [refreshToggle, setRefreshToggle] = useState(0);
  const [deleteName, setDeleteName] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    total_budget: "",
    monthly_saving_capacity: "",
    preference_weights: { nightlife: 0, adventure: 0, shopping: 0, food: 0, urban: 0 },
    constraints: { min_hotel_rating: 0, max_flight_legs: 0 },
    notes: ""
  });

  // Fetch cities and users whenever refreshToggle changes
  useEffect(() => {
    // axios.get("http://localhost:5000/planmytrip")
    //   .then((response) => setCities(response.data))
    //   .catch((error) => console.error("Error fetching cities:", error));

    axios.get("http://localhost:5000/getusers")
      .then((response) => setRes(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, [refreshToggle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.preference_weights) {
      setFormData(prev => ({
        ...prev,
        preference_weights: { ...prev.preference_weights, [name]: Number(value) }
      }));
    } else if (name in formData.constraints) {
      setFormData(prev => ({
        ...prev,
        constraints: { ...prev.constraints, [name]: Number(value) }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/adduser", formData);
      setRefreshToggle(prev => prev + 1); // triggers refresh
      setFormData({
        name: "", total_budget: "", monthly_saving_capacity: "",
        preference_weights: { nightlife: 0, adventure: 0, shopping: 0, food: 0, urban: 0 },
        constraints: { min_hotel_rating: 0, max_flight_legs: 0 }, notes: ""
      });
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  const handleDelete = async () => {
    if (!deleteName.trim()) return;
    try {
      await axios.delete(`http://localhost:5000/deluser/${deleteName}`);
      setDeleteName("");
      setRefreshToggle(prev => prev + 1); // triggers refresh
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

 // Refresh triggered by "PLAN MY TRIP"
const handlePlanTrip = async () => {
  try {
   // Fetch trip plan
  const response = await axios.get("http://localhost:5000/planmytrip");

  // Parse if the response is a string
  const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;

  // Update state (activities instead of cities for clarity)
  setCities(data); // or setActivities(data) if you renamed the state
  } catch (err) {
    console.error("Error fetching cities:", err);
  }
};


  // Inline Styles
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f4f9",
    minHeight: "100vh",
    padding: "40px 20px",
    gap: "20px"
  };

  const columnStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    flex: 1,
    maxWidth: "400px",
    padding: "10px"
  };

  const sectionStyle = {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0px 2px 10px rgba(0,0,0,0.12)",
    margin: "5px"
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "5px 0",
    borderRadius: "5px",
    border: "1px solid #ccc"
  };

  const buttonStyle = {
    backgroundColor: "#5c6bc0",
    color: "white",
    border: "none",
    padding: "12px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    margin: "5px 0"
  };

  const listItemStyle = {
    backgroundColor: "#fff",
    padding: "10px 14px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    margin: "5px 0"
  };

  return (
    <div style={containerStyle}>
      {/* Left Column - Forms */}
      <div style={columnStyle}>
        <div style={sectionStyle}>
          <h2>Add User</h2>
          <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} style={inputStyle} />
          <input name="total_budget" placeholder="Total Budget" type="number" value={formData.total_budget} onChange={handleChange} style={inputStyle} />
          <input name="monthly_saving_capacity" placeholder="Monthly Saving Capacity" type="number" value={formData.monthly_saving_capacity} onChange={handleChange} style={inputStyle} />

          <h3>Preference Weights (0–5)</h3>
          {Object.keys(formData.preference_weights).map(key => (
            <div key={key} style={{ margin: "5px 0" }}>
              <label>{key}: </label>
              <input name={key} type="number" min="0" max="5" value={formData.preference_weights[key]} onChange={handleChange} style={inputStyle} />
            </div>
          ))}

          <h3>Constraints</h3>
          <input name="min_hotel_rating" type="number" placeholder="Min Hotel Rating" value={formData.constraints.min_hotel_rating} onChange={handleChange} style={inputStyle} />
          <input name="max_flight_legs" type="number" placeholder="Max Flight Legs" value={formData.constraints.max_flight_legs} onChange={handleChange} style={inputStyle} />
          <textarea name="notes" placeholder="Notes" value={formData.notes} onChange={handleChange} style={{ ...inputStyle, resize: "vertical" }} />

          <button onClick={handleSubmit} style={buttonStyle}>Add User</button>
        </div>

        <div style={sectionStyle}>
          <h2>Delete User</h2>
          <input placeholder="Enter username to delete" value={deleteName} onChange={(e) => setDeleteName(e.target.value)} style={inputStyle} />
          <button onClick={handleDelete} style={buttonStyle}>Delete</button>
        </div>
      </div>

      {/* Middle Column - Activities */}
      <div style={columnStyle}>
  <div style={sectionStyle}>
    <button 
      onClick={handlePlanTrip} 
      style={{ ...buttonStyle, width: "100%", marginBottom: "15px" }}
    >
      PLAN MY TRIP
    </button>
    <h2>Activities in Madison</h2>
    
    {cities.length > 0 ? (
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {cities.map((activity, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "#fff",
              padding: "15px 20px",
              borderRadius: "12px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <h3 style={{ margin: "0 0 8px 0", color: "#222" }}>{activity.name}</h3>
            <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>Budget: ${activity.budget}</p>
            <p style={{ margin: 0, color: "#555" }}>{activity.justification_score}</p>
          </div>
        ))}
      </div>
    ) : (
      <p style={{ color: "#888", fontStyle: "italic" }}>No activities available</p>
    )}
  </div>
</div>


      {/* Right Column - Group Members */}
    <div style={columnStyle}>
  <div style={{ ...sectionStyle, padding: "20px", backgroundColor: "#fefefe" }}>
    <h2 style={{ textAlign: "center", marginBottom: "15px", color: "#333" }}>Group Members</h2>
    {res.length === 0 ? (
      <p style={{ textAlign: "center", color: "#777" }}>No users available</p>
    ) : (
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
        {res.map((user, i) => (
          <li key={i} style={{
            ...listItemStyle,
            padding: "12px",
            borderRadius: "10px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            backgroundColor: "#ffffff"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong style={{ color: "#5c6bc0" }}>{user.name || "Unnamed"}</strong>
              <span style={{ fontSize: "12px", color: "#555" }}>Budget: {user.total_budget || "N/A"}</span>
            </div>
            
            {user.preference_weights && (
              <div style={{ marginTop: "8px", display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {Object.entries(user.preference_weights).map(([k, v]) => (
                  <span key={k} style={{
                    backgroundColor: "#e0e0ff",
                    color: "#3f51b5",
                    fontSize: "11px",
                    padding: "2px 6px",
                    borderRadius: "8px"
                  }}>
                    {k}: {v}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    )}
  </div>
</div>


    </div>
  );
}

export default HomePage;
