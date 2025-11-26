import { useState, useEffect, useRef } from 'react'

interface OptimizedImageProps {
    src: string
    alt: string
    className?: string
    aspectRatio?: string
    priority?: boolean
}

export const OptimizedImage = ({
    src,
    alt,
    className = "",
    aspectRatio = "16/9",
    priority = false
}: OptimizedImageProps) => {
    const [loaded, setLoaded] = useState(false)
    const [inView, setInView] = useState(priority)
    const imgRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (priority) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true)
                    observer.disconnect()
                }
            },
            { rootMargin: '100px' }
        )

        if (imgRef.current) observer.observe(imgRef.current)

        return () => observer.disconnect()
    }, [priority])

    return (
        <div
            ref={imgRef}
            className="relative overflow-hidden"
            style={{ aspectRatio }}
        >
            {!loaded && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800/40 via-gray-700/30 to-gray-800/40 animate-pulse" />
            )}
            {inView && (
                <img
                    src={src}
                    alt={alt}
                    loading={priority ? "eager" : "lazy"}
                    decoding="async"
                    className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
                    onLoad={() => setLoaded(true)}
                />
            )}
        </div>
    )
}