import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./features/Navbar";
import Home from "./pages/Home";
import Packages from "./components/RecommendedPackages";
import AllPackages from "./pages/AllPackages";
import PackageDetails from "./pages/PackageDetails";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./features/Footer";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./components/ForgetPassword";
import VerifyOTP from "./components/VerifyOtp";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import User from "./pages/User";
import ContactUs from "./components/ContactUs";
// import Admin from "./pages/Admin";
function App() {
  return (
    <Router>
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/all-packages" element={<AllPackages />} />
        <Route path="/packages/:slug" element={<PackageDetails />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        {/* <Route path="/admin/signin" element={<Admin />} /> */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/profile" element={<User />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
