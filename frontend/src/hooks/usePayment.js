import { useMutation} from "@tanstack/react-query";
import { createOrder, verifyPayment } from "../api/paymentApi";

export const useCreateOrder = (options = {}) => {
  return useMutation({
    mutationFn: ({ amount }) => createOrder(amount),
    ...options,
  });
};

export const useVerifyPayment = (options = {}) => {
  return useMutation({
    mutationFn: (payload) => verifyPayment(payload),
    ...options,
  });
};
