import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function SpotDetailsPage() {
  const { id } = useParams(); // Fix: Invoke useParams() to get the id
  const [spot, setSpot] = useState(null);

  useEffect(() => {
    if (!id) return; // Prevent unnecessary API request if no id parameter is available

    // Fetch spot from the backend
    axios
      .get(`http://localhost:3000/spots/${id}`)
      .then((response) => {
        console.log(response.data.spot);
        setSpot(response.data.spot);
      })
      .catch((error) => console.error(`Error fetching spot ${id}:`, error));
  }, [id]); // Add id as a dependency

  // Render a loading state while waiting for data
  if (!spot) {
    return <p>Loading spot details...</p>;
  }

  return (
    <div>
      <div>
        <Link to="/">Back</Link>
      </div>
      <div>
        <img src={spot.images[0]} alt={spot.title} />
      </div>
      <h1>{spot.title}</h1>
      <p>
        Location: {spot.location.city}, {spot.location.address}
      </p>
      <p>{spot.description}</p>

      {spot.amenities.map((amenity) => {
        return (
          <div>
            <p>{amenity}</p>
          </div>
        );
      })}

      <p>Price: {spot.price} €/day</p>

      {/* Host Section */}
      <div>
        <h2>About the Host</h2>
        <p>Company: {spot.createdBy.company}</p>
        <p>Email: {spot.createdBy.email}</p>
        <p>
          Hosted by: {spot.createdBy.firstName} {spot.createdBy.lastName}
        </p>
      </div>

      {/* Availability Section */}
      <div>
        <h2>Availability</h2>
        <ul>
          {spot.availability.map((range, index) => (
            <li key={index}>
              From: {new Date(range.startDate).toLocaleDateString()} To:{" "}
              {new Date(range.endDate).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>

      {/* Booking Button (for future implementation) */}
      <button onClick={() => console.log("Booking initiated!")}>Book</button>
    </div>
  );
}

export default SpotDetailsPage;
