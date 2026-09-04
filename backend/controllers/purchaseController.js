const Purchase = require('../models/Purchase');
const asyncHandler = require('../utils/asyncHandler');

exports.addPurchase = asyncHandler(async (req, res) => {
    const { productname, date, productqty, productprice, paymentmod } = req.body;
    if (!productname || !date || !productqty || productprice === undefined || !paymentmod) {
        return res.status(400).json({ message: 'Missing required purchase fields' });
    }

    const purchase = await Purchase.create({ productname, date, productqty, productprice, paymentmod });
    res.status(201).json({ message: 'Purchase added successfully', data: purchase });
});

exports.getAllPurchases = asyncHandler(async (req, res) => {
    const purchases = await Purchase.find().sort({ createdAt: 1 });
    res.status(200).json({ data: purchases });
});

exports.deletePurchase = asyncHandler(async (req, res) => {
    const purchase = await Purchase.findByIdAndDelete(req.params.id);
    if (!purchase) {
        return res.status(404).json({ message: 'Purchase not found' });
    }
    res.status(200).json({ message: 'Purchase deleted successfully' });
});
