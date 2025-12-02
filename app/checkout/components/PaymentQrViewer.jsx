"use client";
import React, { useEffect, useState, useCallback } from "react";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";

const PaymentQrViewer = () => {
  const [qrImage, setQrImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const refreshTime = 10000; // 10 seconds
  const decryptKey = process.env.NEXT_PUBLIC_PAYMENT_QR_ENCRYPT_KEY?.trim();
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL?.trim();

  // ✅ UseCallback ensures function identity is stable between renders
  const fetchAndDecryptQR = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = Cookies.get("auth_token");
      if (!token) throw new Error("Auth token missing");

      if (!decryptKey || decryptKey.length !== 64) {
        throw new Error("Invalid AES key: must be 64 hex characters");
      }

      const response = await fetch(
        `${apiUrl}/api/v1/payment/send-encrypted-payment-qr`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error ${response.status}: ${errorText}`);
      }

      const responseData = await response.json();

      const encryptedData =
        responseData?.data?.imageEncryptedString ||
        responseData?.imageEncryptedString ||
        responseData?.encryptedData ||
        responseData?.data;

      if (!encryptedData) {
        throw new Error("Encrypted image not found in response.");
      }

      const [ivHex, encryptedHex] = encryptedData.split(":");
      if (!ivHex || !encryptedHex) {
        throw new Error("Invalid encrypted data format.");
      }

      const iv = CryptoJS.enc.Hex.parse(ivHex);
      const encrypted = CryptoJS.enc.Hex.parse(encryptedHex);
      const key = CryptoJS.enc.Hex.parse(decryptKey);

      const decrypted = CryptoJS.AES.decrypt({ ciphertext: encrypted }, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      const base64String = decrypted.toString(CryptoJS.enc.Utf8);
      if (!base64String) throw new Error("Decryption failed (empty result)");

      const imageDataUrl = `data:image/jpeg;base64,${base64String}`;
      setQrImage(imageDataUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, decryptKey]);

  // ✅ Fetch initially and every 5 seconds
  useEffect(() => {
    fetchAndDecryptQR(); // First load immediately

    const interval = setInterval(() => {
      fetchAndDecryptQR();
    }, refreshTime);

    // Cleanup on unmount or dependency change
    return () => clearInterval(interval);
  }, [fetchAndDecryptQR]);

  return (
    <div className="flex flex-col items-center justify-center w-48 h-48">
      {loading && (
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Loading QR...
        </p>
      )}

      {error && (
        <div
          className="text-sm text-center"
          style={{ color: "var(--color-danger)" }}
        >
          <p className="font-semibold">Failed to load payment QR</p>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && qrImage && (
        <img
          src={qrImage}
          alt="Payment QR Code"
          className="border rounded w-48 h-48 object-fit"
          style={{ borderColor: "var(--color-border)" }}
          onError={() => setError("Failed to display image")}
        />
      )}
    </div>
  );
};

export default PaymentQrViewer;
