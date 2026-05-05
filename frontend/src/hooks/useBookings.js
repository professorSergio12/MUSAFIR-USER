import { useQuery } from "@tanstack/react-query";
import { getUserBookings, getBookingById } from "../api/bookingApi";

export const useUserBookings = () => {
  return useQuery({
    queryKey: ["user-bookings"],
    queryFn: getUserBookings,
    staleTime: 0,
    gcTime: 0,
  });
};

export const useBookingById = (id) => {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => getBookingById(id),
    enabled: Boolean(id),
    staleTime: 0,
    gcTime: 0,
  });
};
