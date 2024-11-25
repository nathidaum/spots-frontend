import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Stepper,
  Button,
  Group,
  TextInput,
  Textarea,
  MultiSelect,
  NumberInput,
  Container,
  Text,
  Badge,
  Title,
  FileInput,
  ActionIcon,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { DatePickerInput } from "@mantine/dates";
import { IconTrash } from "@tabler/icons-react";

import "./editspot.css";
import "../components/SpotCard/spotcard.css";

const amenitiesOptions = [
  "Wifi",
  "Parking",
  "Coffee",
  "Lift",
  "Phonebox",
  "Meeting Room",
  "Kitchen",
];

const EditSpot = () => {
  const { spotId } = useParams(); // Get spotId from URL
  const [spot, setSpot] = useState(null); // Store the spot details
  const [form, setForm] = useState({
    title: "",
    description: "",
    deskCount: 1,
    location: { city: "", address: "" },
    amenities: [],
    price: 0,
    availability: { startDate: null, endDate: null },
    images: [],
  });

  const [files, setFiles] = useState([]); // Define state for new files
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  // Fetch Spot Data
  useEffect(() => {
    const fetchSpot = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/spots/${spotId}`
        );
        const data = response.data;
        console.log("Fetched spot data:", response.data.spot);

        // Safeguard against missing data
        const location = data.spot.location || { city: "", address: "" };
        const availability = data.spot.availability?.[0] || {
          startDate: null,
          endDate: null,
        };

        setSpot(data);
        setForm({
          title: data.spot.title || "",
          description: data.spot.description || "",
          deskCount: data.spot.deskCount || 1,
          location: { city: location.city, address: location.address },
          amenities: data.spot.amenities || [],
          price: data.spot.price || 0,
          availability: {
            startDate: availability.startDate
              ? new Date(availability.startDate)
              : null,
            endDate: availability.endDate
              ? new Date(availability.endDate)
              : null,
          },
          images: data.spot.images || [],
        });
      } catch (err) {
        console.error("Error fetching spot:", err);
      }
    };

    fetchSpot();
  }, [spotId]);

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleLocationChange = (field, value) => {
    setForm({ ...form, location: { ...form.location, [field]: value } });
  };

  const handleAvailabilityChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      availability: { ...prev.availability, [field]: value },
    }));
  };

  const handleUpload = async () => {
    if (!files.length) {
      alert("Please select images to upload.");
      return;
    }

    setIsUploading(true);
    const uploadedUrls = [...form.images];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );

      try {
        const response = await axios.post(
          import.meta.env.VITE_CLOUDINARY_URL,
          formData
        );
        uploadedUrls.push(response.data.secure_url);
      } catch (err) {
        console.error("Error uploading image:", err);
        alert("Image upload failed.");
      }
    }

    setForm((prev) => ({ ...prev, images: uploadedUrls }));
    setIsUploading(false);
  };

  const handleDelete = (indexToRemove) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const updatedData = {
        ...form,
        availability: [
          {
            startDate: form.availability.startDate,
            endDate: form.availability.endDate,
          },
        ],
      };

      await axios.put(`http://localhost:3000/spots/${spotId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      alert("Spot updated successfully!");
      navigate(`/spots/${spotId}`);
    } catch (err) {
      console.error("Error updating spot:", err);
      alert("Failed to update spot.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!spot) return <Text>Loading...</Text>;

  return (
    <div className="edit-page">
    <Container size="xl" mt="xl">
      <Title order={2} align="center" mb="xl">
        Edit your spot 📝
      </Title>

      <div>
        <TextInput
          label="Title"
          value={form.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          required
          mt="md"
        />
        <Textarea
          label="Description"
          value={form.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          required
          mt="md"
        />
        <Group grow mt="md">
          <TextInput
            label="City"
            value={form.location.city}
            onChange={(e) => handleLocationChange("city", e.target.value)}
            required
          />
          <TextInput
            label="Address"
            value={form.location.address}
            onChange={(e) => handleLocationChange("address", e.target.value)}
            required
          />
        </Group>
        <Group grow mt="md">
          <NumberInput
            label="Desk Count"
            value={form.deskCount}
            onChange={(value) => handleInputChange("deskCount", value)}
            min={1}
            required
            mt="md"
          />
          <NumberInput
            label="Price (€ / day)"
            value={form.price}
            onChange={(value) => handleInputChange("price", value)}
            min={0}
            required
            mt="md"
          />
        </Group>
        <MultiSelect
          data={amenitiesOptions}
          label="Amenities"
          value={form.amenities}
          onChange={(value) => handleInputChange("amenities", value)}
          mt="md"
        />
        <Group grow mt="md">
          <DatePickerInput
            dropdownType="modal"
            label="Start Date"
            value={form.availability.startDate}
            onChange={(value) => handleAvailabilityChange("startDate", value)}
            mb="lg"
          />
          <DatePickerInput
            dropdownType="modal"
            label="End Date"
            value={form.availability.endDate}
            onChange={(value) => handleAvailabilityChange("endDate", value)}
            mb="lg"
          />
        </Group>

        {form.images.length > 0 && (
          <Carousel withIndicators height={300} loop align="center">
            {form.images.map((url, index) => (
              <Carousel.Slide key={index}>
                <img
                  src={url}
                  alt={`slide-${index}`}
                  style={{ width: "100%", height: "300px", objectFit: "cover" }}
                />
                <ActionIcon
                  onClick={() => handleDelete(index)}
                  style={{ position: "absolute", top: 10, right: 10 }}
                  className="heart-icon"
                >
                  <IconTrash color="orange" />
                </ActionIcon>
              </Carousel.Slide>
            ))}
          </Carousel>
        )}

        <FileInput
          label="Upload Images"
          placeholder="Select images"
          multiple
          onChange={setFiles}
          mt="md"
        />
        <Button
          onClick={handleUpload}
          disabled={!files.length || isUploading}
          mt="md"
          color="yellow"
        >
          Upload images
        </Button>
      </div>
      <Button
        color="yellow"
        onClick={handleSubmit}
        loading={isSubmitting}
        disabled={isSubmitting}
        mt="xl"
        fullWidth
      >
        Save changes
      </Button>
    </Container>
    </div>
  );
};

export default EditSpot;
