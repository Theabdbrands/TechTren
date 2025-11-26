import { useState, useRef, useEffect } from "react";


interface DropdownOption {
    label: string;
    value: string;
}

interface CustomDropdownProps {
    value: string;
    onChange: (value: string) => void;
    options: DropdownOption[];
}

export const CustomDropdown = ({ value, onChange, options }: CustomDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const selectedOption = options.find(option => option.value === value);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {/* Dropdown Trigger */}
            <button
                type="button"
                className="w-full rounded-full bg-transparent border border-white/10 text-white py-3 px-5 cursor-pointer text-left flex items-center justify-between hover:border-white/20 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-sm">{selectedOption?.label || "Select an option"}</span>
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    className="absolute z-50 w-full mt-1 bg-zinc-900 border border-white/10 rounded-md shadow-lg"
                    style={{
                        background: 'rgba(20, 20, 20, 0.95)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-white/10 transition-colors ${value === option.value ? 'bg-white/10 text-white' : 'text-gray-300'
                                }`}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export const ReturnTypeDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState("highest");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const options = [
        { value: "highest", label: "Highest Return" },
        { value: "minimum", label: "Minimum Return" },
        { value: "average", label: "Average Share" },
        { value: "loss", label: "Loss Case" }
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const selectedOption = options.find(option => option.value === selectedValue);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {/* Dropdown Trigger */}
            <button
                type="button"
                className="w-full rounded-full bg-transparent border border-white/10 text-white py-3 px-5 cursor-pointer text-left flex items-center justify-between hover:border-white/20 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-sm">{selectedOption?.label || "Return Type"}</span>
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    className="absolute z-50 w-full mt-1 bg-zinc-900 border border-white/10 rounded-md shadow-lg"
                    style={{
                        background: 'rgba(20, 20, 20, 0.95)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-white/10 transition-colors ${selectedValue === option.value ? 'bg-white/10 text-white' : 'text-gray-300'
                                }`}
                            onClick={() => {
                                setSelectedValue(option.value);
                                setIsOpen(false);
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};


export const CoinsOnlyDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState("binance");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const options = [
        { value: "binance", label: "Binance" },
        { value: "etherium", label: "Etherium" },
        { value: "solana", label: "Solana" },
        { value: "musk", label: "Musk" }
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const selectedOption = options.find(option => option.value === selectedValue);

    return (
        <div className="relative w-full z-50" ref={dropdownRef}>
            {/* Dropdown Trigger */}
            <button
                type="button"
                className="w-full rounded-full bg-transparent border border-white/10 text-white py-3 px-5 cursor-pointer text-left flex items-center justify-between hover:border-white/20 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-sm">{selectedOption?.label || "Coins Only"}</span>
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    className="absolute !z-50 w-full mt-1 bg-zinc-900 border border-white/10 rounded-md shadow-lg"
                    style={{
                        background: 'rgba(20, 20, 20, 0.95)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-white/10 transition-colors ${selectedValue === option.value ? 'bg-white/10 text-white' : 'text-gray-300'
                                }`}
                            onClick={() => {
                                setSelectedValue(option.value);
                                setIsOpen(false);
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export const RealizedReturnDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState("realized");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const options = [
        { value: "realized", label: "Realized Return" },
        { value: "expected", label: "Expected Return" },
        { value: "minimum", label: "Minimum Wage" }
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const selectedOption = options.find(option => option.value === selectedValue);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {/* Dropdown Trigger */}
            <button
                type="button"
                className="w-full rounded-full bg-transparent border border-white/10 text-white py-3 px-5 cursor-pointer text-left flex items-center justify-between hover:border-white/20 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-sm">{selectedOption?.label || "Realized Return"}</span>
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    className="absolute z-50 w-full mt-1 bg-zinc-900 border border-white/10 rounded-md shadow-lg"
                    style={{
                        background: 'rgba(20, 20, 20, 0.95)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-white/10 transition-colors ${selectedValue === option.value ? 'bg-white/10 text-white' : 'text-gray-300'
                                }`}
                            onClick={() => {
                                setSelectedValue(option.value);
                                setIsOpen(false);
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};