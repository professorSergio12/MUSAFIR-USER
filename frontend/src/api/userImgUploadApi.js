import axiosInstance from "./axiosInstance";

export const uploadProfilePicture = async (data) => {
  const response = await axiosInstance.post("/user/profile-picture", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateUserName = async (data) => {
  const response = await axiosInstance.put("/user/update-name", data);
  return response.data;
};