const Item = require('../models/Item');

// Case-insensitive, exact-name match against an existing inventory item.
// Purchases and Sales must reference a real item so stock can be tracked.
async function resolveItemByName(name, session) {
    const item = await Item.findOne({ itemname: name.trim() })
        .collation({ locale: 'en', strength: 2 })
        .session(session);

    if (!item) {
        const err = new Error(`No inventory item found named "${name}". Add it in Inventory first.`);
        err.statusCode = 400;
        throw err;
    }
    return item;
}

async function increaseItemStock(itemId, qty, session) {
    await Item.findByIdAndUpdate(itemId, { $inc: { itemQty: qty } }, { session });
}

// Atomically checks stock >= qty and decrements in one operation, so
// concurrent sales can never push stock below zero.
async function decreaseItemStockOrThrow(itemId, qty, session) {
    const updated = await Item.findOneAndUpdate(
        { _id: itemId, itemQty: { $gte: qty } },
        { $inc: { itemQty: -qty } },
        { new: true, session }
    );
    if (!updated) {
        const err = new Error('Insufficient stock for this sale.');
        err.statusCode = 400;
        throw err;
    }
    return updated;
}

// Used to reverse a purchase (delete): decrements stock but clamps at 0
// instead of going negative, in case stock was already sold down since.
async function decreaseItemStockClamped(itemId, qty, session) {
    await Item.findByIdAndUpdate(
        itemId,
        [{ $set: { itemQty: { $max: [0, { $subtract: ['$itemQty', qty] }] } } }],
        { session }
    );
}

module.exports = {
    resolveItemByName,
    increaseItemStock,
    decreaseItemStockOrThrow,
    decreaseItemStockClamped,
};
