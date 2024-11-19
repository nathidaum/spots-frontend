import { Link } from "react-router-dom";

function ProfilePage() {
  return (
    <div>
      <h1>Welcome, Guest!</h1>
      <p>Log in or sign up to manage bookings and more.</p>
      <div>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
      </div>
    </div>
  );
}

export default ProfilePage;