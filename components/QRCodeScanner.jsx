"use client";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import Cookies from "js-cookie";

const QRCodeScanner = () => {
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;
  const token = Cookies.get("auth_token");

  const scannerRef = useRef(null);
  const [scannedData, setScannedData] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // guards
  const hasScannedRef = useRef(false);
  const isUnmountingRef = useRef(false);

  const startScanner = async () => {
    if (isScanning || isUnmountingRef.current) return;

    try {
      const scanner = new Html5Qrcode("reader");
      scannerRef.current = scanner;
      hasScannedRef.current = false;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0, // 1:1 aspect ratio
        },
        (decodedText) => {
          // ✅ only process first successful scan
          if (hasScannedRef.current || isUnmountingRef.current) return;
          hasScannedRef.current = true;

          console.log("📌 QR Code Value:", decodedText);
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
              console.log("✅ API Response:", data);
              setApiResponse(data);
            })
            .catch((err) => {
              console.error("❌ API Error:", err);
              setApiResponse({
                status: false,
                message: "Something went wrong",
              });
            })
            .finally(() => {
              // ✅ stop scanner safely
              safeStopScanner();
            });
        },
        (errorMessage) => {
          // Ignore scanning errors, they're normal during scanning
        }
      );

      setIsScanning(true);
    } catch (err) {
      console.error("Camera start error:", err);
      if (!isUnmountingRef.current) {
        setIsScanning(false);
      }
    }
  };

  const safeStopScanner = async () => {
    if (!scannerRef.current || isUnmountingRef.current) {
      setIsScanning(false);
      return;
    }

    try {
      // Simple approach - just try to stop and catch any errors
      await scannerRef.current.stop();
      console.log("✅ Scanner stopped successfully");
    } catch (err) {
      // Ignore "already stopped" and "not running" errors
      const errorMsg = err.message || err.toString();
      if (
        !errorMsg.includes("already stopped") &&
        !errorMsg.includes("not running") &&
        !errorMsg.includes("Scanner is not running")
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
    // Start scanner after a small delay to ensure popup is rendered
    setTimeout(() => {
      startScanner();
    }, 100);
  };

  const handleClosePopup = () => {
    stopScanner();
  };

  // Enhanced cleanup with proper state management
  useEffect(() => {
    isUnmountingRef.current = false;

    return () => {
      isUnmountingRef.current = true;
      const cleanupScanner = async () => {
        if (scannerRef.current) {
          try {
            await scannerRef.current.stop().catch((err) => {
              const errorMsg = err.message || err.toString();
              if (
                !errorMsg.includes("already stopped") &&
                !errorMsg.includes("not running") &&
                !errorMsg.includes("Scanner is not running")
              ) {
                console.warn("Cleanup stop warning:", errorMsg);
              }
            });
          } catch (err) {
            // Ignore any cleanup errors
            console.warn("Cleanup error (ignored):", err.message);
          } finally {
            scannerRef.current = null;
          }
        }
      };

      cleanupScanner();
    };
  }, []);

  // Force stop when popup closes
  useEffect(() => {
    if (!showPopup && isScanning) {
      safeStopScanner();
    }
  }, [showPopup, isScanning]);

  return (
    <>
      {/* Floating Scan Button */}
      <button
        onClick={handleOpenScanner}
        className="fixed bottom-6 right-6 bg-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-all duration-200 z-40"
        title="Scan QR Code"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
          />
        </svg>
      </button>

      {/* Scanner Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 ">
          <div className="bg-white max-w-md w-full p-3 border border-gray-300">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-black">QR Code Scanner</h2>
              <button
                onClick={handleClosePopup}
                className="text-black hover:text-gray-700 transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Scanner Container with 1:1 Aspect Ratio */}
            <div className="relative w-full" style={{ aspectRatio: "1/1" }}>
              <div
                id="reader"
                className="w-full h-full border border-gray-400 bg-black"
              ></div>
            </div>

            <div className="mt-2 flex flex-col items-center space-y-2">
              {isScanning ? (
                <>
                  <button
                    onClick={stopScanner}
                    className="bg-black text-white px-6 py-2 border border-gray-400 hover:bg-gray-800 transition-colors duration-200 font-medium w-full"
                  >
                    Stop Scanner
                  </button>
                  <p className="text-sm text-black text-center">
                    Scanner is running... Point camera at QR code
                  </p>
                </>
              ) : (
                <button
                  onClick={startScanner}
                  className="bg-white text-black px-6 py-2 border border-gray-400 hover:bg-gray-100 transition-colors duration-200 font-medium w-full"
                >
                  Start Scanner
                </button>
              )}
            </div>

            {apiResponse && (
              <div
                className={`mt-2 p-3 text-white font-medium text-center ${
                  apiResponse.status ? "bg-green-600" : "bg-red-600"
                }`}
              >
                <div> {apiResponse.message}</div>

                <div>
                  {apiResponse.status && (
                    <span className="">
                      🎉 Points Earned: {apiResponse.total_points}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default QRCodeScanner;
