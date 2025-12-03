<div align="center">

# 🎨 DeOldify on Browser

**AI-Powered Image Colorization Running Entirely in Your Browser**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Demo](https://img.shields.io/badge/demo-live-brightgreen.svg)](https://deoldify.glitch.me/)
[![Model](https://img.shields.io/badge/model-ONNX-orange.svg)](https://huggingface.co/thookham/DeOldify-on-Browser)

*Transform black & white photos into vibrant color images using DeOldify's deep learning model—no server,  installation required!*

**[🚀 Try Live Demo](https://deoldify.glitch.me/)** • [Features](#-features) • [Quick Start](#-quick-start) • [How It Works](#-how-it-works)

![DeOldify Demo](img/screenshot.jpg)

</div>

---

## 📖 Overview

**DeOldify on Browser** is a web-based implementation of the groundbreaking [DeOldify](https://github.com/jantic/DeOldify) project for colorizing and restoring old images. Unlike server-based solutions, this runs **100% client-side** using ONNX.js, ensuring your photos never leave your device.

### Why Browser-Based?

- **🔒 Privacy**: Photos process locally—nothing uploaded to servers
- **⚡ Fast**: No network latency, instant results
- **💰 Free**: No API costs or server hosting required
- **📱 Works Offline**: Download once, use anywhere
- **🌐 Universal**: Runs on any modern browser (Chrome, Edge, Firefox)

---

## ✨ Features

- 🎨 **Two Model Options**:
  - **Artistic Model** (~243MB): Higher quality, richer colors, artistic interpretation
  - **Quantized Model** (~61MB): 75% smaller, faster loading, good quality
  
- 🖼️ **Smart Processing**:
  - Automatic image preprocessing (grayscale conversion, normalization)
  - Intelligent postprocessing for natural-looking results
  - Progress indicators during colorization
  
- 📦 **Browser Caching**:
  - Models cached using Cache API
  - Instant subsequent loads (no re-download)
  - Works PWA-ready for offline use

---

## 🚀 Quick Start

### Option 1: Live Demo (Easiest)

Visit **[deoldify.glitch.me](https://deoldify.glitch.me/)** to try it instantly!

### Option 2: Run Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/thookham/DeOldify-on-Browser.git
   cd DeOldify-on-Browser
   ```

2. **Serve locally** (models load from Hugging Face):
   ```powershell
   # Using PowerShell
   .\serve.ps1
   
   # Or using Python
   python -m http.server 8000
   ```

3. **Open in browser**:
   - **Artistic Model**: `http://localhost:8000/original/index.html`
   - **Quantized Model**: `http://localhost:8000/quantized/index.html`

---

## 💻 Usage

1. **Open** either `artistic.html` or `quantized.html`
2. **Upload** a black & white photo (or color photo to re-colorize)
3. **Click** "Colorize" button
4. **Wait** ~5-30 seconds (depends on image size)
5. **Download** your colorized result!

### Model Comparison

| Feature | Artistic Model | Quantized Model |
|---------|----------------|-----------------|
| **File Size** | ~243 MB | ~61 MB |
| **Quality** | Excellent | Good |
| **Speed** | Moderate | Fast |
| **Best For** | Max quality | Quick previews, mobile |

---

## 🏗️ How It Works

### Architecture

```
User Upload → Preprocessing → ONNX Runtime → Postprocessing → Display
                  ↓               ↓               ↓
              (Grayscale)  (DeOldify Model)  (Color Mapping)
```

### Technical Stack

- **Frontend**: Vanilla JavaScript (no frameworks)
- **ML Runtime**: [ONNX.js](https://github.com/microsoft/onnxjs) / ONNX Runtime Web
- **Models**: DeOldify artistic/quantized models in ONNX format
- **Storage**: Cache API for model persistence
- **Hosting**: Static files from CDN (Hugging Face model hub)

### Model Pipeline

1. **Input Image**: User uploads B&W or color JPG/PNG
2. **Preprocessing**:
   - Convert to grayscale (if not already)
   - Resize to model input size (256x256 or 512x512)
   - Normalize pixel values to [0, 1]
3. **Inference**: Run through DeOldify ONNX model (~5-30s)
4. **Postprocessing**:
   - Map output tensor to RGB values
   - Resize back to original dimensions
   - Apply color corrections
5. **Display**: Show colorized result in canvas

---

## 📁 Project Structure

```
DeOldify-on-Browser/
├── original/
│   └── index.html          # Artistic model implementation
├── quantized/
│   └── index.html          # Quantized model implementation
├── img/
│   └── screenshot.jpg      # Demo screenshot
├── serve.ps1               # PowerShell local server script
└── README.md               # You are here!
```

---

## 🗺️ Roadmap

See [ROADMAP.md](ROADMAP.md) for detailed plans.

### Upcoming Features

- 🎯 **UI/UX Redesign**: Modern, premium interface
- 🖼️ **Before/After Slider**: Interactive comparison
- 📦 **Batch Processing**: Colorize multiple images
- 🎚️ **Intensity Control**: Adjust colorization strength
- 📱 **PWA Support**: Install as native app
- 🎥 **Video Colorization**: Frame-by-frame processing

---

## 🔧 Advanced: Model Quantization

Want to quantize your own ONNX models? See our [Technical Guide](TECHNICAL.md) (coming soon) or use this quick reference:

### Quick Quantization Steps

1. **Upload to Google Colab**: Original ONNX model
2. **Run preprocessing**:
   ```python
   !pip install onnxruntime onnx
   !python -m onnxruntime.quantization.preprocess \
     --input deoldify.onnx \
     --output deoldify-preprocessed.onnx
   ```
3. **Quantize**:
   ```python
   from onnxruntime.quantization import quantize_dynamic, QuantType
   quantize_dynamic(
       'deoldify-preprocessed.onnx',
       'deoldify-quant.onnx',
       weight_type=QuantType.QUInt8
   )
   ```

Full instructions in [TECHNICAL.md](TECHNICAL.md) (coming soon).

---

## 🤝 Contributing

Contributions welcome! Ideas for improvements:

- **Performance**: Optimize preprocessing/postprocessing
- **UI**: Design a better interface
- **Features**: Add batch processing, video support
- **Models**: Test newer DeOldify versions
- **Docs**: Improve  documentation

See [CONTRIBUTING.md](CONTRIBUTING.md) (when available) for guidelines.

---

## 📝 Credits & License

### Original DeOldify Project

This project uses models from [DeOldify](https://github.com/jantic/DeOldify) by [Jason Antic](https://github.com/jantic).

### ONNX Conversion

Original ONNX files by [Thomas De](https://github.com/instant-high/deoldify-onnx).

### License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🔗 Related Projects

- **[DeOldify](https://github.com/thookham/DeOldify)**: Main desktop implementation (modern Python)
- **[DeOldify Original](https://github.com/jantic/DeOldify)**: Original research project
- **[ONNX.js](https://github.com/microsoft/onnxjs)**: JavaScript ML runtime

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/thookham/DeOldify-on-Browser/issues)
- **Demo**: [deoldify.glitch.me](https://deoldify.glitch.me/)
- **Models**: [Hugging Face Hub](https://huggingface.co/thookham/DeOldify-on-Browser)

---

<div align="center">

**[⬆ Back to Top](#-deoldify-on-browser)**

Bringing color to history, one photo at a time 🎨

</div>
 
