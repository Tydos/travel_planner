import React, { useEffect, useState } from "react";
import axios from "axios";

function HomePage() {
  // Initialize state as an empty array
  const [res, setRes] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/getuser")
      .then((response) => {
        setRes(response.data); // Store response in state
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  }, []);

  return (
    <div>
      <h1>HomePage</h1>
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
