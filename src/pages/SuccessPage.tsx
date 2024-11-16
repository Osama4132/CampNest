import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "../contexts/ToastProvider";

export default function SuccessPage() {
    const showToast = useToast()
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const data = {
    startDate: searchParams.get("startDate"),
    endDate: searchParams.get("endDate"),
    campgroundId: searchParams.get("campgroundId"),
    author: searchParams.get("author"),
  };
  console.log(data);

  const createBooking = async () => {
    await axios.post("/api/booking/success", data);
    showToast("Booking created sucesfully","green")
    navigate("/campgrounds");
  };

  useEffect(() => {
    try {
      createBooking();
      showToast("Booking Error", "red")
      navigate("/campgrounds")
    } catch (e) {
        showToast("Booking Error", "red")
      navigate("/campgrounds");
    }
  });
  return (
    <>
      <h1>Loading...</h1>
    </>
  );
}
