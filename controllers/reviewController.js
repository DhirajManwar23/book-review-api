const Review = require("../models/Review");
const Book = require("../models/Book");

exports.submitReview = async (req, res) => {
  const { rating, comment } = req.body;
  const { bookId } = req.params; // Ensure you're accessing the correct `bookId`

  const book = await Book.findById(bookId);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  const review = new Review({
    user: req.user.userId, // The logged-in user's ID
    book: bookId,
    rating,
    comment,
  });

  await review.save();
  book.reviews.push(review._id);
  await book.save();

  res.status(201).json(review);
};

exports.updateReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (review.user.toString() !== req.user.userId)
    return res.status(403).json({ error: "Not your review" });
  Object.assign(review, req.body);
  await review.save();
  res.json(review);
};

exports.deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (review.user.toString() !== req.user.userId)
    return res.status(403).json({ error: "Not your review" });
  await review.deleteOne();
  await Book.findByIdAndUpdate(review.book, { $pull: { reviews: review._id } });
  res.json({ message: "Review deleted" });
};
