import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import { Menu, Avatar, Group, ActionIcon } from "@mantine/core";
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

        {/* Profile section */}
        <div className="profile-menu">
          {isLoggedIn ? (
            <Menu
              shadow="lg"
              width={180}
            >
              <Menu.Target>
                <Group spacing="sm">
                  <Avatar
                    radius="xl"
                    color="yellow"
                    src={user?.avatar || undefined}
                    alt={user?.firstName || "User"}
                  >
                    {/* Display initials if avatar isn't available */}
                    {user?.firstName && user?.lastName
                      ? `${user.firstName[0]}${user.lastName[0]}`
                      : "👋"}
                  </Avatar>
                  <span className="username"> Hi, {`${user?.firstName}`}!</span>
                </Group>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  component={Link}
                  to="/profile/edit"
                  leftSection={
                    <IconSettings style={{ width: 20, height: 20 }} />
                  }
                >
                  Settings
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconLogout style={{ width: 20, height: 20 }} />}
                  onClick={logOutUser}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <Menu
              shadow="lg"
              width={180}
            >
              <Menu.Target>
                <Group spacing="sm">
                  <Avatar
                    radius="xl"
                    color="yellow"
                    alt="no image here"
                  >
                    👋
                  </Avatar>
                  <span className="username"> Hi there!</span>
                </Group>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  component={Link}
                  to="/login"
                  leftSection={
                    <IconLogin style={{ width: 20, height: 20 }} />
                  }
                >
                  Login
                </Menu.Item>
                <Menu.Item
                  component={Link}
                  to="/register"
                  leftSection={<IconUser style={{ width: 20, height: 20 }} />}
                >
                  Signup
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
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
