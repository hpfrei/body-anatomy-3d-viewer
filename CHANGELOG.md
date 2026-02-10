# Changelog

All changes documented here.

## [1.1.0] - 2026-02-10

### Changed

- Installation now uses `npx serve` for static file serving (replaces Express.js server)
- Updated README.md installation instructions and project structure documentation
- Updated CONTRIBUTING.md with static file server workflow

### Removed

- `server.js` - Express.js server
- `package.json` - npm dependencies
- `package-lock.json` - dependency lock file

### Fixed

- License reference in CONTRIBUTING.md (now CC-BY-SA-4.0)

## [1.0.0] - 2026-02-07

### Added

- Initial release
- Three.js viewer with DRACO-compressed GLB model (6.9 MB)
- Click-through layered visualization with red highlighting
- Tween.js animations (Cubic.Out easing, 800ms)
- Orbit controls (rotate, zoom, pan)
- Info panel showing mesh metadata
- Reset button
- Toggle buttons for muscles/bones
- Axes helper (X/Y/Z coordinates)
- Express.js server on port 3000
- CC BY-SA 4.0 license (Z-Anatomy attribution)
