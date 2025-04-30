import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import API from '../../../Server';
import {
  PieChart, pieArcLabelClasses,
} from '@mui/x-charts/PieChart';

import {
  BarChart,
  BarSeries,
  XAxis,
  YAxis,
  ChartContainer,

} from "@mui/x-charts";

import { Card, CardContent, Typography } from '@mui/material';
import axios from 'axios';

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



  return (
    <>
      <h1>Reports Comming Soon</h1>

      <div className='mt-3'>
        <div className="row">
          <div className="col-md-6 shadow-sm">
            <h4 className="p-4">Jewelry Data</h4>
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
          <div className="col-md-6 shadow-sm">
            <h4 className="p-4">Rudrax Data</h4>
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

      <div className='Row mt-4'>
        <div className='col-md-12 shadow-sm mt-3 p-4'>
          <h4>Product Qty</h4>
          <div style={{ width: "100%", overflowX: "auto" }}>
            <BarChart
              xAxis={[{ id: "items", data: itemNames, scaleType: "band", label: "Item Name" }]}
              series={[{ data: quantities, label: "Total Quantity" }]}
              width={Math.max(800, itemNames.length * 100)} // Dynamic width for scroll
              height={500}
            />
          </div>
        </div>
      </div>

      <div className='Row'>
        <div className='col-md-12 shadow-sm mt-3 p-4'>
          <h4>Monthly Sales Data</h4>
          <BarChart
            xAxis={[{ scaleType: 'band', data: months }]}
            series={[{ data: sales, label: 'Monthly Sales', color: '#82e0aa' }]}
            width={Math.max(500, months.length * 100)}
            height={300}
          />
        </div>
      </div>
    </>
  )
}

export default Reports