const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Function to check if the username is valid
const isValid = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    return userswithsamename.length === 0;
}

// Function to check if the user is authenticated
const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return user.username === username && user.password === password;
    });
    return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        };
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization['username']; // Retrieve the username from authorization object
    // Extract isbn parameter and find users with matching email
    const isbn = req.params.isbn;
    let book = books[isbn];
    let bookReviews = book.reviews;
    let userReview = bookReviews[username];
    let review = req.body.review;
    if (userReview) {
        if (review) {
            bookReviews[username] = review;
        }
        return res.status(200).json({ message: `Review for the book ISBN ${isbn} has been updated.` });
    } else {
        if (review) {
            bookReviews[username] = review;
        }
        return res.status(200).json({ message: `Review for the book ISBN ${isbn} has been added.` });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization['username']; // Retrieve the username from authorization object
    const isbn = req.params.isbn;
    delete books[isbn].reviews[username];
    
    return res.status(200).json({ message: `Reviews for the book ISBN ${isbn} posted by the user ${username} deleted.` });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
