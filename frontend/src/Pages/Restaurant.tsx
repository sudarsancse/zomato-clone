import { useEffect, useState } from "react";
import type { IMenuItem, Irestaurant } from "../type";
import axios from "axios";
import { restaurant_Service_url } from "../main";
import AddRestaurant from "../Components/AddRestaurant";
import RestaurantProfile from "../Components/RestaurantProfile";
import MenuItems from "../Components/MenuItems";
import AddMenuItem from "../Components/AddMenuItem";

type Sellertab = "menu" | "add-item" | "sales";

function Restaurant() {
  const [restaurant, setRestaurant] = useState<Irestaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Sellertab>("menu");
  const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);

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

  const fetchMenuItems = async (restaurantId: string) => {
    try {
      const { data } = await axios.get(
        `${restaurant_Service_url}/api/item/all/${restaurantId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setMenuItems(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (restaurant?._id) {
      fetchMenuItems(restaurant._id);
    }
  }, [restaurant]);

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

      <div className=" rounded-xl bg-white shadow-sm">
        <div className=" flex border-b">
          {[
            { key: "menu", label: "Menu Items" },
            { key: "add_item", label: "Add Items" },
            { key: "seals", label: "Seals" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as Sellertab)}
              className={` flex-1 px-4 py-3 text-sm font-medium transition ${tab === t.key ? "border-b-2 border-red-500 text-red-500" : "text-gray-500 hover:text-gray-700"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className=" p-5">
          {tab === "menu" && (
            <MenuItems
              items={menuItems}
              onItemDeleted={() => fetchMenuItems(restaurant._id)}
              isSeller={true}
            />
          )}
          {tab === "add_item" && (
            <AddMenuItem onItemAdded={() => fetchMenuItems(restaurant._id)} />
          )}
          {tab === "seals" && <p>Seals page</p>}
        </div>
      </div>
    </div>
  );
}

export default Restaurant;
