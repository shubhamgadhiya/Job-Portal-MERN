import React from 'react';

const Loader = () => {
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-50 z-50">
            <div className="loader border-t-transparent border-solid border-slate-800 border-4 rounded-full w-16 h-16 animate-spin"></div>
            <style>
                {`
                .loader {
                    border-top-width: 4px;
                    border-bottom-width: 4px;
                }
                `}
            </style>
        </div>
    );
};

export default Loader;
