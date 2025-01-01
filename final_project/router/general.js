const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Please fill username and password" });
    }
  
    if (username && password) {
      if (isValid(username)) {
        users.push({ "username": username, "password": password });
        return res.status(200).json({ message: "User successfully registered. Now you can login" });
      } else {
        return res.status(404).json({ message: "User already exists!" });
      }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    // Retrieve the isbn parameter from the request URL and send the corresponding book's details
    const isbn = req.params.isbn;
    res.send(books[isbn]);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    // Obtain all the keys from the 'books' object
    const bookKeys = Object.keys(books);

    // Create an array to store the matched books
    const matchedBooks = [];

    // Iterate through the books using the keys
    for (let key of bookKeys) {
        const book = books[key];
        if (book.author.toLowerCase() === author.toLowerCase()) {
            matchedBooks.push(book);
        }
    }

    // If no books are found, return an error message
    if (matchedBooks.length === 0) {
        res.send("Unable to find book!");
    }

    // Return the matched books
    return res.send(JSON.stringify(matchedBooks, null, 4));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    // Obtain all the keys from the 'books' object
    const bookKeys = Object.keys(books);

    // Create an array to store the matched books
    const matchedBooks = [];

    // Iterate through the books using the keys
    for (let key of bookKeys) {
        const book = books[key];
        if (book.title.toLowerCase() === title.toLowerCase()) {
            matchedBooks.push(book);
        }
    }

    // If no books are found, return an error message
    if (matchedBooks.length === 0) {
        res.send("Unable to find book!");
    }

    // Return the matched books
    return res.send(JSON.stringify(matchedBooks, null, 4));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const reviews = books[isbn].reviews;
    res.send(JSON.stringify(reviews, null, 4));
});

module.exports.general = public_users;
