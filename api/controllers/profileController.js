const { sendSuccessResponseMessage, handleError, handleValidationError,
    role, isResultEmpty, sendErrorResponseMessage, isDataNotValidForUpdate } = require('../shared/helper');
const { query, findOne } = require('../database/db_hepler');
const Q = require('../database/query');
const { body, validationResult } = require('express-validator');

exports.updateCustomerProfile = [
    body('fullname').notEmpty().withMessage('Please fill in your full name'),
    body('phoneNumber').notEmpty().withMessage('Please fill in your phone number'),
    body('address').notEmpty().withMessage('Address is required for delivering'),

    async (req, res) => {
        const validationError = validationResult(req);
        if (!validationError.isEmpty()) {
            return handleValidationError(res, validationError);
        }
        try {
            const customerId = parseInt(req.payload.id);
            const customerInfo = {
                fullname: req.body['fullname'],
                phoneNumber: req.body['phoneNumber'],
                address: req.body['address']
            }
            const result = await query(Q.user.updateCustomerInfo,
                [customerInfo.fullname, customerInfo.phoneNumber, customerInfo.address, customerId]);
            sendSuccessResponseMessage(res, ['Customer information has been updated.']);
        } catch (err) {
            handleError(res, 500, err);
        }
    }
];

exports.updateEmployeeProfile = [
    body('fullname').notEmpty().withMessage('Fill name'),
    body('phone-number').escape(),
    body('identity-number').notEmpty().withMessage('Fill identity number'),

    async (req, res) => {
        const validationError = validationResult(req);
        if (!validationError.isEmpty()) {
            return handleValidationError(res, validationError);
        }
        try {
            const empId = parseInt(req.payload.id);
            const newIdentityNumber = req.body['identity-number'];
            const newFullname = req.body['fullname'];
            const newPhoneNumber = req.body['phone-number'];
            const oldEmp = await findOne(Q.user.employeeById, [empId]);
            const empWithNewIdentityNumber = await findOne(Q.user.employeeByIdentityNumber, [newIdentityNumber]);
            const empWithNewPhoneNumber = await findOne(Q.user.employeeByPhoneNumber, [newPhoneNumber]);
            
            if (isDataNotValidForUpdate(empWithNewIdentityNumber, oldEmp.identity_nerm, newIdentityNumber)) {
                return sendErrorResponseMessage(res, ['identity number has been use, please check again']);
            }
            if (isDataNotValidForUpdate(empWithNewPhoneNumber, oldEmp.phone_number, newPhoneNumber)) {
                return sendErrorResponseMessage(res, ['phone number has been use.']);
            }

            const result = await query(Q.user.updateEmployeeProfile, 
                [newFullname, newIdentityNumber, newPhoneNumber, empId]);
            sendSuccessResponseMessage(res, ['Profile info has been updated']);
        } catch (err) {
            handleError(res, 500, err);
        }
    }
]


exports.getInfo = async (req, res) => {
    try {
        const userId = parseInt(req.payload.id);
        const userRole = req.payload.role;
        let user;
        if (userRole === role.CUSTOMER) {
            user = await findOne(Q.user.customerById, [userId]);
        } else {
            user = await findOne(Q.user.employeeProfileData, [userId]);
        }

        if (isResultEmpty(user)) {
            sendErrorResponseMessage(res, ['User not found']);
        } else {
            res.json({ success: true, user});
        }
    } catch (err) {
        handleError(res, 500, err);
    }
};

exports.updatePassword = [
    body('new-password').isEmpty().withMessage('Please fill in password for changed'),
    async (req, res) => {
        try {
            const rawPassword = req.body['new-password'];
            const userId = parseInt(req.payload.id);
            const userRole = req.payload.role;
            const hashedPassword = await getHashPassword(rawPassword);
            let result;
            if (userRole === role.CUSTOMER) {
                result = await query(Q.user.updateCustomerPassword, [hashedPassword, userId]);
            } else { 
                result = await query(Q.user.updateEmployeePassword, [hashedPassword, userId]);
            }

            if (result.affectedRow !== 0) {
                sendSuccessResponseMessage(res, ['New passowrd has been updated.']);
            } else {
                sendErrorResponseMessage(res, ['There are some issues occured. Please try again later.']);
            }
        } catch (err) {
            handleError(res, 500, err);
        }
    }
]