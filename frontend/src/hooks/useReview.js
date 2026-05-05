import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createReview,
  getPackageReviews,
  getUserReviews,
} from "../api/reviewsApi";

export const useCreateReview = (onSuccessCallback, onErrorCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createReview(data),
    onSuccess: (data, variables) => {
      // Invalidate package reviews for the specific package
      if (variables.package) {
        queryClient.invalidateQueries({
          queryKey: ["package-reviews", variables.package],
        });
      }
      // Invalidate all package reviews
      queryClient.invalidateQueries({
        queryKey: ["package-reviews"],
      });
      // Invalidate user bookings
      queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
      // Invalidate user reviews
      queryClient.invalidateQueries({ queryKey: ["user-reviews"] });

      // Call custom success callback if provided
      if (onSuccessCallback) {
        onSuccessCallback(data);
      }
    },
    onError: (error) => {
      // Call custom error callback if provided
      if (onErrorCallback) {
        onErrorCallback(error);
      }
    },
  });
};

export const useGetPackageReviews = (packageId) => {
  return useQuery({
    queryKey: ["package-reviews", packageId],
    queryFn: () => getPackageReviews(packageId),
    enabled: Boolean(packageId),
  });
};

export const useGetUserReviews = () => {
  return useQuery({
    queryKey: ["user-reviews"],
    queryFn: () => getUserReviews(),
  });
};
