// AccordionItem.jsx
import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'

const AccordionItem = ({ question, answer }) => {
    const detailsRef = useRef(null)
    const contentRef = useRef(null)

    useEffect(() => {
        const el = detailsRef.current

        const animateOpen = () => {
            gsap.fromTo(
                contentRef.current,
                { height: 0, opacity: 0 },
                {
                    height: 'auto',
                    opacity: 1,
                    duration: 0.4,
                    ease: 'power2.out',
                }
            )
        }

        const animateClose = () => {
            gsap.to(contentRef.current, {
                height: 0,
                opacity: 0,
                duration: 0.3,
                ease: 'power2.inOut',
            })
        }

        const handleToggle = () => {
            if (el.open) {
                animateOpen()
            } else {
                animateClose()
            }
        }

        el.addEventListener('toggle', handleToggle)

        return () => {
            el.removeEventListener('toggle', handleToggle)
        }
    }, [])

    return (
        <details
            ref={detailsRef}
            className="mb-4 bg-[#1a1a1a] p-6 rounded-lg border border-yellow/20 overflow-hidden"
        >
            <summary className="cursor-pointer text-yellow text-lg font-semibold">
                {question}
            </summary>
            <div
                ref={contentRef}
                className="text-gray-300 mt-3 text-left bg-[#2a2a2a] p-4 rounded-xl border border-yellow/10 overflow-hidden"
                style={{ height: 0, opacity: 0 }}
            >
                {answer}
            </div>
        </details>
    )
}

export default AccordionItem
