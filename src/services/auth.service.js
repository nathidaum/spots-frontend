import axios from "axios";

class AuthService {
  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    });

    // Automatically set JWT token in the headers for every request
    this.api.interceptors.request.use((config) => {
      const storedToken = localStorage.getItem("authToken");
      if (storedToken) {
        config.headers = { Authorization: `Bearer ${storedToken}` };
        console.log("Authorization Header:", config.headers.Authorization);
      }
      return config;
    });
  }

  register = (requestBody) => {
    return this.api.post("/users/register", requestBody);
  };

  login = (requestBody) => {
    return this.api.post("/users/login", requestBody);
  };

  verify = () => {
    return this.api.get("/users/verify");
  };
}

// Create one instance (object) of the service
const authService = new AuthService();

export default authService;
