const { role } = require("./helper");


function isCustomer(req, res, next) {
    if (req.payload.role !== role.CUSTOMER) {
        return sendErrorResponseMessage(res, ['Only customer can perform this action']);
    }
    next();
}

module.exports = {
    isCustomer
    
}