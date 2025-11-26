import { useEffect, useRef, useState } from 'react'

export const useInView = (options = {}) => {
    const ref = useRef<HTMLDivElement>(null)
    const [isInView, setIsInView] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.05, rootMargin: '100px', ...options }
        )

        if (ref.current) observer.observe(ref.current)

        return () => observer.disconnect()
    }, [])

    return [ref, isInView] as const
}