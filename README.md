# Three.js Glass Shader Scene

An interactive 3D scene featuring a glass cube with advanced refraction shaders and 3D typography using Three.js and WebGL.

![Three.js Glass Shader Scene](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![WebGL](https://img.shields.io/badge/WebGL-990000?style=for-the-badge&logo=webgl&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## Features

- **🔮 Advanced Glass Shader**: Custom GLSL vertex and fragment shaders creating realistic glass refraction effects
- **📝 3D Typography**: "cerebral" text rendered using Outfit font with Three.js TextGeometry
- **🎮 Interactive Controls**: OrbitControls for mouse-driven camera navigation (rotate, pan, zoom)
- **💡 Multi-Light Setup**: Comprehensive lighting system with ambient, directional, and point lights
- **🎨 Dual Render Targets**: Advanced render pipeline for realistic glass refraction
- **⚡ Performance Optimized**: 60fps rendering with clean, minimal codebase

## Live Demo

Run locally:
```bash
npm run dev
```
Then open `http://localhost:5173` in your browser.

## Quick Start

1. **Clone and install**:
   ```bash
   git clone <repository-url>
   cd three-glass-shader-scene
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Navigate the scene**:
   - **Left click + drag**: Rotate camera around the scene
   - **Right click + drag**: Pan the camera
   - **Mouse wheel**: Zoom in/out

## Project Structure

```
project/
├── index.html              # Main HTML structure
├── main.js                 # Core Three.js application
├── styles.css              # Full-screen canvas styling
├── package.json            # Dependencies and scripts
└── fonts/
    └── Outfit_Regular.json # Three.js typeface font file
```

## Technical Details

### Glass Shader Implementation
- **Vertex Shader**: Handles model-view-projection transformations and normal calculations
- **Fragment Shader**: Implements glass refraction, Fresnel effects, and color mixing
- **Render Targets**: Dual-pass rendering for realistic glass appearance
- **Uniforms**: Configurable IOR, shininess, diffuseness, and lighting parameters

### 3D Typography
- **Font**: Outfit Regular converted to Three.js typeface JSON format
- **Geometry**: TextGeometry with minimal depth (0.1 units) for clean appearance
- **Positioning**: Precisely centered between background plane and glass cube
- **Error Handling**: Graceful fallbacks for font loading failures

### Scene Composition
- **Glass Cube**: 6×6×6 unit BoxGeometry at scene origin
- **Background Plane**: 20×15 unit white plane for refraction reference
- **Text**: Positioned at z: -2.5 between plane and cube
- **Camera**: Positioned at (0, 0, 33.6) for optimal viewing

## Dependencies

- **[Three.js](https://threejs.org/)**: Core 3D library for WebGL rendering
- **[Vite](https://vitejs.dev/)**: Development server and build tool

## Browser Support

- Modern browsers with WebGL support
- Chrome 80+, Firefox 75+, Safari 13.1+, Edge 80+

## Development

### Local Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Structure
- **Modular Functions**: Clean separation of concerns (scene setup, geometry creation, controls)
- **Error Handling**: Comprehensive error catching for shaders and font loading
- **Performance**: Optimized render loop with requestAnimationFrame
- **Debugging**: Minimal console output with essential error reporting

## Customization

### Changing Text
```javascript
// In create3DText() function
const textGeometry = new TextGeometry('your-text-here', {
    font: font,
    size: 5,
    depth: 0.1,
    // ... other parameters
});
```

### Adjusting Glass Properties
```javascript
// In uniforms object
uniforms: {
    uIOR: { value: 1.4 },        // Index of refraction
    uShininess: { value: 25.0 },  // Surface shininess
    uDiffuseness: { value: 0.2 }, // Diffuse reflection
    // ... other uniforms
}
```

### Modifying Colors
```javascript
// Text color
const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

// Background plane color
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- **Three.js Community**: For the excellent 3D library and examples
- **Google Fonts**: For the Outfit font family
- **WebGL**: For enabling high-performance 3D graphics in browsers

---

**Built with ❤️ using Three.js and WebGL**