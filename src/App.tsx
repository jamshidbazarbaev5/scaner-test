import React, { useRef, useState, useEffect } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import "./App.css";

interface ScanResult {
  text: string;
  timestamp: Date;
  format: string;
}

const App: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [error, setError] = useState<string>("");
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initializeScanner = async () => {
      try {
        setIsLoading(true);
        codeReader.current = new BrowserMultiFormatReader();

        // Get available video devices
        const videoDevices = await codeReader.current.listVideoInputDevices();
        setDevices(videoDevices);

        if (videoDevices.length > 0) {
          // Prefer back camera if available
          const backCamera = videoDevices.find(
            (device) =>
              device.label.toLowerCase().includes("back") ||
              device.label.toLowerCase().includes("rear"),
          );
          setSelectedDevice(backCamera?.deviceId || videoDevices[0].deviceId);
        }
      } catch (err) {
        setError(
          "Failed to access camera. Please ensure camera permissions are granted.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    initializeScanner();

    return () => {
      if (codeReader.current) {
        codeReader.current.reset();
      }
    };
  }, []);

  const handleScanResult = (result: any, err: any) => {
    if (result) {
      const newResult: ScanResult = {
        text: result.getText(),
        timestamp: new Date(),
        format: result.getBarcodeFormat().toString(),
      };

      setScanResults((prev) => {
        // Check if this result already exists in recent results (last 3 seconds)
        const now = Date.now();
        const exists = prev.some(
          (r) =>
            r.text === newResult.text && now - r.timestamp.getTime() < 3000,
        );

        if (!exists) {
          return [newResult, ...prev.slice(0, 49)]; // Keep only last 50 results
        }
        return prev;
      });

      setError("");
    }

    if (err && !(err instanceof NotFoundException)) {
      console.error("Scanning error:", err);
    }
  };

  const startScanning = async () => {
    if (!codeReader.current || !videoRef.current || !selectedDevice) {
      setError("Scanner not ready. Please try again.");
      return;
    }

    try {
      setError("");
      setIsScanning(true);

      // Start continuous scanning - camera stays active
      await codeReader.current.decodeFromVideoDevice(
        selectedDevice,
        videoRef.current,
        handleScanResult,
      );
    } catch (err) {
      setError("Failed to start scanning: " + (err as Error).message);
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    if (codeReader.current) {
      codeReader.current.reset();
    }
  };

  const clearResults = () => {
    setScanResults([]);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log("Copied to clipboard:", text);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="app">
     

      <main className="app-main">
        <div className="scanner-container">
          {/* Camera Section */}
          <div className="camera-section">
            <h2>📷 Scanner</h2>

            {devices.length > 1 && (
              <div className="device-selector">
                <label htmlFor="camera-select">Camera:</label>
                <select
                  id="camera-select"
                  value={selectedDevice}
                  onChange={(e) => setSelectedDevice(e.target.value)}
                  disabled={isScanning || isLoading}
                >
                  {devices.map((device, index) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Camera ${index + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="video-container">
              <video
                ref={videoRef}
                className="video-preview"
                playsInline
                muted
                autoPlay
              />
              <div className="scan-overlay">
                <div className="scan-frame">
                  <div className="scan-corners">
                    <div className="corner corner-tl"></div>
                    <div className="corner corner-tr"></div>
                    <div className="corner corner-bl"></div>
                    <div className="corner corner-br"></div>
                  </div>
                  {isScanning && <div className="scan-line"></div>}
                </div>
              </div>
            </div>

            <div className="controls">
              {!isScanning ? (
                <button
                  className="btn btn-start"
                  onClick={startScanning}
                  disabled={!selectedDevice || isLoading}
                >
                  {isLoading ? "🔄 Loading..." : "📷 Start Scanning"}
                </button>
              ) : (
                <button className="btn btn-stop" onClick={stopScanning}>
                  ⏹️ Stop Scanning
                </button>
              )}
            </div>

            {isScanning && (
              <div className="scanning-status">
                <div className="pulse-dot"></div>
                Scanning for barcodes...
              </div>
            )}

            {error && <div className="error-message">⚠️ {error}</div>}
          </div>

          {/* Results Section */}
          <div className="results-section">
            <div className="results-header">
              <h2>📋 Results ({scanResults.length})</h2>
              {scanResults.length > 0 && (
                <button className="btn btn-clear" onClick={clearResults}>
                  🗑️ Clear
                </button>
              )}
            </div>

            <div className="results-list">
              {scanResults.length === 0 ? (
                <div className="no-results">
                  <p>No barcodes scanned yet. Start scanning to see results!</p>
                </div>
              ) : (
                <div className="results-items">
                  {scanResults.map((result, index) => (
                    <div
                      key={`${result.text}-${result.timestamp.getTime()}`}
                      className="result-item"
                    >
                      <div className="result-number">
                        #{scanResults.length - index}
                      </div>
                      <div className="result-content">
                        <div className="result-text">{result.text}</div>
                        <div className="result-meta">
                          <span className="result-format">{result.format}</span>
                          <span className="result-time">
                            {result.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <button
                        className="btn btn-copy"
                        onClick={() => copyToClipboard(result.text)}
                        title="Copy to clipboard"
                      >
                        📋
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

     
    </div>
  );
};

export default App;
