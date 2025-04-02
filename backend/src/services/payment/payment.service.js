const orderService = require('../order/order.service');
const userService = require('../user/user.service');
const { Payment } = require('../../models');
const { Order } = require('../../models');

const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config')[env];
const dateFormat = require('dateformat'); 


const createPayment = async (req, res) => {
    const { orderId, amount, paymentMethod, paymentStatus, paymentDate } = req.body;
    console.log(orderId, amount, paymentMethod, paymentStatus, paymentDate);
    const order = await orderService.getOrderById(orderId);
    if (!order) {
        throw new Error('Order not found');
    }


    const payment = await Payment.create({
        orderId,
        amount,
        paymentMethod,
        paymentStatus,
        paymentDate,
    });
    return payment;
}

const getAllPayments = async () => {
    return Payment.findAll();
}

const getPaymentById = async (id) => {
    return Payment.findByPk(id);
}

const getPaymentByUserId = async (id) => {
    const user = await userService.findById(id);
    if (!user) {
        throw new Error('User not found');
    }
    const payment = await Payment.findOne({
        include: [{
            model: Order,
            where: {
                userId: id
            }
        }]
    });
    return payment;
}

const updatePaymentById = async (id, paymentData) => {
    const { orderId, amount, paymentMethod, paymentStatus, paymentDate } = paymentData;
    if (orderId) {
        const order = await orderService.getOrderById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }
    }
    const payment = await Payment.findByPk(id);
    if (!payment) {
        throw new Error('Payment not found');
    }
    await payment.update(paymentData);
    return payment;
}

const deletePaymentById = async (id) => {
    const payment = await Payment.findByPk(id);
    if (!payment) {
        throw new Error('Payment not found');
    }
    await payment.destroy();
    return payment;
}


const createPaymentVNPAY = async (req, res) => {
    var ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    
    var tmnCode = config.vnp_TmnCode;
    var secretKey = config.vnp_HashSecret;
    var vnpUrl = config.vnp_Url;
    var returnUrl = config.vnp_ReturnUrl;

    var date = new Date();
    
    var createDate = dateFormat(date, 'yyyymmddHHmmss');
    var orderId = dateFormat(date, 'HHmmss');
    var amount = req.body.amount;
    var bankCode = req.body.bankCode;
    
    var orderInfo = req.body.orderDescription;
    var orderType = req.body.orderType;
    var locale = req.body.language;
    if(locale === null || locale === '' || locale === undefined){
        locale = 'vn';
    }
    var currCode = 'VND';
    var vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if(bankCode !== null && bankCode !== '' && bankCode !== undefined){
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");     
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    return vnpUrl;
};

function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}



module.exports = {
    createPayment,
    getAllPayments,
    getPaymentById,
    getPaymentByUserId,
    updatePaymentById,
    deletePaymentById,
    createPaymentVNPAY,
}