
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {

    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 transition-colors duration-200 hover:bg-[var(--color-bg)] hover:text-[var(--color-text-primary)]"
            style={{ color: "var(--color-text-secondary)" }}
        >
            <ArrowLeft size={20} />
            <span>Back</span>
        </button>
    );
};

export default BackButton;
