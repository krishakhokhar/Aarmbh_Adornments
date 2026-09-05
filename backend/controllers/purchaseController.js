const mongoose = require('mongoose');
const Purchase = require('../models/Purchase');
const asyncHandler = require('../utils/asyncHandler');
const { resolveItemByName, increaseItemStock, decreaseItemStockClamped } = require('../utils/inventorySync');

exports.addPurchase = asyncHandler(async (req, res) => {
    const { productname, date, productqty, productprice, paymentmod } = req.body;
    if (!productname || !date || !productqty || productprice === undefined || !paymentmod) {
        return res.status(400).json({ message: 'Missing required purchase fields' });
    }
    if (Number(productqty) < 1) {
        return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }
    if (Number(productprice) < 0) {
        return res.status(400).json({ message: 'Price cannot be negative' });
    }

    const total = Number(productqty) * Number(productprice);

    const session = await mongoose.startSession();
    try {
        let purchase;
        await session.withTransaction(async () => {
            const item = await resolveItemByName(productname, session);
            await increaseItemStock(item._id, Number(productqty), session);
            const created = await Purchase.create(
                [{ productname, date, productqty, productprice, total, paymentmod, item: item._id }],
                { session }
            );
            purchase = created[0];
        });
        res.status(201).json({ message: 'Purchase added successfully', data: purchase });
    } finally {
        await session.endSession();
    }
});

exports.getAllPurchases = asyncHandler(async (req, res) => {
    const purchases = await Purchase.find().sort({ createdAt: 1 });
    res.status(200).json({ data: purchases });
});

exports.deletePurchase = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            const purchase = await Purchase.findByIdAndDelete(req.params.id, { session });
            if (!purchase) {
                const err = new Error('Purchase not found');
                err.statusCode = 404;
                throw err;
            }
            if (purchase.item) {
                await decreaseItemStockClamped(purchase.item, purchase.productqty, session);
            }
        });
        res.status(200).json({ message: 'Purchase deleted successfully' });
    } finally {
        await session.endSession();
    }
});
