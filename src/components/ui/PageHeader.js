import React from 'react';

const PageHeader = ({ title, subtitle, action }) => (
    <div className="aarmbh-page-header">
        <div>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
        </div>
        {action}
    </div>
);

export default PageHeader;
