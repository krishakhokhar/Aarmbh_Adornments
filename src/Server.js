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

};

export default API;


