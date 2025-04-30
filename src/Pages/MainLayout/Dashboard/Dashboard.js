import React, { useState, useEffect } from 'react'
import { Card, CardContent, Typography, Box } from '@mui/material';
import { DollarSign, ShoppingBag, PackageOpen, EthernetPort, HandCoins, ScrollText, Users, ChartNoAxesCombined, ChartCandlestick, Clock } from 'lucide-react';
import axios from 'axios';
import CountUp from 'react-countup';
import ReactApexChart from 'react-apexcharts';
import API from '../../../Server';

const Dashboard = () => {
    const [showCount, setShowCount] = useState(false);

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

    // Pie Chart

    const [state, setState] = useState({
        series: [],
        options: {
            chart: {
                width: 380,
                type: 'pie',
            },
            labels: [],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            ]
        },
    });

    useEffect(() => {
        // Fetching data from API
        fetch('http://localhost:2222/admin/get/jwelery/sales/data')
            .then((response) => response.json())
            .then((data) => {
                if (data.message === 'Jewelry sales statistics fetched successfully') {
                    const series = data.data.map((item) => item.percentageSold);
                    const labels = data.data.map((item) => item.itemname);

                    setState((prevState) => ({
                        ...prevState,
                        series: series,
                        options: {
                            ...prevState.options,
                            labels: labels,
                        },
                    }));
                }
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const [chartState, setChartState] = useState({
        series: [],
        options: {
            chart: {
                width: 380,
                type: 'pie',
            },
            labels: [],
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200,
                    },
                    legend: {
                        position: 'bottom',
                    },
                },
            }],
        },
    });

    useEffect(() => {
        // Fetch the data from the API
        axios.get('http://localhost:2222/admin/get/rudrax/sales/data')
            .then((response) => {
                if (response.data.message === 'Rudrax sales statistics fetched successfully') {
                    const data = response.data.data;

                    // Extracting item names and sold quantities for the pie chart
                    const labels = data.map(item => item.itemname);
                    const series = data.map(item => item.percentageSold);

                    // Updating the chart data and options
                    setChartState(prevState => ({
                        ...prevState,
                        series,
                        options: {
                            ...prevState.options,
                            labels,
                        },
                    }));
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

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
            </div>

            <div className='row mt-3'>
                <div className='col-md-6'>
                    <h3>Jwelery</h3>
                    <div id="chart">
                        <ReactApexChart
                            options={state.options}
                            series={state.series}
                            type="pie"
                            width="100%"
                        />
                    </div>
                </div>

                <div className='col-md-6'>
                    <h3>Rudrax</h3>
                    <div>
                        <div id="chart">
                            <ReactApexChart options={chartState.options} series={chartState.series} type="pie" width="100%" />
                        </div>
                        <div id="html-dist"></div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Dashboard