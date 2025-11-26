import { Outlet } from "react-router-dom";
import EllipseMobile from '../assets/Home/EllipseMobile.svg';
import SingleBox from '../assets/Home/singlebox.png';

export const AuthLayout = () => {
    return (

        <div className="flex flex-col items-center justify-between py-4 pt-14 mx-auto min-h-screen !overflow-hidden w-full gap-10">
            <div className="flex-1 flex items-center justify-center w-full max-w-6xl mx-auto relative !max-h-lg -mt-20">
                <Outlet />

                {/* Side Shades - inside the max width container */}
                <div className="absolute -left-[570px] top-[15%] -z-10 w-[900px]">
                    <div className="relative">
                        <img src={SingleBox} alt="box" className="absolute top-0 w-[80%] left-0" />
                        <img src={EllipseMobile} alt="elipse" className="absolute -top-20 w-[90%] left-10" />
                    </div>
                </div>

                <div className="absolute -right-[570px] top-[15%] -z-10 w-[900px]">
                    <div className="relative">
                        <img src={SingleBox} alt="box" className="absolute top-0 w-[80%] right-0" />
                        <img src={EllipseMobile} alt="elipse" className="absolute -top-20 w-[90%] right-10" />
                    </div>
                </div>
            </div>

            <footer className="text-gray-300 text-center text-sm font-semibold mt-auto w-full max-w-7xl mx-auto">
                <p>&copy; 2025 Tech Tren. All Rights Reserved.</p>
            </footer>
        </div>
    )
};
