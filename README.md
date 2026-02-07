# Body Anatomy 3D Viewer

An interactive 3D anatomy viewer built with Three.js that allows users to explore anatomical models through click-through layered visualization with smooth animations and visual feedback.

![Body Anatomy 3D Viewer](screenshot.png)
*Add a screenshot of your viewer here*

## Features

- **Click-Through Layered Meshes**: Click on any anatomical structure (muscles, bones) to explore underlying layers
- **Visual Feedback**: Semi-transparent red highlighting with smooth transparency transitions
- **Smooth Animations**: Powered by Tween.js with 800ms Cubic.Out easing for fluid motion
- **Orbit Controls**: Intuitive camera navigation - click and drag to rotate, scroll to zoom
- **Object Info Panel**: Displays metadata and information about selected anatomical structures
- **Reset Functionality**: One-click button to restore all objects to their original state
- **DRACO Compression Support**: Efficient 3D model loading with DRACO compression
- **WebGL Rendering**: Hardware-accelerated graphics for smooth performance

## Demo

Visit the live demo at: [https://www.hpfreilabs.com](https://www.hpfreilabs.com)

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

## How It Works

1. **Model Loading**: The app uses GLTFLoader to load the anatomical model (body.glb) with DRACO compression
2. **Scene Setup**: Three.js creates a 3D scene with camera, lights, and orbit controls
3. **Raycasting**: Mouse clicks are converted to 3D raycasts to detect which mesh was clicked
4. **Animation**: When a mesh is clicked, Tween.js smoothly animates its opacity to 0.3 (semi-transparent red)
5. **Info Display**: Metadata from the clicked object is extracted and displayed in the info panel
6. **Reset**: The reset button uses Tween.js to animate all meshes back to full opacity

### Key Implementation Details

- **Transparency**: Uses `material.transparent = true` with `material.opacity` animation
- **Highlighting**: Applies semi-transparent red color (`#ff0000` at 0.3 opacity)
- **Animation Easing**: Cubic.Out easing provides smooth, natural-feeling transitions
- **Camera**: PerspectiveCamera with 75° FOV positioned for optimal model viewing

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
