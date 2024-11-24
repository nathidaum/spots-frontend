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
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
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
    availability: [],
    images: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleLocationChange = (field, value) => {
    setForm({ ...form, location: { ...form.location, [field]: value } });
  };

  const handleAvailabilityChange = (startDate, endDate) => {
    setForm((prev) => ({
      ...prev,
      availability: [...prev.availability, { startDate, endDate }],
    }));
  };

  const handleSubmit = async () => {
    if (active === 2) {
      setIsSubmitting(true);

      try {
        // Ensure correct formatting for availability
        const formattedForm = {
          ...form,
          availability: form.availability.map((range) => ({
            startDate: range.startDate,
            endDate: range.endDate,
          })),
        };

        console.log("Submitting Form Data:", formattedForm);

        // Submit the form data to the server
        const token = localStorage.getItem("authToken");
        const response = await axios.post("http://localhost:3000/spots", formattedForm, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (onSpotCreated) onSpotCreated(response.data.spot);
        setForm({
          title: "",
          description: "",
          deskCount: 1,
          location: { city: "", address: "" },
          amenities: [],
          price: 0,
          availability: [],
          images: [],
        });

        navigate("/spots"); // Redirect after successful creation
      } catch (err) {
        console.error("Error creating spot:", err.response?.data || err.message);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setActive((prev) => Math.min(prev + 1, 2)); // Move to the next step
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

            <DatePicker
              label="Availability Start Date"
              placeholder="Pick start date"
              onChange={(date) => handleAvailabilityChange(date, form.availability?.[0]?.endDate || null)}
              mt="md"
            />
            <DatePicker
              label="Availability End Date"
              placeholder="Pick end date"
              onChange={(date) => handleAvailabilityChange(form.availability?.[0]?.startDate || null, date)}
              mt="md"
            />
          </Stepper.Step>

          {/* Step 2: Upload Images */}
          <Stepper.Step
            label="Upload Images"
            color="yellow"
            description="Add images for the spot"
          >
            <Textarea
              label="Images (comma-separated URLs)"
              value={form.images.join(", ")}
              onChange={(e) =>
                handleInputChange(
                  "images",
                  e.target.value.split(",").map((url) => url.trim())
                )
              }
              required
              mt="md"
            />
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
              {form.availability.map((range) =>
                range.startDate && range.endDate
                  ? `${new Date(range.startDate).toLocaleDateString()} to ${new Date(range.endDate).toLocaleDateString()}`
                  : "N/A"
              ).join(", ")}
            </div>
            <div>
              <strong>Images:</strong> {form.images.join(", ")}
            </div>
          </Stepper.Step>

          <Stepper.Completed>
            <div>Spot created successfully!</div>
            <Button onClick={() => navigate("/spots")} mt="md">
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
