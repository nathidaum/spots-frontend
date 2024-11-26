import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";

import "./index.css";
import App from "./App.jsx";
import { AuthProviderWrapper } from "./context/auth.context.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
      >
        <ModalsProvider modalProps={{ zIndex: 1051 }}>
          <AuthProviderWrapper>
            <App />
          </AuthProviderWrapper>
        </ModalsProvider>
      </MantineProvider>
    </BrowserRouter>
  </StrictMode>
);
