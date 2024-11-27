import { Link } from "react-router-dom";
import { Carousel } from "@mantine/carousel";
import { ActionIcon, Group } from "@mantine/core";
import { IconArrowLeft, IconEdit, IconTrash } from "@tabler/icons-react";
import "../pages/spotdetailspage.css"
import "./SpotCard/spotcard.css"

const DetailedPageCarousel = ({ spot, user, openDeleteModal }) => (
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

    {/* Image Carousel */}
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
);

export default DetailedPageCarousel;
