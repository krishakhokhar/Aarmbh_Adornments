
import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Badge from '@mui/material/Badge';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import { PackageOpen, BadgeDollarSign, Users, ChartLine, ShoppingCart, UserRoundPen, Bell, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

// Import your logo
import logo from '../../images/logo.png'; // <-- your uploaded logo
import UserProfile from './UserProfile/UserProfile';
import Inventory from './Inventory/Inventory';
import Sales from './Sales/Sales';
import Vendors from './Vendors/Vendors';
import Purchases from './Purchase/Purchases';
import Dashboard from './Dashboard/Dashboard';
import Reports from './Reports/Reports';

const NAVIGATION = [
    {
        kind: 'header',
        title: 'Main items',
    },
    {
        segment: 'dashboard',
        title: 'Dashboard',
        icon: <DashboardIcon />,
    },
    {
        segment: 'inventory',
        title: 'Inventory',
        icon: <PackageOpen />,
    },
    {
        segment: 'purchases',
        title: 'Purchases',
        icon: <ShoppingCart />,
    },
    {
        segment: 'sales',
        title: 'Sales',
        icon: <BadgeDollarSign />,
    },
    {
        segment: 'Vendors',
        title: 'Vendors',
        icon: <Users />,
    },
    {
        segment: 'Reports',
        title: 'Reports',
        icon: <ChartLine />,
    },
    {
        segment: 'profile',
        title: 'Profile',
        icon: <UserRoundPen />,
    },
];

const PAGE_META = {
    dashboard: { title: 'Dashboard', subtitle: 'Overview' },
    inventory: { title: 'Inventory', subtitle: 'Manage your stock' },
    purchases: { title: 'Purchases', subtitle: 'Restock activity' },
    sales: { title: 'Sales', subtitle: 'Sales activity' },
    Vendors: { title: 'Vendors', subtitle: 'Supplier relationships' },
    Reports: { title: 'Reports', subtitle: 'Business reporting' },
    profile: { title: 'Profile', subtitle: 'Account settings' },
};

// Premium jewelry-brand theme: deep emerald + warm gold on an ivory canvas.
// This cascades into every MUI component across the authenticated portal
// (including Toolpad's own sidebar/navbar), which is what keeps every page
// visually consistent without having to restyle each component by hand.
const demoTheme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 600,
            lg: 1200,
            xl: 1536,
        },
    },
    palette: {
        primary: { main: '#0d3b3d', dark: '#082726', light: '#12494b' },
        secondary: { main: '#b8923a', light: '#d9b45c' },
        background: { default: '#faf8f4', paper: '#ffffff' },
        text: { primary: '#262a28', secondary: '#767c78' },
    },
    shape: { borderRadius: 14 },
    typography: {
        fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
        h5: { fontWeight: 700 },
        h6: { fontWeight: 700 },
        subtitle1: { fontWeight: 600 },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 18,
                    border: '1px solid #e7e2d6',
                    boxShadow: '0 2px 10px rgba(13,59,61,0.06)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 10,
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: { fontWeight: 600 },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: { borderRight: '1px solid #e7e2d6' },
            },
        },
    },
});

// Content component
function DemoPageContent({ pathname }) {
    const segment = pathname.split('/')[1];

    const renderContent = () => {
        switch (segment) {
            case 'dashboard':
                return <Dashboard />;
            case 'inventory':
                return <Inventory />;
            case 'purchases':
                return <Purchases />;
            case 'sales':
                return <Sales />;
            case 'Vendors':
                return <Vendors />;
            case 'Reports':
                return <Reports />;
            case 'profile':
                return <UserProfile />;
            default:
                return <Typography>Page Not Found</Typography>;
        }
    };

    return (
        <div className='container-fluid mt-3 aarmbh-page-bg'>
            <div>{renderContent()}</div>
        </div>
    );
}

DemoPageContent.propTypes = {
    pathname: PropTypes.string.isRequired,
};

// Top navbar: page title on the left, notification + admin avatar/menu on the right.
function PortalHeader({ segment }) {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const email = (typeof window !== 'undefined' && localStorage.getItem('email')) || '';
    const initials = email ? email.charAt(0).toUpperCase() : 'A';
    const meta = PAGE_META[segment] || { title: '', subtitle: '' };

    const handleLogout = () => {
        localStorage.removeItem('adminId');
        localStorage.removeItem('email');
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                <img src={logo} alt="Aarambh Adornments" style={{ height: 36 }} />
                <Box sx={{ display: { xs: 'none', sm: 'block' }, minWidth: 0 }}>
                    <Typography variant="subtitle2" fontWeight={700} noWrap sx={{ color: '#262a28', lineHeight: 1.2 }}>
                        {meta.title}
                    </Typography>
                    <Typography variant="caption" noWrap sx={{ color: '#767c78' }}>
                        {meta.subtitle}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tooltip title="Notifications">
                    <IconButton size="small">
                        <Badge variant="dot" color="warning" invisible>
                            <Bell size={19} color="#767c78" />
                        </Badge>
                    </IconButton>
                </Tooltip>
                <Tooltip title={email || 'Admin'}>
                    <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#0d3b3d', fontSize: 14, fontWeight: 700 }}>
                            {initials}
                        </Avatar>
                    </IconButton>
                </Tooltip>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                    <Box sx={{ px: 2, py: 1 }}>
                        <Typography variant="body2" fontWeight={600} noWrap>{email || 'Admin'}</Typography>
                    </Box>
                    <Divider />
                    <MenuItem onClick={handleLogout} sx={{ gap: 1, color: '#b3261e' }}>
                        <LogOut size={16} /> Logout
                    </MenuItem>
                </Menu>
            </Box>
        </Box>
    );
}

// Main Layout
const MainLayout = (props) => {
    const { window } = props;
    const router = useDemoRouter('/dashboard');
    const demoWindow = window !== undefined ? window() : undefined;
    const segment = router.pathname.split('/')[1];

    return (
        <AppProvider
            navigation={NAVIGATION}
            router={router}
            theme={demoTheme}
            window={demoWindow}
            branding={{
                logo: <img src={logo} alt="Aarambh Adornments" style={{ height: 40 }} />,
                title: 'Aarmbh Adornments',
            }}
        >
            <DashboardLayout
                slots={{
                    headerToggleButton: null,
                    header: <PortalHeader segment={segment} />,
                }}
            >
                <DemoPageContent pathname={router.pathname} />
            </DashboardLayout>
        </AppProvider>
    );
};

MainLayout.propTypes = {
    window: PropTypes.func,
};

export default MainLayout;
