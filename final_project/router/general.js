const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

public_users.get('/', function (req, res) {
    const getBooks = new Promise((resolve, reject) => {
        resolve(books);
    });
    getBooks.then((bks) => {
        return res.status(200).send(JSON.stringify(bks, null, 4));
    }).catch((err) => {
        return res.status(500).json({ message: err.message });
    });
});

public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const getBook = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject({ status: 404, message: "Book not found" });
        }
    });
    getBook.then((book) => {
        return res.status(200).send(JSON.stringify(book, null, 4));
    }).catch((err) => {
        return res.status(err.status || 500).json({ message: err.message });
    });
});

public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const getBooksByAuthor = new Promise((resolve, reject) => {
        let matchingBooks = [];
        for (let key in books) {
            if (books[key].author.toLowerCase() === author.toLowerCase()) {
                matchingBooks.push(books[key]);
            }
        }
        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject({ status: 404, message: "Author not found" });
        }
    });
    getBooksByAuthor.then((result) => {
        return res.status(200).send(JSON.stringify(result, null, 4));
    }).catch((err) => {
        return res.status(err.status || 500).json({ message: err.message });
    });
});

public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const getBooksByTitle = new Promise((resolve, reject) => {
        let matchingBooks = [];
        for (let key in books) {
            if (books[key].title.toLowerCase() === title.toLowerCase()) {
                matchingBooks.push(books[key]);
            }
        }
        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject({ status: 404, message: "Title not found" });
        }
    });
    getBooksByTitle.then((result) => {
        return res.status(200).send(JSON.stringify(result, null, 4));
    }).catch((err) => {
        return res.status(err.status || 500).json({ message: err.message });
    });
});

public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
