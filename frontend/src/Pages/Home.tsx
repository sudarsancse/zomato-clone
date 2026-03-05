import { useSearchParams } from "react-router-dom";
import { UseAppData } from "../Context/AppContext";
import { useEffect, useState } from "react";
import type { Irestaurant } from "../type";
import axios from "axios";
import { restaurant_Service_url } from "../main";
import RestaurantCard from "../Components/RestaurantCard";

function Home() {
  const { location } = UseAppData();
  const [searchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const [restaurants, setRestaurants] = useState<Irestaurant[]>([]);
  const [loading, setLoading] = useState(true);

  const getDistanceKm = (
    latitude1: number,
    longitude1: number,
    latitude2: number,
    longitude2: number,
  ): number => {
    const R = 6371;
    const dLatitude = ((latitude2 - latitude1) * Math.PI) / 180;
    const dLongitude = ((longitude2 - longitude1) * Math.PI) / 180;

    const a =
      Math.sin(dLatitude / 2) * Math.sin(dLatitude / 2) +
      Math.cos((latitude1 * Math.PI) / 180) *
        Math.cos((latitude2 * Math.PI) / 180) *
        Math.sin(dLongitude / 2) *
        Math.sin(dLongitude / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return +(R * c).toFixed(2);
  };

  const fetchRestaurant = async () => {
    if (!location?.latitude || !location.longitude) {
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${restaurant_Service_url}/api/restaurant/all`,
        {
          params: {
            latitude: location.latitude,
            longitude: location.longitude,
            search,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setRestaurants(data.restaurants ?? []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurant();
  }, [location, search]);
  if (loading || !location) {
    return (
      <div className=" flex h-[60vh] items-center justify-center">
        <p className=" text-gray-500">Finding Restaurant near you...</p>
      </div>
    );
  }
  return (
    <div className=" mx-auto max-w-7xl px-4 py-6">
      {restaurants.length > 0 ? (
        <div className=" grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {restaurants.map((res) => {
            const [resLng, resLat] = res.autoLocation.coordinates;

            const distance = getDistanceKm(
              location.latitude,
              location.longitude,
              resLat,
              resLng,
            );

            return (
              <RestaurantCard
                key={res._id}
                id={res._id}
                name={res.name}
                image={res.image ?? ""}
                distance={`${distance}`}
                isOpen={res.isOpen}
              />
            );
          })}
        </div>
      ) : (
        <p className=" text-center text-green-500"> No restaurant fount</p>
      )}
    </div>
  );
}

export default Home;
