import React from 'react';
import { Button, Card, CardContent, Typography, Avatar, Divider, Box } from '@mui/material';
import { LogOut, Mail, ShieldCheck, Fingerprint } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import PageHeader from '../../../components/ui/PageHeader';

const UserProfile = () => {
  const navigate = useNavigate();
  const email = (typeof window !== 'undefined' && localStorage.getItem('email')) || '';
  const adminId = (typeof window !== 'undefined' && localStorage.getItem('adminId')) || '';
  const initials = email ? email.charAt(0).toUpperCase() : 'A';

  const handleLogout = () => {
    localStorage.removeItem('adminId');
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="container-fluid">
      <PageHeader title="Profile" subtitle="Your admin account details." />

      <div className="row">
        <div className="col-12 col-md-7 col-lg-6">
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Avatar sx={{ width: 64, height: 64, bgcolor: '#0d3b3d', fontSize: 26, fontWeight: 700 }}>
                  {initials}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700}>{email || 'Admin'}</Typography>
                  <Typography variant="body2" color="text.secondary">Aarmbh Adornments Administrator</Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Box display="flex" alignItems="center" gap={1.5} sx={{ py: 1 }}>
                <Mail size={18} color="#767c78" />
                <Box>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography variant="body2" fontWeight={600}>{email || 'Not available'}</Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" gap={1.5} sx={{ py: 1 }}>
                <Fingerprint size={18} color="#767c78" />
                <Box>
                  <Typography variant="caption" color="text.secondary">Account ID</Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ wordBreak: 'break-all' }}>{adminId || 'Not available'}</Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" gap={1.5} sx={{ py: 1 }}>
                <ShieldCheck size={18} color="#767c78" />
                <Box>
                  <Typography variant="caption" color="text.secondary">Role</Typography>
                  <Typography variant="body2" fontWeight={600}>Administrator</Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Button
                variant="contained"
                color="error"
                startIcon={<LogOut size={18} />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
