// DeOldify Browser - Web Worker
// Handles ONNX inference off the main thread

importScripts("https://cdn.jsdelivr.net/npm/onnxruntime-web@1.14.0/dist/ort.min.js");

let session = null;
let currentModelUrl = null;

// Helper: Softmax/Argmax aren't needed for regression, but we need clamping
function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

self.onmessage = async function (e) {
    const { type, payload } = e.data;

    try {
        if (type === 'process') {
            await runInference(payload);
        }
    } catch (err) {
        self.postMessage({ type: 'error', payload: { message: err.message } });
    }
};

async function loadModel(url) {
    if (session && currentModelUrl === url) return;

    self.postMessage({ type: 'status', payload: { message: "Loading AI model..." } });

    try {
        // Use Cache API manually if available (sw is better but this works for simple cases)
        // ORT Web might handle some caching, but let's be explicit if we were using fetch.
        // For now, let ORT handle URL fetch.

        // We can check if file is in Cache Storage API from worker? Yes.
        // But for simplicity in this worker V1, we rely on browser caching of the fetch.

        session = await ort.InferenceSession.create(url, {
            executionProviders: ['wasm'] // Force WASM for broader compatibility
        });
        currentModelUrl = url;
        console.log("Model loaded");
    } catch (err) {
        throw new Error(`Failed to load model: ${err.message}`);
    }
}

async function runInference({ imageBitmap, modelUrl }) {
    await loadModel(modelUrl);

    self.postMessage({ type: 'status', payload: { message: "Preprocessing..." } });

    // 1. Preprocess
    // We need to draw Bitmap to OffscreenCanvas to get pixel data
    const size = 256; // DeOldify standard input
    const offscreen = new OffscreenCanvas(size, size);
    const ctx = offscreen.getContext('2d');
    ctx.drawImage(imageBitmap, 0, 0, size, size);

    const imageData = ctx.getImageData(0, 0, size, size);
    const inputTensor = preprocess(imageData);

    // 2. Inference
    self.postMessage({ type: 'status', payload: { message: "Colorizing..." } });
    const feeds = { input: inputTensor }; // Adjust input name if model differs
    const results = await session.run(feeds);
    const outputTensor = Object.values(results)[0]; // robustly get first output

    // 3. Postprocess
    self.postMessage({ type: 'status', payload: { message: "Finalizing..." } });

    // We need to resize output back to original size? 
    // Creating an ImageData of original size and drawing it is hard in Worker without resize lib.
    // Better strategy: Return 256x256 ImageData, let Main Thread resize (canvas drawImage is fast).

    const resultImageData = postprocess(outputTensor);

    self.postMessage({
        type: 'result',
        payload: {
            imageData: resultImageData,
            width: size,
            height: size
        }
    });
}

function preprocess(imageData) {
    // Convert RGBA to RGB float32 [0, 1] planar
    const { data, width, height } = imageData;
    const float32Data = new Float32Array(3 * width * height);

    let i = 0; // pixel index
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const r = data[i * 4] / 255.0;
            const g = data[i * 4 + 1] / 255.0;
            const b = data[i * 4 + 2] / 255.0;

            // Channel-last to Channel-first [1, 3, H, W]
            // Tensor constructor handles flat array, we just need to order RRRGGGBBB
            float32Data[y * width + x] = r;
            float32Data[width * height + y * width + x] = g;
            float32Data[2 * width * height + y * width + x] = b;

            i++;
        }
    }

    return new ort.Tensor('float32', float32Data, [1, 3, height, width]);
}

function postprocess(tensor) {
    const { data, dims } = tensor;
    // dims: [1, 3, H, W]
    const [, channels, height, width] = dims;
    const resultData = new Uint8ClampedArray(width * height * 4);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const rIdx = y * width + x;
            const gIdx = width * height + rIdx;
            const bIdx = 2 * width * height + rIdx;

            const r = clamp(data[rIdx] * 255, 0, 255);
            const g = clamp(data[gIdx] * 255, 0, 255);
            const b = clamp(data[bIdx] * 255, 0, 255);

            const pixelIdx = (y * width + x) * 4;
            resultData[pixelIdx] = r;
            resultData[pixelIdx + 1] = g;
            resultData[pixelIdx + 2] = b;
            resultData[pixelIdx + 3] = 255; // Alpha
        }
    }

    return new ImageData(resultData, width, height);
}
