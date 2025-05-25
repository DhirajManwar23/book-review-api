const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
  