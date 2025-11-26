import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoSrc?: string;
}

export function VideoModal({ isOpen, onClose, videoSrc }: VideoModalProps) {
    const defaultVideoSrc = "https://res.cloudinary.com/dbzbetuin/video/upload/v1762849571/afbgapbpokwrdcszcwhi.mov";

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/70 flex items-center justify-center px-4 z-[110]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="relative bg-black rounded-2xl overflow-hidden w-full max-w-3xl shadow-xl"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 120, damping: 15 }}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
                        >
                            <X className="text-white size-5" />
                        </button>

                        <video
                            src={videoSrc || defaultVideoSrc}
                            controls
                            autoPlay
                            className="w-full h-[65vh] sm:h-[75vh] object-contain bg-black"
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}