import React, { useState } from "react";
import { UseAppData } from "../Context/AppContext";
import { useNavigate } from "react-router-dom";
import type { ICart, IMenuItem, Irestaurant } from "../type";
import axios from "axios";
import { restaurant_Service_url } from "../main";
import toast from "react-hot-toast";
import { VscLoading } from "react-icons/vsc";
import { BiMinus, BiPlus } from "react-icons/bi";
import { TbTrash } from "react-icons/tb";

function Cart() {
  const { cart, subTotal, quantity, fetchCart } = UseAppData();
  const navigate = useNavigate();

  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const [clearingCart, setClearingCart] = useState(false);

  if (!cart || cart.length === 0) {
    return (
      <div className=" flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500 text-lg">Your Cart is Empty</p>
      </div>
    );
  }

  const restaurant = cart[0].restaurantId as Irestaurant;

  const deliveryFee = subTotal < 300 ? 49 : 0;

  const platFromFee = 10;

  const grantTotal = subTotal + deliveryFee + platFromFee;

  const incressQty = async (itemId: string) => {
    try {
      setLoadingItemId(itemId);
      await axios.put(
        `${restaurant_Service_url}/api/cart/increment`,
        { itemId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      await fetchCart();
    } catch (error) {
      toast.error("Someting Went Worng");
    } finally {
      setLoadingItemId(null);
    }
  };

  const decressQty = async (itemId: string) => {
    try {
      setLoadingItemId(itemId);
      await axios.put(
        `${restaurant_Service_url}/api/cart/decrement`,
        { itemId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      await fetchCart();
    } catch (error) {
      toast.error("Someting Went Worng");
    } finally {
      setLoadingItemId(null);
    }
  };

  const clearCart = async () => {
    const confirm = window.confirm("Are you sure! to clear the cart?");
    if (!confirm) return;
    try {
      setClearingCart(true);
      await axios.delete(`${restaurant_Service_url}/api/cart/clear`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      await fetchCart();
    } catch (error) {
      toast.error("Someting Went Worng");
    } finally {
      setClearingCart(false);
    }
  };

  const checkOut = () => {
    navigate("/checkout");
  };
  return (
    <div className=" mx-auto max-w-5xl px-4 py-6 space-y-6">
      <div className=" rounded-xl bg-white p-2 shadow-sm">
        <h2 className=" text-xl font-semibold">{restaurant.name}</h2>
        <p className=" text-sm text-gray-500 ">
          {restaurant.autoLocation.formattedAddress}
        </p>
      </div>

      <div className=" space-y-4 ">
        {cart.map((cartItem: ICart) => {
          const item = cartItem.itemId as IMenuItem;
          const isLoading = loadingItemId === item._id;

          return (
            <div
              className=" flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm"
              key={item._id}
            >
              <img
                src={item.image}
                alt=""
                className=" h-20 w-20 rounded object-cover"
              />
              <div className=" flex-1 ">
                <h3 className=" font-semibold">{item.name}</h3>
                <p className=" text-sm text-gray-500">₹{item.price}</p>
              </div>

              <div className=" flex items-center gap-3">
                <button
                  className=" rounded-full border p-2 hover:bg-gray-100 disabled:opacity-50"
                  disabled={isLoading}
                  onClick={() => decressQty(item._id)}
                >
                  {isLoading ? (
                    <VscLoading size={16} className=" animate-spin" />
                  ) : (
                    <BiMinus size={16} />
                  )}
                </button>
                <span className=" font-medium">{cartItem.quantity}</span>
                <button
                  className=" rounded-full border p-2 hover:bg-gray-100 disabled:opacity-50"
                  disabled={isLoading}
                  onClick={() => incressQty(item._id)}
                >
                  {isLoading ? (
                    <VscLoading size={16} className=" animate-spin" />
                  ) : (
                    <BiPlus size={16} />
                  )}
                </button>
              </div>
              <p className=" w-20 text-right font-medium">
                ₹{item.price * cartItem.quantity}
              </p>
            </div>
          );
        })}
      </div>
      <div className=" rounded-xl bg-white p-4 shadow-sm space-y-3">
        <div className=" flex justify-between text-sm">
          <span className="">Total Items</span>
          <span>{quantity}</span>
        </div>

        <div className=" flex justify-between text-sm">
          <span>SubTotal</span>
          <span>₹{subTotal}</span>
        </div>
        <div className=" flex justify-between text-sm">
          <span>Delivary Fee</span>
          <span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span>
        </div>
        <div className=" flex justify-between text-sm">
          <span>Platform Fee</span>
          <span>₹{platFromFee}</span>
        </div>

        {subTotal < 300 && (
          <p className=" text-xs text-gray-500">
            Add Item worth ₹{300 - subTotal} more to get Free delivery
          </p>
        )}

        <div className=" flex justify-between text-base font-semibold border-t pt-2">
          <span>Grand Total</span>
          <span>₹{grantTotal}</span>
        </div>
        <button
          onClick={checkOut}
          className={`mt-3 w-full rounded-lg bg-[#E23744] py-3 text-sm font-semibold text-white hover:bg-red-800 ${!restaurant.isOpen ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={!restaurant.isOpen}
        >
          {!restaurant.isOpen ? "Restaurant is closed" : "Proceed to checkout"}
        </button>

        <button
          onClick={clearCart}
          disabled={clearingCart}
          className=" mt-3 w-full rounded-lg bg-[#453f40] py-3 text-sm font-semibold text-white hover:bg-gray-900 flex justify-center items-center gap-3"
        >
          Clear Cart <TbTrash size={16} />
        </button>
      </div>
    </div>
  );
}

export default Cart;
