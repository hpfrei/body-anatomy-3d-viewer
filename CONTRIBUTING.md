# Contributing to Body Anatomy 3D Viewer

Thank you for your interest in contributing to Body Anatomy 3D Viewer! We welcome contributions from the community.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue on GitHub with the following information:

- **Clear Title**: Brief description of the issue
- **Description**: Detailed explanation of the bug
- **Steps to Reproduce**: Step-by-step instructions to reproduce the issue
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Environment**:
  - Browser and version
  - Operating System
  - Node.js version (if applicable)
- **Screenshots**: If applicable, add screenshots to help explain the problem

### Suggesting Features

We welcome feature suggestions! Please create an issue with:

- **Clear Title**: Brief description of the feature
- **Description**: Detailed explanation of the proposed feature
- **Use Case**: Why this feature would be useful
- **Possible Implementation**: If you have ideas on how to implement it

### Submitting Pull Requests

1. **Fork the Repository**: Click the "Fork" button on GitHub

2. **Clone Your Fork**:
   ```bash
   git clone https://github.com/YOUR-USERNAME/body-anatomy-3d-viewer.git
   cd body-anatomy-3d-viewer
   ```

3. **Create a Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

4. **Make Your Changes**: Implement your feature or bug fix

5. **Test Your Changes**: Ensure everything works as expected
   ```bash
   npm start
   # Test in your browser at http://localhost:3000
   ```

6. **Commit Your Changes**:
   ```bash
   git add .
   git commit -m "Add feature: description of your changes"
   ```

7. **Push to Your Fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create a Pull Request**: Go to the original repository on GitHub and click "New Pull Request"

### Pull Request Guidelines

- **One Feature Per PR**: Keep pull requests focused on a single feature or bug fix
- **Clear Description**: Explain what your PR does and why
- **Reference Issues**: If your PR fixes an issue, mention it (e.g., "Fixes #123")
- **Test Your Code**: Ensure your changes work correctly
- **Keep It Simple**: Follow the existing code style and patterns

## Code Style Guidelines

### JavaScript

- **ES6+ Syntax**: Use modern JavaScript features (const, let, arrow functions, etc.)
- **Consistent Indentation**: Use 4 spaces for indentation
- **Meaningful Names**: Use descriptive variable and function names
- **Comments**: Add comments for complex logic, but prefer self-documenting code
- **No Unused Code**: Remove commented-out code and unused variables

Example:
```javascript
// Good
const selectedMesh = intersects[0].object;
mesh.material.transparent = true;

// Avoid
var m = intersects[0].object; // mesh
m.material.transparent = true; //make transparent
```

### CSS

- **Consistent Naming**: Use kebab-case for class names
- **Logical Grouping**: Group related properties together
- **Comments**: Add comments for non-obvious styling decisions

### HTML

- **Semantic Elements**: Use appropriate HTML5 semantic elements
- **Accessibility**: Include ARIA labels where appropriate
- **Consistent Indentation**: Use 4 spaces for indentation

## Development Setup

1. **Install Node.js**: Ensure you have Node.js 14.0.0 or higher installed

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Development Server**:
   ```bash
   npm start
   ```

4. **Access the App**: Open http://localhost:3000 in your browser

## Project Architecture

### Key Files

- **server.js**: Express.js server for static file serving (minimal, ~15 lines)
- **public/viewer.js**: Main Three.js application logic
- **public/index.html**: HTML structure and UI elements
- **public/style.css**: Styling for UI components
- **public/models/body.glb**: 3D anatomical model

### Three.js Architecture

- **Scene Setup**: Camera, lights, and renderer configuration
- **Model Loading**: GLTFLoader with DRACO compression support
- **Interaction**: Raycaster for click detection on 3D objects
- **Animation**: Tween.js for smooth opacity transitions
- **Controls**: OrbitControls for camera navigation

## Testing

Currently, the project uses manual testing. When making changes:

1. **Visual Testing**: Test all visual changes across different browsers
2. **Interaction Testing**: Verify click interactions work correctly
3. **Animation Testing**: Ensure animations are smooth and complete properly
4. **Reset Testing**: Confirm reset button restores all objects correctly
5. **Responsive Testing**: Check that UI works on different screen sizes

## Questions or Need Help?

- **Open an Issue**: For questions about contributing
- **Check Existing Issues**: Someone might have asked the same question
- **Be Patient**: Maintainers will respond as soon as possible

## Code of Conduct

- **Be Respectful**: Treat everyone with respect and kindness
- **Be Constructive**: Provide helpful, constructive feedback
- **Be Patient**: Remember that maintainers and contributors are often volunteers
- **Be Inclusive**: Welcome people of all backgrounds and experience levels

## License

By contributing to Body Anatomy 3D Viewer, you agree that your contributions will be licensed under the BSD 3-Clause License.

---

Thank you for contributing to Body Anatomy 3D Viewer!
