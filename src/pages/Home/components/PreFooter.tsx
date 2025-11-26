import { useState } from "react";
import { Button } from "@/components/ui/button";
import Logo from '../../../assets/Home/logosm.svg';
import { ChevronRight } from "lucide-react";
import singleBox from '../../../assets/Home/singlebox.png';
import TechTren from '../../../assets/Home/TechTren.svg';
import { VideoModal } from "@/components/VideoModal";
import { VideoButton } from "@/components/VideoButton";
import { useNavigate } from "react-router-dom";

const PreFooter = () => {
    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <section className="relative w-full text-center sm:pt-40 md:px-12 max-w-6xl mx-auto sm:px-0 px-4 pt-24">
            <div className="relative max-w-5xl mx-auto space-y-10">
                <div className="relative border rounded-3xl p-10 md:p-16 shadow-lg w-full sm:!py-24 overflow-hidden py-14">
                    <div className="flex justify-center mb-6">
                        <img src={Logo} alt="logo" className="sm:w-14 sm:h-8 " />
                    </div>

                    <h1 className="text-3xl md:text-5xl font-semibold leading-tight mb-8">
                        Stop trading blind. <br /> Start trading with AI.
                    </h1>

                    <div className="sm:mt-8 mt-12 flex items-center justify-center sm:flex-row flex-col gap-5 sm:gap-3 w-full">
                        <Button className="special-btn hover:scale-110 gradient-box-shadow w-2/3 sm:w-fit sm:py-5 sm:px-5 py-6 text-base" onClick={() => navigate('/auth/sign-up')}>
                            Start free trial
                            <span className="ml-1">
                                <ChevronRight size={14} />
                            </span>
                        </Button>

                        {/* See Demo Button using reusable component */}
                        <VideoButton onClick={() => setIsVideoOpen(true)} />
                    </div>

                    <div className="">
                        <img src={singleBox} alt="box" className="absolute sm:block hidden -right-36 -top-36 object-contain w-1/2" />
                        <div className="green-circled w-[600px] h-[400px] blur-[80px] sm:block hidden absolute -top-20 -right-80"></div>
                    </div>

                    <div className="">
                        <img src={singleBox} alt="box" className="absolute -bottom-36 -left-48 object-contain w-1/2 sm:block hidden" />
                        <div className="purple-circled absolute -bottom-36 -left-60 sm:block hidden"></div>
                    </div>
                </div>
            </div>

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full">
                <img src={TechTren} alt="TechTren" className="w-full max-w-full" />
            </div>

            <div className="">
                <div className="purple-shadow sm:w-1/2 sm:h-96 bottom-20 sm:-right-[400px] right-0 w-full h-1/4 sm:hidden block"></div>
            </div>

            {/* Video Modal using reusable component */}
            <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
        </section >
    );
};

export default PreFooter;