"use client";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import Cookies from "js-cookie";
import { QrCode, X, Camera, RefreshCw } from "lucide-react";

const QRCodeScanner = () => {
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;
  const token = Cookies.get("auth_token");

  const scannerRef = useRef(null);
  const [scannedData, setScannedData] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  // Guards
  const hasScannedRef = useRef(false);
  const isUnmountingRef = useRef(false);

  const startScanner = async () => {
    if (isScanning || isUnmountingRef.current) return;

    setCameraError(null); // reset error

    try {
      const scanner = new Html5Qrcode("reader");
      scannerRef.current = scanner;
      hasScannedRef.current = false;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          if (hasScannedRef.current || isUnmountingRef.current) return;
          hasScannedRef.current = true;

          console.log("📌 QR Code:", decodedText);
          setScannedData(decodedText);

          fetch(`${apiUrl}/api/v1/qrcode/scan`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ qr_code_id: decodedText }),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log("API Response:", data);
              setApiResponse(data);
            })
            .catch(() => {
              setApiResponse({
                status: false,
                message: "Something went wrong",
              });
            })
            .finally(() => safeStopScanner());
        },
        () => {}
      );

      setIsScanning(true);
    } catch (err) {
      console.error("❌ Camera start error:", err);

      // Detect camera permission denied
      if (
        err?.message?.includes("NotAllowedError") ||
        err?.message?.includes("Permission") ||
        err?.toString().includes("denied")
      ) {
        setCameraError("Camera permission denied. Please allow camera access.");
      } else {
        setCameraError("Unable to access camera. Please check your device.");
      }

      setIsScanning(false);
    }
  };

  const safeStopScanner = async () => {
    if (!scannerRef.current || isUnmountingRef.current) {
      setIsScanning(false);
      return;
    }

    try {
      await scannerRef.current.stop();
      console.log("Scanner stopped");
    } catch (err) {
      const errorMsg = err.message || err.toString();
      if (
        !errorMsg.includes("already stopped") &&
        !errorMsg.includes("not running")
      ) {
        console.warn("Stop warning:", errorMsg);
      }
    } finally {
      if (!isUnmountingRef.current) {
        setIsScanning(false);
        scannerRef.current = null;
      }
    }
  };

  const stopScanner = async () => {
    await safeStopScanner();
    setShowPopup(false);
  };

  const handleOpenScanner = () => {
    setShowPopup(true);
    setScannedData(null);
    setApiResponse(null);
    setCameraError(null);

    setTimeout(() => {
      startScanner();
    }, 100);
  };

  const handleClosePopup = () => {
    stopScanner();
  };

  // Cleanup on unmount
  useEffect(() => {
    isUnmountingRef.current = false;

    return () => {
      isUnmountingRef.current = true;

      const cleanupScanner = async () => {
        if (scannerRef.current) {
          try {
            await scannerRef.current.stop();
          } catch {}
          scannerRef.current = null;
        }
      };

      cleanupScanner();
    };
  }, []);

  useEffect(() => {
    if (!showPopup && isScanning) {
      safeStopScanner();
    }
  }, [showPopup, isScanning]);
  return (
    <>
      <div className="w-full flex items-center justify-center">
        {/* Floating Scan Button */}
        <button
          onClick={handleOpenScanner}
          className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors duration-200 flex items-center justify-center z-40  hover:bg-[var(--color-surface-alt)]"
          title="Scan QR Code"
        >
          <QrCode size={20} />
        </button>

        {/* Scanner Popup */}
        {showPopup && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--color-surface)] max-w-md w-full rounded-2xl shadow-[var(--shadow-strong)] overflow-hidden border border-[var(--color-border)] animation-fade-in-up">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-[var(--color-border)] bg-[var(--color-surface-alt)]">
                <div className="flex items-center gap-2 text-[var(--color-text-primary)]">
                  <Camera size={20} className="text-[var(--color-primary)]" />
                  <h2 className="text-lg font-semibold">QR Scanner</h2>
                </div>
                <button
                  onClick={handleClosePopup}
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] transition-colors p-1 rounded-full hover:bg-[var(--color-bg)]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scanner Area */}
              <div className="p-4 bg-[var(--color-bg)]">
                <div className="relative w-full rounded-xl overflow-hidden border-2 border-[var(--color-border-primary)] shadow-inner group">
                  <div
                    id="reader"
                    className="w-full h-full bg-black min-h-[300px]"
                  ></div>
                </div>
              </div>

              {/* Controls & Status */}
              <div className="p-4 space-y-3 bg-[var(--color-surface)] border-t border-[var(--color-border)]">
                <div className="flex flex-col gap-3">
                  {isScanning ? (
                    <button
                      onClick={stopScanner}
                      className="w-full py-2.5 px-4 bg-[var(--color-surface)] border border-[var(--color-danger)] text-[var(--color-danger)] font-medium rounded-lg hover:bg-[var(--color-danger-light)] transition-all flex items-center justify-center gap-2"
                    >
                      <X size={18} />
                      Stop Scanner
                    </button>
                  ) : (
                    <button
                      onClick={startScanner}
                      className="w-full py-2.5 px-4 bg-[var(--color-primary)] text-[var(--color-text-on-primary)] font-medium rounded-lg hover:bg-[var(--color-primary-dark)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <Camera size={18} />
                      {cameraError ? "Retry Camera" : "Start Scanner"}
                    </button>
                  )}
                </div>

                {/* API Response Message */}
                {apiResponse && (
                  <div
                    className={`mt-2 p-3 rounded-lg text-sm font-medium text-center flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-2 ${
                      apiResponse.status
                        ? "bg-[var(--color-success-light)] text-[var(--color-success)] border border-[var(--color-border-success)]"
                        : "bg-[var(--color-danger-light)] text-[var(--color-danger)] border border-[var(--color-border-danger)]"
                    }`}
                  >
                    {apiResponse.status ? (
                      <>
                        <span>🎉</span>
                        <div className="flex flex-col">
                          <span>{apiResponse.message}</span>
                          <span className="text-xs opacity-90">
                            Points Earned: {apiResponse.total_points}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <X size={16} />
                        <span>{apiResponse.message}</span>
                      </>
                    )}
                  </div>
                )}

                {/* Camera Error Message */}
                {cameraError && !apiResponse && (
                  <div className="p-3 bg-[var(--color-danger-light)] text-[var(--color-danger)] border border-[var(--color-border-danger)] rounded-lg text-sm text-center">
                    <p className="font-semibold flex items-center justify-center gap-2">
                      <X size={16} /> Error Accessing Camera
                    </p>
                    <p className="mt-1 opacity-90 text-xs">{cameraError}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <style jsx global>{`
        @keyframes scan {
          0% {
            top: 0%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </>
  );
};

export default QRCodeScanner;
