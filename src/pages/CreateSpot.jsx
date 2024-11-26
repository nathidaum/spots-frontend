import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Badge,
  Title,
  FileInput,
  ActionIcon,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { DatePickerInput } from "@mantine/dates";
import { IconX } from "@tabler/icons-react";

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

const CreateSpot = ({ onSpotCreated }) => {
  const [active, setActive] = useState(0);
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]); // Define state for selected files
  const [isUploading, setIsUploading] = useState(false); // State for upload status

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

  // image upload with cloudinary

  const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env
    .VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleUpload = async () => {
    if (!files.length) {
      alert("Please select images to upload.");
      return;
    }

    setIsUploading(true);
    const uploadedUrls = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file); // Append the file
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET); // Append the upload preset

      try {
        const response = await axios.post(CLOUDINARY_URL, formData);
        uploadedUrls.push(response.data.secure_url); // Save the secure URL from Cloudinary response
        console.log(response.data.secure_url);
      } catch (err) {
        console.error("Error uploading image:", err);
        alert("Image upload failed. Please try again.");
      }
    }

    setForm((prev) => ({ ...prev, images: uploadedUrls })); // Update form with uploaded image URLs
    setIsUploading(false);
    alert("Images uploaded successfully!");
  };

  const slides = form.images.map((url, index) => (
    <Carousel.Slide key={index}>
      <img
        src={url}
        alt={`carousel-${index}`}
        style={{
          width: "100%",
          height: "300px",
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />
    </Carousel.Slide>
  ));

  const handleDelete = (indexToRemove) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async () => {
    if (active === 2) {
      setIsSubmitting(true);

      try {
        const formattedForm = {
          ...form,
          availability: [
            {
              startDate: form.availability.startDate,
              endDate: form.availability.endDate,
            },
          ],
        };

        const token = localStorage.getItem("authToken");
        const response = await axios.post(
          "http://localhost:3000/spots",
          formattedForm,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (onSpotCreated) onSpotCreated(response.data.spot);
        if (handleSpotCreated) handleSpotCreated(response.data.spot);
        setForm({
          title: "",
          description: "",
          deskCount: 1,
          location: { city: "", address: "" },
          amenities: [],
          price: 0,
          availability: { startDate: null, endDate: null },
          images: [],
        });

        navigate("/");
      } catch (err) {
        console.error(
          "Error creating spot:",
          err.response?.data || err.message
        );
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setActive((prev) => Math.min(prev + 1, 2));
    }
  };

  return (
    <div className="page">
      <div size="xl" mt="xl" className="steps-container">
        <Title order={2} align="center" mb="xl">
          Insert your spot 🫶
        </Title>

        <Stepper
          active={active}
          color="yellow"
          onStepClick={setActive}
          breakpoint="sm"
        >
          {/* Step 1: Information */}
          <Stepper.Step label="Information" description="Enter spot details">
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
                onChange={(e) =>
                  handleLocationChange("address", e.target.value)
                }
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
                placeholder="Pick start date"
                value={form.availability.startDate}
                onChange={(value) =>
                  handleAvailabilityChange("startDate", value)
                }
              />
              <DatePickerInput
                dropdownType="modal"
                label="End Date"
                placeholder="Pick end date"
                value={form.availability.endDate}
                onChange={(value) => handleAvailabilityChange("endDate", value)}
              />
            </Group>
          </Stepper.Step>

          {/* Step 2: Upload Images */}
          <Stepper.Step
            label="Upload Images"
            color="yellow"
            description="Add images for the spot"
          >
            <div className="image-upload-section">
              {/* FileInput with a container */}
              <div className="file-input-container">
                <FileInput
                  label="Upload Images"
                  placeholder="Select images"
                  multiple
                  value={files}
                  onChange={setFiles} 
                  mt="md"
                  mb="lg"
                />
              </div>

              {/* Uploaded Images */}
              {files.length > 0 && (
                <div className="image-upload">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      style={{
                        width: "110px",
                        height: "110px",
                        position: "relative"
                      }}
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`preview-${index}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          overflow: "hidden",
                          borderRadius: "8px",
                          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)"
                        }}
                      />
                      <ActionIcon
                        onClick={() => handleDelete(index)}
                        size="sm"
                        className="delete-icon"
                      >
                        <IconX stroke={2} color="black" size={15}/>
                      </ActionIcon>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Button */}
              <Button
                onClick={handleUpload}
                disabled={!files.length || isUploading}
                loading={isUploading}
                mt="lg"
                fullWidth
                color="grey"
              >
                Upload selected images
              </Button>
            </div>
          </Stepper.Step>

          {/* Step 3: Review & Save */}
          <Stepper.Step
            label="Review"
            color="yellow"
            description="Review and save the spot"
          >
            <div className="preview-card">
              <div className="carousel-container">
                <Badge variant="default" color="yellow" className="desk-badge">
                  {form.deskCount} desks
                </Badge>
                <Carousel
                  withIndicators
                  height={300}
                  loop
                  align="center"
                  controlSize={24}
                  controlsOffset="sm"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {slides}
                </Carousel>
              </div>

              <div className="spotinfo-link">
                <div className="spotinfo">
                  <p className="title">{form.title}</p>
                  <p className="location">{form.location.city}</p>
                  <p className="price">€ {form.price} per day</p>
                </div>
              </div>
            </div>
          </Stepper.Step>

          <Stepper.Completed>
            <div>Spot created successfully!</div>
            <Button onClick={() => navigate("/")} mt="md">
              Go to Spots List
            </Button>
          </Stepper.Completed>
        </Stepper>

        <Group justify="flex-end" mt="xl">
          {active !== 0 && (
            <Button
              variant="default"
              color="yellow"
              onClick={() => setActive((prev) => Math.max(prev - 1, 0))}
            >
              Back
            </Button>
          )}
          <Button
            color="yellow"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {active === 2 ? "Save Spot" : "Next Step"}
          </Button>
        </Group>
      </div>
    </div>
  );
};

export default CreateSpot;
