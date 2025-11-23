import React, { useEffect, useState } from "react";
import axios from "axios";

function HomePage() {
  // Initialize state as an empty array
  const [res, setRes] = useState([]);
  const [refreshToggle, setRefreshToggle] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:5000/getuser")
      .then((response) => {
        setRes(response.data); // Store response in state
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  }, [refreshToggle]);

  return (
    <div>
      <h1>HomePage</h1>

      <button
        onClick={async () => {
          try {
            const resp = await axios.post("http://localhost:5000/adduser");
            setRefreshToggle(prev => prev + 1);
            // append returned item to state
            // setRes((prev) => [...prev, resp.data]);
          } catch (err) {
            console.error("Error adding item:", err);
          }
        }}
      >
        Add Item
      </button>

      <ul>
        {res.map((name, index) => (
          <li key={index}>
            {name} 
          </li> 
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
