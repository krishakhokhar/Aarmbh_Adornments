// const baseUrl = "http://localhost:2222";
const baseUrl = "https://aarambhbackend.onrender.com";

// Define your endpoints
const API = {
    AdminLogin: `${baseUrl}/admin/login`,
    AdminSendCode: `${baseUrl}/admin/sendcode`,
    VerifyCode: `${baseUrl}/admin/verifycode`,
    ResetPassword: `${baseUrl}/admin/resetPassword`,
    getItems: `${baseUrl}/admin/getallitems`,
    addNewItems : `${baseUrl}/admin/addnewitems`,
    deleteitems : `${baseUrl}/admin/deleteitems`,
    updateItems: (editItemId) => `${baseUrl}/admin/updateitems/${editItemId}`,
    getItemsById: (itemId) => `${baseUrl}/admin/getitemsbyid/${itemId}`,
    deleteitmsById: (itemId) => `${baseUrl}/admin/deleteitems/${itemId}`,


};

export default API;


