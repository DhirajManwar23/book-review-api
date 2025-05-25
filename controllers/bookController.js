const Book = require("../models/Book");
const Review = require("../models/Review");

exports.getBookDetails = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query; // Pagination

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
      book.reviews.reduce((acc, review) => acc + review.rating, 0) / book.reviews.length || 0;

    // Paginate reviews
    const paginatedReviews = book.reviews.slice((page - 1) * limit, page * limit);

    // Send response
    res.json({
      book,
      avgRating,
      reviews: paginatedReviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};



exports.addBook = async (req, res) => {
  const book = new Book(req.body);
  await book.save();
  res.status(201).json(book);
};

exports.getBooks = async (req, res) => {
  const { author, genre, page = 1, limit = 10 } = req.query;
  const query = {};
  if (author) query.author = author;
  if (genre) query.genre = genre;
  const books = await Book.find(query)
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.json(books);
};

exports.getBookById = async (req, res) => {
  const book = await Book.findById(req.params.id).populate({
    path: "reviews",
    populate: { path: "user", select: "username" },
  });
  const avgRating =
    book.reviews.reduce((acc, r) => acc + r.rating, 0) / book.reviews.length || 0;
  res.json({ book, avgRating });
};

exports.searchBooks = async (req, res) => {
  const q = req.query.q;
  const books = await Book.find({
    $or: [
      { title: { $regex: q, $options: "i" } },
      { author: { $regex: q, $options: "i" } },
    ],
  });
  res.json(books);
};
