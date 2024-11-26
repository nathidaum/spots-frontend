import { Routes, Route } from "react-router-dom";
import IsPrivate from "./components/IsPrivate";
import ExplorePage from "./pages/ExplorePage";
import SpotDetailsPage from "./pages/SpotDetailsPage";
import BookingsPage from "./pages/BookingsPage";
import FavoritesPage from "./pages/FavoritesPage";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import Navbar from "./components/Navbar/Navbar";
import CreateSpot from "./pages/CreateSpot";
import EditSpot from "./pages/EditSpot";
import BookingConfirmation from "./pages/BookingConfirmation";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<ExplorePage />} />
        <Route path="/spots/:id" element={<SpotDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Private Routes */}
        <Route
          path="/bookings"
          element={
            <IsPrivate>
              <BookingsPage />
            </IsPrivate>
          }
        />
        <Route
          path="/favorites"
          element={
            <IsPrivate>
              <FavoritesPage />
            </IsPrivate>
          }
        />

        <Route
          path="/spots/create"
          element={
            <IsPrivate>
              <CreateSpot />
            </IsPrivate>
          }
        />

        <Route
          path="/spots/:spotId/edit"
          element={
            <IsPrivate>
              <EditSpot />
            </IsPrivate>
          }
        />

<Route
          path="/bookingconfirmation/:bookingId/"
          element={
            <IsPrivate>
              <BookingConfirmation />
            </IsPrivate>
          }
        />

        {/* Catch-all for undefined routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
