import React from 'react'
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'

const Toast = React.forwardRef(({ status }, ref) => {
    if (!status) return null

    return (
        <div
            ref={ref}
            className={`fixed top-8 z-50 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-xl shadow-xl text-white flex items-center gap-3 text-lg font-medium
        ${status === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
        >
            {status === 'success' ? (
                <>
                    <FaCheckCircle className="text-white text-xl" />
                    Signup Successful!
                </>
            ) : (
                <>
                    <FaExclamationCircle className="text-white text-xl" />
                    Signup Failed. Try again.
                </>
            )}
        </div>
    )
})

export default Toast
