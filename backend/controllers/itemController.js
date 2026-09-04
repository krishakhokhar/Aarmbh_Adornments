const Item = require('../models/Item');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllItems = asyncHandler(async (req, res) => {
    const items = await Item.find().sort({ createdAt: 1 });
    res.status(200).json({ message: 'Items fetched successfully!', data: items });
});

exports.addItem = asyncHandler(async (req, res) => {
    const { itemname, itemcategory, buyingprice, sellingprice, itemQty, status } = req.body;
    if (!itemname || !itemcategory || buyingprice === undefined || sellingprice === undefined || itemQty === undefined) {
        return res.status(400).json({ message: 'Missing required item fields' });
    }

    const item = await Item.create({ itemname, itemcategory, buyingprice, sellingprice, itemQty, status });
    res.status(201).json({ message: 'Item created successfully!', data: item });
});

exports.updateItem = asyncHandler(async (req, res) => {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) {
        return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item updated successfully!', data: item });
});

exports.getItemById = asyncHandler(async (req, res) => {
    const item = await Item.findById(req.params.id);
    if (!item) {
        return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item fetched successfully!', data: item });
});

exports.deleteItem = asyncHandler(async (req, res) => {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
        return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully!' });
});

exports.getAllItemNames = asyncHandler(async (req, res) => {
    const names = await Item.distinct('itemname');
    res.status(200).json({ data: names });
});
