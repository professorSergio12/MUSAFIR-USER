import React, { useState } from "react";
import {
  useUploadProfilePicture,
  useUpdateUserName,
} from "../hooks/useProfileImgUpload";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../redux/user/userSlice";

const UserProfile = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);

  const [username, setUsername] = useState(currentUser?.username || "");
  const [previewImage, setPreviewImage] = useState(
    currentUser?.profilePicture ||
      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  );
  const { mutate: uploadProfilePic, isPending: uploading } =
    useUploadProfilePicture();
  const { mutate: updateUserName, isPending: nameUpdating } =
    useUpdateUserName();

  if (!currentUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500 dark:text-gray-400">
        Please sign in to view your profile.
      </div>
    );
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setPreviewImage(preview);

    const formData = new FormData();
    formData.append("profilePicture", file);

    uploadProfilePic(formData, {
      onSuccess: (res) => dispatch(setCurrentUser(res.data)),
    });
  };

  const handleUpdateName = (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    updateUserName(
      { username },
      {
        onSuccess: (res) => dispatch(setCurrentUser(res.data)),
      }
    );
  };

  return (
    <section className="flex-1 min-h-[calc(100vh-80px)] bg-white dark:bg-gray-900 py-6 sm:py-8 md:py-12 lg:py-16 px-4 sm:px-6 text-gray-900 dark:text-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-center mb-4 sm:mb-6 md:mb-10 text-gray-900 dark:text-white">
          Profile
        </h2>

        <div className="flex flex-col items-center gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 md:mb-12">
          <div className="relative">
            <img
              src={previewImage}
              alt="avatar"
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-gray-100 dark:border-gray-700 shadow-lg"
            />
            <label className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 rounded-full shadow p-1.5 sm:p-2 cursor-pointer border border-gray-200 dark:border-gray-600">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <span className="text-sky-500 dark:text-sky-400 text-base sm:text-lg md:text-xl">
                {uploading ? "…" : "✎"}
              </span>
            </label>
          </div>
          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              {currentUser.username}
            </h3>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 truncate max-w-[200px] sm:max-w-none">
              {currentUser.email}
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdateName} className="space-y-4 sm:space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1.5 sm:mb-2"
            >
              Name
            </label>
            <input
              id="name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1.5 sm:mb-2">
              Email account
            </label>
            <div className="w-full bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base truncate">
              {currentUser.email}
            </div>
          </div>
          <div className="pt-3 sm:pt-4 flex flex-wrap gap-3 sm:gap-4 justify-center">
            <button
              type="submit"
              disabled={nameUpdating}
              className="bg-sky-500 hover:bg-sky-600 px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 rounded-full font-semibold text-white shadow-lg disabled:opacity-60 cursor-pointer text-sm sm:text-base"
            >
              {nameUpdating ? "Saving..." : "Save Change"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default UserProfile;
