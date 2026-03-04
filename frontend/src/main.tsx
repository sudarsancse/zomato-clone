import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.tsx";
import { AppProvider } from "./Context/AppContext.tsx";

// Auth url
export const authService_url = import.meta.env.VITE_AUTH_BASE_URL;

//Restaurant url
export const restaurant_Service_url = import.meta.env.VITE_RESTAURANT_BASE_URL;

// google client id
const GOOGLR_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLR_CLIENT_ID}>
      <AppProvider>
        <App />
      </AppProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
