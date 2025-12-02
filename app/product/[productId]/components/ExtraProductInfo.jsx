import { Loader2, Sparkles, FileText } from "lucide-react";

const ExtraProductInfo = ({ extraDetails, loading }) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center gap-3 p-8 rounded-2xl border shadow-sm" style={{ color: "var(--color-text-muted)", background: "linear-gradient(to bottom right, var(--color-bg), var(--color-surface))", borderColor: "var(--color-border)" }}>
                <Loader2 size={20} className="animate-spin" style={{ color: "var(--color-text-muted)" }} />
                <span className="font-medium" style={{ color: "var(--color-text-secondary)" }}>Loading product details...</span>
            </div>
        );
    }

    if (!extraDetails) return null;

    return (
        <div className="space-y-6">
            {/* Short Description */}
            {extraDetails.short_description && (
                <div className="rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all duration-300" style={{ background: "linear-gradient(to bottom right, var(--color-bg-alt), var(--color-surface))", borderColor: "var(--color-border)" }}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm" style={{ background: "var(--gradient-primary)" }}>
                            <Sparkles size={18} style={{ color: "var(--color-text-on-primary)" }} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-heading)" }}>
                                Product Highlights
                            </h3>
                            <p className="text-sm font-medium" style={{ color: "var(--color-primary)" }}>Key features & benefits</p>
                        </div>
                    </div>
                    <div
                        className="leading-relaxed text-base font-normal rounded-lg p-4 border"
                        style={{ color: "var(--color-text-secondary)", backgroundColor: "rgba(255,255,255,0.5)", borderColor: "var(--color-border)" }}
                        dangerouslySetInnerHTML={{
                            __html: extraDetails.short_description,
                        }}
                    ></div>
                </div>
            )}

            {/* Full Description */}
            {extraDetails.description && (
                <div className="rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all duration-300" style={{ background: "linear-gradient(to bottom right, var(--color-surface), var(--color-bg))", borderColor: "var(--color-border)" }}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm" style={{ background: "linear-gradient(to bottom right, var(--color-text-secondary), var(--color-text-primary))" }}>
                            <FileText size={18} style={{ color: "var(--color-text-on-primary)" }} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-heading)" }}>
                                Detailed Description
                            </h3>
                            <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>Complete product information</p>
                        </div>
                    </div>
                    <div
                        className="leading-relaxed prose max-w-none rounded-lg p-4 border"
                        style={{ color: "var(--color-text-secondary)", backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
                        dangerouslySetInnerHTML={{
                            __html: extraDetails.description,
                        }}
                    ></div>
                </div>
            )}
        </div>
    );
};

export default ExtraProductInfo;