const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const Book = require("./models/Book");
dotenv.config();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

// Route registrations
app.use("/api/auth", require("./routes/authRoutes"));
// Get all books with pagination and optional filters (author and genre)
app.get("/api/books", async (req, res) => {
  try {
    const { author, genre, page = 1, limit = 10 } = req.query; // Pagination setup and filters

    // Build the query object for author and genre filters
    const query = {};
    if (author) query.author = { $regex: author, $options: "i" }; // Case-insensitive search for author
    if (genre) query.genre = { $regex: genre, $options: "i" }; // Case-insensitive search for genre

    // Fetch books with pagination
    const books = await Book.find(query)
      .skip((page - 1) * limit)  // Skip books based on page number
      .limit(Number(limit));    // Limit the number of books per page

    // Count total books for pagination info
    const totalBooks = await Book.countDocuments(query);

    // Send response with books and pagination info
    res.json({
      books,
      page,
      limit,
      totalPages: Math.ceil(totalBooks / limit),  // Calculate total pages
      totalBooks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
app.use("/api/books", require("./routes/bookRoutes"));
app.use("/api", require("./routes/reviewRoutes"));
app.use("/api/search", require("./routes/searchRoutes"));
app.use("/api/search", require("./routes/searchRoutes"));
// Get book details including average rating and reviews (with pagination)
app.get("/api/books/:id", async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;  // Pagination setup

    // Fetch book details by ID and populate reviews
    const book = await Book.findById(req.params.id).populate({
      path: "reviews",
      populate: { path: "user", select: "username" },
    });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Calculate average rating
    const avgRating =
      book.reviews.reduce((acc, r) => acc + r.rating, 0) / book.reviews.length || 0;

    // Paginate reviews
    const paginatedReviews = book.reviews.slice((page - 1) * limit, page * limit);

    // Send response with book details, average rating, and reviews
    res.json({
      book,
      avgRating,
      reviews: paginatedReviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
