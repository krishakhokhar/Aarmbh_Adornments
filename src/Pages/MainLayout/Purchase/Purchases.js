import React, { useState, useEffect } from 'react'
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

const Purchases = () => {

    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [purchases, setPurchases] = useState([]);
    const [filteredPurchases, setFilteredPurchases] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [formData, setFormData] = useState({
        _id: '', // Add _id to track whether it's an edit or a create
        productname: '',
        date: '',
        productqty: '',
        productprice: '',
        paymentmod: 'Cash',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    useEffect(() => {
        fetchPurchases();
    }, [])

    useEffect(() => {
        const filtered = purchases.filter(purchase =>
            purchase.productname?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredPurchases(filtered);
        setPage(0); // Reset to first page on new search
    }, [searchQuery, purchases]);

    const purchaseColumns = [
        { id: 'productname', label: 'Product Name' },
        { id: 'date', label: 'Date' },
        { id: 'productqty', label: 'Quantity' },
        { id: 'productprice', label: 'Price', align: 'right' },
        { id: 'paymentmod', label: 'Payment Mode', align: 'center' },
        { id: 'actions', label: 'Actions', align: 'center' },
    ];



    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(API.createpurchasedata, formData);

            if (response.status === 201) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Purchase added successfully',
                    timer: 2000,
                    showConfirmButton: false,
                });

                // Reset form
                setFormData({
                    productname: '',
                    date: '',
                    productqty: '',
                    productprice: '',
                    paymentmod: 'Cash'
                });

                setOpen(false);
                fetchPurchases();
            } else {
                throw new Error('Failed to save');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.message || 'Something went wrong',
            });
        }
    };


    const fetchPurchases = async () => {
        try {
            const response = await axios.get(API.getAllPurchasedata);
            setPurchases(response.data.data.reverse());
            setFilteredPurchases(response.data.data);
        } catch (error) {
            console.error('Failed to fetch purchases:', error);
        }
    };

    const handleDelete = (id) => {
        // Show the confirmation dialog
        Swal.fire({
            title: 'Are you sure?',
            text: 'This will permanently delete the purchase data.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                // Proceed with the deletion if user confirmed
                try {
                    const response = await axios.delete(API.deleteDataById(id));
                    if (response.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: 'Purchase data has been deleted.',
                            timer: 2000,
                            showConfirmButton: false,
                        });
                        // Refetch the purchases after deletion
                        fetchPurchases();
                    } else {
                        throw new Error('Failed to delete');
                    }
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: error.message || 'Something went wrong',
                    });
                }
            }
        });
    };

    const handleEdit = async (id) => {
        try {
            const response = await axios.get(`http://localhost:2222/admin/get/purchasebyid/${id}`);

            if (response.data && response.data.data) {
                const data = response.data.data;

                setFormData({
                    _id: data._id ?? '', // Ensure fallback
                    productname: data.productname ?? '',
                    date: data.date ?? '',
                    productqty: data.productqty ?? '',
                    productprice: data.productprice ?? '',
                    paymentmod: data.paymentmod ?? 'Cash',
                });
                setOpen(true);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to fetch purchase data.',
            });
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
                    <h1>My Purchase</h1>
                    <Button
                        variant="contained"
                        startIcon={<Plus size={20} />}
                        style={{ backgroundColor: '#0d3b3d', textTransform: 'none' }}
                        onClick={handleOpen}
                    >
                        New Purchases
                    </Button>
                </div>
            </div>

            <div style={{ maxWidth: '350px', width: '100%' }} className="mb-3">
                <TextField
                    placeholder="Search by Product Name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search size={18} />
                            </InputAdornment>
                        ),
                        style: { backgroundColor: '#f5f5f5', borderRadius: 8 },
                    }}
                />
            </div>

            <Modal
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{ backdrop: { timeout: 500 } }}
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
                            Add New Purchase
                        </Typography>

                        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
                            <div className="container-fluid">
                                <div className="row g-3">
                                    <div className="col-12">
                                        <TextField
                                            fullWidth
                                            label="Product Name"
                                            name="productname"
                                            value={formData.productname}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                        />
                                    </div>
                                    <div className="col-12">
                                        <TextField
                                            fullWidth
                                            type="date"
                                            label="Date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <TextField
                                            fullWidth
                                            label="Quantity"
                                            name="productqty"
                                            value={formData.productqty}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                            type="number"
                                        />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <TextField
                                            fullWidth
                                            label="Price"
                                            name="productprice"
                                            value={formData.productprice}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                            type="number"
                                        />
                                    </div>
                                    <div className="col-12">
                                        <TextField
                                            fullWidth
                                            select
                                            label="Payment Mode"
                                            name="paymentmod"
                                            value={formData.paymentmod}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                            SelectProps={{ native: true }}
                                        >
                                            <option value="Cash">Cash</option>
                                            <option value="Online">Online</option>
                                            <option value="Pending">Pending</option>
                                        </TextField>
                                    </div>
                                    <div className="col-12">
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            type="submit"
                                            style={{ backgroundColor: '#0d3b3d', textTransform: 'none' }}
                                        >
                                            Save Purchase
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </Box>
                </Fade>
            </Modal>

            <div className='mt-3'>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <Box sx={{ overflowX: 'auto' }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        {purchaseColumns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align || 'left'}
                                                sx={{
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
                                    {filteredPurchases
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((purchase) => (
                                            <TableRow key={purchase._id} hover>
                                                <TableCell>{purchase.productname}</TableCell>
                                                <TableCell>{new Date(purchase.date).toLocaleDateString()}</TableCell>
                                                <TableCell>{purchase.productqty}</TableCell>
                                                <TableCell align="right">₹{purchase.productprice}</TableCell>
                                                <TableCell align="center">
                                                    <span
                                                        style={{
                                                            backgroundColor:
                                                                purchase.paymentmod === 'Cash'
                                                                    ? '#4caf50'
                                                                    : purchase.paymentmod === 'Online'
                                                                        ? '#2196f3'
                                                                        : '#ff9800',
                                                            color: 'white',
                                                            padding: '4px 12px',
                                                            borderRadius: '12px',
                                                            fontWeight: 'bold',
                                                            minWidth: '90px',
                                                            display: 'inline-block',
                                                        }}
                                                    >
                                                        {purchase.paymentmod}
                                                    </span>
                                                </TableCell>
                                                <TableCell align="center">
                                                    {/* <Button
                                                        size="small"
                                                        variant="outlined"
                                                        onClick={() => handleEdit(purchase._id)}
                                                        style={{ marginRight: 8 }}
                                                    >
                                                        <Pencil size={16} />
                                                    </Button> */}
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="error"
                                                        onClick={() => handleDelete(purchase._id)}
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

                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50]}
                        component="div"
                        count={filteredPurchases.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(e, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(e) => {
                            setRowsPerPage(+e.target.value);
                            setPage(0);
                        }}
                    />
                </Paper>
            </div>
        </>
    )
}

export default Purchases