import React, { useState, useEffect } from 'react'
import { Card, CardContent, Typography, Box } from '@mui/material';
import { DollarSign, ShoppingBag, PackageOpen, EthernetPort, HandCoins, ScrollText, Users, ChartNoAxesCombined, ChartCandlestick, Clock, Wallet } from 'lucide-react';
import axios from 'axios';
import CountUp from 'react-countup';
import API from '../../../Server';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import AarmbhAI from './AarmbhAI';

const Dashboard = () => {
    // total Revenue
    const [data, setData] = useState({
        totalRevenue: 0,
        growthPercentage: 0
    });

    useEffect(() => {
        axios.get(API.getTotalRevenuedata)
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error("Error fetching revenue data:", error);
            });
    }, []);

    const isPositive = data.growthPercentage >= 0;

    // sales Data

    const [salesData, setSalesData] = useState({
        totalRevenue: 0,
        growthPercentage: 0
    });

    useEffect(() => {
        axios.get(API.getTotalSalesdata)
            .then(response => {
                setSalesData(response.data);
            })
            .catch(error => {
                console.error("Error fetching sales data:", error);
            });
    }, []);

    const isSalesGrowthPositive = salesData.growthPercentage >= 0;

    // online Payment Data
    const [onlineData, setOnlineData] = useState({
        totalRevenue: 0,
        growthPercentage: 0
    });

    useEffect(() => {
        axios.get(API.getonlinepaymentsalesdata)
            .then(response => {
                setOnlineData(response.data);
            })
            .catch(error => {
                console.error("Error fetching online payment data:", error);
            });
    }, []);

    const isOnlineGrowthPositive = onlineData.growthPercentage >= 0;

    // cash Data

    const [cashData, setCashData] = useState({
        totalRevenue: 0,
        growthPercentage: 0
    });

    useEffect(() => {
        axios.get(API.getsalescashdata)
            .then(response => {
                setCashData(response.data);
            })
            .catch(error => {
                console.error("Error fetching cash payment data:", error);
            });
    }, []);

    const isCashGrowthPositive = cashData.growthPercentage >= 0;

    // pending data

    const [pendingData, setPendingData] = useState({
        totalRevenue: 0,
        growthPercentage: 0
    });

    useEffect(() => {
        axios.get(API.getsalespendingdata)
            .then(response => {
                setPendingData(response.data);
            })
            .catch(error => {
                console.error("Error fetching pending payment data:", error);
            });
    }, []);

    const isPendingGrowthPositive = pendingData.growthPercentage >= 0;

    // inventory data

    const [inventoryData, setInventoryData] = useState({
        totalRevenue: 0,
        growthPercentage: 0
    });

    useEffect(() => {
        axios.get(API.getinventorydata)
            .then(response => {
                console.log("Inventory API data:", response.data);
                setInventoryData(response.data);
            })
            .catch(error => {
                console.error("Error fetching inventory data:", error);
            });
    }, []);

    const isInventoryGrowthPositive = inventoryData.growthPercentage >= 0;

    // get all purchase data
    const [purchaseData, setPurchaseData] = useState({
        totalPurchasePrice: 0,
        growthPercentage: 0
    });

    useEffect(() => {
        axios.get(API.getallpurchasedata)
            .then(response => {
                setPurchaseData(response.data);
            })
            .catch(error => {
                console.error("Error fetching total purchase data:", error);
            });
    }, []);

    const isPurchaseGrowthPositive = purchaseData.growthPercentage >= 0;

    // get all vendores

    const [vendorData, setVendorData] = useState({
        totalActiveVendors: 0,
        growthPercentage: 0
    });

    useEffect(() => {
        axios.get(API.getallVendoresdata)
            .then(response => {
                setVendorData(response.data);
            })
            .catch(error => {
                console.error("Error fetching active vendors data:", error);
            });
    }, []);

    const isVendorGrowthPositive = vendorData.growthPercentage >= 0;

    // vendore total

    const [vendorPaymentData, setVendorPaymentData] = useState({
        totalPayments: 0,
        growthPercentage: 0
    });

    useEffect(() => {
        axios.get(API.getallVendorestotalpaymentdata)
            .then(response => {
                setVendorPaymentData(response.data);
            })
            .catch(error => {
                console.error("Error fetching vendor payment data:", error);
            });
    }, []);

    const isGrowthPositive = vendorPaymentData.growthPercentage >= 0;

    // pending vendores payment

    const [pendingVendorData, setPendingVendorData] = useState({
        totalPendingPayments: 0,
        growthPercentage: 0
    });

    useEffect(() => {
        axios.get(API.getallVendorestotalpendingdata)
            .then(response => {
                setPendingVendorData(response.data);
            })
            .catch(error => {
                console.error("Error fetching pending vendor payments:", error);
            });
    }, []);

    const isPendingGrowthPositive1 = pendingVendorData.growthPercentage >= 0;

    // Pie Chart jwelery
    const [pieData, setPieData] = useState([]);

    useEffect(() => {
        axios.get(API.getalljeweldataonPiechart)
            .then((response) => {
                const salesData = response.data.data;

                // Use only items with percentageSold > 0
                const transformed = salesData
                    .filter(item => item.percentageSold > 0)
                    .map((item, index) => ({
                        id: index,
                        value: parseFloat(item.percentageSold.toFixed(2)),
                        label: item.itemname,
                    }));

                setPieData(transformed);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const size = {
        width: 500,
        height: 400,
    };

    // Rudrax data on pie

    const [rudraxChartData, setRudraxChartData] = useState([]);

    useEffect(() => {
        axios.get(API.getallRudraxdataonPiechart)
            .then((res) => {
                const rudraxData = res.data.data;

                const filteredRudrax = rudraxData
                    .filter(product => product.percentageSold > 0)
                    .map((product, idx) => ({
                        id: idx,
                        value: parseFloat(product.percentageSold.toFixed(2)),
                        label: product.itemname,
                    }));

                setRudraxChartData(filteredRudrax);
            })
            .catch((err) => {
                console.error('Failed to fetch Rudrax sales data:', err);
            });
    }, []);

    const chartSize = {
        width: 500,
        height: 400,
    };

    const [TodaysalesData, setTodaySalesData] = useState({
        totalAmount: 0,
        growthPercentage: 0,
        count: 0,
    });

    const TodayisPositive = salesData.growthPercentage >= 0;

    useEffect(() => {
        axios.get(API.admingetTodaysRevenue)
            .then((res) => {
                const { totalAmount, growthPercentage, count } = res.data;
                setTodaySalesData({ totalAmount, growthPercentage, count });
            })
            .catch((err) => {
                console.error("Failed to fetch today's sales:", err);
            });
    }, []);

    // Total Profit
    const [profitData, setProfitData] = useState({ totalProfit: 0, growthPercentage: 0 });
    useEffect(() => {
        axios.get(API.getTotalProfit)
            .then((response) => setProfitData(response.data))
            .catch((error) => console.error('Error fetching profit data:', error));
    }, []);
    const isProfitGrowthPositive = profitData.growthPercentage >= 0;

    // Total Vendors (all, not just active)
    const [totalVendorsCount, setTotalVendorsCount] = useState(0);
    useEffect(() => {
        axios.get(API.getTotalVendorsCount)
            .then((response) => setTotalVendorsCount(response.data.totalVendors || 0))
            .catch((error) => console.error('Error fetching total vendors count:', error));
    }, []);

    // Top Selling Products
    const [topProducts, setTopProducts] = useState([]);
    useEffect(() => {
        axios.get(API.getTopSellingProducts)
            .then((response) => setTopProducts(response.data.data || []))
            .catch((error) => console.error('Error fetching top selling products:', error));
    }, []);

    // Sales vs Purchases (monthly)
    const [monthlySales, setMonthlySales] = useState({ months: [], totals: [] });
    useEffect(() => {
        axios.get(API.getMonthlysalesdata)
            .then((response) => {
                const rows = response.data.data || [];
                setMonthlySales({ months: rows.map((r) => r.month), totals: rows.map((r) => r.totalSales) });
            })
            .catch((error) => console.error('Error fetching monthly sales:', error));
    }, []);

    const [monthlyPurchases, setMonthlyPurchases] = useState({ months: [], totals: [] });
    useEffect(() => {
        axios.get(API.getMonthlyPurchasesData)
            .then((response) => {
                const rows = response.data.data || [];
                setMonthlyPurchases({ months: rows.map((r) => r.month), totals: rows.map((r) => r.totalPurchases) });
            })
            .catch((error) => console.error('Error fetching monthly purchases:', error));
    }, []);

    // Payment Status split - reuses the online/cash/pending totals already fetched above.
    const paymentStatusData = [
        { id: 0, value: onlineData.totalRevenue || 0, label: 'Online' },
        { id: 1, value: cashData.totalRevenue || 0, label: 'Cash' },
        { id: 2, value: pendingData.totalRevenue || 0, label: 'Pending' },
    ].filter((entry) => entry.value > 0);

    return (
        <>
            <div>
                <h1>Dashboard</h1>
            </div>
            <div className='row'>
                <div className="col-12 col-sm-6 col-lg-3 mb-4">
                    <Card className="shadow-sm" sx={{ borderRadius: 3 }}>
                        <CardContent>
                            {/* Title & Icon */}
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Total Revenue
                                </Typography>
                                <DollarSign size={20} color="#888" />
                            </Box>

                            {/* Value */}
                            <Typography
                                variant="h5"
                                fontWeight="bold"
                                mt={1}
                                sx={{ color: '#4caf50' }} // Light green
                            >
                                {/* ₹{data.totalRevenue.toLocaleString()} */}
                                ₹<CountUp
                                    end={data.totalRevenue || 0}
                                    duration={1.5}
                                    separator=","
                                />
                            </Typography>

                            {/* Change Indicator */}
                            <Typography
                                variant="body2"
                                sx={{
                                    color: isPositive ? 'success.main' : 'error.main',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                }}
                            >
                                {isPositive ? <ChartNoAxesCombined /> : <ChartCandlestick />} {data.growthPercentage}%
                            </Typography>

                            {/* Subtext */}
                            <Typography variant="caption" color="text.secondary">
                                from last month
                            </Typography>
                        </CardContent>
                    </Card>
                </div>


                <div className="col-12 col-sm-6 col-lg-3 mb-4">
                    <Card className="shadow-sm" sx={{ borderRadius: 3 }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Today's Total Revenue
                                </Typography>
                                <DollarSign size={20} color="#888" />
                            </Box>

                            <Typography variant="h5" fontWeight="bold" mt={1} sx={{ color: '#4caf50' }}>
                                ₹<CountUp end={TodaysalesData.totalAmount} duration={1.5} separator="," />
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: TodayisPositive ? 'success.main' : 'error.main',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                }}
                            >
                                {TodayisPositive ? <ChartNoAxesCombined /> : <ChartCandlestick />}
                                {TodaysalesData.growthPercentage}%
                            </Typography>

                            <Typography variant="caption" color="text.secondary">
                                from yesterday
                            </Typography>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-12 col-sm-6 col-lg-3 mb-4">
                    <Card className="shadow-sm" sx={{ borderRadius: 3 }}>
                        <CardContent>
                            {/* Title & Icon */}
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Total Sales
                                </Typography>
                                <ShoppingBag size={20} color="#888" />
                            </Box>

                            {/* Value */}
                            <Typography
                                variant="h5"
                                fontWeight="bold"
                                mt={1}
                                sx={{ color: '#4caf50' }} // Light green
                            >
                                {/* ₹{salesData.totalRevenue.toLocaleString()} */}
                                ₹<CountUp
                                    end={salesData.totalRevenue || 0}
                                    duration={1.5}
                                    separator=","
                                />
                            </Typography>

                            {/* Change Indicator */}
                            <Typography
                                variant="body2"
                                sx={{
                                    color: isSalesGrowthPositive ? 'success.main' : 'error.main',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                }}
                            >
                                {isSalesGrowthPositive ? <ChartNoAxesCombined /> : <ChartCandlestick />} {salesData.growthPercentage}%
                            </Typography>

                            {/* Subtext */}
                            <Typography variant="caption" color="text.secondary">
                                from last month
                            </Typography>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-12 col-sm-6 col-lg-3 mb-4">
                    <Card className="shadow-sm" sx={{ borderRadius: 3 }}>
                        <CardContent>
                            {/* Title & Icon */}
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Inventory Value
                                </Typography>
                                <PackageOpen size={20} color="#888" />
                            </Box>

                            {/* Value */}
                            <Typography
                                variant="h5"
                                fontWeight="bold"
                                mt={1}
                                sx={{ color: '#3f51b5' }} // Indigo color
                            >
                                {/* ₹{inventoryData.totalRevenue.toLocaleString()} */}
                                ₹<CountUp
                                    end={inventoryData.totalBuyingPrice || 0}
                                    duration={1.5}
                                    separator=","
                                />
                            </Typography>

                            {/* Change Indicator */}
                            <Typography
                                variant="body2"
                                sx={{
                                    color: isInventoryGrowthPositive ? 'success.main' : 'error.main',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                }}
                            >
                                {isInventoryGrowthPositive ? <ChartNoAxesCombined /> : <ChartCandlestick />} {inventoryData.growthPercentage}%
                            </Typography>

                            {/* Subtext */}
                            <Typography variant="caption" color="text.secondary">
                                from last month
                            </Typography>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-12 col-sm-6 col-lg-3 mb-4">
                    <Card className="shadow-sm" sx={{ borderRadius: 3 }}>
                        <CardContent>
                            {/* Title & Icon */}
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Online Payment In Sales
                                </Typography>
                                <EthernetPort size={20} color="#888" />
                            </Box>

                            {/* Value */}
                            <Typography
                                variant="h5"
                                fontWeight="bold"
                                mt={1}
                                sx={{ color: '#1976d2' }} // Custom blue color
                            >
                                {/* ₹{onlineData.totalRevenue.toLocaleString()} */}
                                ₹<CountUp
                                    end={onlineData.totalRevenue || 0}
                                    duration={1.5}
                                    separator=","
                                />

                            </Typography>

                            {/* Change Indicator */}
                            <Typography
                                variant="body2"
                                sx={{
                                    color: isOnlineGrowthPositive ? 'success.main' : 'error.main',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                }}
                            >
                                {isOnlineGrowthPositive ? <ChartNoAxesCombined /> : <ChartCandlestick />} {onlineData.growthPercentage}%
                            </Typography>

                            {/* Subtext */}
                            <Typography variant="caption" color="text.secondary">
                                from last month
                            </Typography>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-12 col-sm-6 col-lg-3 mb-4">
                    <Card className="shadow-sm" sx={{ borderRadius: 3 }}>
                        <CardContent>
                            {/* Title & Icon */}
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Cash Payment In Sales
                                </Typography>
                                <HandCoins size={20} color="#888" />
                            </Box>

                            {/* Value */}
                            <Typography
                                variant="h5"
                                fontWeight="bold"
                                mt={1}
                                sx={{ color: '#ff9800' }} // Amber / Orange color
                            >
                                {/* ₹{cashData.totalRevenue.toLocaleString()} */}
                                ₹<CountUp
                                    end={cashData.totalRevenue || 0}
                                    duration={1.5}
                                    separator=","
                                />
                            </Typography>

                            {/* Change Indicator */}
                            <Typography
                                variant="body2"
                                sx={{
                                    color: isCashGrowthPositive ? 'success.main' : 'error.main',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                }}
                            >
                                {isCashGrowthPositive ? <ChartNoAxesCombined /> : <ChartCandlestick />} {cashData.growthPercentage}%
                            </Typography>

                            {/* Subtext */}
                            <Typography variant="caption" color="text.secondary">
                                from last month
                            </Typography>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-12 col-sm-6 col-lg-3 mb-4">
                    <Card className="shadow-sm" sx={{ borderRadius: 3 }}>
                        <CardContent>
                            {/* Title & Icon */}
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Pending Payment for Sale
                                </Typography>
                                <Clock size={20} color="#888" />
                            </Box>

                            {/* Value */}
                            <Typography
                                variant="h5"
                                fontWeight="bold"
                                mt={1}
                                sx={{ color: '#9c27b0' }} // Purple
                            >
                                {/* ₹{pendingData.totalRevenue.toLocaleString()} */}
                                ₹<CountUp
                                    end={pendingData.totalRevenue || 0}
                                    duration={1.5}
                                    separator=","
                                />
                            </Typography>

                            {/* Change Indicator */}
                            <Typography
                                variant="body2"
                                sx={{
                                    color: isPendingGrowthPositive ? 'success.main' : 'error.main',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                }}
                            >
                                {isPendingGrowthPositive ? <ChartNoAxesCombined /> : <ChartCandlestick />} {pendingData.growthPercentage}%
                            </Typography>

                            {/* Subtext */}
                            <Typography variant="caption" color="text.secondary">
                                from last month
                            </Typography>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-12 col-sm-6 col-lg-3 mb-4">
                    <Card className="shadow-sm" sx={{ borderRadius: 3 }}>
                        <CardContent>
                            {/* Title & Icon */}
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Total Purchase
                                </Typography>
                                <ScrollText size={20} color="#888" />
                            </Box>

                            {/* Value */}
                            <Typography
                                variant="h5"
                                fontWeight="bold"
                                mt={1}
                                sx={{ color: '#ff7043' }} // Deep orange
                            >
                                {/* ₹{purchaseData.totalPurchasePrice.toLocaleString()} */}
                                ₹<CountUp
                                    end={purchaseData.totalPurchasePrice || 0}
                                    duration={1.5}
                                    separator=","
                                />
                            </Typography>

                            {/* Change Indicator */}
                            <Typography
                                variant="body2"
                                sx={{
                                    color: isPurchaseGrowthPositive ? 'success.main' : 'error.main',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                }}
                            >
                                {isPurchaseGrowthPositive ? <ChartNoAxesCombined /> : <ChartCandlestick />} {purchaseData.growthPercentage}%
                            </Typography>

                            {/* Subtext */}
                            <Typography variant="caption" color="text.secondary">
                                from last month
                            </Typography>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-12 col-sm-6 col-lg-3 mb-4">
                    <Card className="shadow-sm" sx={{ borderRadius: 3 }}>
                        <CardContent>
                            {/* Title & Icon */}
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Active Vendors
                                </Typography>
                                <Users size={20} color="#888" />
                            </Box>

                            {/* Value */}
                            <Typography
                                variant="h5"
                                fontWeight="bold"
                                mt={1}
                                sx={{ color: '#29b6f6' }}
                            >
                                {/* {vendorData.totalActiveVendors.toLocaleString()} */}
                                <CountUp
                                    end={vendorData.totalActiveVendors || 0}
                                    duration={1.5}
                                    separator=","
                                />
                            </Typography>

                            {/* Change Indicator */}
                            <Typography
                                variant="body2"
                                sx={{
                                    color: isVendorGrowthPositive ? 'success.main' : 'error.main',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                }}
                            >
                                {isVendorGrowthPositive ? <ChartNoAxesCombined /> : <ChartCandlestick />} {vendorData.growthPercentage}%
                            </Typography>

                            {/* Subtext */}
                            <Typography variant="caption" color="text.secondary">
                                from last month
                            </Typography>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-12 col-sm-6 col-lg-3 mb-4">
                    <Card className="shadow-sm" sx={{ borderRadius: 3 }}>
                        <CardContent>
                            {/* Title & Icon */}
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Vendors Total Payment
                                </Typography>
                                <Users size={20} color="#888" />
                            </Box>

                            {/* Value */}
                            <Typography
                                variant="h5"
                                fontWeight="bold"
                                mt={1}
                                sx={{ color: '#a9dfbf' }} // Purple (chosen for vendor payments)
                            >
                                {/* ₹{(vendorPaymentData.totalPayments || 0).toLocaleString()} */}

                                ₹<CountUp
                                    end={vendorPaymentData.totalPayments || 0}
                                    duration={1.5}
                                    separator=","
                                />
                            </Typography>

                            {/* Change Indicator */}
                            <Typography
                                variant="body2"
                                sx={{
                                    color: isGrowthPositive ? 'success.main' : 'error.main',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                }}
                            >
                                {isGrowthPositive ? <ChartNoAxesCombined /> : <ChartCandlestick />} {vendorPaymentData.growthPercentage}%
                            </Typography>

                            {/* Subtext */}
                            <Typography variant="caption" color="text.secondary">
                                from last month
                            </Typography>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-12 col-sm-6 col-lg-3 mb-4">
                    <Card className="shadow-sm" sx={{ borderRadius: 3 }}>
                        <CardContent>
                            {/* Title & Icon */}
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Vendors Pending Payment
                                </Typography>
                                <Users size={20} color="#888" />
                            </Box>

                            {/* Value */}
                            <Typography
                                variant="h5"
                                fontWeight="bold"
                                mt={1}
                                sx={{ color: '#9c27b0' }} // Orange for pending payments
                            >
                                {/* ₹{(pendingVendorData.totalPendingPayments || 0).toLocaleString()} */}
                                ₹<CountUp
                                    end={pendingVendorData.totalPendingPayments || 0}
                                    duration={1.5}
                                    separator=","
                                />
                            </Typography>

                            {/* Change Indicator */}
                            <Typography
                                variant="body2"
                                sx={{
                                    color: isPendingGrowthPositive1 ? 'success.main' : 'error.main',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                }}
                            >
                                {isPendingGrowthPositive1 ? <ChartNoAxesCombined /> : <ChartCandlestick />} {pendingVendorData.growthPercentage}%
                            </Typography>

                            {/* Subtext */}
                            <Typography variant="caption" color="text.secondary">
                                from last month
                            </Typography>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-12 col-sm-6 col-lg-3 mb-4">
                    <Card className="shadow-sm" sx={{ borderRadius: 3 }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Total Vendors
                                </Typography>
                                <Users size={20} color="#888" />
                            </Box>
                            <Typography variant="h5" fontWeight="bold" mt={1} sx={{ color: '#29b6f6' }}>
                                <CountUp end={totalVendorsCount || 0} duration={1.5} separator="," />
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                all vendor entries
                            </Typography>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-12 col-sm-6 col-lg-3 mb-4">
                    <Card className="shadow-sm" sx={{ borderRadius: 3 }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Total Profit
                                </Typography>
                                <Wallet size={20} color="#888" />
                            </Box>
                            <Typography variant="h5" fontWeight="bold" mt={1} sx={{ color: '#2e7d32' }}>
                                ₹<CountUp end={profitData.totalProfit || 0} duration={1.5} separator="," />
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: isProfitGrowthPositive ? 'success.main' : 'error.main', display: 'flex', alignItems: 'center', gap: 0.5 }}
                            >
                                {isProfitGrowthPositive ? <ChartNoAxesCombined /> : <ChartCandlestick />} {profitData.growthPercentage}%
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                from last month
                            </Typography>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className='row mt-3'>
                <div className='col-md-6'>
                    <h3>Jwelery</h3>
                    <PieChart
                        series={[
                            {
                                data: pieData,
                                arcLabel: (item) => `${item.value}%`,
                                arcLabelMinAngle: 35,
                                arcLabelRadius: '60%',
                            },
                        ]}
                        sx={{
                            [`& .${pieArcLabelClasses.root}`]: {
                                fontWeight: 'bold',
                                fill: '#ffffff',
                            },
                        }}
                        {...size}
                    />
                </div>

                <div className='col-md-6'>
                    <h3>Rudrax</h3>
                    <PieChart
                        series={[
                            {
                                data: rudraxChartData,
                                arcLabel: (item) => `${item.value}%`,
                                arcLabelMinAngle: 35,
                                arcLabelRadius: '60%',
                            },
                        ]}
                        sx={{
                            [`& .${pieArcLabelClasses.root}`]: {
                                fontWeight: 'bold',
                                fill: '#ffffff',
                            },
                        }}
                        {...chartSize}
                    />
                </div>
            </div>

            <div className='row mt-3'>
                <div className='col-12 col-lg-8 mb-4'>
                    <Typography variant="h6" fontWeight="bold" mb={1}>Sales vs Purchases</Typography>
                    <div style={{ width: '100%', overflowX: 'auto' }}>
                        <BarChart
                            xAxis={[{ scaleType: 'band', data: monthlySales.months.length ? monthlySales.months : monthlyPurchases.months }]}
                            series={[
                                { data: monthlySales.totals, label: 'Sales', color: '#4caf50' },
                                { data: monthlyPurchases.totals, label: 'Purchases', color: '#ff7043' },
                            ]}
                            width={Math.max(500, monthlySales.months.length * 100)}
                            height={320}
                        />
                    </div>
                </div>

                <div className='col-12 col-lg-4 mb-4'>
                    <Typography variant="h6" fontWeight="bold" mb={1}>Payment Status</Typography>
                    {paymentStatusData.length === 0 ? (
                        <Typography color="text.secondary">No sales data yet.</Typography>
                    ) : (
                        <PieChart
                            series={[{ data: paymentStatusData, innerRadius: 40, arcLabel: (item) => `${item.label}` }]}
                            sx={{ [`& .${pieArcLabelClasses.root}`]: { fontWeight: 'bold', fill: '#ffffff', fontSize: 11 } }}
                            width={320}
                            height={280}
                        />
                    )}
                </div>
            </div>

            <div className='row mt-3'>
                <div className='col-12 mb-4'>
                    <Card className="shadow-sm" sx={{ borderRadius: 3 }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" mb={2}>Top Selling Products</Typography>
                            {topProducts.length === 0 ? (
                                <Typography color="text.secondary">Not enough sales data yet to rank products.</Typography>
                            ) : (
                                topProducts.map((product, index) => (
                                    <Box
                                        key={product.productname}
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ py: 1, borderBottom: index < topProducts.length - 1 ? '1px solid #eee' : 'none' }}
                                    >
                                        <Typography>{index + 1}. {product.productname}</Typography>
                                        <Typography color="text.secondary">{product.totalQty} sold &middot; ₹{product.totalRevenue}</Typography>
                                    </Box>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <AarmbhAI />
        </>

    )
}

export default Dashboard