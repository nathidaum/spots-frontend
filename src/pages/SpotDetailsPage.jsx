import { useState, useEffect, useContext, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Text,
  Title,
  Button,
  List,
  ThemeIcon,
  Skeleton,
  Flex,
  ActionIcon,
  Group,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { DatePicker } from "@mantine/dates";
import { modals } from "@mantine/modals";
import {
  IconArrowLeft,
  IconCheck,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import "./spotdetailspage.css";
import "../components/SpotCard/spotcard.css";
import { AuthContext } from "../context/auth.context";

function SpotDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [spot, setSpot] = useState(null);
  const { user } = useContext(AuthContext); // Get the current user from context
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availabilities, setAvailabilities] = useState([]); // Store available date ranges
  const [startDate, setStartDate] = useState(null); // Start date for booking
  const [endDate, setEndDate] = useState(null); // End date for booking
  const [blockedDates, setBlockedDates] = useState([]); // Store blocked dates


  // Check if booking is available
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

  // Exclude booked dates
  const excludeDate = (date) => {
    const currentDate = date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
    return blockedDates.some(({ startDate, endDate }) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return date >= start && date <= end;
    });
  };  
  
  useEffect(() => {
    if (!id) return;

    // Fetch spot details and blocked dates
    axios.get(`http://localhost:3000/spots/${id}`)
    .then((response) => {
      setSpot(response.data.spot);
      setBlockedDates(response.data.spot.blockedDates || []);
    })
      .catch((error) => console.error(`Error fetching spot ${id}:`, error));
  }, [id]);

  const handleBookingSubmit = async () => {
    if (!startDate || !endDate) {
      console.error("Start and end dates must be selected.");
      return;
    }
  
    try {
      const token = localStorage.getItem("authToken");
  
      const response = await axios.post(
        "http://localhost:3000/bookings",
        {
          spotId: id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("Booking successful:", response.data);
  
      // Update blockedDates with the new booking
      setBlockedDates((prev) => [
        ...prev,
        { startDate: startDate.toISOString(), endDate: endDate.toISOString() },
      ]);
  
      setStartDate(null);
      setEndDate(null);
  
      navigate(`/bookingconfirmation/${response.data.booking._id}`);
    } catch (error) {
      console.error("Server Response:", error.response?.data);
    }
  };  

  const openDeleteModal = () => {
    setIsModalOpen(true); // Track modal open state
    modals.openConfirmModal({
      title: "Delete this spot 🗑️",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this spot? This action cannot be
          reverted. 😢
        </Text>
      ),
      labels: { confirm: "Delete spot", cancel: "Don't delete" },
      confirmProps: { color: "orange" },
      onCancel: () => setIsModalOpen(false), // Close modal on cancel
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("authToken");
          await axios.delete(`http://localhost:3000/spots/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("Spot deleted successfully.");
          setIsModalOpen(false); // Close modal
          window.location.href = "/"; // Redirect to home page
        } catch (error) {
          console.error("Error deleting spot:", error);
        }
      },
    });
  };

  if (!spot) {
    return (
      <div className="skeleton-detailed-page">
        <Skeleton height={260} />
        <Skeleton height={40} mt="md" radius="sm" style={{ width: "100%" }} />
        <Skeleton
          height={40}
          mt="md"
          radius="sm"
          ml="md"
          mr="md"
          style={{ width: "60%" }}
        />
        <Skeleton
          height={50}
          mt="xs"
          ml="md"
          mr="md"
          radius="sm"
          style={{ width: "80%" }}
        />
        <Skeleton
          height={10}
          mt="md"
          ml="md"
          mr="md"
          radius="sm"
          style={{ width: "80%" }}
        />
      </div>
    );
  }

  return (
    <div className="detailspage">
      {/* Icons Section */}
      <div className="detailed-carousel-container">
        <Group justify="flex-end">
          <ActionIcon
            size="md"
            m={10}
            className="arrowback-icon"
            c="yellow"
            component={Link}
            to="/"
          >
            <IconArrowLeft color="black" />
          </ActionIcon>
          {user?._id === spot.createdBy?._id && (
            <>
              <ActionIcon
                size="md"
                m={10}
                className="edit-icon"
                c="yellow"
                component={Link}
                to={`/spots/${spot._id}/edit`}
              >
                <IconEdit color="black" />
              </ActionIcon>
              <ActionIcon
                size="md"
                m={10}
                className="delete-spot-icon"
                c="yellow"
                onClick={openDeleteModal}
              >
                <IconTrash color="black" />
              </ActionIcon>
            </>
          )}
        </Group>
        <Carousel withIndicators loop height="30vh" withControls={false}>
          {spot.images.map((image, index) => (
            <Carousel.Slide key={index}>
              <div className="image-container">
                <img
                  src={image}
                  alt={`Spot image ${index + 1}`}
                  className="detailed-carousel-image"
                />
                <div className="image-overlay"></div>
              </div>
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>
      <section className="detailed-content">
        <Flex direction="column" mt="md">
          <Title order={1}>{spot.title}</Title>
          <Text size="sm" c="dimmed" mt="sm">
            📍 {spot.location.city}, {spot.location.address}
          </Text>
          <Text mt="md">{spot.description}</Text>
          <Title order={2} mt="lg" mb="sm">
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
          <Title order={3}>About the Host</Title>
          <Text>
            {spot.createdBy.firstName} {spot.createdBy.lastName}
          </Text>
          {spot.createdBy.company && (
            <Text>
              Company: <strong>{spot.createdBy.company}</strong>
            </Text>
          )}
          <Title order={2} mt="lg" mb="sm">
            Book this Spot
          </Title>
          <DatePicker
            value={startDate}
            onChange={(date) => {
              setStartDate(date);
              if (endDate && date > endDate) setEndDate(null); // Reset end date if invalid
            }}
            placeholder="Start Date"
            minDate={new Date()}
            excludeDate={excludeDate}
            styles={{
              day: (date, modifiers) => ({
                backgroundColor: modifiers.disabled ? "#f0f0f0" : undefined,
                color: modifiers.disabled ? "#b0b0b0" : undefined,
                pointerEvents: modifiers.disabled ? "none" : undefined,
              }),
            }}
          />
          <DatePicker
            value={endDate}
            onChange={setEndDate}
            placeholder="End Date"
            minDate={startDate || new Date()} // End date must be after start date
            excludeDate={excludeDate}
            styles={{
              day: (date, modifiers) => ({
                backgroundColor: modifiers.disabled ? "#f0f0f0" : undefined,
                color: modifiers.disabled ? "#b0b0b0" : undefined,
                pointerEvents: modifiers.disabled ? "none" : undefined,
              }),
            }}
          />
        </Flex>
      </section>
      <Button
        color="yellow"
        size="md"
        className="desktop-booking-button"
        onClick={handleBookingSubmit}
      >
        Book
      </Button>
      <div className="sticky-footer">
        <div className="price-info">
          <Text fw={600} size="lg">
            €{spot.price} / day
          </Text>
        </div>
        <Button color="yellow" size="lg" onClick={handleBookingSubmit}>
          Book
        </Button>
      </div>
    </div>
  );
}

export default SpotDetailsPage;
