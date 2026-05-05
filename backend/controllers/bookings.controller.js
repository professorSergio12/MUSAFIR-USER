import bookingModel from "../models/booking.model.js";

export const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required",
      });
    }

    const booking = await bookingModel
      .findById(id)
      .populate("packageId", "name images basePrice durationDays country slug");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Security check: Verify booking belongs to the logged-in user
    if (booking.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to access this booking",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// Get current user's bookings
export const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await bookingModel
      .find({ user: req.user.id })
      .populate("packageId", "name images basePrice durationDays country slug")
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};
