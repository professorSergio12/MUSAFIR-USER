import React from "react";
import { motion } from "framer-motion";
import {
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

const ContactUs = () => {
  const supportCards = [
    {
      icon: <QuestionMarkCircleIcon className="w-8 h-8 text-blue-600" />,
      title: "Questions about bookings",
      description:
        "Need help with a package, date change or special request? Our team is here to guide you.",
      action: "View booking help",
    },
    {
      icon: <ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-600" />,
      title: "Let’s chat live",
      description:
        "Chat with a travel expert in real-time and get personalized recommendations for your trip.",
      action: "Start live chat",
    },
    {
      icon: <PhoneIcon className="w-8 h-8 text-blue-600" />,
      title: "Priority support",
      description:
        "Stuck at the airport or need urgent help? Call our 24/7 support line for instant assistance.",
      action: "Call support",
    },
  ];

  const helpCards = [
    {
      title: "General Queries",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      description:
        "Learn about payments, invoices, refunds, and everything related to your Musafir account.",
    },
    {
      title: "Travel Experts",
      image:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop",
      description:
        "Talk to certified travel experts who can help you design the perfect itinerary.",
    },
    {
      title: "Partners & Agents",
      image:
        "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?w=800&h=600&fit=crop",
      description:
        "Are you a hotel, guide or agency? Partner with Musafir to reach more travelers.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-50 to-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1526779259212-939e64788e3c?w=1600&h=900&fit=crop"
            alt="Travel support"
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-sky-900/60" />
          {/* Floating glow */}
          <motion.div
            className="absolute -bottom-10 -left-10 w-72 h-72 rounded-full bg-sky-500/30 blur-3xl"
            animate={{ y: [0, -15, 0], opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-24 flex flex-col gap-6 md:gap-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl text-white"
          >
            <p className="inline-flex items-center gap-2 text-xs sm:text-sm uppercase tracking-[0.2em] text-sky-200/90 mb-2 md:mb-3">
              <GlobeAltIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              We're here 24/7
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-3 md:mb-4">
              Contact Musafir Support
            </h1>
            <p className="text-sky-100/90 text-sm sm:text-base md:text-lg">
              Whether you are planning your first trip or managing an existing
              booking, our travel experts are just a message away.
            </p>
          </motion.div>

          {/* HERO LOWER PANEL */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
          >
            {supportCards.map((card, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 250, damping: 18 }}
                className="bg-white dark:bg-gray-800/95 backdrop-blur border border-slate-100 rounded-2xl p-5 shadow-sm"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-sky-50">{card.icon}</div>
                  <h3 className="font-semibold text-slate-900 text-base md:text-lg">
                    {card.title}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                  {card.description}
                </p>
                <button className="text-sm font-medium text-sky-600 hover:text-sky-700 inline-flex items-center gap-1">
                  {card.action}
                  <span aria-hidden="true">→</span>
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ + CONTACT FORM */}
      <section className="max-w-6xl mx-auto px-4 py-8 sm:py-12 md:py-14 lg:py-18">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-10 lg:gap-14 items-start">
          {/* FAQ style cards */}
          <div className="space-y-4 md:space-y-5">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white-600 mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-white-600 mb-4">
              Quick answers to the most common questions about bookings,
              cancellations and payments.
            </p>

            {[
              {
                q: "How do I change or cancel my booking?",
                a: "Log in to your Musafir account, open your trip details and choose modify or cancel. Many changes are processed instantly.",
              },
              {
                q: "Can I book for a group or corporate trip?",
                a: "Yes, we specialise in custom itineraries for groups and companies. Share your requirements and a dedicated expert will assist you.",
              },
              {
                q: "Where can I see my invoices and payment history?",
                a: "All invoices are available in your account dashboard under the billing section. You can also download PDF copies anytime.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ y: 15, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-5 shadow-sm border border-slate-100"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-50 text-sky-600 text-xs font-semibold">
                    Q
                  </span>
                  <div>
                    <h3 className="font-semibold text-white-900 mb-1 text-sm md:text-base">
                      {item.q}
                    </h3>
                    <p className="text-xs md:text-sm text-white-600 leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact form */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-sky-100 border border-slate-100 p-6 md:p-7"
          >
            <h3 className="text-xl font-semibold text-white-600 mb-1">
              Send us a message
            </h3>
            <p className="text-sm text-white-600 mb-5">
              Share your travel plans and we’ll respond within a few working
              hours.
            </p>

            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white-600 mb-1">
                    Full name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-sky-500/70 bg-slate-50/60"
                    placeholder="Rohit Sharma"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white-600 mb-1">
                    Email address
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-sky-500/70 bg-slate-50/60"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white-600 mb-1">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-sky-500/70 bg-slate-50/60"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white-600 mb-1">
                    Trip type
                  </label>
                  <select className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-sky-500/70 bg-slate-50/60">
                    <option>Holiday package</option>
                    <option>Corporate travel</option>
                    <option>Honeymoon</option>
                    <option>Adventure trip</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white-600 mb-1">
                  Message
                </label>
                <textarea
                  rows="4"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-sky-500/70 bg-slate-50/60 resize-none"
                  placeholder="Tell us about your trip, dates, and any special requests..."
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
                <p className="text-[11px] text-slate-500 max-w-xs">
                  By submitting, you agree to be contacted by Musafir regarding
                  your inquiry.
                </p>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-5 py-2.5 shadow-md shadow-sky-200 transition"
                >
                  Submit message
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* HOW CAN WE HELP STRIP */}
      <section className="bg-slate-900 text-slate-100 py-8 md:py-10 lg:py-12 mt-4">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold">
              Still need help?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Email us at{" "}
              <span className="font-medium text-white">
                support@musafir.app
              </span>{" "}
              or call{" "}
              <span className="font-medium text-white">+91 8000 123 123</span>.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <button className="inline-flex items-center gap-2 rounded-full border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800 transition">
              <PhoneIcon className="w-4 h-4" />
              Request a callback
            </button>
            <button className="inline-flex  cursor-pointer items-center gap-2 rounded-full bg-white dark:bg-gray-800 text-black-700 px-4 py-2 text-sm font-semibold hover:bg-slate-100 transition">
              <ChatBubbleLeftRightIcon className="w-4 h-4" />
              Open chat
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
