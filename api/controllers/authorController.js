const { body, validationResult } = require('express-validator');

const { findOne, query, countData } = require('../database/db_hepler');
const { preprocessBookList, calculateOffsetForPagination,
    handleError, isResultEmpty, getQueryParam,
    sendErrorResponseMessage, sendSuccessResponseMessage } = require('../shared/helper');
const Q = require('../database/query');
const e = require('../shared/errormessages');

exports.authorList = async (req, res) => {
    try {
        const currentPage = parseInt(req.query.page) || 0;
        const authorPerPage = parseInt(req.query.pagesize) || 10;
        const offset = calculateOffsetForPagination(authorPerPage, currentPage);
        const count = await countData(Q.author.authorCount);
        const authors = await query(Q.author.authorList, [offset, authorPerPage]);
        res.status(200).json({ authors, totalItem: count });
    } catch (err) {
        handleError(res, 500, err);
    }
}

exports.authorDetail = async (req, res) => {
    try {
        let books = [];
        const currentPage = parseInt(req.query.page) || 0;
        const bookPerPage = parseInt(req.query.pagesize) || 30;
        const authorId = parseInt(req.params.id);
        if (isNaN(authorId)) {
            return handleError(res, 404, null, e.pageNotFound);
        }
        const offset = calculateOffsetForPagination(bookPerPage, currentPage);

        const author = await findOne(Q.author.authorById, [authorId]);
        if (isResultEmpty(author)) {
            return handleError(res, 404, null, e.pageNotFound);
        }
        const count = await countData(Q.author.bookCountForAuthorDetail, [authorId]);
        if (count > 0) {
            books = preprocessBookList(await query(Q.author.bookListForAuthorDetail,
                [authorId, offset, bookPerPage]));
        }
        // convert authors from array to string
        for (let i = 0; i < books.length; i++) {
            books[i].Authors = books[i].Authors.map(author => author.fullname).join(', ');
        }

        res.status(200).json({ author, booklist: books, totalItems: count });
    } catch (error) {
        handleError(res, 500, error);
    }
}

exports.authorSearch = async (req, res) => {
    try {
        const rawSearchText = req.query.search;
        const authorPerPage = parseInt(getQueryParam(req, 'pagesize', 15));
        const currentPage = parseInt(getQueryParam(req, 'page', 0));
        const offset = calculateOffsetForPagination(authorPerPage, currentPage);
        if (undefined === rawSearchText) {
            return sendErrorResponseMessage(res, ['Vui lòng điền vào từ khóa để tìm kiếm.']);
        }

        const searchText = rawSearchText.replace(/\+/gi, ' ');
        const count = await countData(Q.author.authorSearchCount, [searchText]);
        const authors = await query(Q.author.authorSearch, [searchText, offset, authorPerPage]);
        res.json({ success: true, authors, totalItems: count });
    } catch (err) {
        handleError(res, 500, err);
    }
}

exports.author = async (req, res) => {
    try {
        const authorId = parseInt(req.params.id);
        if (isNaN(authorId)) {
            return handleError(res, 404, null, e.pageNotFound);
        }
        const author = await findOne(Q.author.authorInfoForManagement, [authorId]);
        if (isResultEmpty(author)) {
            return sendErrorResponseMessage(res, [`Tác giả với id ${authorId} không tồn tại trong hệ thống.`]);
        }
        res.json({ success: true, author });
    } catch (err) {
        handleError(res, 500, err);
    }
};

exports.authorDeleteData = async (req, res) => {
    try {
        const authorId = parseInt(req.params.id);
        if (isNaN(authorId)) {
            return handleError(res, 404, null, e.pageNotFound);
        }
        const author = await findOne(Q.author.authorInfoForManagement, [authorId]);
        if (isResultEmpty(author)) {
            return sendErrorResponseMessage(res, [`Tác giả với id ${authorId} không tồn tại trong hệ thống.`]);
        }
        const booksByAuthor = await query(Q.auhor.bookListForAuthorDelete, [authorId]);
        res.json({ success: true, author, books: booksByAuthor });
    } catch (error) {
        handleError(res, 500, error);
    }
}

exports.authorUpdate = [
    body('fullname').trim().not().isEmpty().withMessage().escape(),
    body('info').optional({ checkFalsy: true }).trim().escape(),

    async (req, res) => {
        const formData = { fullname: req.body.fullname, info: req.body.info || null };
        const authorId = parseInt(req.params.id);
        if (isNaN(authorId)) {
            return handleError(res, 404, null, e.pageNotFound);
        }
        const validationError = validationResult(req);
        if (!validationError.isEmpty()) {
            return handleValidationError(res, validationError);
        }

        try {
            const oldAuthor = await findOne(Q.author.authorById, [authorId]);
            const newAuthor = await findOne(Q.author.authorByFullname, [formData.fullname]);
            // author fullname changed and new fullname already exist
            if (!isResultEmpty(newAuthor) && newAuthor.fullname !== oldAuthor.fullname) {
                const error = [`Đã tồn tại tác giả tên ${formData.fullname} trong hệ thống.`];
                return sendErrorResponseMessage(res, error);
            }

            await query(Q.author.updateAuthor, [formData.fullname, formData.info, authorId]);
            sendSuccessResponseMessage(res, [`Cập nhật thông tin tác giả thành công.`])
        } catch (err) {
            handleError(res, 500, err);
        }
    }
];

exports.authorDelete = async (req, res) => {
    try {
        const authorId = parseInt(req.params.id);
        if (isNaN(authorId)) {
            return handleError(res, 404, null, e.pageNotFound);
        }
        await query(Q.author.deleteAuthor, [authorId]);
        sendSuccessResponseMessage(res, [`Đã xóa thành công tác giả.`])
    } catch (err) {
        handleError(res, 500, err);
    }
};