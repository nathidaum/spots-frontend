// Imports: External Libraries
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { List, Skeleton, Text, ThemeIcon, Title } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { modals } from "@mantine/modals";
import { IconCheck } from "@tabler/icons-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Imports: Internal Styles and Context
import { AuthContext } from "../context/auth.context";
import DetailedPageCarousel from "../components/DetailedPageCarousel";
import BookingBox from "../components/BookingBox";
import StickyBookingFooter from "../components/StickyBookingFooter";
import "./spotdetailspage.css";
import "../components/SpotCard/spotcard.css";

function SpotDetailsPage() {
  // Router and Navigation
  const { id } = useParams();
  const navigate = useNavigate();

  // Context: Authentication
  const { user } = useContext(AuthContext);

  // State: Spot Details
  const [spot, setSpot] = useState(null);
  const [availabilities, setAvailabilities] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);

  // State: Booking Details
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // ------ API Fetches -------

  // Fetch spot details and blocked dates when component loads
  useEffect(() => {
    if (!id) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/spots/${id}`)
      .then((response) => {
        const { spot } = response.data;
        setSpot(spot);
        setAvailabilities(spot.availabilities || []);
        setBlockedDates(spot.blockedDates || []);
      })
      .catch((error) => console.error(`Error fetching spot ${id}:`, error));
  }, [id]);

  // ------ Computed Values -------

  // Total price for the booking
  const totalPrice = useMemo(() => {
    if (!spot || !startDate || !endDate) return 0;
    const diffInDays =
      Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    return diffInDays * spot.price;
  }, [spot, startDate, endDate]);

  // Number of days for the booking
  const numberOfDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  }, [startDate, endDate]);

  // Check if booking is available for the selected date range
  const isBookingAvailable = useMemo(() => {
    if (!startDate || !endDate) return false;
    return availabilities.some(
      ({ startDate: rangeStart, endDate: rangeEnd }) => {
        const start = new Date(rangeStart);
        const end = new Date(rangeEnd);
        return startDate >= start && endDate <= end;
      }
    );
  }, [startDate, endDate, availabilities]);

  // Exclude booked dates in the calendar
  const excludeDate = (date) => {
    return blockedDates.some(({ startDate, endDate }) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return date >= start && date <= end;
    });
  };

  // ------ Event Handlers -------

  // Handle booking submission
  const handleBookingSubmit = async () => {
    if (!startDate || !endDate) return;

    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/bookings`,
        { spotId: id, startDate, endDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBlockedDates((prev) => [
        ...prev,
        { startDate: startDate.toISOString(), endDate: endDate.toISOString() },
      ]);

      setStartDate(null);
      setEndDate(null);

      navigate(`/bookingconfirmation/${response.data.booking._id}`);
    } catch (error) {
      console.error("Error booking spot:", error.response?.data || error);

      toast.warn("Please log in to pursue with the booking. 📆", {
        position: "bottom-right",
        autoClose: 3000,
        icon: false,
        style: { backgroundColor: "#1C1C1C", color: "white" },
      });
    }
  };

  // Handle spot deletion
  const openDeleteModal = () => {
    modals.openConfirmModal({
      title: "Delete this spot 🗑️",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this spot? This action cannot be
          undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "orange" },
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("authToken");
          await axios.delete(`${import.meta.env.VITE_API_URL}/spots/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          navigate("/");
        } catch (error) {
          console.error("Error deleting spot:", error);
        }
      },
    });
  };

  // Render the skeleton screen while loading
  if (!spot) {
    return (
      <div className="skeleton-detailed-page">
        <Skeleton height={260} />
        <Skeleton height={40} mt="md" radius="sm" />
      </div>
    );
  }

  // ------ Component Render -------
  return (
    <div className="detailspage">
      {/* Carousel Section */}
      <DetailedPageCarousel
        spot={spot}
        user={user}
        openDeleteModal={openDeleteModal}
      />

      {/* Spot Details Section */}
      <section className="detailed-content">
        <div className="left-content">
          <Title order={1}>{spot.title}</Title>
          <Text size="sm" c="dimmed" mt="sm">
            📍 {spot.location.city}, {spot.location.address}
          </Text>
          <Text mt="md">{spot.description}</Text>
          <Title order={3} mt="lg" mb="md">
            Amenities
          </Title>
          <List
            spacing="sm"
            icon={
              <ThemeIcon color="yellow" size={24} radius="xl">
                <IconCheck size={14} />
              </ThemeIcon>
            }
          >
            {spot.amenities.map((amenity, index) => (
              <List.Item key={index}>{amenity}</List.Item>
            ))}
          </List>
          <br />
          <Title order={3} mb="md">
            About the Host
          </Title>
          <Text>
            Your host is {spot.createdBy.firstName}{" "}
            {spot.createdBy.profile.linkedinUrl ? (
              <Link to={spot.createdBy.profile.linkedinUrl}>
                {spot.createdBy.lastName}
              </Link>
            ) : (
              spot.createdBy.lastName
            )}{" "}
            from {spot.createdBy.profile.company}. <br />
            Contact for more information via email to{" "}
            <Link to={`mailto:${spot.createdBy.email}`}>
              {spot.createdBy.email} 💌
            </Link>
          </Text>
        </div>

        <div className="date-selection-mobile">
          <Title order={3}>Select dates</Title>
          <DateInput
            mt="lg"
            mb="lg"
            radius={10}
            value={startDate}
            onChange={(date) => {
              setStartDate(date);
              if (endDate && date > endDate) setEndDate(null); // Reset end date if invalid
            }}
            placeholder="Start Date"
            minDate={new Date()}
            excludeDate={excludeDate}
            label="Start Date"
            withAsterisk
            styles={{
              input: {
                backgroundColor: "white",
              },
              day: (date, modifiers) => ({
                backgroundColor: modifiers.disabled ? "#f0f0f0" : undefined,
                color: modifiers.disabled ? "#b0b0b0" : undefined,
                pointerEvents: modifiers.disabled ? "none" : undefined,
              }),
            }}
          />
          <DateInput
            radius={10}
            value={endDate}
            onChange={setEndDate}
            placeholder="End Date"
            minDate={startDate || new Date()} // End date must be after start date
            excludeDate={excludeDate}
            label="End Date"
            withAsterisk
            styles={{
              input: {
                backgroundColor: "white",
              },
              day: (date, modifiers) => ({
                backgroundColor: modifiers.disabled ? "#f0f0f0" : undefined,
                color: modifiers.disabled ? "#b0b0b0" : undefined,
                pointerEvents: modifiers.disabled ? "none" : undefined,
              }),
            }}
          />
        </div>

        {/* Desktop Booking Section */}
        <BookingBox
          excludeDate={excludeDate}
          handleBookingSubmit={handleBookingSubmit}
          numberOfDays={numberOfDays}
          setEndDate={setEndDate}
          setStartDate={setStartDate}
          startDate={startDate}
          endDate={endDate}
          spot={spot}
          totalPrice={totalPrice}
        />
      </section>

      <div>
        <StickyBookingFooter
          spot={spot}
          startDate={startDate}
          endDate={endDate}
          totalPrice={totalPrice}
          handleBookingSubmit={handleBookingSubmit}
        />
      </div>
    </div>
  );
}

export default SpotDetailsPage;
