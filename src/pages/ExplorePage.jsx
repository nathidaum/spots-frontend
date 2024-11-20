import { useState, useEffect } from "react";
import axios from "axios";
import SpotCard from "../components/SpotCard";

function ExplorePage() {
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    // Fetch spots from the backend
    axios
      .get("http://localhost:3000/spots")
      .then((response) => setSpots(response.data.spots))
      .catch((error) => console.error("Error fetching spots:", error));
  }, []);

  return (
    <div>
      <h1>Explore spots</h1>
      <div>
        {spots.map((spot) => (
          <SpotCard key={spot._id} spot={spot} />
        ))}
      </div>
    </div>
  );
}

export default ExplorePage;
