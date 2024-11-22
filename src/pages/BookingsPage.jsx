import { useState, useEffect, useContext } from "react";
import axios from "axios";
import BookingCard from "../components/BookingCard/BookingCard";
import { AuthContext } from "../context/auth.context";
import "./explorepage.css"

function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/bookings", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      })
      .then((response) => {
        setBookings(response.data.bookings || []);
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
      <div className="explorepage">
        <h1 className="mobile-title">Booked spots</h1>
        <div className="gallery-container">
          <div className="spotslist">
            {bookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingsPage;
