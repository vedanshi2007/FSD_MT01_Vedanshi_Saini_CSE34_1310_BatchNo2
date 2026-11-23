const express = require('express');

const app = express();

app.use(express.json());

let books = [
    {
        id: 101,
        title: "Wings of Fire",
        author: "A.P.J. Abdul Kalam",
        genre: "Autobiography",
        publishedYear: 1999,
        available: true
    },
    {
        id: 102,
        title: "The Alchemist",
        author: "Paulo Coelho",
        genre: "Fiction",
        publishedYear: 1988,
        available: true
    },
    {
        id: 103,
        title: "Harry Potter",
        author: "J.K. Rowling",
        genre: "Fantasy",
        publishedYear: 1997,
        available: false
    }
];

// GET all books
app.get('/api/books', (req, res) => {
    res.status(200).json(books);
});

// POST a new book
app.post('/api/books', (req, res) => {
    const { title, author, genre, publishedYear, available } = req.body;

    if (
        typeof title !== 'string' || title.trim() === '' ||
        typeof author !== 'string' || author.trim() === '' ||
        typeof genre !== 'string' || genre.trim() === '' ||
        typeof publishedYear !== 'number' ||
        typeof available !== 'boolean'
    ) {
        return res.status(400).json({ message: "Invalid input" });
    }

    const newBook = {
        id: Math.max(...books.map(book => book.id), 100) + 1,
        title,
        author,
        genre,
        publishedYear,
        available
    };

    books.push(newBook);
    res.status(201).json(newBook);
});

// GET a book by ID
app.get('/api/books/:id', (req, res) => {
    const id = Number(req.params.id);
    const book = books.find(book => book.id === id);

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
});

// PUT update a book
app.put('/api/books/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = books.findIndex(book => book.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Book not found" });
    }

    const { title, author, genre, publishedYear, available } = req.body;

    if (
        typeof title !== 'string' || title.trim() === '' ||
        typeof author !== 'string' || author.trim() === '' ||
        typeof genre !== 'string' || genre.trim() === '' ||
        typeof publishedYear !== 'number' ||
        typeof available !== 'boolean'
    ) {
        return res.status(400).json({ message: "Invalid input" });
    }

    books[index] = {
        id,
        title,
        author,
        genre,
        publishedYear,
        available
    };

    res.status(200).json(books[index]);
});

// DELETE a book
app.delete('/api/books/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = books.findIndex(book => book.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Book not found" });
    }

    books.splice(index, 1);
    res.status(200).json({ message: "Book deleted successfully" });
});

// FILTER books by author
app.get('/api/books/filter', (req, res) => {
    const author = req.query.author;

    if (!author) {
        return res.status(400).json({ message: "Author query parameter is required" });
    }

    const result = books.filter(book =>
        book.author.toLowerCase().includes(author.toLowerCase())
    );

    res.status(200).json(result);
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
