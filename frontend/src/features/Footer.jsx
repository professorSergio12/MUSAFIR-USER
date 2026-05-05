import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-green-50 text-gray-900 relative">
      {/* Curved top border - improved design */}
      <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-r from-green-100 to-green-50 transform -translate-y-4">
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            fill="currentColor"
            opacity="0.1"
          ></path>
        </svg>
      </div>

      <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {/* Shop Packages */}
          <div>
            <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
              Shop Packages
            </h4>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link
                  to="/packages"
                  className="text-sm sm:text-base text-gray-700 hover:text-green-600 transition-colors duration-300"
                >
                  Adventure Packages
                </Link>
              </li>
              <li>
                <Link
                  to="/packages"
                  className="text-sm sm:text-base text-gray-700 hover:text-green-600 transition-colors duration-300"
                >
                  Mountain Expeditions
                </Link>
              </li>
              <li>
                <Link
                  to="/packages"
                  className="text-sm sm:text-base text-gray-700 hover:text-green-600 transition-colors duration-300"
                >
                  Cultural Tours
                </Link>
              </li>
              <li>
                <Link
                  to="/packages"
                  className="text-sm sm:text-base text-gray-700 hover:text-green-600 transition-colors duration-300"
                >
                  Beach Getaways
                </Link>
              </li>
              <li>
                <Link
                  to="/packages"
                  className="text-sm sm:text-base text-gray-700 hover:text-green-600 transition-colors duration-300"
                >
                  Shop All
                </Link>
              </li>
            </ul>
            <p className="text-xs text-gray-500 mt-3 sm:mt-4">©2025 musafir.com</p>
          </div>

          {/* Learn */}
          <div>
            <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Learn</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-sm sm:text-base text-gray-700 hover:text-green-600 transition-colors duration-300"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  to="/guides"
                  className="text-sm sm:text-base text-gray-700 hover:text-green-600 transition-colors duration-300"
                >
                  Travel Guides
                </Link>
              </li>
              <li>
                <Link
                  to="/safety"
                  className="text-sm sm:text-base text-gray-700 hover:text-green-600 transition-colors duration-300"
                >
                  Safety Tips
                </Link>
              </li>
              <li>
                <Link
                  to="/insurance"
                  className="text-sm sm:text-base text-gray-700 hover:text-green-600 transition-colors duration-300"
                >
                  Travel Insurance
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-sm sm:text-base text-gray-700 hover:text-green-600 transition-colors duration-300"
                >
                  FAQ's
                </Link>
              </li>
            </ul>
          </div>

          {/* More from Musafir */}
          <div>
            <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
              More from Musafir
            </h4>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link
                  to="/login"
                  className="text-sm sm:text-base text-gray-700 hover:text-green-600 transition-colors duration-300"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  to="/partner"
                  className="text-sm sm:text-base text-gray-700 hover:text-green-600 transition-colors duration-300"
                >
                  Partner with Us
                </Link>
              </li>
              <li>
                <Link
                  to="/affiliate"
                  className="text-sm sm:text-base text-gray-700 hover:text-green-600 transition-colors duration-300"
                >
                  Affiliate Program
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm sm:text-base text-gray-700 hover:text-green-600 transition-colors duration-300"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow us */}
          <div>
            <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Follow us</h4>
            <div className="flex space-x-2 sm:space-x-3">
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-10 sm:h-10 bg-green-800 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors duration-300"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-10 sm:h-10 bg-green-800 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors duration-300"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-10 sm:h-10 bg-green-800 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors duration-300"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-10 sm:h-10 bg-green-800 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors duration-300"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Policy Links */}
        <div className="border-t border-green-200 mt-6 sm:mt-8 pt-3 sm:pt-4">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
            <Link
              to="/terms"
              className="text-gray-600 hover:text-green-600 transition-colors duration-300"
            >
              Terms of Service
            </Link>
            <span className="text-gray-400">|</span>
            <Link
              to="/privacy"
              className="text-gray-600 hover:text-green-600 transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <span className="text-gray-400">|</span>
            <Link
              to="/refund"
              className="text-gray-600 hover:text-green-600 transition-colors duration-300"
            >
              Refund Policy
            </Link>
            <span className="text-gray-400">|</span>
            <Link
              to="/accessibility"
              className="text-gray-600 hover:text-green-600 transition-colors duration-300"
            >
              Accessibility Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
