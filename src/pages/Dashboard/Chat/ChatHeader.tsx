import { useNavigate } from 'react-router-dom';
import Logo from "../../../assets/Home/logosm.svg";
// import { useIsMobile } from '@/hooks/use-mobile';
import MenuIcon from "../../../assets/Home/logosm.svg";
import { ArrowLeft } from 'lucide-react';

interface ChatHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}
const ChatHeader: React.FC<ChatHeaderProps> = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  // const isMobile = useIsMobile();
  const navigate = useNavigate();


  return (
    <header
      className="absolute top-0 left-1/2 -translate-x-1/2 w-[96%] md:w-full min-h-14 sm:min-h-16 px-4 sm:px-6 flex md:hidden items-center justify-between !rounded-full z-[25] mt-4 isolate glass"
      style={{
        background: "rgba(20, 20, 20, 0.30)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div className='flex items-center gap-4'>
        <div
          onClick={() => { navigate('/dashboard') }}
          className="flex items-center self-start gap-2 cursor-pointer text-gray-300 hover:text-white transition-all"
        >
          <ArrowLeft size={20} />
          <span className="text-base sm:text-lg">Back</span>
        </div>

        <img src={Logo} alt="Tech Tren Logo" className="w-10" />
      </div>

      <div className="hidden md:flex md:flex-1">
      </div>
      <div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <img src={MenuIcon} alt="Menu" className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;