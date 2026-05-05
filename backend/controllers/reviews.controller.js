import PackageReviews from "../models/packageReviews.model.js";
import { errorHandler } from "../utils/errorHandler.js";

export const createReview = async (req, res, next) => {
  try {
    const { package: packageId, booking, rating, title, review, images } = req.body;

    // Validation
    if (!packageId) {
      return next(errorHandler(400, "Package ID is required"));
    }
    if (!rating || rating < 1 || rating > 5) {
      return next(errorHandler(400, "Rating must be between 1 and 5"));
    }
    if (!title || title.trim().length < 3) {
      return next(errorHandler(400, "Title must be at least 3 characters"));
    }
    if (title && title.length > 100) {
      return next(errorHandler(400, "Title must be less than 100 characters"));
    }
    if (!review || review.trim().length < 10) {
      return next(errorHandler(400, "Review must be at least 10 characters"));
    }
    if (review && review.length > 1000) {
      return next(errorHandler(400, "Review must be less than 1000 characters"));
    }

    const existingReview = await PackageReviews.findOne({
      user: req.user.id,
      package: packageId,
    });

    if (existingReview) {
      return next(errorHandler(400, "You have already reviewed this package"));
    }

    const newReview = new PackageReviews({
      package: packageId,
      user: req.user.id,
      booking,
      rating,
      title,
      review,
      images: images || [],
    });

    await newReview.save();

    await newReview.populate([
      { path: "user", select: "name email avatar" },
      { path: "package", select: "name images" },
    ]);

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: newReview,
    });
  } catch (error) {
    next(error);
  }
};

// Get reviews for a specific package
export const getPackageReviews = async (req, res, next) => {
  try {
    const { packageId } = req.params;
    const {
      page = 1,
      limit = 10,
      rating,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit);

    const filter = {
      package: packageId,
    };

    if (rating) {
      filter.rating = Number.parseInt(rating);
    }

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const reviews = await PackageReviews.find(filter)
      .populate("user", "name avatar")
      .populate("package", "name")
      .sort(sort)
      .skip(skip)
      .limit(Number.parseInt(limit));

    const totalReviews = await PackageReviews.countDocuments(filter);
    const averageRating = await PackageReviews.getAverageRating(packageId);

    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: Number.parseInt(page),
          totalPages: Math.ceil(totalReviews / Number.parseInt(limit)),
          totalReviews,
          hasNextPage: skip + reviews.length < totalReviews,
          hasPrevPage: Number.parseInt(page) > 1,
        },
        averageRating,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get user's reviews
export const getUserReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit);

    const reviews = await PackageReviews.find({ user: req.user.id })
      .populate("package", "name images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit));

    const totalReviews = await PackageReviews.countDocuments({
      user: req.user.id,
    });

    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: Number.parseInt(page),
          totalPages: Math.ceil(totalReviews / Number.parseInt(limit)),
          totalReviews,
          hasNextPage: skip + reviews.length < totalReviews,
          hasPrevPage: Number.parseInt(page) > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update a review
export const updateReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, review, images } = req.body;

    const existingReview = await PackageReviews.findOne({
      _id: reviewId,
      user: req.user.id,
    });

    if (!existingReview) {
      return next(errorHandler(404, "Review not found"));
    }

    const updatedReview = await PackageReviews.findByIdAndUpdate(
      reviewId,
      {
        rating,
        title,
        review,
        images,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    ).populate([
      { path: "user", select: "name email avatar" },
      { path: "package", select: "name images" },
    ]);

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: updatedReview,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a review
export const deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const existingReview = await PackageReviews.findOne({
      _id: reviewId,
      user: req.user.id,
    });

    if (!existingReview) {
      return next(errorHandler(404, "Review not found"));
    }

    await PackageReviews.findByIdAndDelete(reviewId);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Vote helpful for a review
export const voteHelpful = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { isHelpful } = req.body;

    const review = await PackageReviews.findById(reviewId);
    if (!review) {
      return next(errorHandler(404, "Review not found"));
    }

    const userId = req.user.id;
    const hasVoted = review.votedBy.some(
      (id) => id.toString() === userId.toString()
    );

    if (isHelpful && !hasVoted) {
      // Add helpful vote
      review.helpfulVotes += 1;
      review.votedBy.push(userId);
    } else if (!isHelpful && hasVoted) {
      // Remove helpful vote
      review.helpfulVotes = Math.max(0, review.helpfulVotes - 1);
      review.votedBy = review.votedBy.filter(
        (id) => id.toString() !== userId.toString()
      );
    }

    await review.save();

    const hasVotedAfter = review.votedBy.some(
      (id) => id.toString() === userId.toString()
    );

    res.status(200).json({
      success: true,
      message: "Vote updated successfully",
      data: {
        helpfulVotes: review.helpfulVotes,
        hasVoted: hasVotedAfter,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get review statistics
export const getReviewStats = async (req, res, next) => {
  try {
    if (req.user?.role !== "admin") {
      return next(errorHandler(403, "Access denied"));
    }

    const stats = await PackageReviews.aggregate([
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    const ratingDistribution = await PackageReviews.aggregate([
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: stats[0] || {
          totalReviews: 0,
          averageRating: 0,
        },
        ratingDistribution,
      },
    });
  } catch (error) {
    next(error);
  }
};
