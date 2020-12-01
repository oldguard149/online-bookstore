const { findOne, query, countData } = require('../database/db_hepler');
const { preprocessBookList, calculateOffsetForPagination, handleError,
    sendErrorResponseMessage, sendSuccessResponseMessage,
    handleValidationError, isResultEmpty, getQueryParam, isDataNotValidForUpdate } = require('../shared/helper');
const Q = require('../database/query');
const { body, validationResult } = require('express-validator');

exports.publisherList = async (req, res) => {
    try {
        const publisherPerPage = 10;
        const currentPage = parseInt(req.query.page) || 1
        const offset = calculateOffsetForPagination(publisherPerPage, currentPage);
        const count = await countData(Q.publisher.publisherCount);
        const publishers = await query(Q.publisher.publisherList, [offset, publisherPerPage]);
        const totalPage = Math.ceil(count / publisherPerPage);

        const data = { publishers, totalPage };
        res.status(200).send(data);
    } catch (err) {
        handleError(req, 500, res)
    }
};

exports.publisherDetail = async (req, res) => {
    try {
        let booklist = [];
        const bookPerPage = 10;
        const currentPage = parseInt(req.query.page) || 1;
        const currentPublisherId = parseInt(req.params.id);
        const offset = calculateOffsetForPagination(bookPerPage, currentPage);

        const publisher = await findOne(Q.publisher.publisherById, [currentPublisherId]);
        const count = await countData(Q.publisher.bookCountForPublisherDetail, [currentPublisherId]);
        if (count > 0) {
            booklist = preprocessBookList(await query(Q.publisher.bookListForPublisherDetail,
                [currentPublisherId, offset, bookPerPage]));
        }
        const totalPage = Math.ceil(count / bookPerPage);


        const data = { publisher, booklist, totalPage };
        res.status(200).json(data);
    } catch (err) {
        handleError(res, 500, err);
    }
};

exports.publisherCreate = [
    body('name').trim().not().isEmpty().withMessage('Tên không được để trống.').escape(),
    body('email').optional({ checkFalsy: true }).trim().isEmail().withMessage('Email không hợp lệ.').normalizeEmail().escape(),
    body('address').optional({ checkFalsy: true }).trim().escape(),

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

            await query(Q.publisher.createPublisher, [publisher.name, publisher.email, publisher.address]);
            sendSuccessResponseMessage(res, ['Thêm nhà xuất bản mới thành công.']);
        } catch (err) {
            handleError(res, 500, err);
        }
    }
];

exports.publisherSearch = async (req, res) => {
    try {
        const publisherPerPage = parseInt(getQueryParam(req, 'display', 15)); // number of result per page
        const searchText = req.query.text;
        const currentPage = parseInt(getQueryParam(req, 'page', 1));
        const offset = calculateOffsetForPagination(publisherPerPage, currentPage);
        console.log(searchText);
        if (undefined === searchText) {
            return sendErrorResponseMessage(res, ['Vui lòng điền vào từ khóa để tìm kiếm.']);
        }

        const count = await countData(Q.publisher.publisherSearchCount, [searchText]);
        const publishers = await query(Q.publisher.publisherSearch, [searchText, offset, publisherPerPage]);
        const totalPage = Math.ceil(count / publisherPerPage);
        res.json({ success: true, totalPage, publishers });
    } catch (err) {
        handleError(res, 500, err);
    }
}

exports.publisher = async (req, res) => {
    try {
        const publisherId = parseInt(req.params.id);
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
    body('address').optional({ checkFalsy: true }).trim().escape(),

    async (req, res) => {
        const formData = {
            name: req.body.name,
            email: req.body.email || null,
            address: req.body.address || null
        };
        const currentPublisherId = parseInt(req.params.id);
        const validationError = validationResult(req);
        if (!validationError.isEmpty()) {
            return handleValidationError(res, validationError);
        }

        try {
            const oldPub = await findOne(Q.publisher.publisherById, [currentPublisherId]);
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

            await query(Q.publisher.updatePublisher, [formData.name, formData.email, formData.address, currentPublisherId]);
            sendSuccessResponseMessage(res, ['Cập nhật thông tin nhà xuất bản thành công.']);
        } catch (err) {
            const errorMsg = ['Đã xảy ra lỗi ở server. Vui lòng thực hiện lại hoặc liên hệ admin để được trợ giúp.'];
            handleError(res, 500, err, errorMsg);
        }
    }
];

exports.publisherDelete = async (req, res) => {
    try {
        await query(Q.publisher.deletePublisher, [parseInt(req.params.id)]);
        sendSuccessResponseMessage(res, ['Đã xóa nhà xuất bản.']);
    } catch (err) {
        handleError(res, 500, err);
    }
};