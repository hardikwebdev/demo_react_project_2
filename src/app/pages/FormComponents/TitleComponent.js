import React from 'react';
import Helmet from 'react-helmet';

const TitleComponent = ({ title, icon }) => {
    var defaultTitle = '⚛️ Aipxperts';
    return (
        <Helmet>
            {/* <link rel="icon" type="image/png" href={icon} /> */}
            <link rel="apple-touch-icon" href={icon} />
            <title>{title ? title : defaultTitle}</title>
        </Helmet>
    );
};

export { TitleComponent };