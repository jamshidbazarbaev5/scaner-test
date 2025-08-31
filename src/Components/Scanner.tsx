"use client";

import {useState, useEffect, useRef} from "react";
import Quagga from "quagga";
import {Check, X, Award, QrCode} from "lucide-react";
import {useScan, useBonusHistory} from "../api/scan.ts";
import {useTranslation} from 'react-i18next';
import errorSound from '../assets/Best Notification Tone.mp3';

declare global {
    interface Window {
        Telegram?: {
            WebApp?: any;
        };
    }
}

export function Scanner() {
    const {t} = useTranslation();
    const [isScanning, setIsScanning] = useState(false);
    const [result, setResult] = useState("");
    const [showSuccessScreen, setShowSuccessScreen] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const isProcessing = useRef(false);
    const [message, setMessage] = useState("");
    const [totalBonuses, setTotalBonuses] = useState(0);
    const [scannedCount, setScannedCount] = useState(0);
    const [todayCount, setTodayCount] = useState(0);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const hasRequestedPermission = useRef(false);
    const firstUpdate = useRef(true);
    const isTelegram = useRef(
        window.Telegram?.WebApp !== undefined ||
        /Telegram/i.test(navigator.userAgent)
    );
    const [browserSupport] = useState(
        !!navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia
    );
    const [showInputModal, setShowInputModal] = useState(false);
    const [manualInput, setManualInput] = useState("");
    const errorAudio = useRef<HTMLAudioElement | null>(null);

    const scan = useScan();

    const today = new Date().toISOString().split('T')[0];
    const bonusHistory = useBonusHistory({
        from_date: today,
        to_date: today
    });
    const totalBonusHistory = useBonusHistory();

    useEffect(() => {
        if (bonusHistory.data?.pages[0]) {
            setTodayCount(bonusHistory.data.pages[0].count);
        }
        if (totalBonusHistory.data?.pages[0]) {
            setTotalBonuses(totalBonusHistory.data.pages[0].total_bonuses);
            setScannedCount(totalBonusHistory.data.pages[0].count);
        }
    }, [totalBonusHistory.data, bonusHistory.data]);

    useEffect(() => {
        errorAudio.current = new Audio(errorSound);
        errorAudio.current.load();
    }, []);

    const playErrorSound = () => {
        if (errorAudio.current) {
            errorAudio.current.currentTime = 0;
            errorAudio.current.play().catch(e => console.error('Error playing sound:', e));
        }
    };

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

    const openInBrowser = () => {
        window.open(window.location.href, '_blank');
    };

    const handleScan = async (code: string) => {
        if (isProcessing.current || showSuccessScreen || showErrorModal) {
            return;
        }

        try {
            isProcessing.current = true;
            setResult(code);
            
            const response = await scan.mutateAsync({barcode_data: code});
            
            if (response.message) {
                const pointsMatch = response.message.match(/\d+/);
                const points = pointsMatch ? pointsMatch[0] : '0';
                setMessage(t("Вы получили {{points}} баллов", { points }).toString());
                playErrorSound();
            }

            bonusHistory.refetch();
            totalBonusHistory.refetch();

            setShowSuccessScreen(true);
        } catch (error: any) {
            console.error('Scan error:', error);
            setResult(code);
            
            if (error.message) {
                const userIdMatch = error.message.match(/ID (\d+)/);
                if (userIdMatch) {
                    setMessage(t("Пользователь с ID {{userId}} уже сканировал этот штрихкод.", { 
                        userId: userIdMatch[1] 
                    }).toString());
                    setShowErrorModal(true);
                } else if (error.message.includes('нет в базе')) {
                    setMessage(t("Такого штрихкода нет в базе данных.").toString());
                    setShowErrorModal(true);
                } else {
                    console.error('Unhandled error:', error.message);
                    setResult("");
                }
            } 

            isProcessing.current = false;
        }
    };

    useEffect(() => {
        if (!showSuccessScreen) {
            isProcessing.current = false;
        }
    }, [showSuccessScreen]);

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

    if (!browserSupport) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg mb-4">
                    <X className="w-12 h-12 text-yellow-600 dark:text-yellow-400 mx-auto mb-2"/>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {t('browserNotSupported')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {t('browserNotSupportedMessage')}
                </p>
                {isTelegram.current && (
                    <button
                        onClick={openInBrowser}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        {t('openInBrowser')}
                    </button>
                )}
            </div>
        );
    }

    if (hasPermission === false) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg mb-4">
                    <X className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-2"/>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {t('cameraPermission')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {t('cameraPermissionMessage')}
                </p>
                {isTelegram.current && (
                    <button
                        onClick={openInBrowser}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        {t('openInBrowser')}
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <div className="max-w-md mx-auto mb-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-gray-500 dark:text-gray-400">{t('totalPoints')}</h3>
                                <div className="flex items-center space-x-2 mt-2">
                                    <Award className="w-5 h-5 text-blue-500"/>
                                    <span className="text-2xl font-bold text-gray-800 dark:text-white">
                    {totalBonuses.toLocaleString()}
                  </span>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-gray-200 dark:bg-gray-700"/>

                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-gray-500 dark:text-gray-400">{t('scannedCodes')}</h3>
                                <div className="flex items-center space-x-2 mt-2">
                                    <QrCode className="w-5 h-5 text-purple-500"/>
                                    <span className="text-2xl font-bold text-gray-800 dark:text-white">
                    {scannedCount.toLocaleString()}
                  </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    ({t('today')}: {todayCount})
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showSuccessScreen && (
                <div 
                    className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        WebkitTransform: 'translate3d(0,0,0)',
                        transform: 'translate3d(0,0,0)'
                    }}
                >
                    <div 
                        className="bg-green-500 rounded-2xl p-9 m-4 shadow-lg transform-gpu"
                        style={{
                            WebkitTransform: 'translate3d(0,0,0)',
                            transform: 'translate3d(0,0,0)',
                            maxWidth: '90vw',
                            width: '100%',
                            position: 'relative'
                        }}
                    >
                        <div className="relative flex items-center justify-center">
                            <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center animate-fadeIn will-change-transform">
                                <Check className="w-8 h-8 text-green-500 animate-checkmark"/>
                            </div>
                        </div>
                        <div className="mt-8 text-center space-y-2 animate-fadeIn">
                            <h1 className="text-white text-2xl font-medium">
                                {t('success')}
                            </h1>
                            <p className="text-green-100 text-lg">
                                {message}
                            </p>
                            <p className="text-green-100 text-lg">
                                {result}
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setShowSuccessScreen(false);
                                setResult("");
                            }}
                            className="mt-4 w-full py-2 bg-white text-green-500 rounded-lg hover:bg-green-50"
                        >
                            {t('close')}
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-md mx-auto">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <button
                        onClick={() => setIsScanning(prev => !prev)}
                        className="w-full py-3 bg-blue-500 dark:bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-600 dark:hover:bg-blue-700"
                    >
                        {isScanning ? t('stop') : t('scan')}
                    </button>
                    <button
                        onClick={() => setShowInputModal(true)}
                        disabled={isScanning}
                        className="w-full py-3 bg-green-500 dark:bg-green-600 text-white rounded-lg font-medium hover:bg-green-600 dark:hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        {t('typeBarcode')}
                    </button>
                </div>

                <div className="mb-4 relative" style={{ minHeight: "300px" }}>
                    <div
                        id="scanner-container"
                        className="absolute inset-0 w-full h-full rounded-lg border-2 border-gray-300 dark:border-gray-700 overflow-hidden"
                        style={{
                            position: 'relative',
                            width: '100%',
                            minHeight: '300px'
                        }}
                    >
                        {/* Quagga will inject the video element here */}
                    </div>
                </div>

                {result && (
                    <div className="mb-4">
            <pre
                className="p-4 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700">
              <code>{result}</code>
            </pre>
                    </div>
                )}
            </div>

            {showErrorModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full translate-z-0">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                                <X className="w-6 h-6 text-red-600 dark:text-red-400"/>
                            </div>
                        </div>
                        <p className="text-center mb-4 text-gray-700 dark:text-gray-300">
                            {message}
                        </p>
                        {result && (
                            <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    {t('scannedCode')}:
                                </p>
                                <p className="text-center font-mono text-gray-800 dark:text-gray-200 break-all">
                                    {result}
                                </p>
                            </div>
                        )}
                        
                        <button
                            onClick={() => {
                                setShowErrorModal(false);
                                setResult("");
                            }}
                            className="w-full py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700"
                        >
                            {t('close')}
                        </button>
                    </div>
                </div>
            )}

            {showInputModal && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]"
                    style={{
                        WebkitTransform: 'translate3d(0,0,0)',
                        transform: 'translate3d(0,0,0)'
                    }}
                >
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
                        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
                            {t('enterBarcode')}
                        </h3>
                        <form onSubmit={handleManualInput}>
                            <input
                                type="text"
                                value={manualInput}
                                onChange={handleInputChange}
                                className="w-full p-2 mb-4 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder={t('barcodeNumber')}
                                autoFocus
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="submit"
                                    className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    {t('submit')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowInputModal(false)}
                                    className="w-full py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                >
                                    {t('cancel')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}