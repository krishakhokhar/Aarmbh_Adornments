import React from 'react';

const TONE_STYLES = {
    success: { bg: '#e8f5ec', color: '#1e7d3a' },
    warning: { bg: '#fdf1de', color: '#a3660a' },
    danger: { bg: '#fbe8e8', color: '#b3261e' },
    info: { bg: '#e7f0fb', color: '#1a5fa8' },
    gold: { bg: '#faf3df', color: '#8a6d1d' },
    neutral: { bg: '#eef0ef', color: '#4a4a4a' },
};

const StatusBadge = ({ label, tone = 'neutral' }) => {
    const style = TONE_STYLES[tone] || TONE_STYLES.neutral;
    return (
        <span className="aarmbh-badge" style={{ backgroundColor: style.bg, color: style.color }}>
            {label}
        </span>
    );
};

export default StatusBadge;
