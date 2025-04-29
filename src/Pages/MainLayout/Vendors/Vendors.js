import React, { useEffect, useState } from 'react';
import { Button, TextField, InputAdornment, Box, Modal, Fade, Typography } from '@mui/material';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import Backdrop from '@mui/material/Backdrop';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import Swal from 'sweetalert2';
import Loader from '../../Loader/Loader';
import API from '../../../Server';

const Vendors = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedVendorId, setSelectedVendorId] = useState(null);
    const [vendorForm, setvendorForm] = useState({
        vendorname: '',
        contactperson: '',
        contactnumber: '',
        location: '',
        product: '',
        orderdate: '',
        ordertotal: '',
        paymentstatus: '',
        status: ''
    });
    const [vendors, setVendors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleOpen = () => {
        setEditMode(false);
        setOpen(true);
        resetForm();
    };

    const handleClose = () => {
        setOpen(false);
        setEditMode(false);
        setSelectedVendorId(null);
        resetForm();
    };

    const resetForm = () => {
        setvendorForm({
            vendorname: '',
            contactperson: '',
            contactnumber: '',
            location: '',
            product: '',
            orderdate: '',
            ordertotal: '',
            paymentstatus: '',
            status: '',
        });
    };


    const columns = [
        { id: 'vendorname', label: 'Vendor Name' },
        { id: 'contactperson', label: 'Contact Person' },
        { id: 'contactnumber', label: 'Contact Number' },
        { id: 'location', label: 'Location' },
        { id: 'product', label: 'Product' },
        { id: 'orderdate', label: 'Order Date' },
        { id: 'ordertotal', label: 'Order Total', align: 'right' },
        { id: 'paymentstatus', label: 'Payment Status', align: 'center' },
        { id: 'status', label: 'Status', align: 'center' },
        { id: 'actions', label: 'Actions', align: 'center' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setvendorForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (editMode) {
                // Update vendor
                await axios.put(API.updateVendor(selectedVendorId), vendorForm);
                Swal.fire('Success', 'Vendor updated successfully!', 'success');
            } else {
                // Create new vendor
                await axios.post(API.createVendor, vendorForm);
                Swal.fire('Success', 'Vendor created successfully!', 'success');
            }
            handleClose();
            fetchVendors();
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };


    const fetchVendors = async () => {
        try {
            const response = await axios.get(API.getAllVendors);
            setVendors(response.data.data.reverse());
        } catch (error) {
            console.error('Error fetching vendors:', error);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const filterVendors = () =>
        vendors.filter(vendor =>
            vendor.vendorname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.contactperson?.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This action will permanently delete the vendor.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(API.deleteVendor(id));
                await Swal.fire('Deleted!', 'Vendor has been deleted successfully.', 'success');
                fetchVendors();
            } catch (error) {
                Swal.fire('Error!', 'Failed to delete vendor.', 'error');
                console.error('Delete error:', error);
            }
        }
    };

    const handleEdit = (id) => {
        const selectedVendor = vendors.find(v => v._id === id);
        if (selectedVendor) {
            setvendorForm({
                vendorname: selectedVendor.vendorname || '',
                contactperson: selectedVendor.contactperson || '',
                contactnumber: selectedVendor.contactnumber || '',
                location: selectedVendor.location || '',
                product: selectedVendor.product || '',
                orderdate: selectedVendor.orderdate ? selectedVendor.orderdate.slice(0, 10) : '',
                ordertotal: selectedVendor.ordertotal || '',
                paymentstatus: selectedVendor.paymentstatus || '',
                status: selectedVendor.status || '',
            });
            setSelectedVendorId(id);
            setEditMode(true);
            setOpen(true);
        }
    };



    return (
        <>
            {loading && <Loader />}

            <div className="container-fluid mt-2">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h1>Vendors</h1>
                    <Button
                        variant="contained"
                        startIcon={<Plus size={20} />}
                        style={{ backgroundColor: '#0d3b3d', textTransform: 'none' }}
                        onClick={handleOpen}
                    >
                        Add Vendors
                    </Button>
                </div>
            </div>

            {/* Search */}
            <div style={{ maxWidth: '350px', width: '100%' }} className="mb-3">
                <TextField
                    placeholder="Search by Vendor Name or Contact Name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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

            {/* Modal */}
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
                            {editMode ? 'Edit Vendor' : 'Add New Vendor'}
                        </Typography>

                        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
                            <div className="container-fluid">
                                <div className="row g-3">
                                    {[
                                        { label: 'Vendor Name', name: 'vendorname' },
                                        { label: 'Contact Person', name: 'contactperson' },
                                        { label: 'Contact Number', name: 'contactnumber', type: 'number' },
                                        { label: 'Location', name: 'location' },
                                        { label: 'Product', name: 'product' },
                                        { label: 'Order Date', name: 'orderdate', type: 'date' },
                                        { label: 'Order Total', name: 'ordertotal', type: 'number' },
                                    ].map(({ label, name, type = 'text' }) => (
                                        <div className="col-12" key={name}>
                                            <TextField
                                                fullWidth
                                                label={label}
                                                name={name}
                                                type={type}
                                                value={vendorForm[name] || ''}
                                                onChange={handleChange}
                                                variant="outlined"
                                                InputLabelProps={type === 'date' ? { shrink: true } : undefined}
                                            />
                                        </div>
                                    ))}

                                    <div className="col-12">
                                        <TextField
                                            fullWidth
                                            select
                                            label="Payment Status"
                                            name="paymentstatus"
                                            value={vendorForm.paymentstatus}
                                            onChange={handleChange}
                                            variant="outlined"
                                            SelectProps={{ native: true }}
                                        >
                                            <option value="">Payment Status</option>
                                            <option value="Cash">Cash</option>
                                            <option value="Online">Online</option>
                                            <option value="Pending">Pending</option>
                                        </TextField>
                                    </div>

                                    <div className="col-12">
                                        <TextField
                                            fullWidth
                                            select
                                            label="Status"
                                            name="status"
                                            value={vendorForm.status}
                                            onChange={handleChange}
                                            variant="outlined"
                                            SelectProps={{ native: true }}
                                        >
                                            <option value="">Status</option>
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </TextField>
                                    </div>

                                    <div className="col-12">
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            type="submit"
                                            style={{ backgroundColor: '#0d3b3d', textTransform: 'none' }}
                                        >
                                            <Typography variant="contained"
                                                fullWidth
                                                type="submit"
                                                style={{ backgroundColor: '#0d3b3d', textTransform: 'none' }}>
                                                {editMode ? 'Edit Vendor' : 'Add New Vendor'}
                                            </Typography>

                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </Box>
                </Fade>
            </Modal>

            {/* Table */}
            <div className='mt-3'>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <Box sx={{ overflowX: 'auto' }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
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
                                    {filterVendors()
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((vendor) => (
                                            <TableRow key={vendor._id} hover>
                                                <TableCell>{vendor.vendorname}</TableCell>
                                                <TableCell>{vendor.contactperson}</TableCell>
                                                <TableCell>{vendor.contactnumber}</TableCell>
                                                <TableCell>{vendor.location}</TableCell>
                                                <TableCell>{vendor.product}</TableCell>
                                                <TableCell>{new Date(vendor.orderdate).toLocaleDateString()}</TableCell>
                                                <TableCell align="right">₹{vendor.ordertotal}</TableCell>
                                                <TableCell align="center">
                                                    <span
                                                        style={{
                                                            backgroundColor:
                                                                vendor.paymentstatus === 'Cash' ? '#4caf50'
                                                                    : vendor.paymentstatus === 'Online' ? '#2196f3'
                                                                        : '#ff9800',
                                                            color: 'white',
                                                            padding: '4px 12px',
                                                            borderRadius: '12px',
                                                            fontWeight: 'bold',
                                                            minWidth: '90px',
                                                            display: 'inline-block',
                                                        }}
                                                    >
                                                        {vendor.paymentstatus}
                                                    </span>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <span
                                                        style={{
                                                            backgroundColor:
                                                                vendor.status === 'Active' ? '#00bfa5' : '#9e9e9e',
                                                            color: 'white',
                                                            padding: '4px 12px',
                                                            borderRadius: '12px',
                                                            fontWeight: 'bold',
                                                            minWidth: '90px',
                                                            textAlign: 'center',
                                                            display: 'inline-block',
                                                        }}
                                                    >
                                                        {vendor.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        onClick={() => handleEdit(vendor._id)}
                                                        style={{ marginRight: 8 }}
                                                    >
                                                        <Pencil size={16} />
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="error"
                                                        onClick={() => handleDelete(vendor._id)}
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
                        count={filterVendors().length}
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
    );
};

export default Vendors;
