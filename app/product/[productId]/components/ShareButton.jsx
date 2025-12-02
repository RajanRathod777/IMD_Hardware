import { useState, useRef, useEffect } from "react";
import { 
    Share2, 
    X, 
    Facebook, 
    Twitter, 
    Linkedin, 
    MessageCircle, 
    Link, 
    Check,
    Mail,
    MessageSquare
} from "lucide-react";

const ShareButton = ({ product }) => {
    const [showSharePopup, setShowSharePopup] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const popupRef = useRef(null);

    // Close popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowSharePopup(false);
            }
        };

        if (showSharePopup) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSharePopup]);

    const handleShare = async (platform) => {
        const url = window.location.href;
        const title = product?.title || "Check out this product";
        const text = `Check out ${title}`;

        switch (platform) {
            case "facebook":
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`, '_blank', 'width=600,height=400');
                break;
            case "twitter":
                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank', 'width=600,height=400');
                break;
            case "linkedin":
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
                break;
            case "whatsapp":
                window.open(`https://wa.me/?text=${encodeURIComponent(`${text} - ${url}`)}`, '_blank');
                break;
            case "telegram":
                window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
                break;
            case "email":
                window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`, '_blank');
                break;
            case "copy":
                try {
                    await navigator.clipboard.writeText(url);
                    setLinkCopied(true);
                    setTimeout(() => setLinkCopied(false), 3000);
                } catch (err) {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = url;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    setLinkCopied(true);
                    setTimeout(() => setLinkCopied(false), 3000);
                }
                break;
        }
        setShowSharePopup(false);
    };

    const sharePlatforms = [
        { platform: "facebook", icon: Facebook, label: "Facebook", color: "bg-blue-600 hover:bg-blue-700" },
        { platform: "twitter", icon: Twitter, label: "Twitter", color: "bg-sky-500 hover:bg-sky-600" },
        { platform: "linkedin", icon: Linkedin, label: "LinkedIn", color: "bg-blue-700 hover:bg-blue-800" },
        { platform: "whatsapp", icon: MessageCircle, label: "WhatsApp", color: "bg-green-500 hover:bg-green-600" },
        { platform: "telegram", icon: MessageSquare, label: "Telegram", color: "bg-blue-500 hover:bg-blue-600" },
        { platform: "email", icon: Mail, label: "Email", color: "bg-gray-600 hover:bg-gray-700" },
    ];

    return (
        <div className="relative" ref={popupRef}>
            {/* Share Button */}
            <button
                className="bg-white/90 hover:bg-white backdrop-blur-sm p-3 rounded-full shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:scale-105 group"
                onClick={() => setShowSharePopup(!showSharePopup)}
                aria-label="Share product"
            >
                <Share2
                    size={20}
                    className="text-gray-700 group-hover:text-black transition-colors"
                />
            </button>

            {/* Share Popup */}
            {showSharePopup && (
                <div className="absolute right-0 top-14 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 min-w-64 z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                        <div>
                            <h3 className="font-semibold text-gray-900 text-base">
                                Share this product
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                                Spread the word with friends
                            </p>
                        </div>
                        <button
                            onClick={() => setShowSharePopup(false)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            aria-label="Close share menu"
                        >
                            <X size={16} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Share Platforms Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        {sharePlatforms.map(({ platform, icon: Icon, label, color }) => (
                            <SharePlatformButton 
                                key={platform}
                                platform={platform} 
                                icon={Icon} 
                                label={label} 
                                color={color}
                                onShare={handleShare} 
                            />
                        ))}
                    </div>

                    {/* Copy Link Section */}
                    <div className="pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                            <Link size={14} className="text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Copy product link</span>
                        </div>
                        
                        <div className="flex gap-2">
                            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                                <p className="text-xs text-gray-600 truncate">
                                    {window.location.hostname}
                                </p>
                            </div>
                            <button
                                onClick={() => handleShare("copy")}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border transition-all duration-200 font-medium text-sm ${
                                    linkCopied
                                        ? "bg-green-50 border-green-200 text-green-700 shadow-sm"
                                        : "bg-gray-900 border-gray-900 text-white hover:bg-gray-800 hover:shadow-lg"
                                }`}
                            >
                                {linkCopied ? (
                                    <>
                                        <Check size={16} className="text-green-600" />
                                        <span>Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Link size={16} />
                                        <span>Copy</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const SharePlatformButton = ({ platform, icon: Icon, label, color, onShare }) => (
    <button
        onClick={() => onShare(platform)}
        className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
        aria-label={`Share on ${label}`}
    >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 ${color} shadow-sm group-hover:shadow-md`}>
            <Icon size={20} className="text-white" />
        </div>
        <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900">
            {label}
        </span>
    </button>
);

export default ShareButton;