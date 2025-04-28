import * as React from 'react';
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

const Inventory = () => {
    const [value, setValue] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isEditMode, setIsEditMode] = React.useState(false); // to track add or edit
    const [editItemId, setEditItemId] = React.useState(null);   // to store item ID during edit


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
            });
    }, []);

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
        try {
            if (isEditMode) {
                // Update API
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
            }
        }
    };

    const columns = [
        { id: 'itemname', label: 'Item Name', minWidth: 170 },
        { id: 'itemcategory', label: 'Category', minWidth: 100 },
        { id: 'buyingprice', label: 'Buying Price', minWidth: 170, align: 'right' },
        { id: 'sellingprice', label: 'Selling Price', minWidth: 170, align: 'right' },
        { id: 'itemQty', label: 'Quantity', minWidth: 170, align: 'right' },
        { id: 'status', label: 'Status', minWidth: 170, align: 'right' },
        { id: 'actions', label: 'Actions', minWidth: 170, align: 'center' },
    ];

    // Filter logic based on active tab
    const filteredItems = items.filter((item) => {
        // Tab filter
        const tabFilter =
            value === 0 ||
            (value === 1 && item.itemcategory === 'Jewelry') ||
            (value === 2 && item.itemcategory === 'Rudrax') ||
            (value === 3 && item.status === 'Low Stock');

        // Search filter
        const searchFilter =
            item.itemname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.itemcategory.toLowerCase().includes(searchTerm.toLowerCase());

        return tabFilter && searchFilter;
    });


    return (
        <>
            <div className="container-fluid mt-2">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h1>Inventory</h1>
                    <Button
                        variant="contained"
                        startIcon={<Plus size={20} />}
                        style={{ backgroundColor: '#0d3b3d', textTransform: 'none' }}
                        onClick={handleOpen}
                    >
                        Add Items
                    </Button>
                </div>

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
                            Add New Inventory Item
                        </Typography>

                        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
                            <div className="container-fluid">
                                <div className="row g-3">
                                    <div className="col-12">
                                        <TextField
                                            fullWidth
                                            label="Item Name"
                                            name="itemname"
                                            value={formData.itemname}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                        />
                                    </div>
                                    <div className="col-12">
                                        <TextField
                                            fullWidth
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

                                    <div className="col-12 col-md-6">
                                        <TextField
                                            fullWidth
                                            label="Buying Price"
                                            name="buyingprice"
                                            value={formData.buyingprice}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                            type="number"
                                        />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <TextField
                                            fullWidth
                                            label="Selling Price"
                                            name="sellingprice"
                                            value={formData.sellingprice}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                            type="number"
                                        />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <TextField
                                            fullWidth
                                            label="Quantity"
                                            name="itemQty"
                                            value={formData.itemQty}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                            type="number"
                                        />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <TextField
                                            fullWidth
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
                                    <div className="col-12">
                                        {/* <Button
                                            variant="contained"
                                            fullWidth
                                            type="submit"
                                            style={{ backgroundColor: '#0d3b3d', textTransform: 'none' }}
                                        >
                                            Save Item
                                        </Button> */}
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            type="submit"
                                            style={{ backgroundColor: '#0d3b3d', textTransform: 'none' }}
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
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    {/* Make the table container scrollable on small screens */}
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
                                    {filteredItems
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((item, index) => (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={item._id}
                                                sx={{
                                                    backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
                                                    '&:hover': { backgroundColor: '#e0f7fa' },
                                                }}
                                            >
                                                <TableCell>{item.itemname}</TableCell>
                                                <TableCell>{item.itemcategory}</TableCell>
                                                <TableCell align="right">{item.buyingprice}</TableCell>
                                                <TableCell align="right">{item.sellingprice}</TableCell>
                                                <TableCell align="right">{item.itemQty}</TableCell>
                                                {/* <TableCell align="right">
                                                    <span
                                                        style={{
                                                            backgroundColor:
                                                                item.status === 'In Stock'
                                                                    ? '#4caf50'
                                                                    : item.status === 'Low Stock'
                                                                        ? '#ff9800'
                                                                        : '#f44336',
                                                            color: 'white',
                                                            padding: '4px 12px',
                                                            borderRadius: '12px',
                                                            fontWeight: 'bold',
                                                            minWidth: '90px',
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        {item.status}
                                                    </span>
                                                </TableCell> */}

                                                <TableCell align="right">
                                                    <span
                                                        style={{
                                                            backgroundColor:
                                                                item.itemQty === 0
                                                                    ? '#f44336' // Out of Stock (red)
                                                                    : item.itemQty === 2
                                                                        ? '#ff9800' // Low Stock (orange)
                                                                        : '#4caf50', // In Stock (green)
                                                            color: 'white',
                                                            padding: '4px 12px',
                                                            borderRadius: '12px',
                                                            fontWeight: 'bold',
                                                            minWidth: '90px',
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        {item.itemQty === 0
                                                            ? 'Out of Stock'
                                                            : item.itemQty === 2
                                                                ? 'Low Stock'
                                                                : 'In Stock'}
                                                    </span>
                                                </TableCell>

                                                <TableCell align="center">
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        size="small"
                                                        startIcon={<Pencil size={16} />}
                                                        sx={{ mr: 1 }}
                                                        onClick={() => handleEdit(item)}
                                                    />
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        size="small"
                                                        startIcon={<Trash2 size={16} />}
                                                        onClick={() => handleDelete(item._id)}
                                                    />
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
                        count={filteredItems.length}
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
