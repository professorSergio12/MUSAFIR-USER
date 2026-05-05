import { useMutation, useQuery } from "@tanstack/react-query";
import {
  uploadGalleryImage,
  getUserGalleryImages,
  deleteUserGalleryImage,
} from "../api/imageUploadApi";

export const useUploadGalleryImage = () => {
  return useMutation({
    mutationFn: (data) => uploadGalleryImage(data),
    onSuccess: (data) => {
      console.log("Gallery Image Uploaded", data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useUserGalleryImages = () => {
  return useQuery({
    queryKey: ["user-gallery-images"],
    queryFn: getUserGalleryImages,
    staleTime: 0,
    gcTime: 0,
  });
};

export const useDeleteUserGalleryImage = () => {
  return useMutation({
    mutationFn: (id) => deleteUserGalleryImage(id),
    onSuccess: (data) => {
      console.log("Gallery Image Deleted", data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};