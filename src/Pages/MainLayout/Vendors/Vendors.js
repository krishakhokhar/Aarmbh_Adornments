import React, { useEffect, useState } from 'react';
import { Button, TextField, InputAdornment, Box, Modal, Fade, Typography } from '@mui/material';
import { Plus, Pencil, Trash2, Search, History, Users, IndianRupee } from 'lucide-react';
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
import PageHeader from '../../../components/ui/PageHeader';
import StatCard from '../../../components/ui/StatCard';
import StatusBadge from '../../../components/ui/StatusBadge';
import EmptyState from '../../../components/ui/EmptyState';

const PAYMENT_STATUS_TONE = { Cash: 'success', Online: 'info', Pending: 'warning' };
const VENDOR_STATUS_TONE = { Active: 'success', Inactive: 'neutral' };

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
    const [summaryOpen, setSummaryOpen] = useState(false);
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [summaryData, setSummaryData] = useState(null);

    const handleViewSummary = async (vendorname) => {
        setSummaryOpen(true);
        setSummaryLoading(true);
        try {
            const response = await axios.get(API.getVendorSummary(vendorname));
            setSummaryData(response.data.data);
        } catch (error) {
            console.error('Failed to fetch vendor summary:', error);
            Swal.fire('Error', 'Failed to load vendor purchase history.', 'error');
            setSummaryOpen(false);
        } finally {
            setSummaryLoading(false);
        }
    };

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
                <PageHeader
                    title="Vendors"
                    subtitle="Manage supplier relationships and payments."
                    action={(
                        <Button
                            variant="contained"
                            className="aarmbh-btn-primary"
                            startIcon={<Plus size={20} />}
                            onClick={handleOpen}
                        >
                            Add Vendor
                        </Button>
                    )}
                />

                <div className="row mb-3">
                    <div className="col-12 col-sm-6 col-md-4 mb-3 mb-md-0">
                        <StatCard icon={Users} label="Vendor Entries" value={vendors.length} accent="#0d3b3d" helperText="total records" />
                    </div>
                    <div className="col-12 col-sm-6 col-md-4 mb-3 mb-md-0">
                        <StatCard icon={Users} label="Active Vendors" value={vendors.filter((v) => v.status === 'Active').length} accent="#0d8a7a" />
                    </div>
                    <div className="col-12 col-sm-6 col-md-4">
                        <StatCard
                            icon={IndianRupee}
                            label="Total Order Value"
                            value={vendors.reduce((sum, v) => sum + (v.ordertotal || 0), 0)}
                            prefix="₹"
                            accent="#b8923a"
                        />
                    </div>
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
                        className="aarmbh-modal-card"
                        sx={{
                            width: { xs: '90%', sm: '80%', md: 600 },
                            p: { xs: 2, md: 4 },
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
                                            className="aarmbh-btn-primary"
                                            fullWidth
                                            type="submit"
                                            size="large"
                                        >
                                            {editMode ? 'Update Vendor' : 'Add Vendor'}
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
                <Paper className="aarmbh-card" sx={{ width: '100%', overflow: 'hidden' }}>
                    <Box sx={{ overflowX: 'auto' }}>
                        <TableContainer sx={{ maxHeight: 480 }}>
                            <Table stickyHeader className="aarmbh-table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell key={column.id} align={column.align || 'left'}>
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filterVendors().length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={columns.length}>
                                                <EmptyState
                                                    icon={Users}
                                                    title={vendors.length === 0 ? 'No vendors added yet.' : 'No vendors match your search.'}
                                                    subtitle={vendors.length === 0 ? 'Add your first vendor to start tracking supplier orders.' : 'Try a different name.'}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    )}
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
                                                    <StatusBadge label={vendor.paymentstatus} tone={PAYMENT_STATUS_TONE[vendor.paymentstatus]} />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <StatusBadge label={vendor.status} tone={VENDOR_STATUS_TONE[vendor.status]} />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        onClick={() => handleViewSummary(vendor.vendorname)}
                                                        style={{ marginRight: 8 }}
                                                        title="View purchase history"
                                                    >
                                                        <History size={16} />
                                                    </Button>
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

            {/* Vendor purchase history / summary */}
            <Modal open={summaryOpen} onClose={() => setSummaryOpen(false)} closeAfterTransition slots={{ backdrop: Backdrop }} slotProps={{ backdrop: { timeout: 500 } }}>
                <Fade in={summaryOpen}>
                    <Box
                        className="aarmbh-modal-card"
                        sx={{
                            width: { xs: '90%', sm: '80%', md: 650 },
                            maxHeight: '85vh',
                            overflowY: 'auto',
                            p: { xs: 2, md: 4 },
                        }}
                    >
                        {summaryLoading && <Typography textAlign="center">Loading purchase history...</Typography>}
                        {!summaryLoading && summaryData && (
                            <>
                                <Typography variant="h5" mb={1} fontWeight="bold">
                                    {summaryData.vendorname}
                                </Typography>
                                <Typography variant="body1" mb={2}>
                                    Total Purchase Amount: <strong>₹{summaryData.totalPurchaseAmount}</strong>
                                    {' · '}
                                    Pending Payment: <strong style={{ color: '#ff9800' }}>₹{summaryData.pendingPayment}</strong>
                                </Typography>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Order Date</TableCell>
                                            <TableCell>Product</TableCell>
                                            <TableCell align="right">Order Total</TableCell>
                                            <TableCell align="center">Payment Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {summaryData.entries.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={4} align="center" sx={{ color: 'text.secondary' }}>No order history found.</TableCell>
                                            </TableRow>
                                        )}
                                        {summaryData.entries.map((entry) => (
                                            <TableRow key={entry._id}>
                                                <TableCell>{entry.orderdate ? new Date(entry.orderdate).toLocaleDateString() : '-'}</TableCell>
                                                <TableCell>{entry.product}</TableCell>
                                                <TableCell align="right">₹{entry.ordertotal}</TableCell>
                                                <TableCell align="center">{entry.paymentstatus}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </>
                        )}
                    </Box>
                </Fade>
            </Modal>
        </>
    );
};

export default Vendors;
