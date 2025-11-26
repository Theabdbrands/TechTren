import { Button } from "@/components/ui/button";
import play from "../assets/Home/play.svg";

interface VideoButtonProps {
    onClick: () => void;
    className?: string;
    buttonVariant?: "outline" | "default" | "secondary" | "ghost" | "link";
    showIcon?: boolean;
    children?: React.ReactNode;
}

export function VideoButton({
    onClick,
    className = "",
    buttonVariant = "outline",
    showIcon = true,
    children = "See demo"
}: VideoButtonProps) {
    return (
        <div
            onClick={onClick}
            className={`flex items-center justify-center px-3 rounded-4xl hover:scale-110 transition-all cursor-pointer ${className}`}
        >
            {showIcon && <img src={play} alt="play" className="size-7 mr-2" />}
            <Button
                variant={buttonVariant}
                className="rounded-full px-0 py-5 !bg-transparent border-none cursor-pointer"
            >
                {children}
            </Button>
        </div>
    );
}