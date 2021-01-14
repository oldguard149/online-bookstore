'use strict';
const author = require('./author');
const bill = require('./bill');
const book = require('./book');
const cart = require('./cart');
const genre = require('./genre');
const publisher = require('./publisher');
const user = require('./user');

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