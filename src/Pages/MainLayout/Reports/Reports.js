import React, { useEffect, useState, useMemo } from 'react'
import './Reports.css';
import API from '../../../Server';
import {
  PieChart, pieArcLabelClasses,
} from '@mui/x-charts/PieChart';

import {
  BarChart,
} from "@mui/x-charts";

import { Button, TextField } from '@mui/material';
import { Download, Printer } from 'lucide-react';
import axios from 'axios';
import PageHeader from '../../../components/ui/PageHeader';
import StatCard from '../../../components/ui/StatCard';

const LOW_STOCK_THRESHOLD = 5;

const REPORT_COLUMNS = {
  sales: [
    { key: 'productname', label: 'Product' },
    { key: 'date', label: 'Date', format: (v) => new Date(v).toLocaleDateString() },
    { key: 'customername', label: 'Customer' },
    { key: 'qty', label: 'Qty' },
    { key: 'productprice', label: 'Price' },
    { key: 'total', label: 'Total' },
    { key: 'paymentstatus', label: 'Status' },
  ],
  purchase: [
    { key: 'productname', label: 'Product' },
    { key: 'date', label: 'Date', format: (v) => new Date(v).toLocaleDateString() },
    { key: 'productqty', label: 'Qty' },
    { key: 'productprice', label: 'Price' },
    { key: 'paymentmod', label: 'Payment Mode' },
  ],
  inventory: [
    { key: 'sku', label: 'SKU' },
    { key: 'itemname', label: 'Item' },
    { key: 'itemcategory', label: 'Category' },
    { key: 'buyingprice', label: 'Buying Price' },
    { key: 'sellingprice', label: 'Selling Price' },
    { key: 'itemQty', label: 'Stock' },
  ],
  profit: [
    { key: 'productname', label: 'Product' },
    { key: 'date', label: 'Date', format: (v) => new Date(v).toLocaleDateString() },
    { key: 'qty', label: 'Qty' },
    { key: 'productprice', label: 'Sale Price' },
    { key: 'buyingprice', label: 'Buying Price' },
    { key: 'profit', label: 'Profit' },
  ],
};

const Reports = () => {

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

  // bars chart
  const [itemNames, setItemNames] = useState([]);
  const [quantities, setQuantities] = useState([]);

  useEffect(() => {
    axios
      .get(API.gettheQtydatainbarcharts)
      .then((res) => {
        const data = res.data.data;
        setItemNames(data.map((item) => item.itemname));
        setQuantities(data.map((item) => item.totalQty));
      })
      .catch((err) => {
        console.error("Error fetching chart data:", err);
      });
  }, []);

  // Monthly Sales Data

  const [months, setMonths] = useState([]);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    axios
      .get(API.getMonthlysalesdata)
      .then((res) => {
        const data = res.data.data;
        setMonths(data.map((item) => item.month));
        setSales(data.map((item) => item.totalSales));
      })
      .catch((err) => {
        console.error('Error fetching monthly sales:', err);
      });
  }, []);

  // ---- Report generator (Sales / Purchase / Inventory / Profit) ----
  const [reportType, setReportType] = useState('sales');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [salesRows, setSalesRows] = useState([]);
  const [purchaseRows, setPurchaseRows] = useState([]);
  const [itemRows, setItemRows] = useState([]);
  const [reportLoading, setReportLoading] = useState(true);

  useEffect(() => {
    setReportLoading(true);
    Promise.all([
      axios.get(API.getallsalesData).catch(() => ({ data: { data: [] } })),
      axios.get(API.getAllPurchasedata).catch(() => ({ data: { data: [] } })),
      axios.get(API.getItems).catch(() => ({ data: { data: [] } })),
    ])
      .then(([salesRes, purchaseRes, itemsRes]) => {
        setSalesRows(salesRes.data.data || []);
        setPurchaseRows(purchaseRes.data.data || []);
        setItemRows(itemsRes.data.data || []);
      })
      .finally(() => setReportLoading(false));
  }, []);

  const inDateRange = (dateStr) => {
    if (!fromDate && !toDate) return true;
    const d = new Date(dateStr);
    if (fromDate && d < new Date(fromDate)) return false;
    if (toDate && d > new Date(`${toDate}T23:59:59`)) return false;
    return true;
  };

  // Only sales made after the inventory-sync fix carry a matching item name
  // with a known buying price - older sales fall back to a name match
  // against current Inventory, and are excluded if that item no longer exists.
  const buyingPriceByName = useMemo(() => {
    const map = new Map();
    itemRows.forEach((it) => map.set(it.itemname, it.buyingprice));
    return map;
  }, [itemRows]);

  const reportRows = useMemo(() => {
    if (reportType === 'sales') {
      return salesRows.filter((s) => inDateRange(s.date));
    }
    if (reportType === 'purchase') {
      return purchaseRows.filter((p) => inDateRange(p.date));
    }
    if (reportType === 'inventory') {
      return itemRows;
    }
    if (reportType === 'profit') {
      return salesRows
        .filter((s) => inDateRange(s.date) && buyingPriceByName.has(s.productname))
        .map((s) => {
          const buyingprice = buyingPriceByName.get(s.productname);
          return { ...s, buyingprice, profit: (s.productprice - buyingprice) * s.qty };
        });
    }
    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportType, salesRows, purchaseRows, itemRows, fromDate, toDate, buyingPriceByName]);

  const summary = useMemo(() => {
    if (reportType === 'sales') {
      const total = reportRows.reduce((sum, r) => sum + (r.total || 0), 0);
      return [{ label: 'Total Sales', value: total, prefix: '₹' }, { label: 'Records', value: reportRows.length }];
    }
    if (reportType === 'purchase') {
      const total = reportRows.reduce((sum, r) => sum + (r.total ?? r.productqty * r.productprice), 0);
      return [{ label: 'Total Purchases', value: total, prefix: '₹' }, { label: 'Records', value: reportRows.length }];
    }
    if (reportType === 'inventory') {
      const totalValue = reportRows.reduce((sum, r) => sum + r.buyingprice * r.itemQty, 0);
      const lowStock = reportRows.filter((r) => r.itemQty <= LOW_STOCK_THRESHOLD).length;
      return [
        { label: 'Total Stock Value', value: totalValue, prefix: '₹' },
        { label: 'Low Stock Items', value: lowStock },
        { label: 'Total Items', value: reportRows.length },
      ];
    }
    if (reportType === 'profit') {
      const totalProfit = reportRows.reduce((sum, r) => sum + r.profit, 0);
      return [{ label: 'Total Profit', value: totalProfit, prefix: '₹' }, { label: 'Records', value: reportRows.length }];
    }
    return [];
  }, [reportType, reportRows]);

  const activeColumns = REPORT_COLUMNS[reportType];

  const handleExportCsv = () => {
    const header = activeColumns.map((c) => c.label).join(',');
    const rows = reportRows.map((row) =>
      activeColumns
        .map((c) => {
          const raw = row[c.key];
          const val = c.format ? c.format(raw) : raw;
          return `"${String(val ?? '').replace(/"/g, '""')}"`;
        })
        .join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${reportType}-report-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => window.print();

  return (
    <>
      <PageHeader title="Reports" subtitle="Sales, purchase, inventory and profit reporting in one place." />

      <div className="no-print mb-3 aarmbh-card" style={{ padding: '16px 20px' }}>
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-3">
            <TextField
              select
              fullWidth
              label="Report Type"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              variant="outlined"
              SelectProps={{ native: true }}
            >
              <option value="sales">Sales Report</option>
              <option value="purchase">Purchase Report</option>
              <option value="inventory">Inventory Report</option>
              <option value="profit">Profit Report</option>
            </TextField>
          </div>
          <div className="col-12 col-md-3">
            <TextField
              fullWidth
              type="date"
              label="From Date"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              disabled={reportType === 'inventory'}
            />
          </div>
          <div className="col-12 col-md-3">
            <TextField
              fullWidth
              type="date"
              label="To Date"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              disabled={reportType === 'inventory'}
            />
          </div>
          <div className="col-12 col-md-3 d-flex" style={{ gap: 8 }}>
            <Button
              variant="contained"
              className="aarmbh-btn-primary"
              startIcon={<Download size={18} />}
              onClick={handleExportCsv}
              disabled={reportRows.length === 0}
            >
              CSV
            </Button>
            <Button
              variant="outlined"
              startIcon={<Printer size={18} />}
              style={{ textTransform: 'none' }}
              onClick={handlePrint}
              disabled={reportRows.length === 0}
            >
              Print
            </Button>
          </div>
        </div>
      </div>

      <div className="print-area">
        <div className="row mb-3">
          {summary.map((s) => (
            <div key={s.label} className="col-12 col-sm-6 col-md-3 mb-3">
              <StatCard label={s.label} value={s.value} prefix={s.prefix || ''} accent="#0d3b3d" />
            </div>
          ))}
        </div>

        <div className="aarmbh-card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-sm aarmbh-table mb-0" style={{ minWidth: 600 }}>
              <thead>
                <tr>
                  {activeColumns.map((c) => (
                    <th key={c.key}>{c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportLoading && (
                  <tr><td colSpan={activeColumns.length} className="text-center py-4">Loading report data...</td></tr>
                )}
                {!reportLoading && reportRows.length === 0 && (
                  <tr><td colSpan={activeColumns.length} className="text-center py-4 text-muted">No records found for this selection.</td></tr>
                )}
                {!reportLoading && reportRows.map((row, idx) => (
                  <tr key={row._id || idx}>
                    {activeColumns.map((c) => (
                      <td key={c.key}>{c.format ? c.format(row[c.key]) : row[c.key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className='mt-4 no-print'>
        <div className="row">
          <div className="col-12 col-md-6 mb-4">
            <div className="aarmbh-card" style={{ padding: '16px', overflowX: 'auto' }}>
            <h4 className="p-2">Jewelry Data</h4>
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
          </div>
          <div className="col-12 col-md-6 mb-4">
            <div className="aarmbh-card" style={{ padding: '16px', overflowX: 'auto' }}>
            <h4 className="p-2">Rudrax Data</h4>
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
        </div>
      </div>

      <div className='row mt-1 no-print'>
        <div className='col-md-12 mb-4'>
          <div className="aarmbh-card" style={{ padding: '20px' }}>
          <h4>Product Qty</h4>
          <div style={{ width: "100%", overflowX: "auto" }}>
            <BarChart
              xAxis={[{ id: "items", data: itemNames, scaleType: "band", label: "Item Name" }]}
              series={[{ data: quantities, label: "Total Quantity", color: '#0d3b3d' }]}
              width={Math.max(800, itemNames.length * 100)} // Dynamic width for scroll
              height={400}
            />
          </div>
          </div>
        </div>
      </div>

      <div className='row no-print'>
        <div className='col-md-12 mb-4'>
          <div className="aarmbh-card" style={{ padding: '20px' }}>
          <h4>Monthly Sales Data</h4>
          <BarChart
            xAxis={[{ scaleType: 'band', data: months }]}
            series={[{ data: sales, label: 'Monthly Sales', color: '#b8923a' }]}
            width={Math.max(500, months.length * 100)}
            height={300}
          />
          </div>
        </div>
      </div>
    </>
  )
}

export default Reports
