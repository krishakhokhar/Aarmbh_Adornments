
import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { PackageOpen, BadgeDollarSign, Users, Calculator, ChartLine, ShoppingCart, UserRoundPen } from 'lucide-react'

// Import your logo
import logo from '../../images/logo.png'; // <-- your uploaded logo
import UserProfile from './UserProfile/UserProfile';
import Inventory from './Inventory/Inventory';
import Sales from './Sales/Sales';

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
        segment: 'Calculator',
        title: 'Calculator',
        icon: <Calculator />,
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

// Theme
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
});

// Content component
function DemoPageContent({ pathname }) {
    const segment = pathname.split('/')[1];

    const renderContent = () => {
        switch (segment) {
            case 'dashboard':
                return <Typography>Welcome to the Dashboard</Typography>;
            case 'inventory':
                return <Typography>
                    <Inventory />
                </Typography>;
            case 'purchases':
                return <Typography>Purchases Content</Typography>;
            case 'sales':
                return <Typography><Sales /></Typography>;
            case 'Vendors':
                return <Typography>Vendors Content</Typography>;
            case 'Calculator':
                return <Typography>Calculator Content</Typography>;
            case 'Reports':
                return <Typography>Reports Content</Typography>;
            case 'profile':
                return <Typography> <UserProfile /></Typography>;
            default:
                return <Typography>Page Not Found</Typography>;
        }
    };

    return (
        <div className='container-fluid mt-3'>
            <div>{renderContent()}</div>
        </div>
    );
}

DemoPageContent.propTypes = {
    pathname: PropTypes.string.isRequired,
};

// Main Layout
const MainLayout = (props) => {
    const { window } = props;
    const router = useDemoRouter('/dashboard');
    const demoWindow = window !== undefined ? window() : undefined;

    return (
        <AppProvider
            navigation={NAVIGATION}
            router={router}
            theme={demoTheme}
            window={demoWindow}
            branding={{
                logo: <img src={logo} alt="Aarambh Adornments" style={{ height: 40 }} />,
                title: '',
            }}
        >
            <DashboardLayout
                slots={{
                    headerToggleButton: null,
                    header: (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <img src={logo} alt="Aarambh Adornments" style={{ height: 40 }} />
                            </Box>
                        </Box>
                    ),
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

