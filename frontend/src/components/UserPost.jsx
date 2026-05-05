import React, { useState } from "react";
import { useUploadGalleryImage } from "../hooks/useImgUpload";
import { useQueryClient } from "@tanstack/react-query";

const UserPost = () => {
  const queryClient = useQueryClient(); // to refresh the cache of the gallery images and serve the latest data to user after uploading a new image
  const [form, setForm] = useState({
    caption: "",
    location: "",
    tags: "",
  });

  const [imageData, setImageData] = useState({
    file: null,
    preview: null,
  });

  // Messages
  const [message, setMessage] = useState({ type: "", text: "" });
  const { mutate: uploadImage, isPending } = useUploadGalleryImage();

  // Handle form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  // Handle image select
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return setMessage({
        type: "error",
        text: "Please select a valid image.",
      });
    }

    if (file.size > 5 * 1024 * 1024) {
      return setMessage({ type: "error", text: "Image must be under 5MB." });
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageData({ file, preview: reader.result });
    };
    reader.readAsDataURL(file);
    setMessage({ type: "", text: "" });
  };

  // Remove selected image
  const removeImage = () => {
    setImageData({ file: null, preview: null });
    document.getElementById("image-input").value = "";
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!imageData.file) {
      return setMessage({ type: "error", text: "Please select an image." });
    }

    const tagsArray = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const formData = new FormData();
    formData.append("image", imageData.file);
    formData.append("caption", form.caption);
    formData.append("location", form.location);
    formData.append("tags", JSON.stringify(tagsArray));

    uploadImage(formData, {
      onSuccess: () => {
        setMessage({ type: "success", text: "Image uploaded successfully!" });
        setForm({ caption: "", location: "", tags: "" });
        setImageData({ file: null, preview: null });
        const fileInput = document.getElementById("image-input");
        if (fileInput) fileInput.value = "";
        queryClient.invalidateQueries({ queryKey: ["user-gallery-images"] });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      },
      onError: (err) => {
        setMessage({
          type: "error",
          text: err?.response?.data?.message || "Upload failed.",
        });
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Upload Tour Photo
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Share your amazing travel moments with the community
          </p>
        </div>

        {/* Upload Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Section */}
            <div>
              <label
                htmlFor="image-input"
                className="block text-sm font-medium text-white-700 mb-2"
              >
                Select Image <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                {imageData.preview ? (
                  <div className="relative">
                    <img
                      src={imageData.preview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-colors cursor-pointer"
                      aria-label="Remove image"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="image-input"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span className="sr-only">Upload image file</span>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-12 h-12 mb-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-300">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-300">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                    <input
                      id="image-input"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageSelect}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Caption Input */}
            <div>
              <label
                htmlFor="caption"
                className="block text-sm font-medium text-white-700 mb-2"
              >
                Caption
              </label>
              <textarea
                id="caption"
                rows={3}
                value={form.caption}
                onChange={handleChange}
                placeholder="Write a caption for your photo..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Location Input */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-white-700 mb-2"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g., Paris, France"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Tags Input */}
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-white-700 mb-2"
              >
                Tags{" "}
                <span className="text-gray-200 text-xs">(comma-separated)</span>
              </label>
              <input
                type="text"
                id="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="e.g., adventure, mountains, sunset"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              />
              <p className="mt-1 text-xs text-white-500">
                Separate multiple tags with commas
              </p>
            </div>

            {/* Message Display */}
            {message.text && (
              <div
                className={`px-4 py-3 rounded-lg flex items-center gap-2 ${
                  message.type === "success"
                    ? "bg-green-50 border border-green-200 text-green-800"
                    : "bg-red-50 border border-red-200 text-red-800"
                }`}
              >
                {message.type === "success" ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                <span>{message.text}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isPending || !imageData.file}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isPending ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    <span>Upload Photo</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserPost;
