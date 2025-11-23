//ONLY FOR TESTING

import React, { useEffect, useState } from "react";
import axios from "axios";

function Test() {
  const [res, setRes] = useState([]);
  const [refreshToggle, setRefreshToggle] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    total_budget: "",
    monthly_saving_capacity: "",
    preference_weights: {
      nightlife: 0,
      adventure: 0,
      shopping: 0,
      food: 0,
      urban: 0
    },
    constraints: {
      min_hotel_rating: 0,
      max_flight_legs: 0
    },
    notes: ""
  });

  useEffect(() => {
    axios.get("http://localhost:5000/getuser")
      .then((response) => setRes(response.data))
      .catch((error) => console.error("Error fetching items:", error));
  }, [refreshToggle]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name in formData.preference_weights) {
      setFormData(prev => ({
        ...prev,
        preference_weights: {
          ...prev.preference_weights,
          [name]: Number(value)
        }
      }));
    } else if (name in formData.constraints) {
      setFormData(prev => ({
        ...prev,
        constraints: {
          ...prev.constraints,
          [name]: Number(value)
        }
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
        name: "",
        total_budget: "",
        monthly_saving_capacity: "",
        preference_weights: {
          nightlife: 0,
          adventure: 0,
          shopping: 0,
          food: 0,
          urban: 0
        },
        constraints: {
          min_hotel_rating: 0,
          max_flight_legs: 0
        },
        notes: ""
      });
    } catch (err) {
      console.error("Error adding item:", err);
    }
  };

  return (
    <div>
      <h1>HomePage</h1>

      <div>
        <h2>Add User</h2>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          name="total_budget"
          placeholder="Total Budget"
          type="number"
          value={formData.total_budget}
          onChange={handleChange}
        />
        <input
          name="monthly_saving_capacity"
          placeholder="Monthly Saving Capacity"
          type="number"
          value={formData.monthly_saving_capacity}
          onChange={handleChange}
        />

        <h3>Preference Weights (0-5)</h3>
        {Object.keys(formData.preference_weights).map(key => (
          <div key={key}>
            <label>{key}: </label>
            <input
              name={key}
              type="number"
              min="0"
              max="5"
              value={formData.preference_weights[key]}
              onChange={handleChange}
            />
          </div>
        ))}

        <h3>Constraints</h3>
        <input
          name="min_hotel_rating"
          type="number"
          placeholder="Min Hotel Rating"
          value={formData.constraints.min_hotel_rating}
          onChange={handleChange}
        />
        <input
          name="max_flight_legs"
          type="number"
          placeholder="Max Flight Legs"
          value={formData.constraints.max_flight_legs}
          onChange={handleChange}
        />

        <textarea
          name="notes"
          placeholder="Notes"
          value={formData.notes}
          onChange={handleChange}
        />

        <button onClick={handleSubmit}>Add User</button>
      </div>

      <ul>
        {res.map((name, index) => (
          <li key={index}>{name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Test;
