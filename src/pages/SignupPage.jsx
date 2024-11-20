import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/auth.service";
import { AuthContext } from "../context/auth.context";

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
    <div className="SignupPage">
      <h1>Sign Up</h1>

      <form onSubmit={handleSignupSubmit}>
        <label>Email:</label>
        <input type="email" name="email" value={email} onChange={handleEmail} />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={handlePassword}
        />

        <label>First Name:</label>
        <input
          type="text"
          name="firstName"
          value={firstName}
          onChange={handleFirstName}
        />

        <label>Last Name:</label>
        <input
          type="text"
          name="lastName"
          value={lastName}
          onChange={handleLastName}
        />

        <label>Company:</label>
        <input
          type="text"
          name="company"
          value={company}
          onChange={handleCompany}
        />

        <button type="submit">Sign Up</button>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <p>Already have an account?</p>
      <Link to={"/login"}> Login</Link>
    </div>
  );
}

export default SignupPage;
