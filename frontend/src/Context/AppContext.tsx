import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { authService_url } from "../main";
import type { AppContextType, LocationData, User } from "../type";
import { Toaster } from "react-hot-toast";

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const [location, setLocation] = useState<LocationData | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [city, setCity] = useState("Fecting Location...");

  async function fetchUser() {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(`${authService_url}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(data);
      setIsAuth(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation)
      return alert("Please Allow Location to continue");
    setLoading(true);

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const res = await fetch(
          `   https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        );

        const data = await res.json();

        setLocation({
          latitude,
          longitude,
          formattedAddress: data.display_name || "current location",
        });

        setCity(
          data.address.city ||
            data.address.county ||
            data.address.town ||
            data.address.village ||
            "Your location",
        );

        setLoadingLocation(false);
      } catch (error) {
        setLocation({
          latitude,
          longitude,
          formattedAddress: "current location",
        });
        setCity("Failed to loade");
        setLoadingLocation(false);
        console.log(error);
      }
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        isAuth,
        loading,
        setIsAuth,
        setLoading,
        setUser,
        user,
        city,
        location,
        loadingLocation,
      }}
    >
      {children} <Toaster />
    </AppContext.Provider>
  );
};

export const UseAppData = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppData must be used within AppProvider");
  }
  return context;
};
