import axios from "axios";
import { useState } from "react";
import { restaurant_Service_url } from "../main";
import toast from "react-hot-toast";
import { BiUpload } from "react-icons/bi";

const AddMenuItem = ({ onItemAdded }: { onItemAdded: () => void }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const resetFrom = () => {
    setName("");
    setDescription("");
    setImage(null);
    setPrice("");
  };

  const handleSubmit = async () => {
    if (!name || !price || !image) {
      alert("Name Price and Image are required");
      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("file", image);

    try {
      setLoading(true);
      await axios.post(`${restaurant_Service_url}/api/item/new`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Menu added sucessfully'");
      resetFrom();
      onItemAdded();
    } catch (error: any) {
      console.log(error);
      toast.error("Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" max-w-md space-y-4 m-auto">
      <h2 className=" text-lg font-semibold ">Add menu Item</h2>
      <input
        type="text"
        placeholder="Item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className=" w-full rounded-lg border px-4 py-2 text-sm outline-none"
      />

      <textarea
        placeholder="Item description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className=" w-full rounded-lg border px-4 py-2 text-sm outline-none"
      />
      <input
        type="text"
        placeholder="Price ₹"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className=" w-full rounded-lg border px-4 py-2 text-sm outline-none"
      />
      <label className=" flex cursor-pointer items-center gap-3 rounded-lg border p-4 text-sm text-gray-600 hover:bg-gray-50">
        <BiUpload className=" h-5 w-5 text-red-500" />
        {image ? image.name : "Upload resturant image"}
        <input
          type="file"
          accept="image/"
          hidden
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className=" w-full rounded-lg border px-4 py-2 text-sm outline-none"
        />
      </label>
      <button
        disabled={loading}
        onClick={handleSubmit}
        className=" w-full rounded-lg text-white text-sm py-3 font-semibold transition bg-red-500 cursor-pointer"
      >
        {loading ? "Adding..." : "Add Item"}
      </button>
    </div>
  );
};

export default AddMenuItem;
