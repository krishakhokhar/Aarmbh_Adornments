// const baseUrl = "http://localhost:2222";
const baseUrl = "https://aarambhbackend.onrender.com";

// Define your endpoints
const API = {
    AdminLogin: `${baseUrl}/admin/login`,
    AdminSendCode: `${baseUrl}/admin/sendcode`,
    VerifyCode: `${baseUrl}/admin/verifycode`,
    ResetPassword: `${baseUrl}/admin/resetPassword`,
    getItems: `${baseUrl}/admin/getallitems`,
    addNewItems: `${baseUrl}/admin/addnewitems`,
    deleteitems: `${baseUrl}/admin/deleteitems`,
    updateItems: (editItemId) => `${baseUrl}/admin/updateitems/${editItemId}`,
    getItemsById: (itemId) => `${baseUrl}/admin/getitemsbyid/${itemId}`,
    deleteitmsById: (itemId) => `${baseUrl}/admin/deleteitems/${itemId}`,
    getAllitemsname: `${baseUrl}/admin/get/allitemsname`,
    addSalesData: `${baseUrl}/admin/add/salesdetails`,
    getallsalesData: `${baseUrl}/admin/get/allsales`,
    updateSalesData: `${baseUrl}/admin/update/sales`,
    getSalesDataById: `${baseUrl}/admin/get/sales`,
    deleteSalesDataById: `${baseUrl}/admin/delete/sales`,
    getAllVendors: `${baseUrl}/admin/get/vendores`,
    createVendor: `${baseUrl}/admin/create/vendores`,
    updateVendor: (id) => `${baseUrl}/admin/update/vendores/${id}`,
    deleteVendor: (id) => `${baseUrl}/admin/delete/vendores/${id}`,
    createpurchasedata: `${baseUrl}/admin/create/purchase`,
    getAllPurchasedata: `${baseUrl}/admin/getall/purchasedata`,
    deleteDataById: (id) => `${baseUrl}/admin/delete/purchasedata/${id}`,
    getTotalRevenuedata: `${baseUrl}/admin/get/totalnumber/sales`,
    getTotalSalesdata: `${baseUrl}/admin/get/totalrevenue/bystatus`,
    getonlinepaymentsalesdata: `${baseUrl}/admin/get/onlinesummery/revenue`,
    getsalescashdata: `${baseUrl}/admin/get/cashsummery/revenue`,
    getsalespendingdata: `${baseUrl}/admin/get/pendingsummery/revenue`,
    getinventorydata: `${baseUrl}/admin/get/totalrevenue/inventoryvalue`,
    getallpurchasedata: `${baseUrl}/admin/get/alltotal/purchaseprice`,
    getallVendoresdata: `${baseUrl}/admin/get/alltotal/activevendores`,
    getallVendorestotalpaymentdata: `${baseUrl}/admin/get/all/vendorespayment/total`,
    getallVendorestotalpendingdata: `${baseUrl}/admin/get/prndingvendores/total`,
    getalljeweldataonPiechart: `${baseUrl}/admin/get/jwelery/sales/data`,
    getallRudraxdataonPiechart: `${baseUrl}/admin/get/rudrax/sales/data`,
    gettheQtydatainbarcharts : `${baseUrl}/admin/get/itemQtytotal/barcharts`,
    getMonthlysalesdata : `${baseUrl}/admin/get/monthlysales/charts`,
    admingetTodaysRevenue : `${baseUrl}/admin/get/todays/sales/data`
};

export default API;


