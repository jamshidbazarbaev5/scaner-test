declare module 'quagga' {
    interface QuaggaConfig {
        inputStream: {
            type: string;
            target: HTMLElement;
            constraints: {
                facingMode: string;
                width: { min: number; ideal?: number; max?: number };
                height: { min: number; ideal?: number; max?: number };
                aspectRatio: { min: number; max: number };
            };
        };
        numOfWorkers: number;
        locate: boolean;
        frequency: number;
        debug: {
            drawBoundingBox: boolean;
            showFrequency: boolean;
            drawScanline: boolean;
            showPattern: boolean;
        };
        multiple: boolean;
        locator: {
            halfSample: boolean;
            patchSize: string;
            debug: {
                showCanvas: boolean;
                showPatches: boolean;
                showFoundPatches: boolean;
                showSkeleton: boolean;
                showLabels: boolean;
                showPatchLabels: boolean;
                showRemainingPatchLabels: boolean;
                boxFromPatches: {
                    showTransformed: boolean;
                    showTransformedBox: boolean;
                    showBB: boolean;
                };
            };
        };
        decoder: {
            readers: string[];
            debug: {
                drawBoundingBox: boolean;
                showFrequency: boolean;
                drawScanline: boolean;
                showPattern: boolean;
                
            };
        };
    }

    interface QuaggaCanvas {
        ctx: {
            overlay: CanvasRenderingContext2D;
        };
        dom: {
            overlay: HTMLCanvasElement;
        };
    }

    const Quagga: {
        init: (config: QuaggaConfig, callback: (error: any) => void) => void;
        start: () => void;
        stop: () => void;
        onDetected: (callback: (result: any) => void) => void;
        offDetected: (callback: (result: any) => void) => void;
        onProcessed: (callback: (result: any) => void) => void;
        offProcessed: () => void;
        canvas: QuaggaCanvas | null;
        ImageDebug: {
            drawPath: (path: any, start: any, ctx: CanvasRenderingContext2D, style: any) => void;
        };
    };

    export default Quagga;
}