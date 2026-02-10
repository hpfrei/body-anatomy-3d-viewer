# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-02-10

### Changed

- **Simplified deployment**: Removed Node.js dependencies (Express.js) in favor of static file serving
- **Updated installation**: Now uses `npx serve` instead of `npm install` - no dependencies to install
- **Rewrote README.md**: More personal tone emphasizing `body.glb` as the main reusable asset
- Added "Why This Exists" section explaining motivation and model creation process
- Repositioned viewer.js as reference implementation rather than the primary deliverable
- **Simplified CONTRIBUTING.md**: More welcoming for first-time contributors, removed Node.js setup
- Updated project structure documentation to reflect static-only architecture

### Removed

- `server.js` - Express server no longer needed
- `package.json` - No npm dependencies required
- `package-lock.json` - No dependency management needed

### Fixed

- Corrected license reference in CONTRIBUTING.md (was BSD-3-Clause, now correctly CC-BY-SA-4.0)

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
