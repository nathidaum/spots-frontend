import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.context";

function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext); // Get user info from context

  useEffect(() => {
    // Fetch bookings for the logged-in user
    axios
      .get("http://localhost:3000/bookings", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      })
      .then((response) => {
        setBookings(response.data.bookings);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading your bookings...</p>;

  if (!bookings.length) {
    return <p>You currently have no bookings.</p>;
  }

  return (
    <div>
      <h1>Your Bookings</h1>
      <div>
        {bookings.map((booking) => (
          <Link key={booking._id} to={`/bookings/${booking._id}`}>
            <div>
              <h2>{booking.spotId.title}</h2>
              <p>
                Location: {booking.spotId.location.city},{" "}
                {booking.spotId.location.address}
              </p>
              <p>Price: {booking.spotId.price} €/day</p>
              <p>
                Dates: {new Date(booking.startDate).toLocaleDateString()} -{" "}
                {new Date(booking.endDate).toLocaleDateString()}
              </p>
              <p>Booked at: {new Date(booking.bookedAt).toLocaleDateString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default BookingsPage;
