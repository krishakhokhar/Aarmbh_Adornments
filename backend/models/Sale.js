const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema(
    {
        productname: {
            type: String,
            required: true,
            trim: true,
        },
        date: {
            type: Date,
            required: true,
        },
        customername: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            enum: ['Jewelry', 'Rudrax'],
        },
        qty: {
            type: Number,
            required: true,
            min: 1,
        },
        productprice: {
            type: Number,
            required: true,
            min: 0,
        },
        total: {
            type: Number,
            required: true,
            min: 0,
        },
        paymentstatus: {
            type: String,
            required: true,
            enum: ['Cash', 'Online', 'Pending'],
        },
    },
    { timestamps: true }
);

saleSchema.index({ date: 1 });
saleSchema.index({ productname: 1, category: 1 });

module.exports = mongoose.model('Sale', saleSchema);
