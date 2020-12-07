const { body, validationResult } = require('express-validator');
const { findOne, query, countData } = require('../database/db_hepler');
const { preprocessBookList, calculateOffsetForPagination, isDataNotValidForUpdate,
        handleError, isResultEmpty, handleValidationError,
        sendErrorResponseMessage, sendSuccessResponseMessage,
        getQueryParam } = require('../shared/helper');
const Q = require('../database/query');

exports.genreList = async (req, res) => {
    try {
        const genrePerPage = parseInt(req.query.pagesize) || 10;
        const currentPage = parseInt(req.query.page) || 0;
        const offset = calculateOffsetForPagination(genrePerPage, currentPage);
        const count = await countData(Q.genre.genreCount);
        const genres = await query(Q.genre.genreList, [offset, genrePerPage]);
        const data = { genres, totalItem: count };
        res.json(data);
    } catch (err) {
        handleError(res, 500, err)
    }
};

exports.genreDetail = async (req, res) => {
    try {
        let books = [];
        const currentPage = parseInt(req.query.page) || 0;
        const currentGenreId = parseInt(req.params.id);
        const bookPerPage = parseInt(req.query.pagesize) || 30;
        const offset = calculateOffsetForPagination(bookPerPage, currentPage);
        if (isNaN(currentGenreId)) {
            return handleError(res, 404, `${req.params.id} is an invalid id.`, 'Page not found!');
        }
        const genre = await findOne(Q.genre.genreById, [currentGenreId]);
        if (isResultEmpty(genre)) {
            return handleError(res, 404, null, 'Page not found!');
        }
        const count = await countData(Q.genre.bookCountForGenreDetail, [currentGenreId]);
        if (count > 0) {
            books = preprocessBookList(await query(Q.genre.bookListForGenreDetail,
                [currentGenreId, offset, bookPerPage]));
        }
        const data = {
            genre, booklist: books, totalItems: count
        }
        res.send(data);
    } catch (error) {
        handleError(res, 500, error);
    }
};

exports.genreCreate = [
    body('name').trim().not().isEmpty().withMessage('Vui lòng điền vào tên thể loại.').escape(),

    async (req, res) => {
        const validationError = validationResult(req);
        const genreName = req.body.name;
        if (!validationError.isEmpty()) {
            return handleValidationError(res, validationError);
        }

        try {            
            const genre = await findOne(Q.genre.genreByName, [genreName]);
            if (!isResultEmpty(genre)) {
                const error = ['Tên thể loại sách này đã tồn tại trong hệ thống.'];
                sendErrorResponseMessage(res, error);
            } else {
                const result = await query(Q.genre.createGenre, [genreName]); // result is object {insertId, effectedRow}
                if (result.effectedRow !== 0) {
                    const msg = [`Thêm thành công thể loại ${genreName}`];
                    sendSuccessResponseMessage(res, msg);
                } else {
                    throw new Error;
                }
            }
        } catch (err) {
            handleError(res, 500, err, 'Server Error');
        }
    }
];

exports.genreSearch = async (req, res) => {
    try {
        const genrePerPage = parseInt(getQueryParam(req, 'pageSize', 15)); // number of result per page
        const rawSearchText = req.query.search;
        const currentPage = parseInt(getQueryParam(req, 'page', 0));
        const offset = calculateOffsetForPagination(genrePerPage, currentPage);
        if (undefined === rawSearchText) {
            return sendErrorResponseMessage(res, ['Vui lòng điền vào từ khóa để tìm kiếm.']);
        }
        const searchText = String(rawSearchText).replace(/\+/gi, ' ');
        const count = await countData(Q.genre.genreSearchCount, [searchText]);
        const genres = await query(Q.genre.genreSearch, [searchText, offset, genrePerPage]);
        res.json({success: true, totalItems: count, genres});
    } catch (err) {
        handleError(res, 500, err);
    }
};

exports.genre = async (req, res) => {
    try {
        const genreId = parseInt(req.params.id);
        if (Number.isNaN(genreId)) {
            return handleError(res, 400, 'Genre id invalid');
            // return sendErrorResponseMessage(res, ['Genre id is not valid']);
        }
        const genre = await findOne(Q.genre.genreById, [genreId]);
        if (isResultEmpty(genre)) {
            return sendErrorResponseMessage(res, [`Thể loại sách với id ${genreId} không tồn tại trong hệ thống.`]);
        }
        res.json({success: true, genre});
    } catch (err) {
        handleError(res, 500, err);
    }
};

exports.genreUpdate = [
    body('name').trim().not().isEmpty().escape(),

    async (req, res) => {
        try {
            const genreId = parseInt(req.params.id);
            const validationError = validationResult(req);
            const newGenreName = req.body.name;
            if (Number.isNaN(genreId)) {
                return handleError(res, 400, 'Genre id invalid');
                // return sendErrorResponseMessage(res, ['Genre id is not valid']);
            }
            if (!validationError.isEmpty()) {
               return handleValidationError(res, validationError);
            }

            const oldGenre = await findOne(Q.genre.genreById, [genreId]);
            const checkExistGenre = await findOne(Q.genre.genreByName, [newGenreName]);

            if (isDataNotValidForUpdate(checkExistGenre, oldGenre.name, newGenreName)) {
                const error = [`Đã tồn tại thể loại ${newGenreName} trong hệ thống.` ];
                sendErrorResponseMessage(res, error);
            } else {
                await query(Q.genre.updateGenre, [newGenreName, genreId]);
                sendSuccessResponseMessage(res, ['Thông tin thể loại đã được cập nhật.']);
            }
        } catch (err) {
            handleError(res, 500, err, 'Server Error');
        }
    }
];

exports.genreDelete = async (req, res) => {
    try {
        const genreId = parseInt(req.params.id);
        if (Number.isNaN(genreId)) {
            return handleError(res, 400, 'Genre id invalid');
            // return sendErrorResponseMessage(res, ['Genre id is not valid']);
        }
        await query(Q.genre.deleteGerne, [genreId]);
        sendSuccessResponseMessage(res, ['Đã xóa thể loại.']);
    } catch (err) {
        handleError(res, 500, err, 'Server Error');
    }
};