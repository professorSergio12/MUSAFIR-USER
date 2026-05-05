import React, { useState, useEffect } from "react";
import { useVerifyOTP, useResetPassword } from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const {
    mutate: verifyOTP,
    isPending: isVerifying,
    error: verifyError,
  } = useVerifyOTP();

  const {
    mutate: resetPassword,
    isPending: isResetting,
    error: resetError,
  } = useResetPassword();

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const handleVerifyOTP = () => {
    if (!otp || otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    verifyOTP(
      { email, otp },
      {
        onSuccess: () => {
          alert("OTP verified successfully!");
          setIsOtpVerified(true);
        },
        onError: (error) => {
          alert(error?.response?.data?.message || "Invalid OTP");
        },
      }
    );
  };

  const handleResetPassword = () => {
    if (!password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    resetPassword(
      { email, password, confirmPassword },
      {
        onSuccess: () => {
          alert(
            "Password reset successfully! Please login with your new password."
          );
          navigate("/signin");
        },
        onError: (error) => {
          alert(error?.response?.data?.message || "Something went wrong!");
        },
      }
    );
  };

  const handleBackToForgotPassword = () => {
    navigate("/forgot-password", { state: { email } });
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
              <i className="fa-solid fa-shield-halved text-white text-3xl"></i>
            </div>
            <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
              {isOtpVerified ? "RESET YOUR PASSWORD" : "VERIFY OTP"}
            </h2>
            <p className="text-blue-100 text-lg max-w-md mx-auto">
              {isOtpVerified
                ? "Create a strong password to secure your account."
                : "Enter the OTP sent to your email address."}
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
                {isOtpVerified ? "Set New Password" : "Verify OTP"}
              </p>
            </div>

            {!isOtpVerified ? (
              <>
                {/* OTP Verification Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className="fa-solid fa-key text-white text-sm"></i>
                    </div>
                    <div>
                      <h3 className="text-black font-bold text-lg mb-1">
                        OTP Verification
                      </h3>
                      <p className="text-black font-semibold text-sm leading-relaxed">
                        Enter the 6-digit OTP sent to{" "}
                        <span className="text-blue-600">{email}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="otp-input"
                      className="block text-black font-bold text-base mb-2"
                    >
                      Enter OTP
                    </label>
                    <div className="relative">
                      <i className="fa-solid fa-key absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                      <input
                        id="otp-input"
                        type="text"
                        name="otp"
                        value={otp}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 6);
                          setOtp(value);
                        }}
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-center text-2xl tracking-widest font-bold"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleVerifyOTP}
                    disabled={isVerifying || otp.length !== 6}
                    className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isVerifying ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Verifying OTP...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-check"></i>
                        <span>Verify OTP</span>
                      </>
                    )}
                  </button>

                  {verifyError && (
                    <p className="text-red-500 text-center text-sm">
                      {verifyError?.response?.data?.message ||
                        "Invalid OTP. Please try again."}
                    </p>
                  )}

                  <button
                    onClick={handleBackToForgotPassword}
                    className="w-full bg-transparent cursor-pointer hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition duration-200 border border-gray-300 flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-arrow-left"></i>
                    <span>Back to Forgot Password</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Reset Password Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className="fa-solid fa-lock text-white text-sm"></i>
                    </div>
                    <div>
                      <h3 className="text-black font-bold text-lg mb-1">
                        Create New Password
                      </h3>
                      <p className="text-black font-semibold text-sm leading-relaxed">
                        Enter your new password below. Make sure it's strong and
                        secure.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="password-input"
                      className="block text-black font-bold text-base mb-2"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <i className="fa-solid fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                      <input
                        id="password-input"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confirm-password-input"
                      className="block text-black font-bold text-base mb-2"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <i className="fa-solid fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                      <input
                        id="confirm-password-input"
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                    </div>
                    {password &&
                      confirmPassword &&
                      password !== confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">
                          Passwords do not match
                        </p>
                      )}
                  </div>

                  <button
                    onClick={handleResetPassword}
                    disabled={
                      isResetting ||
                      !password ||
                      !confirmPassword ||
                      password !== confirmPassword
                    }
                    className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isResetting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Resetting Password...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-check"></i>
                        <span>Reset Password</span>
                      </>
                    )}
                  </button>

                  {resetError && (
                    <p className="text-red-500 text-center text-sm">
                      {resetError?.response?.data?.message ||
                        "Something went wrong!"}
                    </p>
                  )}

                  <button
                    onClick={() => setIsOtpVerified(false)}
                    className="w-full bg-transparent cursor-pointer hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition duration-200 border border-gray-300 flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-arrow-left"></i>
                    <span>Back to OTP Verification</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
