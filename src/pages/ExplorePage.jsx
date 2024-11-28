import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Flex,
  NumberInput,
  Select,
  Slider,
  Text,
  Title,
  ActionIcon,
  Badge,
} from "@mantine/core";
import { IconAdjustmentsHorizontal, IconX } from "@tabler/icons-react";
import debounce from "lodash.debounce";

import { AuthContext } from "../context/auth.context";
import SpotCard from "../components/SpotCard/SpotCard";
import PageSkeleton from "../components/PageSkeleton";
import "./explorepage.css";

function ExplorePage() {
  const [spots, setSpots] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  const [availableCities, setAvailableCities] = useState([]);

  // Filters
  const [cityFilter, setCityFilter] = useState("");
  const [minDeskCountFilter, setMinDeskCountFilter] = useState(null);
  const [maxPriceFilter, setMaxPriceFilter] = useState(null);

  // Track whether filters have changed
  const [filtersChanged, setFiltersChanged] = useState(false);

  // Store initial filter values
  const [initialFilters, setInitialFilters] = useState({
    city: "",
    minDeskCount: null,
    maxPrice: null,
  });

  const fetchSpots = () => {
    setIsLoading(true);

    const params = {};
    if (cityFilter) params.city = cityFilter;
    if (minDeskCountFilter) params.minDeskCount = minDeskCountFilter;
    if (maxPriceFilter) params.maxPrice = maxPriceFilter;

    axios
      .get(`${import.meta.env.VITE_API_URL}/spots`, { params })
      .then((response) => {
        setSpots(response.data.spots);
        // setShowMobileFilters(false);
        setIsLoading(false);

        // Reset filtersChanged and store current filters
        setFiltersChanged(false);
        setInitialFilters({
          city: cityFilter,
          minDeskCount: minDeskCountFilter,
          maxPrice: maxPriceFilter,
        });
      })
      .catch((error) => {
        console.error("Error fetching spots:", error);
        setIsLoading(false);
      });
  };

  const fetchSpotsDebounced = debounce(fetchSpots, 300);

  useEffect(() => {
    fetchSpotsDebounced();
  }, [cityFilter, minDeskCountFilter, maxPriceFilter]);

  useEffect(() => {
    fetchSpots();
    if (isLoggedIn) {
      const token = localStorage.getItem("authToken");
      if (token) {
        axios
          .get(`${import.meta.env.VITE_API_URL}/users/favorites`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => setFavorites(response.data.favorites || []))
          .catch((error) =>
            console.warn("Error fetching user favorites:", error.message)
          );
      }
    }
    axios
      .get(`${import.meta.env.VITE_API_URL}/spots/cities`)
      .then((response) => {
        setAvailableCities(
          response.data.cities.map((city) => ({ value: city, label: city }))
        );
      })
      .catch((error) => console.error("Error fetching cities:", error));
  }, [isLoggedIn]);

  useEffect(() => {
    setFiltersChanged(
      cityFilter !== initialFilters.city ||
        minDeskCountFilter !== initialFilters.minDeskCount ||
        maxPriceFilter !== initialFilters.maxPrice
    );
  }, [cityFilter, minDeskCountFilter, maxPriceFilter, initialFilters]);

  const toggleFavorite = (spotId) =>
    setFavorites((prev) =>
      prev.some((fav) => fav._id === spotId)
        ? prev.filter((fav) => fav._id !== spotId)
        : [...prev, spots.find((spot) => spot._id === spotId)]
    );

  return (
    <div className="explorepage">
      <div className="header">
        <Title order={1} className="mobile-title" mb="lg">
          Discover spots
        </Title>
        <ActionIcon
          variant="default"
          color="yellow"
          size="lg"
          onClick={() => setShowMobileFilters((prev) => !prev)}
          className="filter-icon"
        >
          {showMobileFilters ? (
            <IconX color="grey" />
          ) : (
            <IconAdjustmentsHorizontal color="grey" />
          )}
        </ActionIcon>
      </div>

      {/* Filters */}
      <div className={`filter ${showMobileFilters ? "mobile-visible" : ""}`}>
        <Select
          label="City"
          placeholder="Select a city"
          data={availableCities}
          value={cityFilter || null} // Reset to placeholder if cityFilter is empty
          onChange={(value) => setCityFilter(value || "")} // Clear value when reset
          radius="md"
        />
        <NumberInput
          label="Min. Desks"
          placeholder="Minimum desks"
          value={minDeskCountFilter || undefined} // Reset to placeholder if null
          onChange={(value) => setMinDeskCountFilter(value || null)} // Clear value when reset
          min={1}
          radius="md"
        />
        <Flex direction="column" mt={4}>
          <Text size="sm" mb="lg" mt={0} fw={500}>
            Max. Price / Day [€]
          </Text>
          <Slider
            value={maxPriceFilter || 0} // Default to 0 if null
            onChange={setMaxPriceFilter}
            min={0}
            max={400}
            step={10}
            label={(value) => `${value}€`}
            labelAlwaysOn
            color="yellow"
          />
        </Flex>
      </div>

      {/* Filter Pills */}
      <div className="filter-pills">
        {cityFilter && (
          <Badge
            color="grey"
            rightSection={<IconX size={10} />}
            onClick={() => {
              setCityFilter(""); // Clear cityFilter
            }}
          >
            {cityFilter}
          </Badge>
        )}
        {minDeskCountFilter && (
          <Badge
            color="yellow"
            rightSection={<IconX size={10} />}
            onClick={() => {
              setMinDeskCountFilter(null); // Clear minDeskCountFilter
            }}
          >
            {minDeskCountFilter}+ desks
          </Badge>
        )}
        {maxPriceFilter && (
          <Badge
            color="yellow"
            rightSection={<IconX size={10} />}
            onClick={() => {
              setMaxPriceFilter(null); // Clear maxPriceFilter
            }}
          >
            Up to {maxPriceFilter}€ per day
          </Badge>
        )}
      </div>

      {isLoading && <PageSkeleton />}

      {!isLoading && (
        <div className="gallery-container">
          <div className="spotslist">
            {spots.map((spot) => (
              <SpotCard
                key={spot._id}
                spot={spot}
                isFavorite={favorites.some((fav) => fav._id === spot._id)}
                onFavoriteToggle={() => toggleFavorite(spot._id)}
              />
            ))}
          </div>
        </div>
      )}

      {isLoggedIn && (
        <Button className="floating-button" component={Link} to="/spots/create">
          +
        </Button>
      )}
    </div>
  );
}

export default ExplorePage;
