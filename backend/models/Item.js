const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
    {
        itemname: {
            type: String,
            required: true,
            trim: true,
        },
        sku: {
            type: String,
            trim: true,
            unique: true,
            sparse: true,
        },
        itemcategory: {
            type: String,
            required: true,
            enum: ['Jewelry', 'Rudrax'],
        },
        buyingprice: {
            type: Number,
            required: true,
            min: 0,
        },
        sellingprice: {
            type: Number,
            required: true,
            min: 0,
        },
        itemQty: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        status: {
            type: String,
            enum: ['In Stock', 'Low Stock', 'Out Of Stock'],
            default: 'In Stock',
        },
    },
    { timestamps: true }
);

itemSchema.index({ itemname: 1 });

module.exports = mongoose.model('Item', itemSchema);
