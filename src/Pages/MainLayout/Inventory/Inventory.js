import * as React from 'react';
import { Button, TextField, InputAdornment, Tabs, Tab, Box } from '@mui/material';
import { Plus, Pencil, Trash2, Search, PackageSearch } from 'lucide-react';
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
import StatusBadge from '../../../components/ui/StatusBadge';
import EmptyState from '../../../components/ui/EmptyState';

const LOW_STOCK_THRESHOLD = 5;

const getStockStatus = (item) => {
    if (item.itemQty === 0) return 'Out Of Stock';
    if (item.itemQty <= LOW_STOCK_THRESHOLD) return 'Low Stock';
    return 'In Stock';
};

const STOCK_STATUS_TONE = {
    'In Stock': 'success',
    'Low Stock': 'warning',
    'Out Of Stock': 'danger',
};

const Inventory = () => {
    const [value, setValue] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isEditMode, setIsEditMode] = React.useState(false); // to track add or edit
    const [editItemId, setEditItemId] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    // to store item ID during edit


    const [formData, setFormData] = React.useState({
        itemname: '',
        itemcategory: 'Jewelry',
        buyingprice: '',
        sellingprice: '',
        itemQty: '',
        status: 'In Stock',
    });
    const [items, setItems] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [initialLoading, setInitialLoading] = React.useState(true);
    const [sortConfig, setSortConfig] = React.useState({ key: null, direction: 'asc' });

    React.useEffect(() => {

        axios
            .get(API.getItems)
            .then((response) => {
                if (response.data && response.data.message === 'Items fetched successfully!') {
                    setItems(response.data.data.reverse());
                }
            })
            .catch((error) => {
                console.error('Error fetching items:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to fetch items!',
                    showConfirmButton: true,
                });
            })
            .finally(() => setInitialLoading(false));
    }, []);

    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setPage(0); // Reset page on tab switch
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const response = await axios.post(API.addNewItems, formData);
    //         if (response.data && response.data.message === "Item created successfully!") {
    //             Swal.fire({
    //                 icon: 'success',
    //                 title: 'Success!',
    //                 text: 'Item added successfully!',
    //                 showConfirmButton: false,
    //                 timer: 2000,
    //             });

    //             setFormData({
    //                 itemname: '',
    //                 itemcategory: 'Jewelry',
    //                 buyingprice: '',
    //                 sellingprice: '',
    //                 itemQty: '',
    //                 status: 'In Stock',
    //             });

    //             setItems((prevItems) => [response.data.data, ...prevItems]);
    //             setOpen(false);
    //         }
    //     } catch (error) {
    //         console.error('Error adding item:', error);
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Error',
    //             text: 'Failed to add item!',
    //             showConfirmButton: true,
    //         });
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const buyingNum = Number(formData.buyingprice);
        const sellingNum = Number(formData.sellingprice);
        const qtyNum = Number(formData.itemQty);

        if (!formData.itemname || !formData.itemcategory) {
            Swal.fire({ icon: 'error', title: 'Missing fields', text: 'Please fill all required fields!' });
            return;
        }
        if (!Number.isFinite(buyingNum) || buyingNum < 0 || !Number.isFinite(sellingNum) || sellingNum < 0) {
            Swal.fire({ icon: 'error', title: 'Invalid price', text: 'Prices cannot be negative.' });
            return;
        }
        if (!Number.isFinite(qtyNum) || qtyNum < 0) {
            Swal.fire({ icon: 'error', title: 'Invalid quantity', text: 'Quantity cannot be negative.' });
            return;
        }

        try {
            if (isEditMode) {
                // Update API
                setLoading(true)
                const response = await axios.put(API.updateItems(editItemId), formData);

                if (response.data && response.data.message === "Item updated successfully!") {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Item updated successfully!',
                        showConfirmButton: false,
                        timer: 2000,
                    });

                    // Update the item in items state
                    setItems((prevItems) =>
                        prevItems.map((item) => (item._id === editItemId ? response.data.data : item))
                    );

                    setIsEditMode(false);
                    setEditItemId(null);
                    setOpen(false);
                }
            } else {
                // Add API
                const response = await axios.post(API.addNewItems, formData);

                if (response.data && response.data.message === "Item created successfully!") {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Item added successfully!',
                        showConfirmButton: false,
                        timer: 2000,
                    });

                    setItems((prevItems) => [response.data.data, ...prevItems]);
                    setOpen(false);
                }
            }

            // Reset form after submit
            setFormData({
                itemname: '',
                itemcategory: 'Jewelry',
                buyingprice: '',
                sellingprice: '',
                itemQty: '',
                status: 'In Stock',
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: isEditMode ? 'Failed to update item!' : 'Failed to add item!',
                showConfirmButton: true,
            });
        } finally {
            setLoading(false)
        }
    };


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleEdit = async (item) => {
        try {
            setLoading(true)
            const response = await axios.get(API.getItemsById(item._id));
            if (response.data && response.data.message === "Item fetched successfully!") {
                setFormData(response.data.data); // Set formData with fetched item
                setEditItemId(item._id);          // Store the id
                setIsEditMode(true);              // Enable Edit mode
                setOpen(true);                    // Open the modal
            }
        } catch (error) {
            console.error('Error fetching item:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch item!',
                showConfirmButton: true,
            });
        } finally {
            setLoading(false)
        }
    };


    const handleDelete = async (id) => {
        const confirmResult = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',  // blue
            cancelButtonColor: '#d33',      // red
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (confirmResult.isConfirmed) {
            setLoading(true)
            try {
                const response = await axios.delete(API.deleteitmsById(id));
                console.log('Item deleted successfully:', response.data);

                // Remove the deleted item from the state
                setItems(prevItems => prevItems.filter(item => item._id !== id));

                // Success alert
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Your item has been deleted.',
                    showConfirmButton: false,
                    timer: 1500,
                });
            } catch (error) {
                console.error('Error deleting item:', error);

                Swal.fire({
                    icon: 'error',
                    title: 'Failed!',
                    text: 'Something went wrong.',
                    showConfirmButton: false,
                    timer: 2000,
                });
            } finally {
                setLoading(false)
            }
        }
    };

    const columns = [
        { id: 'sku', label: 'SKU', minWidth: 110 },
        { id: 'itemname', label: 'Item Name', minWidth: 170, sortable: true },
        { id: 'itemcategory', label: 'Category', minWidth: 100 },
        { id: 'buyingprice', label: 'Buying Price', minWidth: 130, align: 'right', sortable: true },
        { id: 'sellingprice', label: 'Selling Price', minWidth: 130, align: 'right', sortable: true },
        { id: 'itemQty', label: 'Quantity', minWidth: 110, align: 'right', sortable: true },
        { id: 'stockValue', label: 'Stock Value', minWidth: 130, align: 'right', sortable: true },
        { id: 'profit', label: 'Profit/Item', minWidth: 120, align: 'right', sortable: true },
        { id: 'status', label: 'Status', minWidth: 130, align: 'right' },
        { id: 'actions', label: 'Actions', minWidth: 130, align: 'center' },
    ];

    // Filter logic based on active tab - the "Low Stock" tab and the status
    // badge now both derive from the same live getStockStatus() computation,
    // so they can never disagree with each other.
    const filteredItems = items.filter((item) => {
        const tabFilter =
            value === 0 ||
            (value === 1 && item.itemcategory === 'Jewelry') ||
            (value === 2 && item.itemcategory === 'Rudrax') ||
            (value === 3 && getStockStatus(item) === 'Low Stock');

        const searchFilter =
            item.itemname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.itemcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.sku || '').toLowerCase().includes(searchTerm.toLowerCase());

        return tabFilter && searchFilter;
    });

    const sortedItems = React.useMemo(() => {
        if (!sortConfig.key) return filteredItems;
        const withComputed = filteredItems.map((item) => ({
            ...item,
            stockValue: item.buyingprice * item.itemQty,
            profit: item.sellingprice - item.buyingprice,
        }));
        withComputed.sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];
            if (typeof aVal === 'string') {
                return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            }
            return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
        });
        return withComputed;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredItems, sortConfig]);


    return (
        <>
            {
                loading && (
                    <Loader />
                )
            }
            <div className="container-fluid mt-2">
                <PageHeader
                    title="Inventory"
                    subtitle="Track stock levels, pricing and profit across every item."
                    action={(
                        <Button
                            variant="contained"
                            className="aarmbh-btn-primary"
                            startIcon={<Plus size={20} />}
                            onClick={handleOpen}
                        >
                            Add New Inventory Item
                        </Button>
                    )}
                />

                {/* Search Bar */}
                <div style={{ maxWidth: '350px', width: '100%' }}>
                    <TextField
                        placeholder="Search..."
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(0); // Reset page when search changes
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search size={18} />
                                </InputAdornment>
                            ),
                            style: {
                                backgroundColor: '#f5f5f5',
                                borderRadius: 8,
                            }
                        }}
                    />
                </div>


                {/* Tabs */}
                <div className="mt-4">
                    <div className="row justify-content-start g-0">
                        <div className="col-auto">
                            <Box sx={{ bgcolor: '#f5f5f5', p: 0.5, borderRadius: 2 }}>
                                <Tabs
                                    value={value}
                                    onChange={handleChange}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    textColor="inherit"
                                    TabIndicatorProps={{ style: { display: 'none' } }}
                                >
                                    {['All Items', 'Jewelry', 'Rudrax', 'Low Stock'].map((label, index) => (
                                        <Tab
                                            key={label}
                                            label={label}
                                            sx={{
                                                bgcolor: value === index ? 'white' : 'transparent',
                                                fontWeight: value === index ? 'bold' : 'normal',
                                                borderRadius: 1,
                                                textTransform: 'none',
                                                minHeight: '36px',
                                                px: 2,
                                            }}
                                        />
                                    ))}
                                </Tabs>
                            </Box>
                        </div>
                    </div>
                </div>
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
                        className="aarmbh-modal-card"
                        sx={{
                            width: { xs: '92%', sm: '85%', md: 520 },
                            p: { xs: 2, md: 3 },
                        }}
                    >
                        <Typography variant="h6" mb={2} fontWeight="bold" textAlign="center">
                            {isEditMode ? 'Edit Inventory Item' : 'Add New Inventory Item'}
                        </Typography>

                        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
                            <div className="container-fluid">
                                <div className="row g-2">
                                    {/* Row 1: Item Name | Category */}
                                    <div className="col-12 col-md-6">
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Item Name"
                                            name="itemname"
                                            value={formData.itemname}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                        />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <TextField
                                            fullWidth
                                            size="small"
                                            select
                                            label="Select Category"
                                            name="itemcategory"
                                            value={formData.itemcategory}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                            SelectProps={{ native: true }}
                                        >
                                            <option value="Jewelry">Jewelry</option>
                                            <option value="Rudrax">Rudrax</option>
                                        </TextField>
                                    </div>

                                    {/* Row 2: Buying Price | Selling Price */}
                                    <div className="col-12 col-md-6">
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Buying Price"
                                            name="buyingprice"
                                            value={formData.buyingprice}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                            type="number"
                                            inputProps={{ min: 0 }}
                                            onWheel={(e) => e.target.blur()}
                                        />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Selling Price"
                                            name="sellingprice"
                                            value={formData.sellingprice}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                            type="number"
                                            inputProps={{ min: 0 }}
                                            onWheel={(e) => e.target.blur()}
                                        />
                                    </div>

                                    {/* Row 3: Quantity | Status */}
                                    <div className="col-12 col-md-6">
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Quantity"
                                            name="itemQty"
                                            value={formData.itemQty}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                            type="number"
                                            inputProps={{ min: 0 }}
                                            onWheel={(e) => e.target.blur()}
                                        />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <TextField
                                            fullWidth
                                            size="small"
                                            select
                                            label="Select Status"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                            SelectProps={{ native: true }}
                                        >
                                            <option value="In Stock">In Stock</option>
                                            <option value="Low Stock">Low Stock</option>
                                            <option value="Out Of Stock">Out Of Stock</option>
                                        </TextField>
                                    </div>
                                    <div className="col-12 mt-1">
                                        <Button
                                            variant="contained"
                                            className="aarmbh-btn-primary"
                                            fullWidth
                                            type="submit"
                                        >
                                            {isEditMode ? 'Update Item' : 'Save Item'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </Box>
                </Fade>
            </Modal>

            {/* Table Section */}
            <div className="mt-3">
                <Paper className="aarmbh-card" sx={{ width: '100%', overflow: 'hidden' }}>
                    {/* Make the table container scrollable on small screens */}
                    <Box sx={{ maxWidth: '100%', overflowX: 'auto' }}>
                        <TableContainer sx={{ maxHeight: 480 }}>
                            <Table stickyHeader aria-label="sticky table" className="aarmbh-table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align || 'left'}
                                                onClick={column.sortable ? () => handleSort(column.id) : undefined}
                                                sx={{
                                                    minWidth: column.minWidth,
                                                    cursor: column.sortable ? 'pointer' : 'default',
                                                    userSelect: 'none',
                                                }}
                                            >
                                                {column.label}
                                                {column.sortable && sortConfig.key === column.id && (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {initialLoading && (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                                                Loading inventory...
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {!initialLoading && sortedItems.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={columns.length}>
                                                <EmptyState
                                                    icon={PackageSearch}
                                                    title={items.length === 0 ? 'No inventory items yet.' : 'No items match your search/filter.'}
                                                    subtitle={items.length === 0 ? 'Add your first product to start tracking stock and profit.' : 'Try a different search term or category.'}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {!initialLoading && sortedItems
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((item) => {
                                            const stockStatus = getStockStatus(item);
                                            const stockValue = item.buyingprice * item.itemQty;
                                            const profit = item.sellingprice - item.buyingprice;
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={item._id}>
                                                    <TableCell>{item.sku || '-'}</TableCell>
                                                    <TableCell>{item.itemname}</TableCell>
                                                    <TableCell>{item.itemcategory}</TableCell>
                                                    <TableCell align="right">₹{item.buyingprice}</TableCell>
                                                    <TableCell align="right">₹{item.sellingprice}</TableCell>
                                                    <TableCell align="right">{item.itemQty}</TableCell>
                                                    <TableCell align="right">₹{stockValue}</TableCell>
                                                    <TableCell align="right">₹{profit}</TableCell>

                                                    <TableCell align="right">
                                                        <StatusBadge label={stockStatus} tone={STOCK_STATUS_TONE[stockStatus]} />
                                                    </TableCell>

                                                    <TableCell align="center">
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            startIcon={<Pencil size={16} />}
                                                            sx={{ mr: 1 }}
                                                            onClick={() => handleEdit(item)}
                                                        />
                                                        <Button
                                                            variant="outlined"
                                                            color="error"
                                                            size="small"
                                                            startIcon={<Trash2 size={16} />}
                                                            onClick={() => handleDelete(item._id)}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>

                    {/* Pagination */}
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={sortedItems.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </div>

        </>
    );
};

export default Inventory;
