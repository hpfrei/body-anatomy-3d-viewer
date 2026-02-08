# Body Anatomy 3D Viewer

An interactive 3D anatomy viewer built with Three.js that allows users to explore anatomical models through click-through layered visualization with smooth animations and visual feedback.

![Body Anatomy 3D Viewer](screenshot.png)

## Features

- **Click-Through Layered Meshes**: Click on any anatomical structure (muscles, bones) to explore underlying layers
- **Visual Feedback**: Subtle red emissive glow for highlighted objects with smooth transitions
- **Smart Layer Navigation**: Click highlighted objects to move them away and reveal deeper structures
- **Intelligent Restore**: Clicking moved objects restores them along with any hidden underlying structures
- **Smooth Animations**: Powered by Tween.js with 800ms Cubic.Out easing for fluid motion
- **Orbit Controls**: Intuitive camera navigation - click and drag to rotate, scroll to zoom
- **Rich Info Panel**: Displays anatomical names, descriptions, and educational wiki links
- **Reset Functionality**: One-click button to restore all objects to their original state
- **DRACO Compression**: Efficient 3D model loading with optimized file size
- **WebGL Rendering**: Hardware-accelerated graphics for smooth performance

## Demo

Visit the live demo at: [https://www.hpfreilabs.com/body-anatomy-3d-viewer/](https://www.hpfreilabs.com/body-anatomy-3d-viewer/)

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/hpfrei/body-anatomy-3d-viewer.git
   cd body-anatomy-3d-viewer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage

### Basic Interactions

- **Rotate**: Left-click and drag to rotate the camera around the model
- **Zoom**: Scroll up/down to zoom in/out
- **Pan**: Right-click and drag to pan the camera
- **Select Object**: Left-click on any mesh to make it semi-transparent and view underlying structures
- **View Info**: Selected objects display metadata in the info panel
- **Reset**: Click the "Reset All" button to restore all objects to their original opacity

### Navigation Tips

- Click through multiple layers to explore deep anatomical structures
- Use the info panel to learn about each selected structure
- Combine rotation and zooming for detailed examination of specific areas

## Project Structure

```
body-anatomy-3d-viewer/
├── public/
│   ├── index.html          # Main HTML file
│   ├── style.css           # Styling for UI elements
│   ├── viewer.js           # Three.js viewer logic
│   ├── models/
│   │   └── body.glb        # 3D anatomical model (DRACO compressed)
│   └── libs/
│       ├── three.module.js        # Three.js core library
│       ├── OrbitControls.js       # Camera controls
│       ├── GLTFLoader.js          # GLTF/GLB loader
│       ├── DRACOLoader.js         # DRACO compression support
│       ├── tween.js               # Animation library
│       └── draco/                 # DRACO decoder files
├── server.js               # Express.js server for static file serving
├── package.json            # Node.js dependencies and metadata
├── README.md               # This file
├── LICENSE                 # BSD-3-Clause license
├── CONTRIBUTING.md         # Contribution guidelines
└── CHANGELOG.md            # Version history
```

## Technologies Used

- **[Three.js](https://threejs.org/)**: WebGL-based 3D graphics library
- **[Express.js](https://expressjs.com/)**: Minimal web server for static file serving
- **[Tween.js](https://github.com/tweenjs/tween.js/)**: JavaScript animation library for smooth transitions
- **[DRACO](https://google.github.io/draco/)**: 3D geometry compression library by Google
- **WebGL**: Hardware-accelerated 3D graphics rendering

## Model Preparation

The anatomical model (`body.glb`) has been specifically prepared for optimal web browser performance:

- **Source**: Derived from the [Z-Anatomy](https://www.z-anatomy.com/) anatomical dataset
- **Processing**: Extensively processed in Blender using custom Python scripts to:
  - Simplify geometry for reduced file size while maintaining anatomical accuracy
  - Optimize mesh topology for efficient rendering
  - Embed structured metadata (names, descriptions, wiki links) into each mesh's custom data
  - Apply DRACO compression for minimal network transfer size
- **Result**: A lightweight, browser-friendly model (6.9 MB) with rich, queryable anatomical data

This preprocessing pipeline transforms the comprehensive Z-Anatomy dataset into a web-optimized format that loads quickly and performs smoothly across devices, while preserving essential anatomical information and educational links.

## How It Works

1. **Model Loading**: GLTFLoader loads the optimized anatomical model with DRACO compression
2. **Scene Setup**: Three.js creates a 3D scene with camera, lights, and orbit controls
3. **Interaction**: Mouse clicks use raycasting to detect selected meshes
4. **Highlighting**: Selected objects display a subtle red emissive glow
5. **Layer Navigation**: Clicking highlighted objects moves them away to reveal underlying structures
6. **Info Display**: Metadata (name, description, wiki links) from each object's custom data is displayed
7. **Smart Restore**: Clicking moved objects restores them along with any structures that were underneath

### Viewer Code Design

The `viewer.js` implementation is intentionally kept **minimal and readable** (~280 lines) to serve as:
- A clean reference implementation for anatomical model interaction
- A starting point for custom viewers with specialized features
- An educational example of Three.js best practices for medical/biological visualization

Developers can extend this foundation with features like cross-sections, measurement tools, annotation systems, or VR support while maintaining the core interaction pattern.

## Customization

### Using Your Own 3D Model

To replace the anatomical model with your own GLB/GLTF file:

1. Export your 3D model as GLB (optionally with DRACO compression)
2. Replace `public/models/body.glb` with your model file
3. Update the model path in `public/viewer.js` if you use a different filename:
   ```javascript
   loader.load('./models/your-model.glb', function (gltf) {
       // ...
   });
   ```

### Adjusting Visual Settings

Edit `public/viewer.js` to customize:

- **Animation Duration**: Change `800` in the Tween duration (line ~XX)
- **Transparency Level**: Change `0.3` in `material.opacity` animation
- **Highlight Color**: Modify the color calculation for transparency effect
- **Camera Position**: Adjust `camera.position.set(x, y, z)` values
- **Easing Function**: Change `TWEEN.Easing.Cubic.Out` to other easing functions

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Any modern browser with WebGL support

## Performance Considerations

- The included body.glb file is 6.9 MB with DRACO compression
- Loading time depends on network speed and device performance
- For larger models, consider additional compression or lazy loading strategies

## Attribution

This project uses anatomical models and data from **[Z-Anatomy](https://www.z-anatomy.com/)**, which is licensed under the [Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0)](http://creativecommons.org/licenses/by-sa/4.0/).

In compliance with the CC BY-SA 4.0 license:
- **Attribution**: Content derived from Z-Anatomy
- **Source**: https://www.z-anatomy.com/
- **License**: CC BY-SA 4.0 (http://creativecommons.org/licenses/by-sa/4.0/)

## License

This project is licensed under the Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0) - see the [LICENSE](LICENSE) file for details.

This license applies to both the code and the anatomical models used in this project, in compliance with the Z-Anatomy source material's licensing requirements.

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Author

**hpfrei**
- Website: [https://www.hpfreilabs.com](https://www.hpfreilabs.com)
- GitHub: [@hpfrei](https://github.com/hpfrei)

## Issues

If you encounter any issues or have questions, please file them in the [issue tracker](https://github.com/hpfrei/body-anatomy-3d-viewer/issues).

## Acknowledgments

- Three.js community for excellent documentation and examples
- DRACO compression by Google for efficient 3D model delivery
- The open source community for tools and inspiration
