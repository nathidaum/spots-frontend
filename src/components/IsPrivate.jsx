import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { Alert, Button, Center, Stack, Loader } from "@mantine/core";
import { useNavigate, Link } from "react-router-dom";
import { IconAlertCircle } from "@tabler/icons-react";
import {
  IconUser,
  IconLogin,
} from "@tabler/icons-react";

function IsPrivate({ children, fallback }) {
  const { isLoggedIn, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  // If the authentication is still loading
  if (isLoading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader color="yellow" />
      </Center>
    );
  }

  // If the user is not logged in, show fallback content
  if (!isLoggedIn) {
    return fallback ? (
      fallback
    ) : (
      <div className="forbiddenbackground">
      <Center style={{ height: "100vh" }}>
        <Stack align="center" spacing="lg">
          <Alert
            icon={<IconAlertCircle size={24} />}
            title="Nothing here!"
            variant="light" 
            color="yellow"
            radius="md"
            style={{ maxWidth: 400 }}
          >
            You need to log in to access your favorites.
          </Alert>
          <Button
            leftSection={<IconUser size={14} />}
            variant="default"
            fullWidth
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
            component={Link}
            to="/login"
          >
            Login
          </Button>
        </Stack>
      </Center>
      </div>
    );
  }

  // If the user is logged in, show the protected content
  return children;
}

export default IsPrivate;
