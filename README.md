# Body Anatomy 3D Viewer

I needed a decent anatomical 3D model for the browser and couldn't find one. So I made it.

![Body Anatomy 3D Viewer](screenshot.png)

## What This Is

The main thing here is `body.glb` - a 6.9 MB anatomical model that actually works in browsers. Took the massive Z-Anatomy dataset, ran it through a bunch of Python scripts in Blender to simplify geometry and add DRACO compression, and got it down to something usable.

The viewer code is just there to show you how to load it. Take the model, use it however you want.

## Features

- **Click-Through Layered Meshes**: Click on any anatomical structure (muscles, bones) to explore underlying layers
- **Visual Feedback**: Subtle red emissive glow for highlighted objects with smooth transitions
- **Smart Layer Navigation**: Click highlighted objects to move them away and reveal deeper structures
- **Intelligent Restore**: Clicking moved objects restores them along with any hidden underlying structures
- **Type Filters**: Toggle muscles and bones visibility independently - hidden objects move to floor piles
- **Smooth Animations**: Constant-speed curved animations using CatmullRom splines
- **Orbit Controls**: Intuitive camera navigation - click and drag to rotate, scroll to zoom
- **Rich Info Panel**: Displays anatomical names, descriptions, and educational wiki links
- **XYZ Axes Helper**: Toggle coordinate axes display (X=red, Y=green, Z=blue) for spatial reference
- **Reset Functionality**: One-click button to restore all objects to their original state
- **DRACO Compression**: Efficient 3D model loading with optimized file size
- **WebGL Rendering**: Hardware-accelerated graphics for smooth performance

## Demo

Visit the live demo at: [https://www.hpfreilabs.com/body-anatomy-3d-viewer/](https://www.hpfreilabs.com/body-anatomy-3d-viewer/)

## Quick Start

```bash
git clone https://github.com/hpfrei/body-anatomy-3d-viewer.git
cd body-anatomy-3d-viewer
npx serve -s public -l 3000
```

Open http://localhost:3000. Done.

(Or use Python's http.server, VS Code Live Server, whatever. Just serve the `public/` folder.)

## How to Use

- **Click** things to highlight them
- **Click again** to move them to the floor (gets them out of the way)
- **Click moved stuff** to put it back
- **Drag** to rotate, **scroll** to zoom, **right-click + drag** to pan
- **Toggle buttons** hide/show muscles or bones
- **Reset button** puts everything back

Click through layers to see what's underneath. The info panel shows names and wiki links.

## About the Model

Z-Anatomy has great anatomical data, but it's way too big for browsers. I wrote Python scripts in Blender that:
- Simplify geometry (keep the detail, lose the bloat)
- Embed metadata (names, types, wiki links) into each mesh
- Apply DRACO compression (~70% smaller)

Each mesh has data like this:
```javascript
{
  type: "muscle",
  name: "Pectoralis Major",
  nameDetail: "Clavicular Head Of Pectoralis Major Muscle",
  wikiLink: "https://en.wikipedia.org/wiki/Pectoralis_major"
}
```

Use it for whatever - search interfaces, quizzes, measurements, VR, you name it.

## The Viewer Code

`viewer.js` is ~440 lines showing how to load the model. It's straightforward Three.js: load with DRACO, setup scene/camera/lights, raycast for clicks, animate with Tween.js.

Copy it, change it, fork it. Do whatever you want with it.

## Tech Stack

- Three.js for 3D rendering
- Tween.js for animations
- DRACO for compression
- That's it

Everything's bundled in `public/libs/` - no CDN, no build tools, no nonsense.

Works in Chrome, Firefox, Safari, Edge. Loads in 1-3 seconds.

## Use It In Your Project

Copy `body.glb` and `libs/` folder, grab whatever you need from `viewer.js`, build what you want.

## License & Attribution

Model data from [Z-Anatomy](https://www.z-anatomy.com/) (CC BY-SA 4.0).

This project is also CC BY-SA 4.0 - see [LICENSE](LICENSE).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). PRs welcome.

---

**hpfrei** | [hpfreilabs.com](https://www.hpfreilabs.com) | [@hpfrei](https://github.com/hpfrei)
