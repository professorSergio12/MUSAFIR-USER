import { useQuery } from "@tanstack/react-query";
import { getRecommendedPackages,getAllPackages, getPackageBySlug } from "../api/packagesApi";


export const useRecommendedPackages = () => {
  return useQuery({
    queryKey: ["recommended-packages"],
    queryFn: getRecommendedPackages,
    staleTime: 0,
    gcTime: 0,
  });
};

export const useAllPackages = () => {
  return useQuery({
    queryKey: ["all-packages"],
    queryFn: getAllPackages,
    staleTime: 0,
    gcTime: 0,
  });
};

export const usePackageBySlug = (slug) => {
  return useQuery({
    queryKey: ["package-by-slug", slug],
    queryFn: () => getPackageBySlug(slug),
    enabled: Boolean(slug), // don't run until slug exists
    staleTime: 0,
    gcTime: 0,
    retry: 1,
  });
};
