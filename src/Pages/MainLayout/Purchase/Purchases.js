import React, { useState, useEffect } from 'react'
import { Button, TextField, InputAdornment, Box } from '@mui/material';
import { Plus, Trash2, Search, ShoppingCart, ScrollText } from 'lucide-react';
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
import PageHeader from '../../../components/ui/PageHeader';
import StatCard from '../../../components/ui/StatCard';
import StatusBadge from '../../../components/ui/StatusBadge';
import EmptyState from '../../../components/ui/EmptyState';

const PAYMENT_MODE_TONE = { Cash: 'success', Online: 'info', Pending: 'warning' };

const Purchases = () => {

    const [open, setOpen] = React.useState(false);
    const [loading] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [purchases, setPurchases] = useState([]);
    const [filteredPurchases, setFilteredPurchases] = useState([]);
    const [items, setItems] = useState([]);
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
        // Product Name must reference a real inventory item so purchases can
        // reliably update that item's stock.
        const fetchItems = async () => {
            try {
                const response = await axios.get(API.getItems);
                setItems(response.data.data || []);
            } catch (error) {
                console.error('Failed to fetch items:', error);
            }
        };
        fetchItems();
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
        { id: 'total', label: 'Total', align: 'right' },
        { id: 'paymentmod', label: 'Payment Mode', align: 'center' },
        { id: 'actions', label: 'Actions', align: 'center' },
    ];



    const handleSubmit = async (e) => {
        e.preventDefault();

        const qtyNum = Number(formData.productqty);
        const priceNum = Number(formData.productprice);

        if (!formData.productname || !formData.date || !formData.paymentmod) {
            Swal.fire({ icon: 'error', title: 'Missing fields', text: 'Please fill all required fields!' });
            return;
        }
        if (!Number.isFinite(qtyNum) || qtyNum < 1) {
            Swal.fire({ icon: 'error', title: 'Invalid quantity', text: 'Quantity must be greater than 0.' });
            return;
        }
        if (!Number.isFinite(priceNum) || priceNum < 0) {
            Swal.fire({ icon: 'error', title: 'Invalid price', text: 'Price cannot be negative.' });
            return;
        }

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



    return (
        <>
            {
                loading && (
                    <Loader />
                )
            }

            <div className="container-fluid mt-2">
                <PageHeader
                    title="Purchases"
                    subtitle="Track restocking activity and supplier spend."
                    action={(
                        <Button
                            variant="contained"
                            className="aarmbh-btn-primary"
                            startIcon={<Plus size={20} />}
                            onClick={handleOpen}
                        >
                            New Purchase
                        </Button>
                    )}
                />

                <div className="row mb-3">
                    <div className="col-12 col-sm-6 col-md-4 mb-3 mb-md-0">
                        <StatCard icon={ShoppingCart} label="Total Purchases" value={purchases.length} accent="#0d3b3d" helperText="records" />
                    </div>
                    <div className="col-12 col-sm-6 col-md-4">
                        <StatCard
                            icon={ScrollText}
                            label="Total Spend"
                            value={purchases.reduce((sum, p) => sum + (p.total ?? p.productqty * p.productprice), 0)}
                            prefix="₹"
                            accent="#b8923a"
                            helperText="all time"
                        />
                    </div>
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
                        className="aarmbh-modal-card"
                        sx={{
                            width: { xs: '92%', sm: '85%', md: 520 },
                            p: { xs: 2, md: 3 },
                        }}
                    >
                        <Typography variant="h6" mb={2} fontWeight="bold" textAlign="center">
                            Add New Purchase
                        </Typography>

                        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
                            <div className="container-fluid">
                                <div className="row g-2">
                                    {/* Row 1: Product | Date */}
                                    <div className="col-12 col-md-6">
                                        <TextField
                                            fullWidth
                                            size="small"
                                            select
                                            label="Select Product"
                                            name="productname"
                                            value={formData.productname}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                            SelectProps={{ native: true }}
                                        >
                                            <option value="">Select Product</option>
                                            {items.map((item) => (
                                                <option key={item._id} value={item.itemname}>
                                                    {item.itemname}
                                                </option>
                                            ))}
                                        </TextField>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <TextField
                                            fullWidth
                                            size="small"
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

                                    {/* Row 2: Quantity | Price */}
                                    <div className="col-12 col-md-6">
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Quantity"
                                            name="productqty"
                                            value={formData.productqty}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                            type="number"
                                            inputProps={{ min: 1 }}
                                            onWheel={(e) => e.target.blur()}
                                        />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Price"
                                            name="productprice"
                                            value={formData.productprice}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                            type="number"
                                            inputProps={{ min: 0 }}
                                            onWheel={(e) => e.target.blur()}
                                        />
                                    </div>

                                    {/* Row 3: Payment Mode */}
                                    <div className="col-12 col-md-6">
                                        <TextField
                                            fullWidth
                                            size="small"
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
                                    <div className="col-12 col-md-6 d-none d-md-block" />

                                    <div className="col-12 mt-1">
                                        <Button
                                            variant="contained"
                                            className="aarmbh-btn-primary"
                                            fullWidth
                                            type="submit"
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
                <Paper className="aarmbh-card" sx={{ width: '100%', overflow: 'hidden' }}>
                    <Box sx={{ overflowX: 'auto' }}>
                        <TableContainer sx={{ maxHeight: 480 }}>
                            <Table stickyHeader className="aarmbh-table">
                                <TableHead>
                                    <TableRow>
                                        {purchaseColumns.map((column) => (
                                            <TableCell key={column.id} align={column.align || 'left'}>
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredPurchases.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={purchaseColumns.length}>
                                                <EmptyState
                                                    icon={ShoppingCart}
                                                    title={purchases.length === 0 ? 'No purchases found.' : 'No purchases match your search.'}
                                                    subtitle={purchases.length === 0 ? 'New purchases will appear here and automatically update your stock.' : 'Try a different product name.'}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {filteredPurchases
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((purchase) => (
                                            <TableRow key={purchase._id} hover>
                                                <TableCell>{purchase.productname}</TableCell>
                                                <TableCell>{new Date(purchase.date).toLocaleDateString()}</TableCell>
                                                <TableCell>{purchase.productqty}</TableCell>
                                                <TableCell align="right">₹{purchase.productprice}</TableCell>
                                                <TableCell align="right">₹{purchase.total ?? purchase.productqty * purchase.productprice}</TableCell>
                                                <TableCell align="center">
                                                    <StatusBadge label={purchase.paymentmod} tone={PAYMENT_MODE_TONE[purchase.paymentmod]} />
                                                </TableCell>
                                                <TableCell align="center">
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