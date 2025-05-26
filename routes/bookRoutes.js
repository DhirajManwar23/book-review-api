const express = require("express");
const router = express.Router();
const { getBookDetails, addBook } = require("../controllers/bookController");
const Book = require("../models/Book");
const auth = require("../middlewares/authMiddleware"); // Make sure this path is correct

// POST /api/books – Add a new book (auth required)
router.post("/", auth, addBook);

// GET all books (with pagination + filters)
router.get("/", async (req, res) => {
  try {
    const { author, genre, page = 1, limit = 10 } = req.query;
    const query = {};
    if (author) query.author = { $regex: author, $options: "i" };
    if (genre) query.genre = { $regex: genre, $options: "i" };

    const books = await Book.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const totalBooks = await Book.countDocuments(query);

    res.json({
      books,
      page,
      limit,
      totalPages: Math.ceil(totalBooks / limit),
      totalBooks,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/books/:id – Book details
router.get("/:id", getBookDetails);

module.exports = router;
