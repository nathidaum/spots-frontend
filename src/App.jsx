import { Routes, Route } from "react-router-dom";
import IsPrivate from "./components/IsPrivate"; // Ensure the correct path
import ExplorePage from "./pages/ExplorePage";
import SpotDetailsPage from "./pages/SpotDetailsPage";
import BookingsPage from "./pages/BookingsPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<ExplorePage />} />
        <Route path="/spots/:id" element={<SpotDetailsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

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
              <Profile />
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
