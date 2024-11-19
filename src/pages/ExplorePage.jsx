import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function ExplorePage() {
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    // Fetch spots from the backend
    axios.get("http://localhost:3000/spots")
      .then((response) => setSpots(response.data.spots))
      .catch((error) => console.error("Error fetching spots:", error));
  }, []);

  return (
    <div>
      <h1>Explore spots</h1>
      <div>
        {spots.map((spot) => (
          <Link key={spot._id} to={`/spots/${spot._id}`}>
            <div>
              <img src={spot.images[0]} alt={spot.title} />
              <h2>{spot.title}</h2>
              <p>{spot.location.city}</p>
              <p>{spot.price} €/day</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ExplorePage;