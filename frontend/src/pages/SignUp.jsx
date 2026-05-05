import React, { useState } from "react";
import { useSignup } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import OAuth from "../components/OAuth";

const Signup = () => {
  const navigate = useNavigate();
  const { mutate: signup, isPending, error } = useSignup();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { username, email, password } = formData;

    if (!username || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    signup(formData, {
      onSuccess: () => {
        alert("Account created successfully! Welcome to Travel Blogger.");
        setFormData({
          username: "",
          email: "",
          password: "",
        });
        navigate("/signin");
      },
      onError: (error) => {
        console.error("Signup error:", error);
      },
    });
  };

  return (
    <div className="flex justify-center items-center py-4 sm:py-8 md:py-12 lg:py-16 min-h-[calc(100vh-200px)] px-3 sm:px-4">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl min-h-[calc(100vh-200px)]">
        {/* Left Side */}
        <div className="w-full lg:w-1/2 relative bg-cover bg-center overflow-hidden min-h-[200px] sm:min-h-[250px] md:min-h-[300px] lg:min-h-[calc(100vh-200px)] rounded-t-lg sm:rounded-t-xl md:rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://res.cloudinary.com/dpu6rveug/image/upload/v1763201542/singup-image_rmipxc.jpg')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 to-blue-900/60"></div>
          </div>

          <div className="relative z-10 flex flex-col justify-center p-4 sm:p-6 md:p-8 lg:p-12 text-white h-full">
            <div>
              <h1
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 text-center"
                style={{ fontFamily: "cursive" }}
              >
                MUSAFIR
              </h1>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-white/90 max-w-md leading-relaxed text-center mx-auto px-2">
                Travel is the only purchase that enriches you in ways beyond
                material wealth.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-1/2 bg-white dark:bg-gray-800 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 relative min-h-[calc(100vh-200px)] rounded-b-lg sm:rounded-b-xl md:rounded-b-2xl lg:rounded-r-2xl lg:rounded-bl-none">
          <div className="absolute top-4 right-4 md:top-8 md:right-8 hidden lg:block">
            <svg
              className="w-8 h-8 md:w-12 md:h-12 text-blue-500 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </div>

          <div className="w-full max-w-md">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1 sm:mb-2">
              Welcome
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 md:mb-8 text-xs sm:text-sm md:text-base">
              Create Your Account
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2"
                >
                  Username
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <input
                    id="username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-blue-500 dark:border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2"
                >
                  Email id
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-blue-500 dark:border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-blue-500 dark:border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={isPending}
                className={`w-full py-2.5 sm:py-3 px-4 rounded-lg font-semibold text-white transition duration-200 cursor-pointer text-sm sm:text-base ${
                  isPending
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isPending ? "Creating Account..." : "SIGN UP"}
              </button>

              {error && (
                <p className="text-red-500 dark:text-red-400 text-center text-sm">
                  {error.response.data.message || "Something went wrong!"}
                </p>
              )}

              {/* OR */}
              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
                <span className="px-4 text-gray-500 dark:text-gray-400 text-sm">
                  OR
                </span>
                <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
              </div>

              {/* Google Login Button */}
              <OAuth />

              <p className="text-center text-gray-600 dark:text-gray-300 text-sm mt-6">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
