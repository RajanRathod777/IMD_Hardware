import React from "react";
import { Loader } from "lucide-react";

const Loading = () => {
  return (
    <div className="py-8" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center h-64">
          <div
            className="rounded-full animate-spin"
            style={{ color: "var(--color-primary)" }}
          >
            <Loader />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
