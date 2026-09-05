import React from 'react';
import { Typography, Box } from '@mui/material';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import CountUp from 'react-countup';

// Shared premium stat tile used across the Dashboard, Purchases, Sales and
// Vendors summary rows - keeps every number card visually consistent.
const StatCard = ({ icon: Icon, label, value, prefix = '', suffix = '', growthPercentage, accent = '#0d3b3d', helperText }) => {
    const hasTrend = growthPercentage !== undefined && growthPercentage !== null;
    const isPositive = hasTrend && growthPercentage >= 0;

    return (
        <div className="aarmbh-stat-card">
            <Box display="flex" alignItems="center" justifyContent="space-between">
                {Icon && (
                    <div className="aarmbh-stat-card__icon" style={{ background: `${accent}17`, color: accent }}>
                        <Icon size={20} />
                    </div>
                )}
            </Box>
            <Typography variant="caption" className="aarmbh-stat-card__label">{label}</Typography>
            <Typography variant="h5" className="aarmbh-stat-card__value">
                {prefix}<CountUp end={value || 0} duration={1.2} separator="," />{suffix}
            </Typography>
            {hasTrend ? (
                <Typography variant="caption" className={`aarmbh-trend ${isPositive ? 'up' : 'down'}`}>
                    {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {Math.abs(growthPercentage)}% from last month
                </Typography>
            ) : (
                helperText && <Typography variant="caption" color="text.secondary">{helperText}</Typography>
            )}
        </div>
    );
};

export default StatCard;
