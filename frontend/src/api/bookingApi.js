import axiosInstance from "./axiosInstance";

export const getUserBookings = async () => {
  const response = await axiosInstance.get("/bookings/my");
  return response.data;
};

export const getBookingById = async (id) => {
  if (!id) {
    throw new Error("Booking ID is required");
  }
  const response = await axiosInstance.get(`/bookings/${id}`);
  return response.data;
};
