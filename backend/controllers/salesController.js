const Sale = require('../models/Sale');
const asyncHandler = require('../utils/asyncHandler');

exports.addSale = asyncHandler(async (req, res) => {
    const { productname, date, customername, category, qty, productprice, paymentstatus } = req.body;
    if (!productname || !date || !customername || !category || !qty || productprice === undefined || !paymentstatus) {
        return res.status(400).json({ message: 'Missing required sale fields' });
    }

    const total = Number(qty) * Number(productprice);
    const sale = await Sale.create({ productname, date, customername, category, qty, productprice, total, paymentstatus });
    res.status(201).json({ message: 'Sale added successfully', data: sale });
});

exports.getAllSales = asyncHandler(async (req, res) => {
    const sales = await Sale.find().sort({ createdAt: 1 });
    res.status(200).json({ data: sales });
});

exports.updateSale = asyncHandler(async (req, res) => {
    const update = { ...req.body };
    if (update.qty !== undefined && update.productprice !== undefined) {
        update.total = Number(update.qty) * Number(update.productprice);
    }

    const sale = await Sale.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!sale) {
        return res.status(404).json({ message: 'Sale not found' });
    }
    res.status(200).json({ message: 'Sale updated successfully', data: sale });
});

exports.getSaleById = asyncHandler(async (req, res) => {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
        return res.status(404).json({ message: 'Sale not found' });
    }
    res.status(200).json({ data: sale });
});

exports.deleteSale = asyncHandler(async (req, res) => {
    const sale = await Sale.findByIdAndDelete(req.params.id);
    if (!sale) {
        return res.status(404).json({ message: 'Sale not found' });
    }
    res.status(200).json({ message: 'Sale deleted successfully' });
});
