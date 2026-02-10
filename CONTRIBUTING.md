# Contributing

Thanks for checking out this project! This is my first open source project, and I'm happy to have others contribute.

## What This Project Is

The core asset here is `body.glb` - a browser-optimized anatomical model. The viewer code (`viewer.js`) is a reference implementation showing how to use it. While the model is mostly complete, I may add features to the viewer, and I welcome contributions that make this more useful for everyone.

## Ways to Contribute

### Report Bugs

Found something broken? [Open an issue](https://github.com/hpfrei/body-anatomy-3d-viewer/issues) with:
- What you expected to happen
- What actually happened
- Browser and OS you're using
- Steps to reproduce (if possible)

Screenshots help a lot!

### Suggest Features

Have ideas for the viewer? Open an issue describing:
- What you want to add
- Why it would be useful
- How you think it might work (optional)

Good examples: measurement tools, annotations, keyboard shortcuts, VR support, better mobile controls.

### Improve Documentation

Spot a typo? Something unclear in the README? Documentation improvements are always welcome.

### Submit Code

If you want to add a feature or fix a bug:

1. **Fork this repo** and clone your fork
2. **Create a branch**: `git checkout -b fix-something` or `git checkout -b add-feature`
3. **Make your changes**
4. **Test it**: Run `npx serve -s public -l 3000` and verify everything works
5. **Commit**: `git commit -m "Clear description of what you did"`
6. **Push**: `git push origin your-branch-name`
7. **Open a Pull Request** on GitHub

#### Pull Request Tips

- Keep it focused - one feature or fix per PR
- Explain what you changed and why
- Reference any related issues (e.g., "Fixes #42")
- Test in multiple browsers if you can
- Follow the existing code style

## Code Style

Keep it simple and readable:

**JavaScript:**
- Use modern ES6+ syntax (const, let, arrow functions)
- 4 spaces for indentation
- Descriptive variable names
- Comments for complex logic only

**CSS/HTML:**
- Keep the existing style
- Use semantic HTML where possible
- Test on different screen sizes

## Development Setup

Super simple - no build tools or npm dependencies:

```bash
git clone https://github.com/YOUR-USERNAME/body-anatomy-3d-viewer.git
cd body-anatomy-3d-viewer
npx serve -s public -l 3000
```

Open http://localhost:3000 and you're running the viewer.

All the code is in `public/`:
- `viewer.js` - Main Three.js logic
- `index.html` - HTML structure
- `style.css` - UI styling
- `body.glb` - The 3D model
- `libs/` - Bundled Three.js libraries

## Using the Model in Your Own Project

If you build something cool with `body.glb`, I'd love to hear about it! You don't need to contribute it back, but if you make improvements to the model itself or find the viewer code useful, consider sharing your changes.

## Testing

No automated tests yet - just manual testing:
- Click around and make sure interactions work
- Test the toggle buttons
- Verify animations are smooth
- Check that reset works
- Try it in different browsers (Chrome, Firefox, Safari)

## Questions?

Open an issue! I'm learning as I go, so don't hesitate to ask.

## Code of Conduct

Be respectful and constructive. This is a community project - help make it welcoming for everyone, regardless of experience level.

## License

By contributing, you agree your contributions will be licensed under [CC-BY-SA-4.0](LICENSE), the same license as this project. This is required by the Z-Anatomy source material.

---

Thanks for contributing!
