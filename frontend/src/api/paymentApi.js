import axiosInstance from "./axiosInstance";

export const createOrder = async (amount) => {
    const response = await axiosInstance.post("/payment/create-order", { amount });
    return response.data;
};

export const verifyPayment = async (payload) => {
    const response = await axiosInstance.post("/payment/verify-payment", payload);
    return response.data;
};