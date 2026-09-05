const mongoose = require('mongoose');
const Sale = require('../models/Sale');
const asyncHandler = require('../utils/asyncHandler');
const { resolveItemByName, increaseItemStock, decreaseItemStockOrThrow } = require('../utils/inventorySync');

exports.addSale = asyncHandler(async (req, res) => {
    const { productname, date, customername, category, qty, productprice, paymentstatus } = req.body;
    if (!productname || !date || !customername || !category || !qty || productprice === undefined || !paymentstatus) {
        return res.status(400).json({ message: 'Missing required sale fields' });
    }
    if (Number(qty) < 1) {
        return res.status(400).json({ message: 'Quantity must be at least 1' });
    }
    if (Number(productprice) < 0) {
        return res.status(400).json({ message: 'Product price cannot be negative' });
    }

    const total = Number(qty) * Number(productprice);

    const session = await mongoose.startSession();
    try {
        let sale;
        await session.withTransaction(async () => {
            const item = await resolveItemByName(productname, session);
            await decreaseItemStockOrThrow(item._id, Number(qty), session);
            const created = await Sale.create(
                [{ productname, date, customername, category, qty, productprice, total, paymentstatus, item: item._id }],
                { session }
            );
            sale = created[0];
        });
        res.status(201).json({ message: 'Sale added successfully', data: sale });
    } finally {
        await session.endSession();
    }
});

exports.getAllSales = asyncHandler(async (req, res) => {
    const sales = await Sale.find().sort({ createdAt: 1 });
    res.status(200).json({ data: sales });
});

exports.updateSale = asyncHandler(async (req, res) => {
    const update = { ...req.body };
    const newQty = update.qty !== undefined ? Number(update.qty) : undefined;
    const newPrice = update.productprice !== undefined ? Number(update.productprice) : undefined;

    if (newQty !== undefined && newQty < 1) {
        return res.status(400).json({ message: 'Quantity must be at least 1' });
    }
    if (newPrice !== undefined && newPrice < 0) {
        return res.status(400).json({ message: 'Product price cannot be negative' });
    }
    if (newQty !== undefined && newPrice !== undefined) {
        update.total = newQty * newPrice;
    }

    const session = await mongoose.startSession();
    try {
        let sale;
        await session.withTransaction(async () => {
            const existing = await Sale.findById(req.params.id).session(session);
            if (!existing) {
                const err = new Error('Sale not found');
                err.statusCode = 404;
                throw err;
            }

            const newProductName = update.productname || existing.productname;
            const newItem = await resolveItemByName(newProductName, session);
            const effectiveNewQty = newQty !== undefined ? newQty : existing.qty;

            if (existing.item && String(existing.item) === String(newItem._id)) {
                const delta = effectiveNewQty - existing.qty;
                if (delta > 0) {
                    await decreaseItemStockOrThrow(newItem._id, delta, session);
                } else if (delta < 0) {
                    await increaseItemStock(newItem._id, -delta, session);
                }
            } else {
                if (existing.item) {
                    await increaseItemStock(existing.item, existing.qty, session);
                }
                await decreaseItemStockOrThrow(newItem._id, effectiveNewQty, session);
            }

            update.item = newItem._id;
            sale = await Sale.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true, session });
        });
        res.status(200).json({ message: 'Sale updated successfully', data: sale });
    } finally {
        await session.endSession();
    }
});

exports.getSaleById = asyncHandler(async (req, res) => {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
        return res.status(404).json({ message: 'Sale not found' });
    }
    res.status(200).json({ data: sale });
});

exports.deleteSale = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            const sale = await Sale.findByIdAndDelete(req.params.id, { session });
            if (!sale) {
                const err = new Error('Sale not found');
                err.statusCode = 404;
                throw err;
            }
            if (sale.item) {
                await increaseItemStock(sale.item, sale.qty, session);
            }
        });
        res.status(200).json({ message: 'Sale deleted successfully' });
    } finally {
        await session.endSession();
    }
});
