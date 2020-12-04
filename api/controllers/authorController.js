const { body, validationResult } = require('express-validator');

const { findOne, query, countData } = require('../database/db_hepler');
const { preprocessBookList, calculateOffsetForPagination,
    handleError, isResultEmpty, getQueryParam, 
    sendErrorResponseMessage, sendSuccessResponseMessage } = require('../shared/helper');
const Q = require('../database/query');


exports.authorList = async (req, res) => {
    try {
        const currentPage = parseInt(req.query.page) || 0;
        const authorPerPage = parseInt(req.query.pagesize) || 10;
        const offset = calculateOffsetForPagination(authorPerPage, currentPage);
        const count = await countData(Q.author.authorCount);
        const authors = await query(Q.author.authorList, [offset, authorPerPage]);
        // const totalPage = Math.ceil(count / authorPerPage);
        const data = {
            authors, totalItem: count
        }
        res.status(200).json(data);
    } catch (err) {
        handleError(res, 500, err);
    }
}

exports.authorDetail = async (req, res) => {
    try {
        let booklist = [];
        const currentPage = parseInt(req.query.page) || 0;
        const bookPerPage = parseInt(req.query.pagesize) || 30;
        const currentAuthorId = parseInt(req.params.id);
        if (isNaN(currentAuthorId)) {
            return handleError(res, 404, null, 'Page not found!');
        }
        const offset = calculateOffsetForPagination(bookPerPage, currentPage);

        const author = await findOne(Q.author.authorById, [currentAuthorId]);
        if (isResultEmpty(author)) {
            return handleError(res, 404, null, 'Page not found!');
        }
        const count = await countData(Q.author.bookCountForAuthorDetail, [currentAuthorId]);
        if (count > 0) {
            booklist = preprocessBookList(await query(Q.author.bookListForAuthorDetail,
                [currentAuthorId, offset, bookPerPage]));
        }
        // convert authors from array to string
        for (let i = 0; i < booklist.length; i++) {
            booklist[i].Authors = booklist[i].Authors.map(author => author.fullname).join(', ');
        }

        const data = { author, booklist, totalItems: count };
        res.status(200).json(data);
    } catch (error) {
        handleError(res, 500, error);
    }
}

exports.authorSearch = async (req, res) => {
    try {
        const searchText = req.query.text;
        const authorPerPage = parseInt(getQueryParam(req, 'display', 15));
        const currentPage = parseInt(getQueryParam(req, 'page', 1));
        const offset = calculateOffsetForPagination(authorPerPage, currentPage);
        if (undefined === searchText) {
            return sendErrorResponseMessage(res, ['Vui lòng điền vào từ khóa để tìm kiếm.']);
        }

        const count = await countData(Q.author.authorSearchCount, [searchText]);
        const authors = await query(Q.author.authorSearch, [searchText, offset, authorPerPage]);
        const totalPage = Math.ceil(count / authorPerPage);
        res.json({ success: true, authors, totalPage });
    } catch (err) {
        handleError(res, 500, err);
    }
}

exports.author = async (req, res) => {
    try {
        const authorId = parseInt(req.params.id);
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
        const currentAuthorId = parseInt(req.params.id);
        const author = await findOne(Q.author.authorInfoForManagement, [currentAuthorId]);
        if (isResultEmpty(author)) {
            return sendErrorResponseMessage(res, [`Tác giả với id ${authorId} không tồn tại trong hệ thống.`]);
        }
        const booksByAuthor = await query(Q.auhor.bookListForAuthorDelete, [currentAuthorId]);
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
        const currentAuthorId = parseInt(req.params.id);
        const validationError = validationResult(req);
        if (!validationError.isEmpty()) {
            return handleValidationError(res, validationError);
        }

        try {
            const oldAuthor = await findOne(Q.author.authorById, [currentAuthorId]);
            const newAuthor = await findOne(Q.author.authorByFullname, [formData.fullname]);
            // author fullname changed and new fullname already exist
            if (!isResultEmpty(newAuthor) && newAuthor.fullname !== oldAuthor.fullname) {
                const error = [`Đã tồn tại tác giả tên ${formData.fullname} trong hệ thống.`];
                return sendErrorResponseMessage(res, error);
            }

            await query(Q.author.updateAuthor, [formData.fullname, formData.info, currentAuthorId]);
            sendSuccessResponseMessage(res, [`Cập nhật thông tin tác giả thành công.`])
        } catch (err) {
            handleError(res, 500, err);
        }
    }
];

exports.authorDelete = async (req, res) => {
    try {
        await query(Q.author.deleteAuthor, [parseInt(req.params.id)]);
        sendSuccessResponseMessage(res, [`Đã xóa thành công tác giả.`])
    } catch (err) {
        handleError(res, 500, err);
    }
};