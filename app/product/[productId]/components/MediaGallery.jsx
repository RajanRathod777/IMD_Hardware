import { Film } from "lucide-react";

const MediaGallery = ({ product, apiUrl }) => {
    if (!product.video || product.video.length === 0) return null;

    return (
        <div className="mt-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
                    <Film size={18} style={{ color: "var(--color-text-on-primary)" }} />
                </div>
                <h3 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-heading)" }}>Media Gallery</h3>
            </div>
            
            <div className="grid gap-6">
                {product.video.map((file, index) => {
                    const isVideo = file.toLowerCase().endsWith(".mp4");
                    const fileUrl = `${apiUrl}/image/product/${file}`;

                    return (
                        <MediaItem 
                            key={index}
                            fileUrl={fileUrl}
                            isVideo={isVideo}
                        />
                    );
                })}
            </div>
        </div>
    );
};

const MediaItem = ({ fileUrl, isVideo }) => {
    return (
        <div className="group relative rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}>
            {/* Media Content */}
            <div className="relative">
                {isVideo ? (
                    <div className="relative aspect-video bg-black rounded-2xl overflow-hidden">
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-contain"
                        >
                            <source src={fileUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                ) : (
                    <div className="aspect-video flex items-center justify-center p-4 rounded-2xl" style={{ background: "linear-gradient(to bottom right, var(--color-bg), var(--color-bg-alt))" }}>
                        <img
                            src={fileUrl}
                            alt="Product media"
                            className="max-w-full max-h-full object-contain rounded-lg shadow-sm transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                        />
                    </div>
                )}
            </div>

            {/* Hover Effect Border */}
            <div className="absolute inset-0 border-2 border-transparent rounded-2xl pointer-events-none transition-all duration-300 group-hover:border-[var(--color-primary)]"></div>
        </div>
    );
};

export default MediaGallery;