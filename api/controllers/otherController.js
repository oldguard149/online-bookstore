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

exports.search = [
    body('searchtext').not().isEmpty().withMessage('Vui lòng điền tên muốn tìm kiếm').escape(),
    async (req, res) => {
        const validationError = validationResult(req);
        if (!validationError.isEmpty()) {
            handleValidationError(res, validationError);
        } else {
            try {
                const searchText = req.body.searchtext;
                const type = req.body.type; // book || author || genre || publisher 
                const resultPerPage = parseInt(getQueryParam(req, 'pagesize', 15)); // number of result per page
                const currentPage = parseInt(getQueryParam(req, 'page', 0));
                const offset = calculateOffsetForPagination(resultPerPage, currentPage);

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

