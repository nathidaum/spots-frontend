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

function App() {
  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<ExplorePage />} />
        <Route path="/spots/:id" element={<SpotDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

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
          path="/profile"
          element={
            <IsPrivate>
              <ProfilePage />
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

        {/* Catch-all for undefined routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
