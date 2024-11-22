import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextInput, PasswordInput, Button, Text, Anchor } from "@mantine/core";
import { AuthContext } from "../context/auth.context";
import authService from "../services/auth.service";
import "./loginpage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const { storeToken, authenticateUser } = useContext(AuthContext);

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const requestBody = { email, password };

    authService
      .login(requestBody)
      .then((response) => {
        console.log("JWT token", response.data.authToken);

        storeToken(response.data.authToken);
        authenticateUser();
        navigate("/");
      })
      .catch((error) => {
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div className="loginpage">
      <h1>Login to spots. 🤙</h1>
      <form onSubmit={handleLoginSubmit} className="login-form">
        <TextInput
          label="Email"
          placeholder="Enter your email"
          type="email"
          value={email}
          onChange={handleEmail}
          required
        />
        <br />

        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={handlePassword}
          required
        />
        {errorMessage && <Text c="red">{errorMessage}</Text>}

        <Button type="submit" color="yellow" fullWidth mt="md">
          Login
        </Button>
      </form>

      <Text align="center" mt="md">
        Don't have an account yet?{" "}
        <Anchor component={Link} to="/register" c="yellow">
          Sign Up
        </Anchor>
      </Text>
    </div>
  );
}

export default LoginPage;
