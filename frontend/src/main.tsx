import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.tsx";

export const authService_url = import.meta.env.VITE_AUTH_BASE_URL;
const GOOGLR_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLR_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
    ;
  </StrictMode>,
);
