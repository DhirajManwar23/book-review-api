const express = require("express");
const router = express.Router();
const { getBookDetails } = require("../controllers/bookController");

// Route to get book details by ID
router.get("/:id", getBookDetails);

module.exports = router;
