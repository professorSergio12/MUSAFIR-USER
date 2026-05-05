import axiosInstance from "./axiosInstance";

export const getRecommendedPackages = async () => {
  const response = await axiosInstance.get("/packages/recommended");
  return response.data;
};

export const getAllPackages = async () => {
  const response = await axiosInstance.get("/packages/all");
  return response.data;
};

export const getPackageBySlug = async (slug) => {
  const response = await axiosInstance.get(`/packages/${slug}`);
  return response.data;
};