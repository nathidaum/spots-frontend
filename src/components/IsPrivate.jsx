import { useContext } from "react";
import { AuthContext } from "../context/auth.context";

function IsPrivate({ children, fallback }) {
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  // If the authentication is still loading
  if (isLoading) return <p>Loading ...</p>;

  // If the user is not logged in, show fallback content
  if (!isLoggedIn) {
    return fallback ? fallback : <p>You need to log in to access this page.</p>;
  }

  // If the user is logged in, show the protected content
  return children;
}

export default IsPrivate;