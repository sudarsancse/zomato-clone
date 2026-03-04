import { useEffect, useState } from "react";
import type { Irestaurant } from "../type";
import axios from "axios";
import { restaurant_Service_url } from "../main";
import AddRestaurant from "../Components/AddRestaurant";
import RestaurantProfile from "../Components/RestaurantProfile";
function Restaurant() {
  const [restaurant, setRestaurant] = useState<Irestaurant | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMyRestaurant = async () => {
    try {
      const { data } = await axios.get(
        `${restaurant_Service_url}/api/restaurant/myrestaurant`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setRestaurant(data.restaurant || null);

      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRestaurant();
  }, []);

  if (loading)
    return (
      <div className=" flex min-h-screen items-center justify-center">
        <p className=" text-gray-500">Loading your restaturant...</p>
      </div>
    );

  if (!restaurant) {
    return <AddRestaurant fetchMyRestaurant={fetchMyRestaurant} />;
  }
  return (
    <div className=" min-h-screen bg-gray-50 px-4 py-6 space-y-6">
      <RestaurantProfile
        restaurant={restaurant}
        onUpdate={setRestaurant}
        isSeller={true}
      />
    </div>
  );
}

export default Restaurant;
