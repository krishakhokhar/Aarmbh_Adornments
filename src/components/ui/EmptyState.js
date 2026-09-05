import React from 'react';
import { Typography } from '@mui/material';

const EmptyState = ({ icon: Icon, title, subtitle, action }) => (
    <div className="aarmbh-empty-state">
        {Icon && <Icon size={40} strokeWidth={1.5} />}
        <Typography variant="subtitle1" fontWeight={600} color="text.primary">{title}</Typography>
        {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
        {action}
    </div>
);

export default EmptyState;
