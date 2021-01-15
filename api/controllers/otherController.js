const { body, validationResult } = require('express-validator');
const fetch = require('node-fetch');
const { findOne, query, countData } = require('../database/db_hepler');
const { preprocessBookList, calculateOffsetForPagination,
    handleError, isResultEmpty, sendErrorResponseMessage,
    sendSuccessResponseMessage, getQueryParam, handleValidationError } = require('../shared/helper');
const pool = require('../config/pool');
const recommendSystemServerUrl = 'http://localhost:5000';

const mysql2 = require('mysql2');

const recommendIsbnQuery = `
WITH books AS (SELECT b.* FROM books b WHERE b.isbn IN (?))
SELECT b.*, p.name as publisher_name, a.fullname as author_name, a.author_id as author_id
FROM books b
LEFT OUTER JOIN (writtens w JOIN authors a ON w.author_id = a.author_id)
ON b.isbn = w.isbn
LEFT OUTER JOIN publishers p
ON b.publisher_id = p.publisher_id;`;

recommendIsbnList = async (isbn, numberOfBook) => {
    try {
        const response = await fetch(recommendSystemServerUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isbn: isbn, number: numberOfBook })
        });

        const responseData = await response.json();
        return responseData['isbnlist'];
    } catch (error) {
        console.log('Error');
    }
}

exports.recommendBookList = async (req, res) => {
    try {
        const numOfBook = parseInt(req.query.number);
        const isbnlist = await recommendIsbnList(req.params.isbn, numOfBook);
        // const sql = mysql2.format(recommendIsbnQuery, [isbnlist, 10])
        const books = preprocessBookList(await query(recommendIsbnQuery, [isbnlist, numOfBook]));
        for (let i = 0; i < books.length; i++) {
            books[i].Authors = books[i].Authors.map(author => author.fullname).join(', ');
        }
        res.json({ success: true, books});
    } catch (error) {
        handleError(res, 500, error);
    }
}

exports.search = [
    // body('searchtext').not().isEmpty().withMessage('Vui lòng điền tên muốn tìm kiếm').escape(),
    async (req, res) => {
        const validationError = validationResult(req);
        if (!validationError.isEmpty()) {
            handleValidationError(res, validationError);
        } else {
            try {
                const searchText = req.query.search;
                const type = req.query.type; // book || author || genre || publisher 
                const resultPerPage = parseInt(getQueryParam(req, 'limit', 10));
                // const resultPerPage = parseInt(req.query.pagesize) || 10;
                const currentPage = parseInt(getQueryParam(req, 'offset', 0));
                const offset = calculateOffsetForPagination(resultPerPage, currentPage);
                console.log(resultPerPage);
                if (prepareObj[type]) { // valid type
                    selectCols = prepareObj[type].selectCols;
                    dbTableName = prepareObj[type].tableName;
                    conditionCol = prepareObj[type].conditionCol;
                    countCol = prepareObj[type].countCol;
                    
                    const searchQuery =
                        `SELECT ${selectCols} FROM ${dbTableName}
                        WHERE ${conditionCol} LIKE CONCAT('%', ?, '%') LIMIT ?, ?;`;

                    const searchCoutQuery =
                        `SELECT COUNT(${countCol}) as count FROM ${dbTableName} 
                        WHERE ${conditionCol} LIKE CONCAT('%', ?, '%');`;

                    const result = await query(searchQuery, [searchText, offset, resultPerPage]);
                    const totalItems = await countData(searchCoutQuery, [searchText]);
                    res.json({ success: true, totalItems, result });
                } else {
                    sendErrorResponseMessage(res, ['Loại tìm kiếm không hợp lệ, vui lòng chọn lại']);
                }
            } catch (err) {
                handleError(res, 500, err);
            }
        }
    }
];

const prepareObj = {
    'book': {
        selectCols: 'isbn, name, image_url',
        tableName: 'books',
        countCol: 'isbn',
        conditionCol: 'name'
    },
    'genre': {
        selectCols: 'genre_id, name',
        tableName: 'genres',
        countCol: 'genre_id',
        conditionCol: 'name'
    },
    'author': {
        selectCols: 'author_id, fullname',
        tableName: 'authors',
        countCol: 'author_id',
        conditionCol: 'fullname'
    },
    'publisher': {
        selectCols: 'publisher_id, name',
        tableName: 'publishers',
        countCol: 'publisher_id',
        conditionCol: 'name'
    }
}

