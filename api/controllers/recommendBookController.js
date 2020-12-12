const { body, validationResult } = require('express-validator');
const fetch = require('node-fetch');
const { findOne, query, countData } = require('../database/db_hepler');
const { preprocessBookList, calculateOffsetForPagination,
    handleError, isResultEmpty, sendErrorResponseMessage,
    sendSuccessResponseMessage, getQueryParam, handleValidationError } = require('../shared/helper');
const pool = require('../config/pool');
const Q = require('../database/query');
const recommendSystemServerUrl = 'http://localhost:5000';

const recommendIsbnQuery = `
WITH books AS (SELECT b.* FROM books b WHERE b.isbn IN (?) LIMIT ?)
SELECT b.*, p.name as publisher_name, a.fullname as author_name, a.author_id as author_id
FROM books b
LEFT OUTER JOIN (writtens w JOIN authors a ON w.author_id = a.author_id)
ON b.isbn = w.isbn
LEFT OUTER JOIN publishers p
ON b.publisher_id = p.publisher_id;`;

recommendIsbnList = async (isbn) => {
    try {
        const response = await fetch(recommendSystemServerUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isbn: isbn })
        });

        const responseData = await response.json();
        return responseData['isbnlist'];
    } catch (error) {
        console.log('Error');
    }
}

exports.recommendBookList = async (req, res) => {
    try {
        const isbnlist = await recommendIsbnList(req.params.isbn);
        // const sql = mysql2.format(recommendIsbnQuery, [isbnlist, 10])
        const book = preprocessBookList(await query(recommendIsbnQuery, [isbnlist, 10]));
        res.send(book);
    } catch (error) {
        res.send('error')
        console.log(error);
    }
}

