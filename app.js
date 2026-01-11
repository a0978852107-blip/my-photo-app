// Global Variables
let canvas, ctx;
let originalImage = null;
let currentImage = null;
let currentTab = 'invoice';
let currentFilter = 'none';
let filterIntensity = 0;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeCanvas();
    initializeEventListeners();
    checkStandaloneMode();
});

// Canvas Initialization
function initializeCanvas() {
    canvas = document.getElementById('mainCanvas');
    ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Set initial canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
    const container = document.querySelector('.canvas-container');
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Only resize if no image is loaded
    if (!originalImage) {
        canvas.width = containerWidth;
        canvas.height = containerHeight;
    }
}

// Event Listeners
function initializeEventListeners() {
    // Upload Controls
    document.getElementById('uploadBtn').addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });
    
    document.getElementById('cameraBtn').addEventListener('click', () => {
        document.getElementById('cameraInput').click();
    });
    
    document.getElementById('fileInput').addEventListener('change', handleFileSelect);
    document.getElementById('cameraInput').addEventListener('change', handleFileSelect);
    
    // Tab Navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            switchTab(tab);
        });
    });
    
    // Filter Controls
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            applyCurrentFilter();
        });
    });
    
    const intensitySlider = document.getElementById('intensitySlider');
    intensitySlider.addEventListener('input', (e) => {
        filterIntensity = parseInt(e.target.value);
        document.getElementById('intensityValue').textContent = `${filterIntensity}%`;
        applyCurrentFilter();
    });
    
    // AR Controls
    const styleButtons = document.querySelectorAll('.style-btn');
    styleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            styleButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    const colorButtons = document.querySelectorAll('.color-btn');
    colorButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            colorButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // Action Buttons
    document.getElementById('resetBtn').addEventListener('click', resetImage);
    document.getElementById('downloadBtn').addEventListener('click', downloadImage);
    
    // OCR Button
    document.getElementById('extractBtn').addEventListener('click', () => {
        alert('OCR 功能將在第三階段實作');
    });
    
    // AR Detection Button
    document.getElementById('detectFaceBtn').addEventListener('click', () => {
        alert('AR 臉部偵測功能將在第五階段實作');
    });
}
// File Handling
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('請選擇圖片檔案');
        return;
    }
    
    showLoading('載入圖片中...');
    
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            loadImageToCanvas(img);
            hideLoading();
        };
        img.onerror = () => {
            hideLoading();
            alert('圖片載入失敗');
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    
    // Reset file input
    e.target.value = '';
}

// Load Image to Canvas
function loadImageToCanvas(img) {
    // Store original image
    originalImage = img;
    
    // Calculate canvas dimensions to fit the image
    const containerWidth = document.querySelector('.canvas-container').clientWidth;
    const containerHeight = document.querySelector('.canvas-container').clientHeight;
    
    let canvasWidth = img.width;
    let canvasHeight = img.height;
    
    // Scale down if image is larger than container
    const widthRatio = containerWidth / img.width;
    const heightRatio = containerHeight / img.height;
    const scale = Math.min(widthRatio, heightRatio, 1); // Don't scale up
    
    canvasWidth = img.width * scale;
    canvasHeight = img.height * scale;
    
    // Set canvas size
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Draw image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
    
    // Store current image data
    currentImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Hide placeholder
    document.getElementById('placeholder').classList.add('hidden');
    
    // Show tab controls
    document.getElementById('tabControls').style.display = 'block';
    
    // Reset filter settings
    resetFilterSettings();
    
    console.log('Image loaded:', {
        originalSize: `${img.width}x${img.height}`,
        canvasSize: `${canvas.width}x${canvas.height}`,
        scale: scale
    });
}

// Tab Switching
function switchTab(tab) {
    currentTab = tab;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    
    // Hide all control sections
    document.getElementById('invoiceControls').style.display = 'none';
    document.getElementById('filterControls').style.display = 'none';
    document.getElementById('arControls').style.display = 'none';
    
    // Show relevant control section
    switch(tab) {
        case 'invoice':
            document.getElementById('invoiceControls').style.display = 'block';
            break;
        case 'filter':
            document.getElementById('filterControls').style.display = 'block';
            break;
        case 'ar':
            document.getElementById('arControls').style.display = 'block';
            break;
    }
}
// Filter Application (placeholder for Phase 4)
function applyCurrentFilter() {
    if (!originalImage || currentFilter === 'none' || filterIntensity === 0) {
        resetImage();
        return;
    }
    
    // This will be implemented in Phase 4
    console.log(`Applying filter: ${currentFilter} at ${filterIntensity}% intensity`);
    
    // For now, just show a message
    showLoading(`套用 ${currentFilter} 濾鏡 (${filterIntensity}%)...`);
    setTimeout(() => {
        hideLoading();
    }, 500);
}

function resetFilterSettings() {
    currentFilter = 'none';
    filterIntensity = 0;
    document.getElementById('intensitySlider').value = 0;
    document.getElementById('intensityValue').textContent = '0%';
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === 'none');
    });
}

// Reset Image
function resetImage() {
    if (!originalImage) return;
    
    // Redraw original image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const scale = Math.min(canvas.width / originalImage.width, canvas.height / originalImage.height);
    const width = originalImage.width * scale;
    const height = originalImage.height * scale;
    
    ctx.drawImage(originalImage, 0, 0, width, height);
    currentImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Reset filter settings
    if (currentTab === 'filter') {
        resetFilterSettings();
    }
}

// Download Image
function downloadImage() {
    if (!originalImage) {
        alert('請先載入圖片');
        return;
    }
    
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-photo-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 'image/png');
}

// Loading Indicator
function showLoading(text = '處理中...') {
    document.getElementById('loadingText').textContent = text;
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

// Check if running in standalone mode
function checkStandaloneMode() {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
                      || window.navigator.standalone 
                      || document.referrer.includes('android-app://');
    
    if (isStandalone) {
        console.log('Running in standalone PWA mode');
        document.body.classList.add('standalone-mode');
    } else {
        console.log('Running in browser mode');
    }
}

// Service Worker Registration (will be implemented in Phase 2)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration.scope);
            })
            .catch(err => {
                console.log('ServiceWorker registration failed:', err);
            });
    });
}

// Prevent default touch behaviors for better PWA feel
document.addEventListener('touchmove', (e) => {
    if (e.target.closest('.control-panel')) {
        // Allow scrolling in control panel
        return;
    }
    e.preventDefault();
}, { passive: false });

// Handle orientation changes
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        resizeCanvas();
        if (originalImage) {
            loadImageToCanvas(originalImage);
        }
    }, 100);
});

console.log('App initialized - Phase 1 Complete');
console.log('Canvas ready for image loading');