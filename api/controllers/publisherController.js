const { findOne, query, countData } = require('../database/db_hepler');
const { preprocessBookList, calculateOffsetForPagination, handleError,
    sendErrorResponseMessage, sendSuccessResponseMessage,
    handleValidationError, isResultEmpty, getQueryParam, isDataNotValidForUpdate } = require('../shared/helper');
const Q = require('../database/query');
const e = require('../shared/errormessages');
const { body, validationResult } = require('express-validator');

exports.publisherList = async (req, res) => {
    try {
        const publisherPerPage = parseInt(req.query.pagesize) || 10;
        const currentPage = parseInt(req.query.page) || 0;
        const offset = calculateOffsetForPagination(publisherPerPage, currentPage);
        const count = await countData(Q.publisher.publisherCount);
        const publishers = await query(Q.publisher.publisherList, [offset, publisherPerPage]);
        const data = { publishers, totalItem: count };
        res.status(200).json(data);
    } catch (err) {
        handleError(req, 500, res)
    }
};

exports.publisherDetail = async (req, res) => {
    try {
        let books = [];
        const bookPerPage = parseInt(req.query.pagesize) || 30;
        const currentPage = parseInt(req.query.page) || 0;
        const publisherId = parseInt(req.params.id);
        const offset = calculateOffsetForPagination(bookPerPage, currentPage);
        if (Number.isNaN(publisherId)) {
            return handleError(res, 400, 'Publisher id is invalid', 'Bad request');
            // return sendErrorResponseMessage(res, ['Publisher id is invalid'])
        }
        const publisher = await findOne(Q.publisher.publisherById, [publisherId]);
        if (isResultEmpty(publisher)) {
            return sendErrorResponseMessage(res, [e.pageNotFound]);
        }
        const count = await countData(Q.publisher.bookCountForPublisherDetail, [publisherId]);
        if (count > 0) {
            books = preprocessBookList(await query(Q.publisher.bookListForPublisherDetail,
                [publisherId, offset, bookPerPage]));
            for (let i = 0; i < books.length; i++) {
                books[i].Authors = books[i].Authors.map(author => author.fullname).join(', ');
            }
        }

        const data = { publisher, booklist: books, totalItems: count };
        res.status(200).json(data);
    } catch (err) {
        handleError(res, 500, err);
    }
};

exports.publisherCreate = [
    body('name').trim().not().isEmpty().withMessage('Tên không được để trống.').escape(),
    body('email').optional({ checkFalsy: true }).trim().isEmail().withMessage('Email không hợp lệ.').normalizeEmail().escape(),

    async (req, res) => {
        const publisher = {
            name: req.body.name,
            email: req.body.email || null,
            address: req.body.address || null
        }
        const validationError = validationResult(req);
        if (!validationError.isEmpty()) {
            return handleValidationError(res, validationError);
        }

        try {
            const checkPublisherName = await findOne(Q.publisher.publisherByName, [publisher.name]);
            if (!isResultEmpty(checkPublisherName)) {
                const error = [`Đã tồn tại nhà xuất bản ${publisher.name} trong hệ thống.`];
                return sendErrorResponseMessage(res, error);
            }

            await query(Q.publisher.createPublisher, [publisher.name, publisher.email]);
            sendSuccessResponseMessage(res, [`Thêm nhà xuất bản mới thành công.`]);
        } catch (err) {
            handleError(res, 500, err);
        }
    }
];

exports.publisherSearch = async (req, res) => {
    try {
        const publisherPerPage = parseInt(getQueryParam(req, 'pagesize', 10)); // number of result per page
        const rawSearchText = req.query.search;
        const currentPage = parseInt(getQueryParam(req, 'page', 0));
        const offset = calculateOffsetForPagination(publisherPerPage, currentPage);
        if (undefined === rawSearchText) {
            return sendErrorResponseMessage(res, ['Vui lòng điền vào từ khóa để tìm kiếm.']);
        }

        const searchText = rawSearchText.replace(/\+/gi, ' ');
        const count = await countData(Q.publisher.publisherSearchCount, [searchText]);
        const publishers = await query(Q.publisher.publisherSearch, [searchText, offset, publisherPerPage]);
        res.json({ success: true, totalItems: count, publishers });
    } catch (err) {
        handleError(res, 500, err);
    }
}

exports.publisher = async (req, res) => {
    try {
        const publisherId = parseInt(req.params.id);
        if (Number.isNaN(publisherId)) {
            return handleError(res, 400, 'Publisher id is invalid', 'Bad request');
            // return sendErrorResponseMessage(res, ['Publisher id is invalid'])
        }
        const publisher = await findOne(Q.publisher.publisherById, [publisherId]);
        if (isResultEmpty(publisher)) {
            sendErrorResponseMessage(res, [`Nhà xuất bản với ${publisherId} không tồn tại trong hệ thống.`]);
        } else {
            res.json({ success: true, publisher });
        }
    } catch (err) {

    }
};

exports.publisherUpdate = [
    body('name').trim().not().isEmpty().withMessage('Vui lòng điền vào tên nhà xuất bản.'),
    body('email').optional({ checkFalsy: true }).trim().isEmail().withMessage('Email không hợp lệ.').normalizeEmail().escape(),

    async (req, res) => {
        const formData = {
            name: req.body.name,
            email: req.body.email || null,
        };
        const publisherId = parseInt(req.params.id);
        const validationError = validationResult(req);
        if (Number.isNaN(publisherId)) {
            return handleError(res, 400, 'Publisher id is invalid', 'Bad request');
            // return sendErrorResponseMessage(res, ['Publisher id is invalid'])
        }
        if (!validationError.isEmpty()) {
            return handleValidationError(res, validationError);
        }

        try {
            const oldPub = await findOne(Q.publisher.publisherById, [publisherId]);
            const checkPublisherName = await findOne(Q.publisher.publisherByName, [formData.name]);
            const checkPublisherEmail = await findOne(Q.publisher.publisherByEmail, [formData.email]);
            // if publisher name has changed, check wether it exist in database or not, similiarly for email            
            if (isDataNotValidForUpdate(checkPublisherName, oldPub.name, formData.name)) {
                const error = [`Đã tồn tại nhà xuất bản ${formData.name} trong hệ thống.`];
                return sendErrorResponseMessage(res, error);
            }

            if (isDataNotValidForUpdate(checkPublisherEmail, oldPub.email, formData.email)) {
                const error = [`Email ${formData.email} đã được sử dụng.`];
                return sendErrorResponseMessage(res, error);
            }

            await query(Q.publisher.updatePublisher, [formData.name, formData.email, publisherId]);
            sendSuccessResponseMessage(res, ['Cập nhật thông tin nhà xuất bản thành công.']);
        } catch (err) {
            const errorMsg = ['Đã xảy ra lỗi ở server. Vui lòng thực hiện lại hoặc liên hệ admin để được trợ giúp.'];
            handleError(res, 500, err, errorMsg);
        }
    }
];

exports.publisherDelete = async (req, res) => {
    try {
        const publisherId = parseInt(req.params.id);
        if (Number.isNaN(publisherId)) {
            return handleError(res, 400, 'Publisher id is invalid', 'Bad request');
            // return sendErrorResponseMessage(res, ['Publisher id is invalid'])
        }
        await query(Q.publisher.deletePublisher, [publisherId]);
        sendSuccessResponseMessage(res, ['Đã xóa nhà xuất bản.']);
    } catch (err) {
        handleError(res, 500, err);
    }
};

exports.publisherForStockImport = async (req, res) => {
    try {
        const publishers = await query(Q.publisher.publisherForStockImport);
        res.json({ success: true, publishers });
    } catch (err) {
        handleError(res, 500, err);
    }
};