import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import { Menu, Avatar, Group } from "@mantine/core";
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
          <div className="navbar-links">
            <Link to="/favorites">Favorites</Link>
            <Link to="/bookings">Bookings</Link>
          </div>

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
                  <Menu.Item
                    component={Link}
                    to="/login"
                    icon={<IconLogin />}
                  >
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
        <Link to="/" className="nav-item">
          <IconSearch />
          <span>Explore</span>
        </Link>
        <Link to="/favorites" className="nav-item">
          <IconHeart />
          <span>Favorites</span>
        </Link>
        <Link to="/bookings" className="nav-item">
          <IconCalendar />
          <span>Bookings</span>
        </Link>
        <Link to="/profile" className="nav-item">
          <IconUser />
          <span>Profile</span>
        </Link>
      </div>
    </>
  );
};

export default Navbar;
