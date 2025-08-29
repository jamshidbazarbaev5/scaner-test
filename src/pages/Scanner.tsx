"use client";

import { useState, useEffect, useRef } from "react";
// @ts-ignore
import Quagga from "quagga";

declare global {
    interface Window {
        Quagga: any;
    }
}

export function Scanner() {
    const [isScanning, setIsScanning] = useState(false);
    const [result, setResult] = useState("");
    const [showInputModal, setShowInputModal] = useState(false);
    const [manualInput, setManualInput] = useState("");
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const hasRequestedPermission = useRef(false);
    const firstUpdate = useRef(true);
    const [browserSupport] = useState(
        !!navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia
    );
    const isProcessing = useRef(false);
    const [showSuccessScreen, setShowSuccessScreen] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);



    const checkCameraPermission = async () => {
        if (hasPermission === true && hasRequestedPermission.current) {
            return true;
        }

        if (hasPermission === false && hasRequestedPermission.current) {
            return false;
        }

        try {
            const status = await navigator.permissions.query({name: 'camera' as PermissionName});

            if (status.state === 'granted') {
                setHasPermission(true);
                hasRequestedPermission.current = true;
                return true;
            } else if (status.state === 'prompt') {
                const result = await requestCameraPermission();
                hasRequestedPermission.current = true;
                return result;
            } else {
                setHasPermission(false);
                hasRequestedPermission.current = true;
                return false;
            }
        } catch (error) {
            const result = await requestCameraPermission();
            hasRequestedPermission.current = true;
            return result;
        }
    };

    const requestCameraPermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment'
                }
            });
            setHasPermission(true);
            stream.getTracks().forEach(track => track.stop());
            return true;
        } catch (err) {
            console.error("Camera permission error:", err);
            setHasPermission(false);
            return false;
        }
    };

    useEffect(() => {
        if (!hasRequestedPermission.current && browserSupport) {
            checkCameraPermission();
        }
    }, [browserSupport]);

    const handleScan = (code: string) => {
        if (isProcessing.current || showSuccessScreen || showErrorModal) {
            return;
        }
        
        try {
            isProcessing.current = true;
            setResult(code);
            setShowSuccessScreen(true);
        } catch (error: any) {
            console.error('Scan error:', error);
            setShowErrorModal(true);
            isProcessing.current = false;
        }
    };

    const startScanning = () => {
        const scannerContainer = document.querySelector('#scanner-container');
        if (!scannerContainer) {
            console.error('Scanner container not found');
            setShowErrorModal(true);
            return;
        }

        Quagga.init(
            {
                inputStream: {
                    type: 'LiveStream',
                    target: scannerContainer as HTMLElement,
                    constraints: {
                        facingMode: 'environment',
                        width: { min: 1280, ideal: 1920, max: 2560 },
                        height: { min: 720, ideal: 1080, max: 1440 },
                        aspectRatio: { min: 1, max: 2 }
                    }
                },
                numOfWorkers: navigator.hardwareConcurrency || 4,
                locate: true,
                frequency: 10,
                debug: {
                    drawBoundingBox: true,
                    showFrequency: true,
                    drawScanline: true,
                    showPattern: true
                },
                multiple: false,
                locator: {
                    halfSample: true,
                    patchSize: "medium",
                    debug: {
                        showCanvas: false,
                        showPatches: false,
                        showFoundPatches: false,
                        showSkeleton: false,
                        showLabels: false,
                        showPatchLabels: false,
                        showRemainingPatchLabels: false,
                        boxFromPatches: {
                            showTransformed: false,
                            showTransformedBox: false,
                            showBB: false
                        }
                    }
                },
                decoder: {
                    readers: [
                        // 'ean_reader',
                        // 'ean_8_reader',
                        'code_128_reader',
                        // 'code_39_reader',
                        // 'upc_reader'
                    ],
                    debug: {
                        drawBoundingBox: true,
                        showFrequency: true,
                        drawScanline: true,
                        showPattern: true
                    }
                }
            },
            (err: any) => {
                if (err) {
                    console.error(err);
                    setShowErrorModal(true);
                    return;
                }
                Quagga.start();
                setIsScanning(true);
            }
        );
        let lastResults: string[] = [];
        const BUFFER_SIZE = 3;
        const CONFIDENCE_THRESHOLD = 0.10;

        Quagga.onDetected((res: any) => {
            if (isProcessing.current || showSuccessScreen || showErrorModal) {
                return;
            }

            const scannedText = res.codeResult.code;
            const confidence = res.codeResult.confidence;
            if (
                !scannedText ||
                scannedText.trim() === "" ||
                scannedText.length < 4 ||
                !/^[A-Za-z0-9-_]+$/.test(scannedText) ||
                confidence < CONFIDENCE_THRESHOLD
            ) {
                lastResults = [];
                return;
            }

            lastResults.push(scannedText);

            if (lastResults.length >= BUFFER_SIZE) {
                const allSame = lastResults.every(result => result === lastResults[0]);

                if (allSame) {
                    setResult(scannedText);
                    handleScan(scannedText);
                    lastResults = [];
                } else {
                    lastResults.shift();
                }
            }
        });

        Quagga.onProcessed((result: any) => {
            const canvas = Quagga.canvas;
            if (!canvas) return;

            let drawingCtx = canvas.ctx.overlay,
                drawingCanvas = canvas.dom.overlay;

            if (result) {
                if (result.boxes) {
                    drawingCtx.clearRect(
                        0,
                        0,
                        parseInt(drawingCanvas.getAttribute('width') || '0'),
                        parseInt(drawingCanvas.getAttribute('height') || '0')
                    );
                    result.boxes.filter((box: any) => box !== result.box).forEach((box: any) => {
                        Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                            color: 'green',
                            lineWidth: 2
                        });
                    });
                }

                if (result.box) {
                    Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: '#00F', lineWidth: 2 });
                }

                if (result.codeResult && result.codeResult.code) {
                    Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
                }
            }
        });
    };

    const stopScanning = () => {
        if (typeof Quagga !== 'undefined') {
            try {
                if (Quagga.canvas) {
                    Quagga.offProcessed();

                }
                Quagga.stop();
            } catch (error) {
                console.error('Error stopping Quagga:', error);
            }
        }
        setIsScanning(false);
    };

    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }

        if (isScanning) {
            startScanning();
        } else {
            stopScanning();
        }
    }, [isScanning]);

    useEffect(() => {
        return () => {
            if (isScanning && typeof Quagga !== 'undefined') {
                try {
                    stopScanning();
                } catch (error) {
                    console.error('Error in cleanup:', error);
                }
            }
        };
    }, []);


    useEffect(() => {
        // Add global styles for Quagga video
        const style = document.createElement('style');
        style.textContent = `
            #scanner-container {
                position: relative;
                width: 100%;
                height: 300px;
                overflow: hidden;
            }
            #scanner-container > video {
                width: 100%;
                height: 100%;
                object-fit: cover;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            #scanner-container > canvas {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 100%;
                height: 100%;
            }
            .drawingBuffer {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 100%;
                height: 100%;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const handleManualInput = async (e: React.FormEvent) => {
        e.preventDefault();
        // Clean up the input by removing all spaces
        const cleanedInput = manualInput.replace(/\s+/g, '');
        if (cleanedInput) {
            await handleScan(cleanedInput);
            setManualInput("");
            setShowInputModal(false);
        }
    };

    // Add input change handler to clean up pasted values
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Clean up the input value by removing spaces
        const cleanedValue = e.target.value.replace(/\s+/g, '');
        setManualInput(cleanedValue);
    };

    useEffect(() => {
        if (!showErrorModal && !showSuccessScreen) {
            isProcessing.current = false;
        }
    }, [showErrorModal, showSuccessScreen]);

    if (!browserSupport) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Browser Not Supported
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Your browser doesn't support camera access.
                </p>
            </div>
        );
    }

    if (hasPermission === false) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Camera Permission Required
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Please enable camera access to use the barcode scanner.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 p-4">


            <div className="max-w-md mx-auto">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <button
                        onClick={() => setIsScanning(prev => !prev)}
                        className="w-full py-3 bg-blue-500 dark:bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-600 dark:hover:bg-blue-700"
                    >
                        {isScanning ? 'Stop Scanning' : 'Start Scanning'}
                    </button>
                    <button
                        onClick={() => setShowInputModal(true)}
                        disabled={isScanning}
                        className="w-full py-3 bg-green-500 dark:bg-green-600 text-white rounded-lg font-medium hover:bg-green-600 dark:hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        Manual Input
                    </button>
                </div>

                <div className="mb-4 relative" style={{ minHeight: "300px" }}>
                    <div
                        id="scanner-container"
                        className="absolute inset-0 w-full h-full rounded-lg border-2 border-gray-300 dark:border-gray-700 overflow-hidden"
                    />
                </div>

                {result && (
                    <div className="mb-4">
                        <pre className="p-4 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700">
                            <code>{result}</code>
                        </pre>
                    </div>
                )}
            </div>

            {showInputModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
                        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
                            Enter Barcode
                        </h3>
                        <form onSubmit={handleManualInput}>
                            <input
                                type="text"
                                value={manualInput}
                                onChange={handleInputChange}
                                className="w-full p-2 mb-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Enter barcode number"
                                autoFocus
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="submit"
                                    className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowInputModal(false)}
                                    className="w-full py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}