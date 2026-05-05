import { useMutation } from "@tanstack/react-query";
import { uploadProfilePicture, updateUserName } from "../api/userImgUploadApi";

export const useUploadProfilePicture = () => {
  return useMutation({
    mutationFn: (data) => uploadProfilePicture(data),
    onSuccess: (data) => {
      console.log("Profile Uploaded", data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
export const useUpdateUserName = () => {
  return useMutation({
    mutationFn: (data) => updateUserName(data),
    onSuccess: (data) => {
      console.log("Username Updated", data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
