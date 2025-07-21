import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { XCircle, CheckCircle } from 'lucide-react'
import gsap from 'gsap'

const AlertDialog = ({ type = 'success', message = '', onClose }) => {
    const dialogRef = useRef(null)
    const closeTimeout = useRef(null)

    useEffect(() => {
        // Animate in
        gsap.fromTo(
            dialogRef.current,
            { y: -50, opacity: 0, scale: 0.9 },
            { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
        )

        // Start auto-dismiss
        closeTimeout.current = setTimeout(() => handleClose(), 3000)

        return () => clearTimeout(closeTimeout.current)
    }, [])

    const handleClose = () => {
        if (!dialogRef.current) return
        clearTimeout(closeTimeout.current)

        gsap.to(dialogRef.current, {
            y: -30,
            opacity: 0,
            scale: 0.9,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                if (onClose) onClose()
            },
        })
    }

    const colors = {
        success: {
            bg: 'bg-green-600/10',
            icon: <CheckCircle size={24} className="text-green-400" />
        },
        error: {
            bg: 'bg-red-600/10',
            icon: <XCircle size={24} className="text-red-400" />
        }
    }

    const alertContent = (
        <div
            ref={dialogRef}
            className={`fixed top-8 left-1/2 -translate-x-1/2 z-[99999] pointer-events-auto shadow-xl rounded-xl px-6 py-4 flex items-center gap-3 backdrop-blur-sm border border-white/10 text-white ${colors[type].bg}`}
        >
            {colors[type].icon}
            <div className="text-sm font-medium">{message}</div>
            <button
                onClick={handleClose}
                className="ml-auto text-sm opacity-60 hover:opacity-100 transition"
            >
                ✕
            </button>
        </div>
    )

    return createPortal(alertContent, document.body)
}

export default AlertDialog
