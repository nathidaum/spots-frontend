import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Text,
  Title,
  Button,
  List,
  ThemeIcon,
  Skeleton,
  Flex,
  ActionIcon,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { IconArrowLeft, IconCheck } from "@tabler/icons-react";
import "./spotdetailspage.css";
import "../components/SpotCard/spotcard.css";

function SpotDetailsPage() {
  const { id } = useParams();
  const [spot, setSpot] = useState(null);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://localhost:3000/spots/${id}`)
      .then((response) => {
        console.log(response.data.spot);
        setSpot(response.data.spot);
      })
      .catch((error) => console.error(`Error fetching spot ${id}:`, error));
  }, [id]);

  if (!spot) {
    return (
      <Container>
        <Skeleton height={300} radius="md" />
        <Skeleton height={20} mt="md" radius="sm" />
        <Skeleton height={20} mt="xs" radius="sm" />
        <Skeleton height={50} mt="md" radius="sm" />
      </Container>
    );
  }

  return (
    <div className="detailspage">
      {/* Images Section */}
      <div>
        <Carousel withIndicators loop height="30vh" withControls={false}>
          {spot.images.map((image, index) => (
            <Carousel.Slide key={index}>
              <div className="image-container">
                <img
                  src={image}
                  alt={`Spot image ${index + 1}`}
                  className="carousel-image"
                />
                <div className="image-overlay"></div>
              </div>
            </Carousel.Slide>
          ))}
        </Carousel>

        {/* Mobile back icon */}
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
      </div>

      <section className="detailed-content">
        {/* Content Section */}
        <Flex direction="column" mt="md">
          {/* Title and Location */}
          <div>
            <Title order={1}>{spot.title}</Title>
            <Text size="sm" c="dimmed" mt="sm">
              📍 {spot.location.city}, {spot.location.address}
            </Text>
          </div>

          {/* Description */}
          <Text mt="md">{spot.description}</Text>

          {/* Amenities */}
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
          <br></br>

          {/* About Host */}
          <div mt="lg">
            <Title order={3}>About the Host</Title>
            <Text>
              {spot.createdBy.firstName} {spot.createdBy.lastName}
            </Text>
            {spot.createdBy.company && (
              <Text>
                Company: <strong>{spot.createdBy.company}</strong>
              </Text>
            )}
          </div>
        </Flex>
      </section>

      {/* Sticky Footer for Mobile */}
      <div className="sticky-footer">
        <div className="price-info">
          <Text fw={600} size="lg">
            €{spot.price} / day
          </Text>
        </div>
        <Button
          color="yellow"
          size="lg"
          onClick={() => console.log("Booking initiated!")}
        >
          Book
        </Button>
      </div>
    </div>
  );
}

export default SpotDetailsPage;
