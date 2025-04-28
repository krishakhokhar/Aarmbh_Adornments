import React, { useState, useEffect } from 'react'
import './Sales.css'
import { Button, TextField, InputAdornment, Tabs, Tab, Box } from '@mui/material';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Swal from 'sweetalert2';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import API from '../../../Server';
import Loader from '../../Loader/Loader';

const Sales = () => {
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [salesData, setSalesData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = React.useState(false);
    const [itemNames, setItemNames] = useState([]);
    const [formData, setFormData] = useState({
        productname: '',
        date: '',
        customername: '',
        category: '',
        qty: '',
        productprice: '',
        total: 0,
        paymentstatus: ''
    });

    const filterSalesData = () => {
        return salesData.filter((sale) => {
            const customerName = sale.customername.toLowerCase();
            const productName = sale.productname.toLowerCase();
            const query = searchQuery.toLowerCase();

            // Filter by customer name or product name
            return customerName.includes(query) || productName.includes(query);
        });
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };


    useEffect(() => {
        // Fetch all product names
        const fetchItemNames = async () => {
            
            try {
                const response = await axios.get(API.getAllitemsname);
                setItemNames(response.data.data);
            } catch (error) {
                console.error('Failed to fetch item names:', error);
            }
        };
        fetchItemNames();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
            total: name === 'qty' || name === 'productprice'
                ? (name === 'qty' ? value : prevData.qty) * (name === 'productprice' ? value : prevData.productprice)
                : prevData.total
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                // Update sale
                setLoading(true);
                const response = await axios.put(`${API.updateSalesData}/${editingId}`, formData);
                if (response.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Sale Updated Successfully!',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
            } else {
                // Add new sale
                const response = await axios.post(API.addSalesData, formData);
                if (response.status === 201 || response.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Sale Added Successfully!',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
            }

            setFormData({
                productname: '',
                date: '',
                customername: '',
                category: '',
                qty: '',
                productprice: '',
                total: 0,
                paymentstatus: '',
            });
            setIsEditing(false);
            setEditingId(null);
            setOpen(false);
            fetchSalesData();
        } catch (error) {
            console.error('Error saving/updating sale:', error);
            Swal.fire({
                icon: 'error',
                title: 'Failed to save Sale',
                text: error.response?.data?.message || 'Something went wrong!',
            });
        }finally{
            setLoading(false);
        }
    };

    const handleEdit = async (id) => {
        try {
            setLoading(true);
            const response = await axios.get(`${API.getSalesDataById}/${id}`);
            const saleData = response.data.data;

            // Important: Make sure the data structure matches your formData fields exactly
            setFormData({
                productname: saleData.productname || '',
                date: saleData.date ? new Date(saleData.date).toISOString().substr(0, 10) : '',
                customername: saleData.customername || '',
                category: saleData.category || '',
                qty: saleData.qty || '',
                productprice: saleData.productprice || '',
                total: saleData.total || 0,
                paymentstatus: saleData.paymentstatus || '',
            });

            setEditingId(id);
            setIsEditing(true);
            setOpen(true);
        } catch (error) {
            console.error('Error fetching sale:', error);
            Swal.fire('Error', 'Failed to fetch sale details', 'error');
        }finally{
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setLoading(true);
                    await axios.delete(`${API.deleteSalesDataById}/${id}`);
                    Swal.fire('Deleted!', 'Sale has been deleted.', 'success');
                    fetchSalesData();
                } catch (error) {
                    console.error('Error deleting sale:', error);
                    Swal.fire('Error', 'Failed to delete sale', 'error');
                }finally{
                    setLoading(false);
                }
            }
        });
    };



    const columns = [
        { id: 'productname', label: 'Product Name' },
        { id: 'date', label: 'Date' },
        { id: 'customername', label: 'Customer Name' },
        { id: 'category', label: 'Category' },
        { id: 'qty', label: 'Quantity', align: 'right' },
        { id: 'productprice', label: 'Product Price', align: 'right' },
        { id: 'total', label: 'Total', align: 'right' },
        { id: 'paymentstatus', label: 'Payment Status', align: 'center' },
        { id: 'actions', label: 'Actions', align: 'center' }

    ];

    useEffect(() => {
        fetchSalesData();
    }, []);

    const fetchSalesData = async () => {
        try {
            const response = await fetch(API.getallsalesData);
            const result = await response.json();
            if (response.ok) {
                setSalesData(result.data);
            } else {
                console.error(result.message);
            }
        } catch (error) {
            console.error('Error fetching sales data:', error);
        }
    };



    return (
        <>
            {
                loading && (
                    <Loader />
                )
            }
            <div className="container-fluid mt-2">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h1>Sales</h1>
                    <Button
                        variant="contained"
                        startIcon={<Plus size={20} />}
                        style={{ backgroundColor: '#0d3b3d', textTransform: 'none' }}
                        onClick={handleOpen}
                    >
                        New Sales
                    </Button>
                </div>

                {/* Search Bar */}
                <div style={{ maxWidth: '350px', width: '100%' }}>
                    <TextField
                        placeholder="Search by Customer Name or Product Name"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={searchQuery}
                        onChange={handleSearchChange}  // Update search query
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search size={18} />
                                </InputAdornment>
                            ),
                            style: {
                                backgroundColor: '#f5f5f5',
                                borderRadius: 8,
                            },
                        }}
                    />
                </div>


                {/* Add Item Modal */}
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                        backdrop: { timeout: 500 },
                    }}
                >
                    <Fade in={open}>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: { xs: '90%', sm: '80%', md: 600 },
                                bgcolor: 'background.paper',
                                borderRadius: 3,
                                boxShadow: 24,
                                p: { xs: 2, md: 4 },
                                outline: 'none',
                            }}
                        >
                            <Typography variant="h5" mb={3} fontWeight="bold" textAlign="center">
                                Add New Sale
                            </Typography>

                            <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
                                <div className="container-fluid">
                                    <div className="row g-3">
                                        {/* Product Name */}
                                        <div className="col-12">
                                            <TextField
                                                fullWidth
                                                select
                                                label="Select Product"
                                                name="productname"
                                                value={formData.productname}
                                                onChange={handleChange}
                                                variant="outlined"
                                                SelectProps={{ native: true }}
                                            >
                                                <option value="">Select Product</option>
                                                {itemNames.map((item, index) => (
                                                    <option key={index} value={item}>
                                                        {item}
                                                    </option>
                                                ))}
                                            </TextField>
                                        </div>

                                        {/* Date */}
                                        <div className="col-12">
                                            <TextField
                                                fullWidth
                                                label="Date"
                                                name="date"
                                                type="date"
                                                value={formData.date}
                                                onChange={handleChange}
                                                InputLabelProps={{ shrink: true }}
                                                variant="outlined"
                                            />
                                        </div>

                                        {/* Customer Name */}
                                        <div className="col-12">
                                            <TextField
                                                fullWidth
                                                label="Customer Name"
                                                name="customername"
                                                value={formData.customername}
                                                onChange={handleChange}
                                                variant="outlined"
                                            />
                                        </div>

                                        {/* Category */}
                                        <div className="col-12">
                                            <TextField
                                                fullWidth
                                                select
                                                label="Select Category"
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                variant="outlined"
                                                SelectProps={{ native: true }}
                                            >
                                                <option value="">Select Category</option>
                                                <option value="Jewelry">Jewelry</option>
                                                <option value="Rudrax">Rudrax</option>
                                            </TextField>
                                        </div>

                                        {/* Quantity */}
                                        <div className="col-12 col-md-6">
                                            <TextField
                                                fullWidth
                                                label="Quantity"
                                                name="qty"
                                                type="number"
                                                value={formData.qty}
                                                onChange={handleChange}
                                                variant="outlined"
                                            />
                                        </div>

                                        {/* Product Price */}
                                        <div className="col-12 col-md-6">
                                            <TextField
                                                fullWidth
                                                label="Product Price"
                                                name="productprice"
                                                type="number"
                                                value={formData.productprice}
                                                onChange={handleChange}
                                                variant="outlined"
                                            />
                                        </div>

                                        {/* Total */}
                                        <div className="col-12">
                                            <TextField
                                                fullWidth
                                                label="Total"
                                                name="total"
                                                type="number"
                                                value={formData.total}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                variant="outlined"
                                            />
                                        </div>

                                        {/* Payment Status */}
                                        <div className="col-12">
                                            <TextField
                                                fullWidth
                                                select
                                                label="Payment Status"
                                                name="paymentstatus"
                                                value={formData.paymentstatus}
                                                onChange={handleChange}
                                                variant="outlined"
                                                SelectProps={{ native: true }}
                                            >
                                                <option value="">Select Payment Status</option>
                                                <option value="Cash">Cash</option>
                                                <option value="Online">Online</option>
                                                <option value="Pending">Pending</option>
                                            </TextField>
                                        </div>

                                        {/* Submit Button */}
                                        <div className="col-12">
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                type="submit"
                                                style={{ backgroundColor: '#0d3b3d', textTransform: 'none' }}
                                            >
                                                Save Sale
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Box>
                        </Box>
                    </Fade>
                </Modal>
            </div>

            {/* table */}

            {/* Table */}
            <div className="mt-3">
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <Box sx={{ maxWidth: '100%', overflowX: 'auto' }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align || 'left'}
                                                sx={{
                                                    minWidth: column.minWidth,
                                                    fontWeight: 'bold',
                                                    color: 'white',
                                                    bgcolor: '#0d3b3d',
                                                    borderBottom: '1px solid #ccc',
                                                }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filterSalesData()  // Use filtered sales data here
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((sale, index) => (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={sale._id}
                                                sx={{
                                                    backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
                                                    '&:hover': { backgroundColor: '#e0f7fa' },
                                                }}
                                            >
                                                <TableCell>{sale.productname}</TableCell>
                                                <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                                                <TableCell>{sale.customername}</TableCell>
                                                <TableCell>{sale.category}</TableCell>
                                                <TableCell align="right">{sale.qty}</TableCell>
                                                <TableCell align="right">₹{sale.productprice}</TableCell>
                                                <TableCell align="right">₹{sale.total}</TableCell>
                                                <TableCell align="center">
                                                    <span
                                                        style={{
                                                            backgroundColor:
                                                                sale.paymentstatus === 'Cash'
                                                                    ? '#4caf50'
                                                                    : sale.paymentstatus === 'Online'
                                                                        ? '#2196f3'
                                                                        : '#ff9800',
                                                            color: 'white',
                                                            padding: '4px 12px',
                                                            borderRadius: '12px',
                                                            fontWeight: 'bold',
                                                            minWidth: '90px',
                                                            textAlign: 'center',
                                                            display: 'inline-block',
                                                        }}
                                                    >
                                                        {sale.paymentstatus}
                                                    </span>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="primary"
                                                        onClick={() => handleEdit(sale._id)}
                                                        style={{ marginRight: 8 }}
                                                    >
                                                        <Pencil size={16} />
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="error"
                                                        onClick={() => handleDelete(sale._id)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>

                    {/* Pagination */}
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={filterSalesData().length}  // Use filtered data count
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(event, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(event) => {
                            setRowsPerPage(+event.target.value);
                            setPage(0);
                        }}
                    />
                </Paper>
            </div>
        </>
    )
}

export default Sales