'use strict';
const author = require('./author_query');
const bill = require('./bill_query');
const book = require('./book_query');
const cart = require('./cart_query');
const genre = require('./genre_query');
const publisher = require('./publisher_query');
const user = require('./user_query');

//------------------------------------------ LAYOUTS ------------------------------------------
const startTransaction = `START TRANSACTION;`;
const commit = `COMMIT;`;
const rollback = `ROLLBACK;`;

const genreForSidenav =
    `SELECT g.genre_id, g.name, (SELECT COUNT(*) FROM books b WHERE b.genre_id = g.genre_id) AS bookcount
FROM genres g
ORDER BY bookcount DESC
LIMIT 5;`;

const publisherForSidenav =
    `SELECT p.publisher_id, p.name, (SELECT COUNT(*) FROM books b WHERE b.publisher_id = p.publisher_id) AS bookcount
FROM publishers p
ORDER BY bookcount DESC
LIMIT 5;`;

const authorForSidenav =
    `SELECT a.author_id, a.fullname, (SELECT COUNT(*) FROM writtens w WHERE w.author_id = a.author_id) AS bookcount
FROM authors a
ORDER BY bookcount DESC
LIMIT 5;`

//------------------------------------------ RECOVER PASSWORD ------------------------------------------




module.exports = {
    startTransaction,
    commit,
    rollback,
    genreForSidenav,
    publisherForSidenav,
    authorForSidenav,

    genre,
    publisher,
    author,
    book,
    cart,
    bill,
    user
}