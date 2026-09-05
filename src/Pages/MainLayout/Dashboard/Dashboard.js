import React, { useState, useEffect } from 'react'
import { Card, CardContent, Typography, Box } from '@mui/material';
import { DollarSign, ShoppingBag, PackageOpen, EthernetPort, HandCoins, ScrollText, Users, Clock, Wallet, TrendingUp } from 'lucide-react';
import axios from 'axios';
import API from '../../../Server';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import AarmbhAI from './AarmbhAI';
import StatCard from '../../../components/ui/StatCard';

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

    // inventory data

    const [inventoryData, setInventoryData] = useState({
        totalRevenue: 0,
        growthPercentage: 0
    });

    useEffect(() => {
        axios.get(API.getinventorydata)
            .then(response => {
                setInventoryData(response.data);
            })
            .catch(error => {
                console.error("Error fetching inventory data:", error);
            });
    }, []);

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
        width: 320,
        height: 300,
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
        width: 320,
        height: 300,
    };

    const [TodaysalesData, setTodaySalesData] = useState({
        totalAmount: 0,
        growthPercentage: 0,
        count: 0,
    });

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

    const email = (typeof window !== 'undefined' && localStorage.getItem('email')) || '';
    const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <>
            <Box
                sx={{
                    background: 'linear-gradient(120deg, #0d3b3d 0%, #12494b 100%)',
                    color: '#fff',
                    borderRadius: 'var(--aarmbh-radius-lg)',
                    p: { xs: 2.5, md: 3.5 },
                    mb: 3,
                }}
            >
                <Typography variant="h5" fontWeight={700}>Welcome back{email ? `, ${email.split('@')[0]}` : ''}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
                    Here's what's happening with your jewelry business today &middot; {today}
                </Typography>
            </Box>

            <div className='row'>
                <div className="col-12 col-sm-6 col-lg-3 mb-4">
                    <StatCard icon={DollarSign} label="Total Revenue" value={data.totalRevenue} prefix="₹" growthPercentage={data.growthPercentage} accent="#0d3b3d" />
                </div>
                <div className="col-12 col-sm-6 col-lg-3 mb-4">
                    <StatCard icon={DollarSign} label="Today's Revenue" value={TodaysalesData.totalAmount} prefix="₹" growthPercentage={TodaysalesData.growthPercentage} accent="#b8923a" />
                </div>
                <div className="col-12 col-sm-6 col-lg-3 mb-4">
                    <StatCard icon={ShoppingBag} label="Total Sales" value={salesData.totalRevenue} prefix="₹" growthPercentage={salesData.growthPercentage} accent="#1a5fa8" />
                </div>
                <div className="col-12 col-sm-6 col-lg-3 mb-4">
                    <StatCard icon={PackageOpen} label="Inventory Value" value={inventoryData.totalBuyingPrice} prefix="₹" growthPercentage={inventoryData.growthPercentage} accent="#5a4fcf" />
                </div>
                <div className="col-12 col-sm-6 col-lg-3 mb-4">
                    <StatCard icon={EthernetPort} label="Online Payments" value={onlineData.totalRevenue} prefix="₹" growthPercentage={onlineData.growthPercentage} accent="#1976d2" />
                </div>
                <div className="col-12 col-sm-6 col-lg-3 mb-4">
                    <StatCard icon={HandCoins} label="Cash Payments" value={cashData.totalRevenue} prefix="₹" growthPercentage={cashData.growthPercentage} accent="#a3660a" />
                </div>
                <div className="col-12 col-sm-6 col-lg-3 mb-4">
                    <StatCard icon={Clock} label="Pending Payments" value={pendingData.totalRevenue} prefix="₹" growthPercentage={pendingData.growthPercentage} accent="#9c27b0" />
                </div>
                <div className="col-12 col-sm-6 col-lg-3 mb-4">
                    <StatCard icon={ScrollText} label="Total Purchases" value={purchaseData.totalPurchasePrice} prefix="₹" growthPercentage={purchaseData.growthPercentage} accent="#c65b2e" />
                </div>
                <div className="col-12 col-sm-6 col-lg-3 mb-4">
                    <StatCard icon={Users} label="Active Vendors" value={vendorData.totalActiveVendors} growthPercentage={vendorData.growthPercentage} accent="#0d8a7a" />
                </div>
                <div className="col-12 col-sm-6 col-lg-3 mb-4">
                    <StatCard icon={Users} label="Vendors Total Payment" value={vendorPaymentData.totalPayments} prefix="₹" growthPercentage={vendorPaymentData.growthPercentage} accent="#2e7d32" />
                </div>
                <div className="col-12 col-sm-6 col-lg-3 mb-4">
                    <StatCard icon={Users} label="Vendors Pending Payment" value={pendingVendorData.totalPendingPayments} prefix="₹" growthPercentage={pendingVendorData.growthPercentage} accent="#9c27b0" />
                </div>
                <div className="col-12 col-sm-6 col-lg-3 mb-4">
                    <StatCard icon={Users} label="Total Vendors" value={totalVendorsCount} accent="#1a5fa8" helperText="all vendor entries" />
                </div>
                <div className="col-12 col-sm-6 col-lg-3 mb-4">
                    <StatCard icon={Wallet} label="Total Profit" value={profitData.totalProfit} prefix="₹" growthPercentage={profitData.growthPercentage} accent="#2e7d32" />
                </div>
            </div>

            <div className='row mt-1'>
                <div className='col-12 col-md-6 mb-4'>
                    <div className="aarmbh-card" style={{ padding: '20px', overflowX: 'auto' }}>
                        <Typography variant="h6" mb={1}>Jewelry Sales Mix</Typography>
                        <PieChart
                            series={[
                                {
                                    data: pieData,
                                    arcLabel: (item) => `${item.value}%`,
                                    arcLabelMinAngle: 35,
                                    arcLabelRadius: '60%',
                                    innerRadius: 30,
                                },
                            ]}
                            colors={['#0d3b3d', '#b8923a', '#1a5fa8', '#a3660a', '#5a4fcf', '#c65b2e']}
                            sx={{
                                [`& .${pieArcLabelClasses.root}`]: {
                                    fontWeight: 'bold',
                                    fill: '#ffffff',
                                },
                            }}
                            {...size}
                        />
                    </div>
                </div>

                <div className='col-12 col-md-6 mb-4'>
                    <div className="aarmbh-card" style={{ padding: '20px', overflowX: 'auto' }}>
                        <Typography variant="h6" mb={1}>Rudrax Sales Mix</Typography>
                        <PieChart
                            series={[
                                {
                                    data: rudraxChartData,
                                    arcLabel: (item) => `${item.value}%`,
                                    arcLabelMinAngle: 35,
                                    arcLabelRadius: '60%',
                                    innerRadius: 30,
                                },
                            ]}
                            colors={['#0d3b3d', '#b8923a', '#1a5fa8', '#a3660a', '#5a4fcf', '#c65b2e']}
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
            </div>

            <div className='row mt-1'>
                <div className='col-12 col-lg-8 mb-4'>
                    <div className="aarmbh-card" style={{ padding: '20px' }}>
                        <Typography variant="h6" mb={1}>Sales vs Purchases</Typography>
                        <div style={{ width: '100%', overflowX: 'auto' }}>
                            <BarChart
                                xAxis={[{ scaleType: 'band', data: monthlySales.months.length ? monthlySales.months : monthlyPurchases.months }]}
                                series={[
                                    { data: monthlySales.totals, label: 'Sales', color: '#0d3b3d' },
                                    { data: monthlyPurchases.totals, label: 'Purchases', color: '#b8923a' },
                                ]}
                                width={Math.max(500, monthlySales.months.length * 100)}
                                height={300}
                            />
                        </div>
                    </div>
                </div>

                <div className='col-12 col-lg-4 mb-4'>
                    <div className="aarmbh-card" style={{ padding: '20px', height: '100%' }}>
                        <Typography variant="h6" mb={1}>Payment Status</Typography>
                        {paymentStatusData.length === 0 ? (
                            <Typography color="text.secondary" variant="body2">No sales data yet.</Typography>
                        ) : (
                            <PieChart
                                series={[{ data: paymentStatusData, innerRadius: 40, arcLabel: (item) => `${item.label}` }]}
                                colors={['#1a5fa8', '#a3660a', '#9c27b0']}
                                sx={{ [`& .${pieArcLabelClasses.root}`]: { fontWeight: 'bold', fill: '#ffffff', fontSize: 11 } }}
                                width={280}
                                height={260}
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className='row mt-1'>
                <div className='col-12 mb-4'>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                                <TrendingUp size={20} color="#b8923a" />
                                <Typography variant="h6">Top Selling Products</Typography>
                            </Box>
                            {topProducts.length === 0 ? (
                                <Typography color="text.secondary" variant="body2">Not enough sales data yet to rank products.</Typography>
                            ) : (
                                topProducts.map((product, index) => (
                                    <Box
                                        key={product.productname}
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ py: 1.2, borderBottom: index < topProducts.length - 1 ? '1px solid #f0ede3' : 'none' }}
                                    >
                                        <Typography fontWeight={600}>{index + 1}. {product.productname}</Typography>
                                        <Typography color="text.secondary" variant="body2">{product.totalQty} sold &middot; ₹{product.totalRevenue}</Typography>
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
