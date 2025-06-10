import React from 'react';

const Main = ({
    children,
    backgroundColor = 'from-orange-50',
    toColor = 'to-red-50',
    containerClass = '',
}) => {
    return (
        <div className={`min-h-screen bg-gradient-to-br ${backgroundColor} ${toColor}`}>
            <div
                className={`mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-screen-2xl ${containerClass}`}
            >
                {children}
            </div>
        </div>
    );
};

export default Main;
