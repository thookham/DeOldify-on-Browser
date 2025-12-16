// DeOldify Browser - Main Application Logic
import { setupSlider } from './slider.js';

// Configuration
const CONFIG = {
    models: {
        artistic: {
            url: "https://huggingface.co/thookham/DeOldify-on-Browser/resolve/main/deoldify-art.onnx",
            name: "Artistic"
        },
        quantized: {
            url: "https://huggingface.co/thookham/DeOldify-on-Browser/resolve/main/deoldify-quant.onnx",
            name: "Quantized"
        }
    },
    defaultModel: 'artistic'
};

// State
let state = {
    currentModel: CONFIG.defaultModel,
    worker: null,
    isProcessing: false
};

// DOM Elements
const elements = {
    dropZone: document.getElementById('dropZone'),
    fileInput: document.getElementById('fileInput'),
    modelOptions: document.querySelectorAll('.model-option'),
    statusText: document.getElementById('statusText'),
    progressBar: document.getElementById('progressBar'),
    progressFill: document.getElementById('progressFill'),
    resultContainer: document.getElementById('resultContainer'),
    originalImage: document.getElementById('originalImage'),
    outputCanvas: document.getElementById('outputCanvas')
};

// Initialize
function init() {
    setupWorker();
    setupEventListeners();
    setupSlider(); // Imported from slider.js
}

function setupWorker() {
    state.worker = new Worker('assets/js/worker.js');

    state.worker.onmessage = function (e) {
        const { type, payload } = e.data;

        switch (type) {
            case 'status':
                updateStatus(payload.message);
                break;
            case 'progress':
                updateProgress(payload.percent);
                break;
            case 'result':
                handleResult(payload);
                break;
            case 'error':
                handleError(payload);
                break;
        }
    };
}

function setupEventListeners() {
    // Model Selection
    elements.modelOptions.forEach(option => {
        option.addEventListener('click', () => {
            elements.modelOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            state.currentModel = option.dataset.model;
            updateStatus(`Switched to ${CONFIG.models[state.currentModel].name} model`);
        });
    });

    // Drag & Drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        elements.dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    elements.dropZone.addEventListener('dragenter', () => elements.dropZone.classList.add('drag-over'));
    elements.dropZone.addEventListener('dragover', () => elements.dropZone.classList.add('drag-over'));
    elements.dropZone.addEventListener('dragleave', () => elements.dropZone.classList.remove('drag-over'));
    elements.dropZone.addEventListener('drop', handleDrop);

    // Click to Upload
    elements.dropZone.addEventListener('click', () => elements.fileInput.click());
    elements.fileInput.addEventListener('change', (e) => handleFiles(e.target.files));
}

function handleDrop(e) {
    elements.dropZone.classList.remove('drag-over');
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

function handleFiles(files) {
    if (state.isProcessing) return;
    const file = files[0];
    if (file && file.type.startsWith('image/')) {
        processImage(file);
    } else {
        updateStatus("Please upload a valid image file.", true);
    }
}

function processImage(file) {
    state.isProcessing = true;
    elements.resultContainer.classList.remove('visible');
    elements.progressBar.style.display = 'block';
    updateProgress(0);
    updateStatus("Preparing image...");

    // Display original
    const objectUrl = URL.createObjectURL(file);
    elements.originalImage.onload = () => {
        // Send to worker
        createImageBitmap(file).then(bitmap => {
            state.worker.postMessage({
                type: 'process',
                payload: {
                    imageBitmap: bitmap,
                    modelUrl: CONFIG.models[state.currentModel].url
                }
            }, [bitmap]); // Transfer bitmap ownership
        });
    };
    elements.originalImage.src = objectUrl;
}

function handleResult(payload) {
    const { imageData, width, height } = payload;

    // Draw result to canvas
    elements.outputCanvas.width = width;
    elements.outputCanvas.height = height;
    const ctx = elements.outputCanvas.getContext('2d');
    ctx.putImageData(imageData, 0, 0);

    // Show result
    state.isProcessing = false;
    elements.progressBar.style.display = 'none';
    elements.resultContainer.classList.add('visible');
    updateStatus("Colorization complete!");

    // Reset slider
    document.getElementById('sliderHandle').style.left = '50%';
    elements.outputCanvas.style.clipPath = 'inset(0 50% 0 0)';
}

function handleError(error) {
    console.error(error);
    state.isProcessing = false;
    elements.progressBar.style.display = 'none';
    updateStatus(`Error: ${error.message || "Unknown error occurred"}`, true);
}

function updateStatus(message, isError = false) {
    elements.statusText.innerText = message;
    elements.statusText.style.color = isError ? '#ef4444' : 'var(--text-muted)';
}

function updateProgress(percent) {
    elements.progressFill.style.width = `${percent}%`;
}

// Start
init();
