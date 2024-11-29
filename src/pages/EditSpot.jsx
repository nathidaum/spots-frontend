import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Group,
  TextInput,
  Textarea,
  MultiSelect,
  NumberInput,
  Container,
  Text,
  Title,
  FileInput,
  ActionIcon,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { IconX } from "@tabler/icons-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./editspot.css";
import "./createspot.css";
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
          `${import.meta.env.VITE_API_URL}/spots/${spotId}`
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

  const handleUpload = async () => {
    if (!files.length) {
      toast.error("Please select images to upload. 📸", {
        icon: false,
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        style: { backgroundColor: "#1C1C1C", color: "white" },
      });
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
        toast.error("Image upload failed. Please try again. 🙏", {
          icon: false,
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          style: { backgroundColor: "#1C1C1C", color: "white" },
        });
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

      await axios.put(`${import.meta.env.VITE_API_URL}/spots/${spotId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      toast.success("Successfully updated! 🤩", {
        icon: false,
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        style: { backgroundColor: "#1C1C1C", color: "white" },
      });
      navigate(`/spots/${spotId}`);
    } catch (err) {
      console.error("Error updating spot:", err);
      toast.error("Updating this spot failed. 😵‍💫", {
        icon: false,
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        style: { backgroundColor: "#1C1C1C", color: "white" },
      });
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
          mb="xl"
        />

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
                  size="sm"
                          className="delete-icon"
                >
                  <IconX stroke={2} color="black" size={15} />
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
