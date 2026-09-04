const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
    {
        vendorname: {
            type: String,
            required: true,
            trim: true,
        },
        contactperson: {
            type: String,
            required: true,
            trim: true,
        },
        contactnumber: {
            type: String,
            required: true,
            trim: true,
        },
        location: {
            type: String,
            trim: true,
        },
        product: {
            type: String,
            trim: true,
        },
        orderdate: {
            type: Date,
        },
        ordertotal: {
            type: Number,
            default: 0,
            min: 0,
        },
        paymentstatus: {
            type: String,
            enum: ['Cash', 'Online', 'Pending'],
        },
        status: {
            type: String,
            enum: ['Active', 'Inactive'],
            default: 'Active',
        },
    },
    { timestamps: true }
);

vendorSchema.index({ vendorname: 1 });

module.exports = mongoose.model('Vendor', vendorSchema);
