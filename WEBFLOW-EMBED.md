# Three.js Glass Shader - Webflow Embed Guide

This project has been transformed into a Webflow-compatible interactive 3D scene featuring advanced glass shaders and scroll-driven animations.

## 🚀 Quick Embed

### Option 1: Complete HTML File
Use `webflow-embed.html` as a complete standalone page:
- Copy the entire file content
- Paste into a Webflow HTML embed element
- Set embed to full page width/height

### Option 2: Webflow Custom Code
Add to Webflow site's custom code sections:

#### In `<head>` tag:
```html
<!-- ES Module Shims for CDN compatibility -->
<script async src="https://unpkg.com/es-module-shims@1.3.6/dist/es-module-shims.js"></script>

<!-- Import Map for Three.js CDN -->
<script type="importmap">
{
    "imports": {
        "three": "https://unpkg.com/three@0.178.0/build/three.module.js",
        "three/examples/jsm/loaders/FontLoader.js": "https://unpkg.com/three@0.178.0/examples/jsm/loaders/FontLoader.js",
        "three/examples/jsm/geometries/TextGeometry.js": "https://unpkg.com/three@0.178.0/examples/jsm/geometries/TextGeometry.js"
    }
}
</script>

<!-- GSAP Animation Library -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js"></script>
```

#### In page body:
```html
<canvas id="webgl"></canvas>
```

#### Before `</body>` tag:
Copy the entire `<script type="module">` section from `webflow-embed.html`

## 🎨 Features

### Interactive Elements
- **Scroll-driven camera movement**: Camera moves vertically as user scrolls
- **Mouse-responsive glass cube**: Rotates smoothly based on mouse position
- **Hover effects**: Text changes color when hovering over section titles
- **GSAP animations**: Professional smooth transitions

### Visual Effects
- **Advanced glass shaders**: Custom GLSL vertex/fragment shaders
- **Realistic refraction**: Multi-pass rendering with dual render targets
- **3D typography**: "cerebral" text with Outfit font (fallback to Helvetiker)
- **Professional lighting**: Multi-light setup for optimal glass appearance

## 🛠️ Technical Specifications

### Dependencies (All CDN-based)
- **Three.js v0.178.0**: Core 3D library
- **GSAP v3.11.4**: Animation library
- **ES Module Shims v1.3.6**: Browser compatibility

### Performance Optimizations
- **Pixel ratio capping**: `Math.min(window.devicePixelRatio, 2)`
- **GSAP overwrite protection**: Prevents animation conflicts
- **Efficient render targets**: Proper cleanup and reuse
- **Responsive design**: Mobile-optimized with breakpoints

### Browser Support
- **Modern browsers**: Chrome 80+, Firefox 75+, Safari 13.1+, Edge 80+
- **WebGL required**: Automatic fallback handling
- **Mobile responsive**: Touch-friendly interactions

## 📱 Responsive Behavior

### Desktop (>768px)
- Full glassmorphism effects
- Smooth mouse tracking
- Large typography (3rem headings)

### Mobile (≤768px)
- Reduced padding and margins
- Smaller typography (2rem headings)
- Touch-optimized interactions
- Maintained performance

## 🎯 Webflow Integration Tips

### CSS Classes
The embed includes these key CSS classes:
- `.content`: Glassmorphism cards
- `section`: Full-height sections
- `h1`: Gradient text headers

### Customization Options
1. **Colors**: Modify gradient values in CSS
2. **Content**: Change section text and headings
3. **Glass properties**: Adjust shader uniforms
4. **Animation speed**: Modify GSAP duration values

### Performance Considerations
- **Canvas size**: Automatically scales to viewport
- **Render quality**: Optimized for 60fps on modern devices
- **Memory usage**: Efficient texture management
- **Mobile performance**: Reduced complexity on smaller screens

## 🔧 Troubleshooting

### Common Issues
1. **Black screen**: Check browser WebGL support
2. **No interactions**: Verify GSAP loaded correctly
3. **Font loading**: Fallback to Helvetiker if Outfit fails
4. **Performance**: Reduce pixel ratio on older devices

### Debug Mode
Add to console for debugging:
```javascript
// Check WebGL support
console.log(renderer.capabilities);

// Monitor performance
console.log(renderer.info);
```

## 📦 File Structure

```
webflow-embed.html          # Complete standalone embed
WEBFLOW-EMBED.md            # This documentation
index.html                  # Development version
main.js                     # Development JavaScript
styles.css                  # Development styles
```

## ✅ Production Ready

This embed is fully optimized for production use:
- ✅ CDN-based dependencies (no build process needed)
- ✅ Cross-browser compatibility
- ✅ Mobile responsive design
- ✅ Performance optimized
- ✅ Error handling included
- ✅ Professional animations
- ✅ Webflow-compatible structure

## 🎬 Live Demo

The embed creates a sophisticated 3D experience with:
- Scrollable content sections with glassmorphism design
- Fixed Three.js canvas background with glass cube
- Smooth scroll-to-camera animations
- Mouse-driven cube rotations
- Interactive hover effects
- Professional GSAP transitions

Perfect for portfolios, product showcases, or any site requiring premium 3D interactions!
