import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Button, Paper, Text } from "@mantine/core";

import { AuthContext } from "../context/auth.context";
import authService from "../services/auth.service";
import {
  IconEdit,
  IconLogout,
  IconTrash,
  IconUser,
  IconLogin,
} from "@tabler/icons-react";
import "./profilepage.css"

function ProfilePage() {
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate("/profile/edit");
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
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
      <div className="profilepage">
        <Paper m={20} radius="xl" withBorder p="xl" bg="var(--mantine-color-body)" shadow="md" className="profilecard">
          <Avatar color="yellow" mx="auto" size={120} radius={120}>👋
          </Avatar>
          <Text ta="center" fz="xl" fw={500} mt="lg">
            Welcome!
          </Text>
          <Text ta="center" c="dimmed" fz="sm">
            You're currently in guest mode.
          </Text>

          <Button
            leftSection={<IconUser size={14} />}
            variant="default"
            fullWidth
            mt="md"
            component={Link}
            to="/register"
          >
            Signup
          </Button>
          <Button
            leftSection={<IconLogin size={14} />}
            variant="filled"
            color="yellow"
            fullWidth
            mt="md"
            component={Link}
            to="/login"
          >
            Login
          </Button>
        </Paper>
      </div>
    );
  }

  return (
    <div className="profilepage">
      <Paper m={20} radius="xl" withBorder p="xl" bg="var(--mantine-color-body)" shadow="md" className="profilecard">
        <Avatar
          color="yellow"
          mx="auto"
          size={120}
          radius={120}
          src={user?.avatar || undefined}
          alt={user?.firstName || "User"}
        >
          {user?.firstName && user?.lastName
            ? `${user.firstName[0]}${user.lastName[0]}`
            : "👋"}
        </Avatar>
        <Text ta="center" fz="xl" fw={500} mt="lg">
          Nice to see you here, {user.firstName} !
        </Text>
        <Text ta="center" c="dimmed" fz="sm">
          {user.email}
        </Text>
        {user.profile?.company && <Text>Company:{user.profile.company}</Text>}

        <Button
          leftSection={<IconEdit size={14} />}
          variant="filled"
          color="yellow"
          fullWidth
          mt="md"
          onClick={handleEditProfile}
        >
          Edit Profile
        </Button>
        <Button
          leftSection={<IconLogout size={14} />}
          variant="default"
          fullWidth
          mt="md"
          onClick={logOutUser}
        >
          Logout
        </Button>
        <Button
          leftSection={<IconTrash size={14} />}
          variant="default"
          fullWidth
          mt="md"
          onClick={handleDeleteAccount}
        >
          Delete account
        </Button>
      </Paper>
    </div>
  );
}

export default ProfilePage;
