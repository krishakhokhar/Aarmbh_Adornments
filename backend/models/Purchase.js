const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema(
    {
        productname: {
            type: String,
            required: true,
            trim: true,
        },
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
        },
        date: {
            type: Date,
            required: true,
        },
        productqty: {
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
            min: 0,
        },
        paymentmod: {
            type: String,
            required: true,
            enum: ['Cash', 'Online', 'Pending'],
        },
    },
    { timestamps: true }
);

purchaseSchema.index({ date: 1 });

module.exports = mongoose.model('Purchase', purchaseSchema);
