const express = require('express');

const authController = require('../controllers/authController');
const itemController = require('../controllers/itemController');
const salesController = require('../controllers/salesController');
const purchaseController = require('../controllers/purchaseController');
const vendorController = require('../controllers/vendorController');
const analyticsController = require('../controllers/analyticsController');

const router = express.Router();

// Auth
router.post('/login', authController.login);
router.post('/sendcode', authController.sendCode);
router.post('/verifycode', authController.verifyCode);
router.post('/resetPassword', authController.resetPassword);

// Items
router.get('/getallitems', itemController.getAllItems);
router.post('/addnewitems', itemController.addItem);
router.put('/updateitems/:id', itemController.updateItem);
router.get('/getitemsbyid/:id', itemController.getItemById);
router.delete('/deleteitems/:id', itemController.deleteItem);
router.get('/get/allitemsname', itemController.getAllItemNames);

// Sales
router.post('/add/salesdetails', salesController.addSale);
router.get('/get/allsales', salesController.getAllSales);
router.put('/update/sales/:id', salesController.updateSale);
router.get('/get/sales/:id', salesController.getSaleById);
router.delete('/delete/sales/:id', salesController.deleteSale);

// Vendors
router.get('/get/vendores', vendorController.getAllVendors);
router.post('/create/vendores', vendorController.createVendor);
router.put('/update/vendores/:id', vendorController.updateVendor);
router.delete('/delete/vendores/:id', vendorController.deleteVendor);

// Purchases
router.post('/create/purchase', purchaseController.addPurchase);
router.get('/getall/purchasedata', purchaseController.getAllPurchases);
router.delete('/delete/purchasedata/:id', purchaseController.deletePurchase);

// Dashboard / Reports analytics
router.get('/get/totalnumber/sales', analyticsController.getTotalRevenue);
router.get('/get/totalrevenue/bystatus', analyticsController.getTotalSalesByStatus);
router.get('/get/onlinesummery/revenue', analyticsController.getOnlinePaymentSales);
router.get('/get/cashsummery/revenue', analyticsController.getCashSales);
router.get('/get/pendingsummery/revenue', analyticsController.getPendingSales);
router.get('/get/totalrevenue/inventoryvalue', analyticsController.getInventoryValue);
router.get('/get/alltotal/purchaseprice', analyticsController.getTotalPurchasePrice);
router.get('/get/alltotal/activevendores', analyticsController.getActiveVendorsCount);
router.get('/get/all/vendorespayment/total', analyticsController.getVendorPaymentsTotal);
router.get('/get/prndingvendores/total', analyticsController.getVendorPendingPaymentsTotal);
router.get('/get/jwelery/sales/data', analyticsController.getCategorySalesPie('Jewelry'));
router.get('/get/rudrax/sales/data', analyticsController.getCategorySalesPie('Rudrax'));
router.get('/get/itemQtytotal/barcharts', analyticsController.getItemQtyBarChart);
router.get('/get/monthlysales/charts', analyticsController.getMonthlySalesChart);
router.get('/get/todays/sales/data', analyticsController.getTodaysSales);

module.exports = router;
