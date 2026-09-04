// Returns the [start, end) Date range for the calendar month `offsetMonths`
// away from the current month (0 = this month, -1 = last month).
exports.getMonthRange = function getMonthRange(offsetMonths = 0) {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() + offsetMonths, 1);
    const end = new Date(now.getFullYear(), now.getMonth() + offsetMonths + 1, 1);
    return { start, end };
};

exports.computeGrowth = function computeGrowth(current, previous) {
    if (!previous) return current > 0 ? 100 : 0;
    return Number((((current - previous) / previous) * 100).toFixed(2));
};
