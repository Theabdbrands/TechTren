// DashboardLayout.tsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import { TopbarProvider } from '@/api/hooks/TopbarContext';
import DashboardMobileHeader from './DashboardMobileHeader';

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [chartData, setChartData] = useState(null);
    const [newsSearchQuery, setNewsSearchQuery] = useState('');
    const [isSearchActive, setIsSearchActive] = useState(false); // Add this state

    // Handler for news search
    const handleNewsSearch = (query: string) => {
        setNewsSearchQuery(query);
    };

    // Handler for search active state
    const handleSearchActiveChange = (active: boolean) => {
        setIsSearchActive(active);
    };

    return (
        <TopbarProvider>
            <div className={`relative flex py-4 gap-2 transition-all duration-300 ${isSearchActive ? 'search-active' : ''
                }`}>
                {/* Blur Overlay */}
                {isSearchActive && (
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 pointer-events-none"
                        style={{ backdropFilter: 'blur(4px)' }}
                    />
                )}

                <div className='sticky top-4 hidden md:block h-screen z-50'>
                    <DashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                </div>

                <div className="flex-1 flex flex-col gap-4 relative z-50">
                    <div className='sticky top-4 z-50 backdrop-blur-sm rounded-full hidden sm:block'>
                        {/* Pass the search active handler to DashboardHeader */}
                        <DashboardHeader
                            setChartData={setChartData}
                            onNewsSearch={handleNewsSearch}
                            onSearchActiveChange={handleSearchActiveChange}
                        />
                    </div>
                    <div className='block sm:hidden'>
                        <DashboardMobileHeader
                            setChartData={setChartData}
                            onNewsSearch={handleNewsSearch}
                            onSearchActiveChange={handleSearchActiveChange}
                        />
                    </div>

                    <main className={`flex-1 px-2 sm:px-4 pb-6 mt-4 transition-all duration-300 ${isSearchActive ? 'opacity-40 pointer-events-none' : ''
                        }`}>
                        <Outlet context={{
                            chartData,
                            setChartData,
                            newsSearchQuery,
                            setNewsSearchQuery
                        }} />
                    </main>
                </div>

                {/* Background blobs - make them dull when search is active */}
                <div className={`overflow-hidden transition-all duration-300 ${isSearchActive ? 'opacity-30' : ''
                    }`}>
                    {/* Left Gradient Blob */}
                    <div className="fixed top-[-40px] left-[-250px] hidden sm:block w-[600px] h-[450px] rounded-full bg-[linear-gradient(275.19deg,#14E893_-15.5%,#5131AD_98.25%)] opacity-60 blur-[100px] saturate-[0.5] z-[-90]"></div>

                    {/* Right Gradient Blob */}
                    <div className="fixed top-[-160px] right-[-350px] hidden sm:block w-[600px] h-[450px] rounded-full bg-[linear-gradient(275.19deg,#14E893_-15.5%,#5131AD_98.25%)] opacity-60 blur-[100px] saturate-[0.5] z-[-90]"></div>
                </div>
            </div>
        </TopbarProvider>
    );
};

export default DashboardLayout;