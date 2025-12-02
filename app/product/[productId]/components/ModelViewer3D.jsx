import { Box, RotateCcw, Smartphone } from "lucide-react";

const ModelViewer3D = ({ product, apiUrl }) => {
    if (!product?.models_3d?.[0]) return null;

    return (
        <div className="mt-8 space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
                    <Box size={18} style={{ color: "var(--color-text-on-primary)" }} />
                </div>
                <h3 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-heading)" }}>3D Model Viewer</h3>
            </div>

            {/* Model Viewer Container */}
            <div className="group relative rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}>
                {/* Controls Info */}
                <div className="absolute top-4 left-4 z-10 px-3 py-2 rounded-lg backdrop-blur-sm" style={{ backgroundColor: "rgba(0,0,0,0.8)", color: "var(--color-surface)" }}>
                    <div className="flex items-center gap-2 text-sm">
                        <RotateCcw size={16} style={{ color: "var(--color-primary-light)" }} />
                        <span>Drag to rotate • Scroll to zoom</span>
                    </div>
                </div>

                {/* AR Button Info */}
                <div className="absolute top-4 right-4 z-10 px-3 py-2 rounded-lg backdrop-blur-sm" style={{ backgroundColor: "rgba(0,0,0,0.8)", color: "var(--color-surface)" }}>
                    <div className="flex items-center gap-2 text-sm">
                        <Smartphone size={16} style={{ color: "var(--color-success-light)" }} />
                        <span>View in AR</span>
                    </div>
                </div>

                {/* Model Viewer */}
                <div className="w-full aspect-video" style={{ background: "linear-gradient(to bottom right, var(--color-bg), var(--color-bg-alt))" }}>
                    <model-viewer
                        src={`${apiUrl}/image/product/${product.models_3d[0]}`}
                        alt={`3D Model of ${product.title}`}
                        auto-rotate
                        camera-controls
                        ar
                        ar-modes="webxr scene-viewer quick-look"
                        shadow-intensity="1"
                        environment-image="neutral"
                        exposure="1"
                        camera-orbit="0deg 75deg 105%"
                        className="w-full h-full"
                        style={{ 
                            backgroundColor: 'var(--color-bg)'
                        }}
                    >
                        {/* Loading Progress */}
                        <div slot="progress-bar" className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: "var(--color-border)" }}>
                            <div className="h-full transition-all duration-300" style={{ background: "var(--gradient-primary)" }}></div>
                        </div>
                    </model-viewer>
                </div>

                {/* Features Footer */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 backdrop-blur-sm border rounded-xl px-4 py-2 shadow-sm" style={{ backgroundColor: "rgba(255, 255, 255, 0.9)", borderColor: "var(--color-border)" }}>
                    <div className="flex items-center gap-4 text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
                        <div className="flex items-center gap-1">
                            <RotateCcw size={12} />
                            <span>360° View</span>
                        </div>
                        <div className="w-px h-4" style={{ backgroundColor: "var(--color-border-strong)" }}></div>
                        <div className="flex  items-center gap-1">
                            <Smartphone size={12} />
                            <span>AR Ready</span>
                        </div>
                        <div className="w-px h-4" style={{ backgroundColor: "var(--color-border-strong)" }}></div>
                        <div className="flex items-center gap-1">
                            <Box size={12} />
                            <span>Interactive</span>
                        </div>
                    </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-transparent rounded-2xl pointer-events-none transition-all duration-300 group-hover:border-[var(--color-primary-soft)]"></div>
            </div>

        </div>
    );
};

export default ModelViewer3D;