import React, { useState, useEffect } from "react";
import { useForgotPassword } from "../hooks/useAuth";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialEmail = location.state?.email || "";
  const [email, setEmail] = useState(initialEmail);
  const [fetchingEmail, setFetchingEmail] = useState(true);

  const {
    mutate: forgotPassword,
    isPending: isLoading,
    error: forgotPasswordError,
  } = useForgotPassword();

  useEffect(() => {
    setTimeout(() => setFetchingEmail(false), 800);
  }, []);

  const handleSubmit = () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    forgotPassword(
      { email },
      {
        onSuccess: () => {
          alert("OTP sent successfully!");
          navigate("/verify-otp", { state: { email } });
        },
        onError: (error) => {
          alert(error?.response?.data?.message || "Something went wrong!");
        },
      }
    );
  };

  const handleBackToLogin = () => {
    navigate("/signin");
  };

  return (
    <div className="flex items-center justify-center py-20 md:py-24 px-4 min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side */}
        <div
          className="md:w-1/2 relative bg-cover bg-center min-h-[250px] md:min-h-[600px]"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/dpu6rveug/image/upload/v1763202115/forgetpass-img_tvrozk.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 to-blue-900/60 flex flex-col justify-center items-center p-8 text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-white/30">
              <i className="fa-solid fa-envelope text-white text-3xl"></i>
            </div>
            <h2 className="text-white text-3xl cursor-pointer md:text-4xl font-bold mb-4">
              FORGOT YOUR PASSWORD?
            </h2>
            <p className="text-blue-100 text-lg max-w-md mx-auto">
              Don’t worry! We’ll help you get back on track.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="md:w-1/2 p-6 md:p-8 lg:p-10 bg-white flex items-center min-h-[250px] md:min-h-[600px]">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-black mb-2 tracking-wide">
                TRAVEL BLOGGER
              </h1>
              <p className="text-black font-bold text-base">
                Reset your password
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="fa-solid fa-envelope text-white text-sm"></i>
                </div>
                <div>
                  <h3 className="text-black font-bold text-lg mb-1">
                    Email Verification
                  </h3>
                  <p className="text-black font-semibold text-sm leading-relaxed">
                    We'll send an OTP to your email address.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email-input"
                  className="block text-black font-bold text-base mb-2"
                >
                  Email Address
                </label>
                {fetchingEmail ? (
                  <div className="flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg p-3">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3"></div>
                    <span className="text-black font-semibold text-sm">
                      Fetching your email...
                    </span>
                  </div>
                ) : (
                  <div className="relative">
                    <i className="fa-solid fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                    <input
                      id="email-input"
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={isLoading || fetchingEmail}
                className="w-full bg-white cursor-pointer hover:bg-blue-50 text-blue-900 font-bold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane"></i>
                    <span>Send OTP</span>
                    <Link to="/verify-otp" className="text-blue-500"></Link>
                  </>
                )}
              </button>

              <button
                onClick={handleBackToLogin}
                className="w-full bg-transparent cursor-pointer hover:bg-white/10 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 border border-white/30 flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-arrow-left"></i>
                <span>Back to Login</span>
              </button>

              {forgotPasswordError && (
                <p className="text-red-300 text-center mt-2">
                  {forgotPasswordError?.response?.data?.message ||
                    "Something went wrong!"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
