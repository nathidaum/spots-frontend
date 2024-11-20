import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import authService from "../services/auth.service";

function ProfilePage() {
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate("/profile/edit"); // need to add edit profile functionality later
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      authService
        .deleteAccount()
        .then(() => {
          logOutUser();
          navigate("/register");
        })
        .catch((error) => {
          console.error("Error deleting account:", error);
          alert("Failed to delete account. Please try again later.");
        });
    }
  };

  if (!isLoggedIn) {
    return (
      <div>
        <h1>Welcome, Guest!</h1>
        <p>Log in or sign up to manage bookings and more.</p>
        <div>
          <Link to="/login">Login</Link>
          <Link to="/register">Signup</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <p>Here's your profile information:</p>
      <ul>
        <li><strong>Email:</strong> {user.email}</li>
        <li><strong>Name:</strong> {user.firstName} {user.lastName}</li>
        {user.profile?.company && (
          <li><strong>Company:</strong> {user.profile.company}</li>
        )}
      </ul>
      <div>
        <Link to="/bookings">View Your Bookings</Link>
        <Link to="/favorites">View Your Favorites</Link>
      </div>
      <div>
        <button onClick={handleEditProfile}>Edit Profile</button>
        <button onClick={logOutUser}>Logout</button>
        <button onClick={handleDeleteAccount} style={{ color: "red" }}>
          Delete Account
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;
