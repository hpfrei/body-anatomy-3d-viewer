# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-07

### Added

- Initial public release of Body Anatomy 3D Viewer
- Three.js-based 3D model viewer with GLB/GLTF support
- DRACO compression support for efficient model loading
- Click-through layered mesh visualization
- Semi-transparent red highlighting on selected objects (0.3 opacity)
- Smooth animations using Tween.js with Cubic.Out easing (800ms duration)
- Interactive orbit controls for camera navigation (rotate, zoom, pan)
- Object info panel displaying metadata for selected anatomical structures
- Reset functionality to restore all objects to original state
- Express.js server for static file serving on port 3000
- Comprehensive documentation (README, CONTRIBUTING, CHANGELOG)
- CC BY-SA 4.0 license (Creative Commons Attribution-ShareAlike 4.0)
- Attribution to Z-Anatomy for anatomical models and data
- Complete project structure with organized directories
- Responsive UI elements (info panel, reset button, close button)
- WebGL hardware-accelerated rendering
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)

### Technical Implementation

- PerspectiveCamera with 75° FOV
- Ambient and directional lighting for proper model illumination
- Raycasting for precise 3D object selection
- Material transparency system for layered visualization
- Dynamic info panel with hide/show functionality
- Tween.js animation loop for smooth transitions
- Import maps for ES6 module management

[1.0.0]: https://github.com/hpfrei/body-anatomy-3d-viewer/releases/tag/v1.0.0
