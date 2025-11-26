export const SectionSkeleton = ({ height = "h-96" }: { height?: string }) => (
    <div className={`animate-pulse ${height} w-full max-w-6xl mx-auto px-4`}>
        <div className="h-12 bg-gray-800/50 rounded-lg w-3/4 mx-auto mb-6"></div>
        <div className="h-6 bg-gray-800/30 rounded w-1/2 mx-auto mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-72 bg-gray-800/40 rounded-2xl"></div>
            ))}
        </div>
    </div>
)

export const CardSkeleton = () => (
    <div className="animate-pulse glass rounded-4xl p-6 h-full">
        <div className="h-48 bg-gray-800/40 rounded-xl mb-4"></div>
        <div className="h-6 bg-gray-800/30 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-800/20 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-800/20 rounded w-5/6"></div>
    </div>
)

export const HeroSkeleton = () => (
    <div className="animate-pulse pt-28 max-w-6xl mx-auto px-4">
        <div className="h-16 bg-gray-800/50 rounded-lg w-3/4 mx-auto mb-6"></div>
        <div className="h-6 bg-gray-800/30 rounded w-1/2 mx-auto mb-8"></div>
        <div className="flex gap-4 justify-center mb-12">
            <div className="h-12 bg-gray-800/40 rounded-full w-40"></div>
            <div className="h-12 bg-gray-800/30 rounded-full w-32"></div>
        </div>
        <div className="h-96 bg-gray-800/40 rounded-2xl"></div>
    </div>
)