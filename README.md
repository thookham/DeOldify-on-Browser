---
license: mit
library_name: onnxruntime
tags:
  - onnx
  - image-colorization
  - deoldify
  - image-to-image
  - image-restoration
  - browser
  - client-side
  - onnx-runtime-web
  - no-server
  - javascript
datasets:
  - imagenet-1k
pipeline_tag: image-to-image
language:
  - en
---

<div align="center">

# 🎨 DeOldify on Browser

**AI-Powered Image Colorization • 100% Client-Side • No Server Required**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Demo](https://img.shields.io/badge/🚀_Live_Demo-brightgreen.svg)](https://deoldify.glitch.me/)
[![ONNX](https://img.shields.io/badge/Runtime-ONNX-orange.svg)](https://onnxruntime.ai/)
[![Browser](https://img.shields.io/badge/Runs_in-Browser-purple.svg)](#)

*Transform your black & white photos into vibrant color images using deep learning—directly in your browser with complete privacy!*

**[🚀 Try Live Demo](https://deoldify.glitch.me/)** • **[📖 Documentation](#-quick-start)** • **[💾 Download Models](#-available-models)**

<img src="img/screenshot.jpg" alt="DeOldify Demo - Before and After" width="600"/>

</div>

---

## ✨ What is DeOldify on Browser?

**DeOldify on Browser** brings the legendary [DeOldify](https://github.com/jantic/DeOldify) AI colorization to your web browser. Using ONNX Runtime Web, the model runs **100% locally**—your photos never leave your device!

### 🔑 Key Benefits

| Feature | Description |
|---------|-------------|
| 🔒 **Private** | All processing happens in your browser—zero data uploaded |
| ⚡ **Fast** | No network latency, instant inference after model loads |
| 💰 **Free** | No API costs, no subscriptions, no limits |
| 📱 **Offline Ready** | Download once, use anywhere (models are cached) |
| 🌐 **Universal** | Works on Chrome, Edge, Firefox, Safari |

---

## 📦 Available Models

This repository contains ONNX models optimized for browser deployment:

| Model | File | Size | Quality | Speed | Best For |
|-------|------|------|---------|-------|----------|
| **🎨 Artistic** | `deoldify-artistic.onnx` | ~243 MB | ⭐⭐⭐⭐⭐ Excellent | ⚡⚡ Moderate | Maximum quality results |
| **⚡ Quantized** | `deoldify-quant.onnx` | ~61 MB | ⭐⭐⭐⭐ Good | ⚡⭐⭐⭐⭐ Fast | Mobile, quick previews |

### Model Architecture

- **Base Architecture**: ResNet34 U-Net
- **Training Method**: NoGAN (No Generative Adversarial Network)
- **Input**: Grayscale image (any resolution)
- **Output**: RGB colorized image
- **Format**: ONNX (Open Neural Network Exchange)

> **💡 Pro Tip**: The Artistic model produces more vibrant, creative colors. The Quantized model is 4x smaller with minimal quality loss—perfect for mobile devices!

---

## 🚀 Quick Start

### Option 1: Live Demo (Instant)

**[👉 Visit deoldify.glitch.me](https://deoldify.glitch.me/)** and start colorizing immediately!

### Option 2: Self-Host

#### Requirements

- Modern web browser (Chrome 80+, Firefox 75+, Edge 80+, Safari 14+)
- Local HTTP server (models can't load from `file://` due to CORS)

#### Steps

1. **Clone the repository**:

   ```bash
   git clone https://huggingface.co/thookham/DeOldify-on-Browser
   cd DeOldify-on-Browser
   ```

2. **Start a local server**:

   ```bash
   # Python (cross-platform)
   python -m http.server 8000
   
   # PowerShell (Windows)
   .\serve.ps1
   
   # Node.js
   npx serve .
   ```

3. **Open in browser**:
   - Artistic Model: `http://localhost:8000/original/index.html`
   - Quantized Model: `http://localhost:8000/quantized/index.html`

---

## 💻 Usage Guide

### Basic Workflow

1. **Open** the web app (demo or local)
2. **Upload** your black & white photo (or any color photo to re-colorize)
3. **Wait** 5-30 seconds for AI colorization
4. **Download** your colorized masterpiece!

### Supported Formats

| Input | Output |
|-------|--------|
| JPEG, PNG, WebP | PNG (lossless) |
| Any resolution | Same as input |
| Color or B&W | Full RGB color |

### Tips for Best Results

- ✅ **High contrast** images work best
- ✅ **Good lighting** in the original helps
- ✅ **Portraits** often produce excellent results
- ⚠️ **Very dark** images may need preprocessing
- ⚠️ **Heavy damage** (scratches, tears) won't be repaired

---

## 🏗️ Technical Details

### How It Works

```
User Upload → Preprocessing → ONNX Runtime → Postprocessing → Display
     │              │              │              │
     ▼              ▼              ▼              ▼
  (Image)    (Grayscale,     (DeOldify     (Color map,
              Normalize)      Model)        Resize)
```

### Processing Pipeline

1. **Preprocessing**: Convert to grayscale, resize to 256×256, normalize to [0,1]
2. **Inference**: Run through DeOldify ONNX model using ONNX Runtime Web
3. **Postprocessing**: Map output tensor to RGB, resize to original, apply corrections
4. **Caching**: Models stored in browser Cache API for instant reloads

### Browser Requirements

| Component | Requirement |
|-----------|-------------|
| WebAssembly | Required for ONNX Runtime |
| WebGL | Optional (GPU acceleration) |
| Cache API | Required for model caching |
| Memory | 2GB+ recommended |

---

## 📁 Repository Structure

```
DeOldify-on-Browser/
├── assets/                 ← App resources
│   ├── css/                ← Styling (Glassmorphism)
│   ├── js/                 ← Javascript logic & workers
│   └── models/             ← Cached models
├── img/                    ← Images
├── serve.ps1               ← Windows helper script
├── LICENSE                 ← MIT License
├── README.md               ← This file
├── ROADMAP.md              ← Feature roadmap
├── index.html              ← Main Application
└── CHANGELOG.md            ← Version history
```

---

## � Integration Example

Want to use these models in your own project? Here's a minimal example:

```javascript
import * as ort from 'onnxruntime-web';

async function colorize(imageData) {
  // Load model from Hugging Face
  const modelUrl = 'https://huggingface.co/thookham/DeOldify-on-Browser/resolve/main/original/deoldify-artistic.onnx';
  const session = await ort.InferenceSession.create(modelUrl);
  
  // Preprocess: grayscale, normalize, resize to 256x256
  const inputTensor = preprocessImage(imageData);
  
  // Run inference
  const results = await session.run({ input: inputTensor });
  
  // Postprocess: map to RGB
  return postprocessOutput(results.output);
}
```

> **📚 Full integration guide coming soon!** See [ROADMAP.md](ROADMAP.md) for planned documentation.

---

## 🌟 The NoGAN Advantage

DeOldify achieves stunning results using **NoGAN training**—a hybrid approach that combines:

- **GAN-level realism** without common artifacts
- **Stable training** without mode collapse
- **Consistent colors** across image regions

This is why DeOldify consistently outperforms other colorization methods!

---

## � Performance Benchmarks

*Tested on M1 MacBook Pro, Chrome 120*

| Model | Load Time | Inference (512×512) | Memory Usage |
|-------|-----------|---------------------|--------------|
| Artistic | ~3s (cached) | ~8s | ~1.2 GB |
| Quantized | ~1s (cached) | ~3s | ~0.4 GB |

> **Note**: First load downloads the model; subsequent loads use browser cache.

---

## 🤝 Related Projects

| Project | Description | Link |
|---------|-------------|------|
| **DeOldify (Desktop)** | Full Python implementation | [GitHub](https://github.com/thookham/DeOldify) |
| **DeOldify (Original)** | Original research by Jason Antic | [GitHub](https://github.com/jantic/DeOldify) |
| **ONNX Runtime** | Cross-platform ML inference | [Website](https://onnxruntime.ai/) |
| **thookham/DeOldify** | PyTorch + ONNX models | [Hugging Face](https://huggingface.co/thookham/DeOldify) |

---

## 📝 Credits & License

### Acknowledgments

- **[Jason Antic](https://github.com/jantic)** - Original DeOldify creator
- **[Thomas De](https://github.com/instant-high)** - Initial ONNX conversion
- **[Hugging Face](https://huggingface.co)** - Model hosting

### License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| **"Failed to fetch" error** | Use HTTP server, not `file://` |
| **Tab crashes** | Close other tabs, try Quantized model |
| **Slow colorization** | Normal for first load, uses cache after |
| **Colors look wrong** | Try different image, adjust brightness first |

---

## � Support & Community

- **🐛 Issues**: [GitHub Issues](https://github.com/thookham/DeOldify-on-Browser/issues)
- **🚀 Demo**: [deoldify.glitch.me](https://deoldify.glitch.me/)
- **💾 Models**: [This Repository](https://huggingface.co/thookham/DeOldify-on-Browser/tree/main)

---

<div align="center">

### 🎨 Bringing Color to History, One Photo at a Time

**[Try the Live Demo →](https://deoldify.glitch.me/)**

---

*Made with ❤️ for photo restoration enthusiasts everywhere*

</div>
