import { useState } from "react";
import { UseAppData } from "../Context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import { restaurant_Service_url } from "../main";
import { BiMapPin, BiUpload } from "react-icons/bi";
function AddRestaurant() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { loadingLocation, location } = UseAppData();

  const handelSubmit = async () => {
    if (!name || !image || !location) {
      alert("All field are requried");
      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("latitude", String(location.latitude));
    formData.append("longitude", String(location.longitude));
    formData.append("formattedAddress", location.formattedAddress);
    formData.append("file", image);
    formData.append("phone", phone);
    console.log("POST URL:", `${restaurant_Service_url}/api/restaurant/new`);

    try {
      setSubmitting(true);

      await axios.post(
        `${restaurant_Service_url}/api/restaurant/new`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      toast.success("Restaurant added sucessfully");
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className=" min-h-screen bg-gray-50 px-4 py-6">
      <div className=" mx-auto max-w-lg rounded-xl bg-white p-6 shadow-sm space-y-5">
        <h1 className=" text-xl font-semibold">Add your Restaurant</h1>
        <input
          type="text"
          placeholder="Restaurant name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className=" w-full rounded-lg border px-4 py-2 text-sm outline-none"
        />
        <input
          type="number"
          placeholder="Contact number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className=" w-full rounded-lg border px-4 py-2 text-sm outline-none"
        />
        <textarea
          placeholder="Restaurant Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
        <div className=" flex items-start gap-3 rounded-lg border p-4">
          <BiMapPin className=" mt-0.5 h-5 w-5 text-red-500" />
          <div className=" text-sm ">
            {loadingLocation
              ? "Fetching your current location...."
              : location?.formattedAddress || "Location not available"}
          </div>
        </div>

        <button
          className=" w-full rounded-lg py-3 text-sm font-semibold text-white bg-[#E23744]"
          disabled={submitting}
          onClick={handelSubmit}
        >
          {submitting ? "Submiting..." : "Add restaurant"}
        </button>
      </div>
    </div>
  );
}

export default AddRestaurant;
