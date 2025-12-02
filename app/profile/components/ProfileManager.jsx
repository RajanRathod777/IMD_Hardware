
"use client";
import React, { Suspense } from "react";
import ProfilePage from "./ProfilePage";
import Orders from "./Orders";
import RewrdPaymentRequest from "./RewrdPaymentRequest";

import { useState } from "react";

const ProfileManager = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div
      className="p-1 m-auto max-w-md w-full border"
      style={{
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text-primary)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Tab Bar */}
      <div className="mb-1 flex gap-1">
        <button
          onClick={() => setActiveTab("profile")}
          className={`w-full border px-4 py-2 text-sm font-medium transition-all duration-200`}
          style={{
            backgroundColor:
              activeTab === "profile"
                ? "var(--color-primary)"
                : "var(--color-surface)",
            color:
              activeTab === "profile"
                ? "var(--color-text-on-primary)"
                : "var(--color-text-primary)",
            borderColor: "var(--color-border)",
          }}
        >
          Profile
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`w-full border px-4 py-2 text-sm font-medium transition-all duration-200`}
          style={{
            backgroundColor:
              activeTab === "orders"
                ? "var(--color-primary)"
                : "var(--color-surface)",
            color:
              activeTab === "orders"
                ? "var(--color-text-on-primary)"
                : "var(--color-text-primary)",
            borderColor: "var(--color-border)",
          }}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab("rewrdPaymentRequest")}
          className={`w-full whitespace-nowrap border px-4 py-2 text-sm font-medium transition-all duration-200`}
          style={{
            backgroundColor:
              activeTab === "rewrdPaymentRequest"
                ? "var(--color-primary)"
                : "var(--color-surface)",
            color:
              activeTab === "rewrdPaymentRequest"
                ? "var(--color-text-on-primary)"
                : "var(--color-text-primary)",
            borderColor: "var(--color-border)",
          }}
        >
          Payment Request
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "profile" && (
          <Suspense
            fallback={
              <div
                className="p-4 text-center"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Loading profile...
              </div>
            }
          >
            <ProfilePage />
          </Suspense>
        )}
        {activeTab === "orders" && <Orders />}
        {activeTab === "rewrdPaymentRequest" && <RewrdPaymentRequest />}
      </div>
    </div>
  );
};

export default ProfileManager;
