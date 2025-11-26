import type { SearchResult } from "@/types/prediction";

export const SearchDropdown = ({
    results,
    isSearching,
    onClick,
    selectedId,
}: {
    results: SearchResult[];
    isSearching: boolean;
    onClick: (result: SearchResult) => void;
    selectedId: string | null;
}) => {
    return (
        <div
            className="absolute top-full left-0 right-0 mt-2 z-50 max-h-60 overflow-y-auto rounded-xl shadow-xl"
            style={{
                background: "rgba(10, 10, 10, 0.95)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(10px)",
            }}
        >
            {isSearching ? (
                <div className="p-4 text-center text-gray-400">Searching...</div>
            ) : results.length > 0 ? (
                results.map((result) => {
                    const isActive = selectedId === result.id;

                    return (
                        <div
                            key={result.id}
                            onClick={() => onClick(result)}
                            className={`
                px-4 py-3 cursor-pointer border-b border-white/10 last:border-b-0        
                ${isActive ? "bg-[#22ff9a]" : "hover:bg-white/5"} 
              `}
                        >
                            <div
                                className={`font-medium ${isActive ? "text-black" : "text-white"
                                    }`}
                            >
                                {result.metadata?.name || result.desc}
                            </div>

                            <div
                                className={`text-sm ${isActive ? "text-black/70" : "text-gray-400"
                                    }`}
                            >
                                {result.id}
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="p-4 text-center text-gray-400">No results found</div>
            )}
        </div>
    );
};
