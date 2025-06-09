import React from 'react'

const Main = ({ children, backgroundColor = "from-orange-50" }) => {
    return (
        <div className={`min-h-screen bg-gradient-to-br ${backgroundColor} to-red-50`}>
            <div className="container mx-auto max-w-screen-2xl p-4 sm:p-6 space-y-6">
                {children}
            </div>
        </div>
    )
}

export default Main;
