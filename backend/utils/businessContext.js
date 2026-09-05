const Item = require('../models/Item');
const Sale = require('../models/Sale');
const Purchase = require('../models/Purchase');
const Vendor = require('../models/Vendor');

const LOW_STOCK_THRESHOLD = 5;

// Builds one compact, fully-aggregated snapshot of business data for the AI
// assistant - never raw customer PII, never credentials, never the full
// database. Only summarized numbers and product/vendor-level aggregates.
async function buildBusinessContext() {
    const [items, allSales, allPurchases, vendors] = await Promise.all([
        Item.find().lean(),
        Sale.find().lean(),
        Purchase.find().lean(),
        Vendor.find().lean(),
    ]);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const purchaseTotal = (p) => (p.total ?? p.productqty * p.productprice);

    const totalRevenue = allSales.reduce((sum, s) => sum + (s.total || 0), 0);
    const revenueThisMonth = allSales
        .filter((s) => new Date(s.date) >= startOfMonth)
        .reduce((sum, s) => sum + (s.total || 0), 0);
    const revenueToday = allSales
        .filter((s) => new Date(s.date) >= startOfToday)
        .reduce((sum, s) => sum + (s.total || 0), 0);

    const totalPurchaseSpend = allPurchases.reduce((sum, p) => sum + purchaseTotal(p), 0);
    const purchaseSpendThisMonth = allPurchases
        .filter((p) => new Date(p.date) >= startOfMonth)
        .reduce((sum, p) => sum + purchaseTotal(p), 0);

    const revenueByStatus = (status) => allSales.filter((s) => s.paymentstatus === status).reduce((sum, s) => sum + (s.total || 0), 0);

    const salesByProduct = new Map();
    allSales.forEach((s) => {
        const entry = salesByProduct.get(s.productname) || { qty: 0, revenue: 0 };
        entry.qty += s.qty;
        entry.revenue += s.total || 0;
        salesByProduct.set(s.productname, entry);
    });
    const topSellingProducts = [...salesByProduct.entries()]
        .sort((a, b) => b[1].qty - a[1].qty)
        .slice(0, 5)
        .map(([productname, v]) => ({ productname, qtySold: v.qty, revenue: v.revenue }));

    // Profit only counted for sales linked to a known item (post inventory-sync fix).
    const itemById = new Map(items.map((i) => [String(i._id), i]));
    let totalProfit = 0;
    allSales.forEach((s) => {
        if (s.item && itemById.has(String(s.item))) {
            const buyingprice = itemById.get(String(s.item)).buyingprice;
            totalProfit += (s.productprice - buyingprice) * s.qty;
        }
    });

    const inventoryValue = items.reduce((sum, i) => sum + i.buyingprice * i.itemQty, 0);
    const lowStockItems = items
        .filter((i) => i.itemQty <= LOW_STOCK_THRESHOLD)
        .sort((a, b) => a.itemQty - b.itemQty)
        .map((i) => ({ itemname: i.itemname, sku: i.sku, itemQty: i.itemQty, category: i.itemcategory }));
    const outOfStockItems = items.filter((i) => i.itemQty === 0).map((i) => i.itemname);

    const monthlySales = [];
    const monthlyPurchases = [];
    for (let i = 5; i >= 0; i -= 1) {
        const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        const label = start.toLocaleString('default', { month: 'short', year: 'numeric' });
        const salesTotal = allSales
            .filter((s) => { const d = new Date(s.date); return d >= start && d < end; })
            .reduce((sum, s) => sum + (s.total || 0), 0);
        const purchTotal = allPurchases
            .filter((p) => { const d = new Date(p.date); return d >= start && d < end; })
            .reduce((sum, p) => sum + purchaseTotal(p), 0);
        monthlySales.push({ month: label, total: salesTotal });
        monthlyPurchases.push({ month: label, total: purchTotal });
    }

    const vendorGroups = new Map();
    vendors.forEach((v) => {
        const key = (v.vendorname || '').trim().toLowerCase();
        const entry = vendorGroups.get(key) || { vendorname: v.vendorname, totalPurchaseAmount: 0, pendingPayment: 0 };
        entry.totalPurchaseAmount += v.ordertotal || 0;
        if (v.paymentstatus === 'Pending') entry.pendingPayment += v.ordertotal || 0;
        vendorGroups.set(key, entry);
    });
    const vendorSummaries = [...vendorGroups.values()].sort((a, b) => b.totalPurchaseAmount - a.totalPurchaseAmount);

    return {
        generatedAt: now.toISOString(),
        currency: 'INR',
        summary: {
            totalRevenue,
            revenueThisMonth,
            revenueToday,
            totalSalesCount: allSales.length,
            totalPurchaseSpend,
            purchaseSpendThisMonth,
            totalPurchaseCount: allPurchases.length,
            totalProfit,
            inventoryValue,
            totalItems: items.length,
            totalVendorEntries: vendors.length,
            uniqueVendors: vendorSummaries.length,
            activeVendors: vendors.filter((v) => v.status === 'Active').length,
        },
        paymentBreakdown: {
            cash: revenueByStatus('Cash'),
            online: revenueByStatus('Online'),
            pending: revenueByStatus('Pending'),
        },
        topSellingProducts,
        lowStockItems,
        outOfStockItems,
        monthlySales,
        monthlyPurchases,
        topVendorByPurchaseAmount: vendorSummaries[0] || null,
        vendorSummaries: vendorSummaries.slice(0, 10),
    };
}

module.exports = { buildBusinessContext, LOW_STOCK_THRESHOLD };
