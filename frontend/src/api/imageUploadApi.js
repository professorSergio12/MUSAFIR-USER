import axiosInstance from "./axiosInstance";

/** Public: fetch all gallery images (for public gallery page) */
export const getAllGalleryImages = async () => {
  const response = await axiosInstance.get("/gallery");
  return response.data;
};

export const uploadGalleryImage = async (data) => {
  const response = await axiosInstance.post("/gallery/upload", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getUserGalleryImages = async () => {
  const response = await axiosInstance.get("/gallery/my");
  return response.data;
};

export const deleteUserGalleryImage = async (id) => {
  const response = await axiosInstance.delete(`/gallery/${id}`);
  return response.data;
}