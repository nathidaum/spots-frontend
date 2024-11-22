import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import { Menu, Avatar } from "@mantine/core";
import {
  IconSettings,
  IconLogout,
  IconLogin,
  IconUser,
  IconHeart,
  IconCalendar,
  IconSearch,
} from "@tabler/icons-react";
import "./navbar.css";

const Navbar = () => {
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);
  const location = useLocation(); // Get the current path

  const isActive = (path) => location.pathname === path; // Check if a path is active

  return (
    <>
      {/* Desktop Navbar */}
      <div className="desktop-navbar">
        {/* Logo */}
        <Link to="/" className="logo">
          spots.
        </Link>

        
        <div className="navbar-right">
          {/* Navigation links */}
          
          {isLoggedIn && (
          <div className="navbar-links">
            <Link
              to="/favorites"
              className={isActive("/favorites") ? "active-link" : ""}
            >
              Favorites
            </Link>
            <Link
              to="/bookings"
              className={isActive("/bookings") ? "active-link" : ""}
            >
              Bookings
            </Link>
          </div>
        )}

          {/* Profile menu */}
          <div className="profile-menu">
            {isLoggedIn ? (
              <Menu shadow="lg" width={180}>
                <Menu.Target>
                  <div className="profile-box">
                    <Avatar
                      radius="xl"
                      color="yellow"
                      src={user?.avatar || undefined}
                      alt={user?.firstName || "User"}
                    >
                      {user?.firstName && user?.lastName
                        ? `${user.firstName[0]}${user.lastName[0]}`
                        : "👋"}
                    </Avatar>
                    <span className="username">Hi, {user?.firstName}!</span>
                  </div>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    component={Link}
                    to="/profile/edit"
                    icon={<IconSettings />}
                  >
                    Settings
                  </Menu.Item>
                  <Menu.Item icon={<IconLogout />} onClick={logOutUser}>
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Menu shadow="lg" width={180}>
                <Menu.Target>
                  <div className="profile-box">
                    <Avatar radius="xl" color="yellow" alt="Guest">
                      👋
                    </Avatar>
                    <span className="username">Hi there!</span>
                  </div>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item component={Link} to="/login" icon={<IconLogin />}>
                    Login
                  </Menu.Item>
                  <Menu.Item
                    component={Link}
                    to="/register"
                    icon={<IconUser />}
                  >
                    Signup
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navbar */}
      <div className="mobile-navbar">
        <Link
          to="/"
          className={`nav-item ${isActive("/") ? "active-link" : ""}`}
        >
          <IconSearch className={isActive("/") ? "active-icon" : ""} />
          <span>Explore</span>
        </Link>
        <Link
          to="/favorites"
          className={`nav-item ${isActive("/favorites") ? "active-link" : ""}`}
        >
          <IconHeart className={isActive("/favorites") ? "active-icon" : ""} />
          <span>Favorites</span>
        </Link>
        <Link
          to="/bookings"
          className={`nav-item ${isActive("/bookings") ? "active-link" : ""}`}
        >
          <IconCalendar
            className={isActive("/bookings") ? "active-icon" : ""}
          />
          <span>Bookings</span>
        </Link>
        <Link
          to="/profile"
          className={`nav-item ${isActive("/profile") ? "active-link" : ""}`}
        >
          <IconUser className={isActive("/profile") ? "active-icon" : ""} />
          <span>Profile</span>
        </Link>
      </div>
    </>
  );
};

export default Navbar;
