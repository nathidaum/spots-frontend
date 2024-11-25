import React, { useState } from "react";
import {
  Stepper,
  Button,
  Group,
  TextInput,
  Textarea,
  MultiSelect,
  NumberInput,
  Container,
  Title,
  FileInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./createspot.css";

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
        console.log(response.data.secure_url)
      } catch (err) {
        console.error("Error uploading image:", err);
        alert("Image upload failed. Please try again.");
      }
    }

    setForm((prev) => ({ ...prev, images: uploadedUrls })); // Update form with uploaded image URLs
    setIsUploading(false);
    alert("Images uploaded successfully!");
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

        navigate("/spots");
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
      <Container size="xl" mt="xl">
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
            <FileInput
              label="Upload Images"
              placeholder="Select images"
              multiple
              value={files} // Store selected files
              onChange={setFiles} // Update files state
              mt="md"
            />
            <Button
              onClick={handleUpload}
              disabled={!files.length || isUploading}
              loading={isUploading}
              mt="md"
            >
              Upload Images
            </Button>

            {form.images.length > 0 && (
              <div>
                <Title order={4} mt="md">
                  Uploaded Images:
                </Title>
                <ul>
                  {form.images.map((url, index) => (
                    <li key={index}>
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        View Image {index + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Stepper.Step>

          {/* Step 3: Review & Save */}
          <Stepper.Step
            label="Review"
            color="yellow"
            description="Review and save the spot"
          >
            <Title order={3} align="center" mb="lg">
              Please review the details of your spot before saving.
            </Title>
            <div>
              <strong>Title:</strong> {form.title}
            </div>
            <div>
              <strong>Description:</strong> {form.description}
            </div>
            <div>
              <strong>Desk Count:</strong> {form.deskCount}
            </div>
            <div>
              <strong>Location:</strong> {form.location.city},{" "}
              {form.location.address}
            </div>
            <div>
              <strong>Amenities:</strong> {form.amenities.join(", ")}
            </div>
            <div>
              <strong>Price:</strong> €{form.price}
            </div>
            <div>
              <strong>Availability:</strong>{" "}
              {form.availability.startDate && form.availability.endDate
                ? `${form.availability.startDate.toLocaleDateString()} to ${form.availability.endDate.toLocaleDateString()}`
                : "N/A"}
            </div>
            <div>
              <strong>Images:</strong> {form.images.join(", ")}
            </div>
          </Stepper.Step>

          <Stepper.Completed>
            <div>Spot created successfully!</div>
            <Button onClick={() => navigate("/")} mt="md">
              Go to Spots List
            </Button>
          </Stepper.Completed>
        </Stepper>

        <Group justify="center" mt="xl">
          <Button
            variant="default"
            color="yellow"
            onClick={() => setActive((prev) => Math.max(prev - 1, 0))}
          >
            Back
          </Button>
          <Button
            color="yellow"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {active === 2 ? "Save Spot" : "Next Step"}
          </Button>
        </Group>
      </Container>
    </div>
  );
};

export default CreateSpot;
