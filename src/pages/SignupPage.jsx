import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextInput, PasswordInput, Button, Text, Anchor } from "@mantine/core";

import { AuthContext } from "../context/auth.context";
import authService from "../services/auth.service";
import "./signuppage.css";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const { storeToken, authenticateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleFirstName = (e) => setFirstName(e.target.value);
  const handleLastName = (e) => setLastName(e.target.value);
  const handleCompany = (e) => setCompany(e.target.value);

  const handleSignupSubmit = (e) => {
    e.preventDefault();

    const requestBody = {
      email,
      password,
      firstName,
      lastName,
      profile: { company },
    };

    authService
      .register(requestBody)
      .then((response) => {
        const { authToken } = response.data;

        // Store token and authenticate user
        storeToken(authToken);
        authenticateUser();

        // Redirect to explore page
        navigate("/");
      })
      .catch((error) => {
        console.error("Error during signup:", error);
        const errorDescription = error.response?.data?.message;
        setErrorMessage(errorDescription || "Something went wrong.");
      });
  };

  return (
    <div className="signuppage">
      <h1>Sign up to spots. 🫰</h1>

      <form onSubmit={handleSignupSubmit}>
        <TextInput
          label="Email"
          placeholder="nathi@gmail.com"
          type="email"
          value={email}
          onChange={handleEmail}
          required
        />
        <br></br>

        <PasswordInput
          label="Password"
          placeholder="StrongPassword123!"
          value={password}
          onChange={handlePassword}
          required
        />
        <br></br>
        <TextInput
          label="First Name"
          placeholder="Nathi"
          type="text"
          value={firstName}
          onChange={handleFirstName}
          required
        />
        <br></br>
        <TextInput
          label="Last Name"
          placeholder="Daum"
          type="text"
          value={lastName}
          onChange={handleLastName}
          required
        />
        <br></br>
        <TextInput
          label="Company"
          placeholder="Nathi Corp."
          type="text"
          value={company}
          onChange={handleCompany}
          required
        />
        {errorMessage && <Text c="red">{errorMessage}</Text>}
        <Button type="submit" color="yellow" fullWidth mt="md">
          Sign up
        </Button>
      </form>

      <Text align="center" mt="md">
        Already have an account?{" "}
        <Anchor component={Link} to="/login" c="yellow">
          Login
        </Anchor>
      </Text>
    </div>
  );
}

export default SignupPage;
