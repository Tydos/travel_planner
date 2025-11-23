import React, { useEffect, useState } from "react";
import axios from "axios";

function HomePage() {
  const [res, setRes] = useState([]);
  const [activities, setActivities] = useState([]);
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

  useEffect(() => {
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
      setRefreshToggle(prev => prev + 1);
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
      setRefreshToggle(prev => prev + 1);
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handlePlanTrip = async () => {
    try {
      const response = await axios.get("http://localhost:5000/planmytrip");
      const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
      setActivities(data);
    } catch (err) {
      console.error("Error fetching activities:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col md:flex-row gap-6">
      
      {/* Left Column - Forms */}
      <div className="flex flex-col gap-6 md:w-1/3">
        
        {/* Add User */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add User</h2>
          <input
            className="w-full border border-gray-300 rounded-md p-2 mb-2"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            className="w-full border border-gray-300 rounded-md p-2 mb-2"
            type="number"
            name="total_budget"
            placeholder="Total Budget"
            value={formData.total_budget}
            onChange={handleChange}
          />
          <input
            className="w-full border border-gray-300 rounded-md p-2 mb-2"
            type="number"
            name="monthly_saving_capacity"
            placeholder="Monthly Saving Capacity"
            value={formData.monthly_saving_capacity}
            onChange={handleChange}
          />

          <h3 className="font-medium mt-4 mb-2">Preference Weights (0–5)</h3>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {Object.keys(formData.preference_weights).map(key => (
              <div key={key}>
                <label className="text-sm">{key}</label>
                <input
                  className="w-full border border-gray-300 rounded-md p-1"
                  type="number"
                  min="0"
                  max="5"
                  name={key}
                  value={formData.preference_weights[key]}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>

          <h3 className="font-medium mt-2 mb-2">Constraints</h3>
          <input
            className="w-full border border-gray-300 rounded-md p-2 mb-2"
            type="number"
            name="min_hotel_rating"
            placeholder="Min Hotel Rating"
            value={formData.constraints.min_hotel_rating}
            onChange={handleChange}
          />
          <input
            className="w-full border border-gray-300 rounded-md p-2 mb-2"
            type="number"
            name="max_flight_legs"
            placeholder="Max Flight Legs"
            value={formData.constraints.max_flight_legs}
            onChange={handleChange}
          />
          <textarea
            className="w-full border border-gray-300 rounded-md p-2 mb-2 resize-y"
            name="notes"
            placeholder="Notes"
            value={formData.notes}
            onChange={handleChange}
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white py-2 rounded-md mt-2 hover:bg-indigo-700 transition"
          >
            Add User
          </button>
        </div>

        {/* Delete User */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Delete User</h2>
          <input
            className="w-full border border-gray-300 rounded-md p-2 mb-2"
            placeholder="Enter username to delete"
            value={deleteName}
            onChange={(e) => setDeleteName(e.target.value)}
          />
          <button
            onClick={handleDelete}
            className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Middle Column - Activities */}
      <div className="flex flex-col gap-6 md:w-1/3">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <button
            onClick={handlePlanTrip}
            className="w-full bg-green-500 text-white py-2 rounded-md mb-4 hover:bg-green-600 transition"
          >
            PLAN MY TRIP
          </button>
          <h2 className="text-xl font-semibold mb-4">Activities in Madison</h2>
          {activities.length === 0 ? (
            <p className="text-gray-500 italic">No activities available</p>
          ) : (
            <div className="flex flex-col gap-4">
              {activities.map((activity, i) => (
                <div
                  key={i}
                  className="bg-gray-50 p-4 rounded-xl shadow hover:shadow-md transition transform hover:scale-105"
                >
                  <h3 className="text-lg font-semibold text-gray-800">{activity.name}</h3>
                  <p className="font-bold text-gray-700">Budget: ${activity.budget}</p>
                  <p className="text-gray-600">{activity.justification_score}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column - Users */}
      <div className="flex flex-col gap-6 md:w-1/3">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-center">Group Members</h2>
          {res.length === 0 ? (
            <p className="text-gray-500 italic text-center">No users available</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {res.map((user, i) => (
                <li
                  key={i}
                  className="bg-gray-50 p-3 rounded-xl shadow flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center">
                    <strong className="text-indigo-600">{user.name || "Unnamed"}</strong>
                    <span className="text-gray-600 text-sm">Budget: {user.total_budget || "N/A"}</span>
                  </div>
                  {user.preference_weights && (
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(user.preference_weights).map(([k, v]) => (
                        <span key={k} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full">
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
