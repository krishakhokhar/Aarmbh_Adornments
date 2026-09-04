const Sale = require('../models/Sale');
const Purchase = require('../models/Purchase');
const Vendor = require('../models/Vendor');
const Item = require('../models/Item');
const asyncHandler = require('../utils/asyncHandler');
const { getMonthRange, computeGrowth } = require('../utils/analyticsHelpers');

async function sumSalesTotal(filter = {}) {
    const result = await Sale.aggregate([
        { $match: filter },
        { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    return result[0]?.total || 0;
}

async function sumVendorOrderTotal(filter = {}) {
    const result = await Vendor.aggregate([
        { $match: filter },
        { $group: { _id: null, total: { $sum: '$ordertotal' } } },
    ]);
    return result[0]?.total || 0;
}

// Total revenue across all sales, this month vs last month.
exports.getTotalRevenue = asyncHandler(async (req, res) => {
    const { start: curStart, end: curEnd } = getMonthRange(0);
    const { start: prevStart, end: prevEnd } = getMonthRange(-1);
    const current = await sumSalesTotal({ date: { $gte: curStart, $lt: curEnd } });
    const previous = await sumSalesTotal({ date: { $gte: prevStart, $lt: prevEnd } });
    res.status(200).json({ totalRevenue: current, growthPercentage: computeGrowth(current, previous) });
});

// Revenue from sales that are not still Pending ("confirmed" sales), this month vs last month.
exports.getTotalSalesByStatus = asyncHandler(async (req, res) => {
    const { start: curStart, end: curEnd } = getMonthRange(0);
    const { start: prevStart, end: prevEnd } = getMonthRange(-1);
    const build = (start, end) => ({ date: { $gte: start, $lt: end }, paymentstatus: { $ne: 'Pending' } });
    const current = await sumSalesTotal(build(curStart, curEnd));
    const previous = await sumSalesTotal(build(prevStart, prevEnd));
    res.status(200).json({ totalRevenue: current, growthPercentage: computeGrowth(current, previous) });
});

exports.getOnlinePaymentSales = asyncHandler(async (req, res) => {
    const { start: curStart, end: curEnd } = getMonthRange(0);
    const { start: prevStart, end: prevEnd } = getMonthRange(-1);
    const build = (start, end) => ({ date: { $gte: start, $lt: end }, paymentstatus: 'Online' });
    const current = await sumSalesTotal(build(curStart, curEnd));
    const previous = await sumSalesTotal(build(prevStart, prevEnd));
    res.status(200).json({ totalRevenue: current, growthPercentage: computeGrowth(current, previous) });
});

exports.getCashSales = asyncHandler(async (req, res) => {
    const { start: curStart, end: curEnd } = getMonthRange(0);
    const { start: prevStart, end: prevEnd } = getMonthRange(-1);
    const build = (start, end) => ({ date: { $gte: start, $lt: end }, paymentstatus: 'Cash' });
    const current = await sumSalesTotal(build(curStart, curEnd));
    const previous = await sumSalesTotal(build(prevStart, prevEnd));
    res.status(200).json({ totalRevenue: current, growthPercentage: computeGrowth(current, previous) });
});

exports.getPendingSales = asyncHandler(async (req, res) => {
    const { start: curStart, end: curEnd } = getMonthRange(0);
    const { start: prevStart, end: prevEnd } = getMonthRange(-1);
    const build = (start, end) => ({ date: { $gte: start, $lt: end }, paymentstatus: 'Pending' });
    const current = await sumSalesTotal(build(curStart, curEnd));
    const previous = await sumSalesTotal(build(prevStart, prevEnd));
    res.status(200).json({ totalRevenue: current, growthPercentage: computeGrowth(current, previous) });
});

// Current total stock value (buyingprice * itemQty summed over all items).
// growthPercentage trends the value of items added this month vs last month,
// since stock value has no historical snapshots to compare against.
exports.getInventoryValue = asyncHandler(async (req, res) => {
    const items = await Item.find();
    const totalBuyingPrice = items.reduce((sum, i) => sum + i.buyingprice * i.itemQty, 0);

    const { start: curStart, end: curEnd } = getMonthRange(0);
    const { start: prevStart, end: prevEnd } = getMonthRange(-1);
    const valueThisMonth = items
        .filter((i) => i.createdAt >= curStart && i.createdAt < curEnd)
        .reduce((sum, i) => sum + i.buyingprice * i.itemQty, 0);
    const valueLastMonth = items
        .filter((i) => i.createdAt >= prevStart && i.createdAt < prevEnd)
        .reduce((sum, i) => sum + i.buyingprice * i.itemQty, 0);

    res.status(200).json({ totalBuyingPrice, growthPercentage: computeGrowth(valueThisMonth, valueLastMonth) });
});

exports.getTotalPurchasePrice = asyncHandler(async (req, res) => {
    const sum = async (start, end) => {
        const result = await Purchase.aggregate([
            { $match: { date: { $gte: start, $lt: end } } },
            { $group: { _id: null, total: { $sum: { $multiply: ['$productqty', '$productprice'] } } } },
        ]);
        return result[0]?.total || 0;
    };

    const { start: curStart, end: curEnd } = getMonthRange(0);
    const { start: prevStart, end: prevEnd } = getMonthRange(-1);
    const current = await sum(curStart, curEnd);
    const previous = await sum(prevStart, prevEnd);
    res.status(200).json({ totalPurchasePrice: current, growthPercentage: computeGrowth(current, previous) });
});

exports.getActiveVendorsCount = asyncHandler(async (req, res) => {
    const totalActiveVendors = await Vendor.countDocuments({ status: 'Active' });

    const { start: curStart, end: curEnd } = getMonthRange(0);
    const { start: prevStart, end: prevEnd } = getMonthRange(-1);
    const current = await Vendor.countDocuments({ status: 'Active', createdAt: { $gte: curStart, $lt: curEnd } });
    const previous = await Vendor.countDocuments({ status: 'Active', createdAt: { $gte: prevStart, $lt: prevEnd } });

    res.status(200).json({ totalActiveVendors, growthPercentage: computeGrowth(current, previous) });
});

exports.getVendorPaymentsTotal = asyncHandler(async (req, res) => {
    const totalPayments = await sumVendorOrderTotal({ paymentstatus: { $ne: 'Pending' } });

    const { start: curStart, end: curEnd } = getMonthRange(0);
    const { start: prevStart, end: prevEnd } = getMonthRange(-1);
    const current = await sumVendorOrderTotal({ paymentstatus: { $ne: 'Pending' }, orderdate: { $gte: curStart, $lt: curEnd } });
    const previous = await sumVendorOrderTotal({ paymentstatus: { $ne: 'Pending' }, orderdate: { $gte: prevStart, $lt: prevEnd } });

    res.status(200).json({ totalPayments, growthPercentage: computeGrowth(current, previous) });
});

exports.getVendorPendingPaymentsTotal = asyncHandler(async (req, res) => {
    const totalPendingPayments = await sumVendorOrderTotal({ paymentstatus: 'Pending' });

    const { start: curStart, end: curEnd } = getMonthRange(0);
    const { start: prevStart, end: prevEnd } = getMonthRange(-1);
    const current = await sumVendorOrderTotal({ paymentstatus: 'Pending', orderdate: { $gte: curStart, $lt: curEnd } });
    const previous = await sumVendorOrderTotal({ paymentstatus: 'Pending', orderdate: { $gte: prevStart, $lt: prevEnd } });

    res.status(200).json({ totalPendingPayments, growthPercentage: computeGrowth(current, previous) });
});

// Share of total units sold (within a category) that each item accounts for -
// feeds the Jewelry / Rudrax pie charts on the Dashboard and Reports pages.
exports.getCategorySalesPie = (category) => asyncHandler(async (req, res) => {
    const items = await Item.find({ itemcategory: category });
    const qtyByProduct = await Sale.aggregate([
        { $match: { category } },
        { $group: { _id: '$productname', totalQty: { $sum: '$qty' } } },
    ]);
    const qtyMap = new Map(qtyByProduct.map((q) => [q._id, q.totalQty]));
    const totalSoldAllItems = qtyByProduct.reduce((sum, q) => sum + q.totalQty, 0);

    const data = items.map((item) => {
        const soldQty = qtyMap.get(item.itemname) || 0;
        const percentageSold = totalSoldAllItems > 0 ? (soldQty / totalSoldAllItems) * 100 : 0;
        return { itemname: item.itemname, percentageSold };
    });

    res.status(200).json({ data });
});

exports.getItemQtyBarChart = asyncHandler(async (req, res) => {
    const items = await Item.find().sort({ itemname: 1 });
    const data = items.map((item) => ({ itemname: item.itemname, totalQty: item.itemQty }));
    res.status(200).json({ data });
});

exports.getMonthlySalesChart = asyncHandler(async (req, res) => {
    const MONTHS_TO_SHOW = 6;
    const now = new Date();
    const results = [];

    for (let i = MONTHS_TO_SHOW - 1; i >= 0; i -= 1) {
        const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        const total = await sumSalesTotal({ date: { $gte: start, $lt: end } }); // eslint-disable-line no-await-in-loop
        results.push({ month: start.toLocaleString('default', { month: 'short', year: 'numeric' }), totalSales: total });
    }

    res.status(200).json({ data: results });
});

exports.getTodaysSales = asyncHandler(async (req, res) => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);

    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    const todaysSales = await Sale.find({ date: { $gte: startOfToday, $lt: endOfToday } });
    const totalAmount = todaysSales.reduce((sum, s) => sum + s.total, 0);
    const count = todaysSales.length;

    const yesterdaysTotal = await sumSalesTotal({ date: { $gte: startOfYesterday, $lt: startOfToday } });

    res.status(200).json({ totalAmount, growthPercentage: computeGrowth(totalAmount, yesterdaysTotal), count });
});
