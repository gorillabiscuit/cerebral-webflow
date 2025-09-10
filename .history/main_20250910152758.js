// Main JavaScript file for NFTfi Marketing Site - Single Scroll
// Three.js scene with glass shader and scroll/mouse interactions

import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

console.log('Three.js Glass Shader Scene initialized');



// Scene variables
let scene, camera, renderer, canvas;
let mesh, wrapper;
let isModelReady = false;
let mainRenderTarget, backRenderTarget;
let uniforms;
let mouseInfluence = { x: 0, y: 0 };
let lastMousePos = { x: 0, y: 0 };
let controls;

// Shader code
const vertexShader = `
varying vec3 worldNormal;
varying vec3 eyeVector;

void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vec4 mvPosition = viewMatrix * worldPos;

  gl_Position = projectionMatrix * mvPosition;

  worldNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;
  eyeVector = normalize(worldPos.xyz - cameraPosition);
}
`;

const fragmentShader = `
uniform float uIorR;
uniform float uIorY;
uniform float uIorG;
uniform float uIorC;
uniform float uIorB;
uniform float uIorP;

uniform float uSaturation;
uniform float uChromaticAberration;
uniform float uRefractPower;
uniform float uFresnelPower;
uniform float uShininess;
uniform float uDiffuseness;
uniform vec3 uLight;

uniform vec2 winResolution;
uniform sampler2D uTexture;

varying vec3 worldNormal;
varying vec3 eyeVector;

vec3 sat(vec3 rgb, float adjustment) {
  const vec3 W = vec3(0.2125, 0.7154, 0.0721);
  vec3 intensity = vec3(dot(rgb, W));
  return mix(intensity, rgb, adjustment);
}

float fresnel(vec3 eyeVector, vec3 worldNormal, float power) {
  float fresnelFactor = abs(dot(eyeVector, worldNormal));
  float inversefresnelFactor = 1.0 - fresnelFactor;
  
  return pow(inversefresnelFactor, power);
}

float specular(vec3 light, float shininess, float diffuseness) {
  vec3 normal = worldNormal;
  vec3 lightVector = normalize(-light);
  vec3 halfVector = normalize(eyeVector + lightVector);

  float NdotL = dot(normal, lightVector);
  float NdotH =  dot(normal, halfVector);
  float kDiffuse = max(0.0, NdotL);
  float NdotH2 = NdotH * NdotH;

  float kSpecular = pow(NdotH2, shininess);
  return  kSpecular + kDiffuse * diffuseness;
}

const int LOOP = 16;

void main() {
  float iorRatioRed = 1.0/uIorR;
  float iorRatioGreen = 1.0/uIorG;
  float iorRatioBlue = 1.0/uIorB;

  vec2 uv = gl_FragCoord.xy / winResolution.xy;
  vec3 normal = worldNormal;
  vec3 color = vec3(0.0);

  for ( int i = 0; i < LOOP; i ++ ) {
    float slide = float(i) / float(LOOP) * 0.1;

    vec3 refractVecR = refract(eyeVector, normal,(1.0/uIorR));
    vec3 refractVecY = refract(eyeVector, normal, (1.0/uIorY));
    vec3 refractVecG = refract(eyeVector, normal, (1.0/uIorG));
    vec3 refractVecC = refract(eyeVector, normal, (1.0/uIorC));
    vec3 refractVecB = refract(eyeVector, normal, (1.0/uIorB));
    vec3 refractVecP = refract(eyeVector, normal, (1.0/uIorP));

    float r = texture2D(uTexture, uv + refractVecR.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).x * 0.5;

    float y = (texture2D(uTexture, uv + refractVecY.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).x * 2.0 +
                texture2D(uTexture, uv + refractVecY.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).y * 2.0 -
                texture2D(uTexture, uv + refractVecY.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).z) / 6.0;

    float g = texture2D(uTexture, uv + refractVecG.xy * (uRefractPower + slide * 2.0) * uChromaticAberration).y * 0.5;

    float c = (texture2D(uTexture, uv + refractVecC.xy * (uRefractPower + slide * 2.5) * uChromaticAberration).y * 2.0 +
                texture2D(uTexture, uv + refractVecC.xy * (uRefractPower + slide * 2.5) * uChromaticAberration).z * 2.0 -
                texture2D(uTexture, uv + refractVecC.xy * (uRefractPower + slide * 2.5) * uChromaticAberration).x) / 6.0;
          
    float b = texture2D(uTexture, uv + refractVecB.xy * (uRefractPower + slide * 3.0) * uChromaticAberration).z * 0.5;

    float p = (texture2D(uTexture, uv + refractVecP.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).z * 2.0 +
                texture2D(uTexture, uv + refractVecP.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).x * 2.0 -
                texture2D(uTexture, uv + refractVecP.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).y) / 6.0;

    float R = r + (2.0*p + 2.0*y - c)/3.0;
    float G = g + (2.0*y + 2.0*c - p)/3.0;
    float B = b + (2.0*c + 2.0*p - y)/3.0;

    color.r += R;
    color.g += G;
    color.b += B;

    color = sat(color, uSaturation);
  }

  // Divide by the number of layers to normalize colors (rgb values can be worth up to the value of LOOP)
  color /= float( LOOP );

  // Specular
  float specularLight = specular(uLight, uShininess, uDiffuseness);
  color += specularLight;

  // Fresnel
  float f = fresnel(eyeVector, normal, uFresnelPower);
  color.rgb += f * vec3(1.0);

  gl_FragColor = vec4(color, 1.0);
}
`;

// Initialize Three.js scene
function init() {
    console.log('Initializing Three.js scene...');
    
    // Get canvas
    canvas = document.getElementById('three-canvas');
    
    // Create scene
    scene = new THREE.Scene();
    scene.background = null; // Transparent background
    
    // Create camera with full screen aspect ratio
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 33.6);
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        alpha: true,
        antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    
    // Create render targets with full window resolution like GitHub version
    mainRenderTarget = new THREE.WebGLRenderTarget(
        window.innerWidth * Math.min(window.devicePixelRatio, 2),
        window.innerHeight * Math.min(window.devicePixelRatio, 2)
    );
    backRenderTarget = new THREE.WebGLRenderTarget(
        window.innerWidth * Math.min(window.devicePixelRatio, 2),
        window.innerHeight * Math.min(window.devicePixelRatio, 2)
    );
    
    // Initialize uniforms
    uniforms = {
        uIorR: { value: 1.15 },
        uIorY: { value: 1.16 },
        uIorG: { value: 1.18 },
        uIorC: { value: 1.22 },
        uIorB: { value: 1.22 },
        uIorP: { value: 1.22 },
        uSaturation: { value: 1.01 },
        uChromaticAberration: { value: 0.14 },
        uRefractPower: { value: 0.35 },
        uFresnelPower: { value: 9.0 },
        uShininess: { value: 25.0 },
        uDiffuseness: { value: 0.2 },
        uLight: { value: new THREE.Vector3(-1.0, 1.0, 1.0) },
        winResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight).multiplyScalar(Math.min(window.devicePixelRatio, 2)) },
        uTexture: { value: null }
    };
    
    console.log('Uniforms initialized:', uniforms);
    
    // Add comprehensive lighting setup
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    // Main directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    // Secondary directional light for fill
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-5, 3, 5);
    scene.add(fillLight);
    
    // Rim light for edge highlighting
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
    rimLight.position.set(0, -5, 5);
    scene.add(rimLight);
    
    // Point light for dynamic highlights
    const pointLight = new THREE.PointLight(0xffffff, 0.8, 100);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);
    
    // Create background geometry for refraction
    createBackgroundGeometry();
    
    // Create 3D text
    create3DText();
    
    // Create glass cube
    createGlassCube();
    
    // Add OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.enableRotate = true;
    
    // Add event listeners
    addEventListeners();
}

// Create background geometry for refraction effects
function createBackgroundGeometry() {
    // Create simple white plane for refraction background
    const planeGeometry = new THREE.PlaneGeometry(20, 15); // Simple rectangular plane
    const planeMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, // Pure white
        side: THREE.DoubleSide
    });
    
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(-5.1, 0, -5.0); // Keep same position
    scene.add(plane);
}

// Create 3D text
function create3DText() {
    console.log('Creating 3D text...');
    
    const fontLoader = new FontLoader();
    
    // Load a font (using Three.js built-in helvetiker font)
    fontLoader.load(
        'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
        (font) => {
            // Create text geometry
            const textGeometry = new TextGeometry('cerebral', {
                font: font,
                size: 5, // Text size
                depth: 5.1, // Text depth/extrusion
                curveSegments: 12,
                bevelEnabled: false,
                // bevelThickness: 0.03,
                // bevelSize: 0.02,
                // bevelOffset: 0,
                // bevelSegments: 5
            });
            
            // Center the text geometry
            textGeometry.computeBoundingBox();
            const bbox = textGeometry.boundingBox;
            
            // Log detailed bounding box information
            console.log('=== TEXT GEOMETRY DEBUG ===');
            console.log('Bounding Box:', bbox);
            console.log('Width (X):', bbox.max.x - bbox.min.x);
            console.log('Height (Y):', bbox.max.y - bbox.min.y);
            console.log('Depth (Z):', bbox.max.z - bbox.min.z);
            console.log('Min XYZ:', bbox.min);
            console.log('Max XYZ:', bbox.max);
            
            const centerOffsetX = -0.5 * (bbox.max.x - bbox.min.x);
            const centerOffsetY = -0.5 * (bbox.max.y - bbox.min.y);
            // IGNORE the Z offset - the geometry has incorrect depth despite height: 0
            const centerOffsetZ = 0; // Force Z-centering to 0
            
            console.log('Center Offsets - X:', centerOffsetX, 'Y:', centerOffsetY, 'Z (FORCED):', centerOffsetZ);
            
            // Create RED material for text (easy to see)
            const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            
            // Create text mesh
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            
            // Position text between plane (-5.0 z) and cube (0 z) 
            // Use centerOffsetZ to counteract the geometry's incorrect depth
            textMesh.position.set(centerOffsetX, centerOffsetY, -2.5 + centerOffsetZ);
            
            console.log('Final text position:', textMesh.position);
            console.log('Text mesh scale:', textMesh.scale);
            
            // Add to scene
            scene.add(textMesh);
            
            console.log('3D text "cerebral" added to scene');
        },
        (progress) => {
            console.log('Font loading progress:', (progress.loaded / progress.total * 100) + '%');
        },
        (error) => {
            console.error('Error loading font:', error);
        }
    );
}

// Create glass cube
function createGlassCube() {
    console.log('Creating glass cube...');
    
    // Create cube geometry
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    
    // Create glass shader material
    const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: uniforms,
        side: THREE.DoubleSide
    });
    
    // Check for shader compilation errors
    if (material.program && material.program.error) {
        console.error('Shader compilation error:', material.program.error);
    } else {
        console.log('Glass shader compiled successfully');
    }
    
    // Create mesh
    mesh = new THREE.Mesh(geometry, material);
    
    // Create wrapper group
    wrapper = new THREE.Group();
    wrapper.add(mesh);
    
    // Scale the wrapper
    wrapper.scale.set(3, 3, 3);
    
    // Add to scene
    scene.add(wrapper);
    
    isModelReady = true;
    console.log('Glass cube ready for animation');
    
    // Debug: Log all objects in scene
    console.log('All objects in scene:');
    scene.traverse((object) => {
        console.log('-', object.type, object.name || 'unnamed', 'visible:', object.visible);
    });
}


// Add event listeners
function addEventListeners() {
    // Mouse move handler
    window.addEventListener('mousemove', (e) => {
        // Initialize lastMousePos if it hasn't been set yet
        if (lastMousePos.x === 0 && lastMousePos.y === 0) {
            lastMousePos.x = e.clientX;
            lastMousePos.y = e.clientY;
            return;
        }
        
        const deltaX = e.clientX - lastMousePos.x;
        const deltaY = e.clientY - lastMousePos.y;
        
        // Add mouse movement to influence (normalized to screen size)
        mouseInfluence.x += deltaX / window.innerWidth * 2.0;
        mouseInfluence.y += deltaY / window.innerHeight * 2.0;
        
        lastMousePos.x = e.clientX;
        lastMousePos.y = e.clientY;
    });
    
    // Window resize handler
    window.addEventListener('resize', onWindowResize);
}

// Window resize handler
function onWindowResize() {
    // Update camera aspect ratio to match window
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    // Update renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Update render targets
    mainRenderTarget.setSize(
        window.innerWidth * Math.min(window.devicePixelRatio, 2),
        window.innerHeight * Math.min(window.devicePixelRatio, 2)
    );
    backRenderTarget.setSize(
        window.innerWidth * Math.min(window.devicePixelRatio, 2),
        window.innerHeight * Math.min(window.devicePixelRatio, 2)
    );
    
    // Update uniforms
    uniforms.winResolution.value.set(window.innerWidth, window.innerHeight).multiplyScalar(Math.min(window.devicePixelRatio, 2));
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update controls
    if (controls) {
        controls.update();
    }
    
    if (wrapper && isModelReady) {
        const time = Date.now() * 0.001; // Convert to seconds
        
        // Decay mouse influence over time
        mouseInfluence.x *= 0.98;
        mouseInfluence.y *= 0.98;
        
        // X-axis: varying rate with sine wave modulation + mouse Y influence
        const xRate = 0.2 + Math.sin(time * 0.1) * 0.15;
        wrapper.rotation.x += xRate * 0.02 + mouseInfluence.y * 0.05;
        
        // Y-axis: varying rate with cosine wave modulation + mouse X influence
        const yRate = 0.3 + Math.cos(time * 0.08) * 0.2;
        wrapper.rotation.y += yRate * 0.02 + mouseInfluence.x * 0.05;
        
        // Z-axis: varying rate with sine wave modulation at different frequency
        const zRate = 0.15 + Math.sin(time * 0.12) * 0.1;
        wrapper.rotation.z += zRate * 0.02;
    }
    
    // Glass refraction rendering
    if (mesh) {
        mesh.visible = false;
        
        // Back side render
        renderer.setRenderTarget(backRenderTarget);
        renderer.render(scene, camera);
        
        mesh.material.uniforms.uTexture.value = backRenderTarget.texture;
        mesh.material.side = THREE.BackSide;
        
        mesh.visible = true;
        
        // Front side render
        renderer.setRenderTarget(mainRenderTarget);
        renderer.render(scene, camera);
        
        mesh.material.uniforms.uTexture.value = mainRenderTarget.texture;
        mesh.material.side = THREE.FrontSide;
        
        renderer.setRenderTarget(null);
    }
    
    renderer.render(scene, camera);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, ready to initialize Three.js scene');
    init();
    animate();
});
