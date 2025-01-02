const express = require('express');
const axios = require('axios');
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
    let fetchBooksPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (books) {
                resolve(books);
            } else {
                reject("An error occurred while fetching the books!");
            }
        }, 2000);
    });

    fetchBooksPromise
        .then((books) => {
            res.send(JSON.stringify({ books }, null, 4));
        })
        .catch((error) => {
            res.status(404).send({ message: error });
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    // Retrieve the isbn parameter from the request URL and send the corresponding book's details
    const isbn = req.params.isbn;

    let fetchBookPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject("Unable to find book!");
            }
        }, 2000);
    });

    fetchBookPromise
        .then((bookDetails) => {
            res.status(200).send(bookDetails);
        })
        .catch((error) => {
            res.status(404).send({ message: error });
        });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    let fetchBooksByAuthor = new Promise((resolve, reject) => {
        setTimeout(() => {
            const bookKeys = Object.keys(books); // Obtain all the keys from the 'books' object
            const booksbyauthor = [];

            for (let key of bookKeys) {
                const book = books[key];
                if (book.author.toLowerCase() === author.toLowerCase()) {
                    booksbyauthor.push({"isbn": key,"title": book.title,"reviews": book.reviews});
                }
            }

            if (booksbyauthor.length > 0) {
                resolve(booksbyauthor);
            } else {
                reject("Unable to find book!");
            }
        }, 2000)})

    fetchBooksByAuthor
        .then((booksbyauthor) => {
            res.status(200).send(JSON.stringify({ booksbyauthor }, null, 4));
        })
        .catch((error) => {
            res.status(404).json({ message: error });
        });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let fetchBooksByTitle = new Promise((resolve, reject) => {
        setTimeout(() => {
            const bookKeys = Object.keys(books); // Obtain all the keys from the 'books' object
            const booksbytitle = [];

            for (let key of bookKeys) {
                const book = books[key];
                if (book.title.toLowerCase() === title.toLowerCase()) {
                    booksbytitle.push({"isbn": key,"author": book.author,"reviews": book.reviews});
                }
            }

            if (booksbytitle.length > 0) {
                resolve(booksbytitle);
            } else {
                reject("Unable to find book!");
            }
        }, 2000)})

    fetchBooksByTitle
        .then((booksbytitle) => {
            res.status(200).send(JSON.stringify({ booksbytitle }, null, 4));
        })
        .catch((error) => {
            res.status(404).json({ message: error });
        });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const reviews = books[isbn].reviews;
    res.send(JSON.stringify(reviews, null, 4));
});

module.exports.general = public_users;
