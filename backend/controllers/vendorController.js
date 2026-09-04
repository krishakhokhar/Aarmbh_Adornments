const Vendor = require('../models/Vendor');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllVendors = asyncHandler(async (req, res) => {
    const vendors = await Vendor.find().sort({ createdAt: 1 });
    res.status(200).json({ data: vendors });
});

exports.createVendor = asyncHandler(async (req, res) => {
    const { vendorname, contactperson, contactnumber } = req.body;
    if (!vendorname || !contactperson || !contactnumber) {
        return res.status(400).json({ message: 'Missing required vendor fields' });
    }

    const vendor = await Vendor.create(req.body);
    res.status(201).json({ message: 'Vendor created successfully', data: vendor });
});

exports.updateVendor = asyncHandler(async (req, res) => {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!vendor) {
        return res.status(404).json({ message: 'Vendor not found' });
    }
    res.status(200).json({ message: 'Vendor updated successfully', data: vendor });
});

exports.deleteVendor = asyncHandler(async (req, res) => {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) {
        return res.status(404).json({ message: 'Vendor not found' });
    }
    res.status(200).json({ message: 'Vendor deleted successfully' });
});
