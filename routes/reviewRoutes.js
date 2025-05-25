const express = require("express");
const router = express.Router();

const {
  submitReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const auth = require("../middlewares/authMiddleware");

// POST /api/books/:bookId/reviews
router.post("/books/:bookId/reviews", auth, submitReview);

// PUT /api/reviews/:id
router.put("/reviews/:id", auth, updateReview);

// DELETE /api/reviews/:id
router.delete("/reviews/:id", auth, deleteReview);

module.exports = router;
// This code defines the routes for submitting, updating, and deleting reviews.