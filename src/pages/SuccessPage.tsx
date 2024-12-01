import axios from "axios";
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "../contexts/ToastProvider";

export default function SuccessPage() {
  const showToast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hasEffectRun = useRef(false);

  const data = {
    startDate: searchParams.get("startDate"),
    endDate: searchParams.get("endDate"),
    campgroundId: searchParams.get("campgroundId"),
    author: searchParams.get("author"),
  };
  console.log(data);

  const createBooking = async () => {
    try {
      await axios.post("/api/booking/success", data);
      showToast("Booking created successfully", "green");
      navigate("/campgrounds");
    } catch (e) {
      showToast("Booking Error", "red");
      navigate("/campgrounds");
    }
  };

  useEffect(() => {
    if (hasEffectRun.current) return; // Prevents the effect from running again

    hasEffectRun.current = true; // Mark the effect as run
    createBooking();
  }, []); // Empty dependency array ensures this runs only on mount

  return (
    <>
      <h1>Loading...</h1>
    </>
  );
}