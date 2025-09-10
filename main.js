// Main JavaScript file for NFTfi Marketing Site - Single Scroll
// Three.js scene with glass shader and scroll/mouse interactions

import * as THREE from 'three';
import { GLTFLoader } from './libs/GLTFLoader.js';

console.log('NFTfi Marketing Site - Single Scroll initialized');

// Navigation functionality
function initializeNavigation() {
    console.log('🔧 Initializing navigation...');
    
    const dropdowns = document.querySelectorAll('.dropdown-container');
    console.log('📋 Found dropdowns:', dropdowns.length);
    
    dropdowns.forEach((dropdown, index) => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        console.log(`📦 Dropdown ${index + 1}:`, {
            trigger: trigger ? 'Found' : 'Missing',
            menu: menu ? 'Found' : 'Missing',
            triggerText: trigger ? trigger.textContent.trim() : 'N/A',
            triggerVisible: trigger ? trigger.offsetParent !== null : false,
            menuVisible: menu ? menu.offsetParent !== null : false,
            menuDisplay: menu ? getComputedStyle(menu).display : 'N/A',
            menuVisibility: menu ? getComputedStyle(menu).visibility : 'N/A'
        });
        
        if (!trigger || !menu) {
            console.error('❌ Missing trigger or menu element');
            return;
        }
        
        // Toggle dropdown on click
        trigger.addEventListener('click', (e) => {
            console.log('🖱️ Dropdown clicked:', trigger.textContent.trim());
            e.preventDefault();
            e.stopPropagation();
            
            const isOpen = menu.classList.contains('open');
            console.log('📊 Current state:', isOpen ? 'Open' : 'Closed');
            
            // Close all other dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(otherMenu => {
                if (otherMenu !== menu) {
                    otherMenu.classList.remove('open');
                    const otherTrigger = otherMenu.parentElement.querySelector('.dropdown-trigger');
                    if (otherTrigger) {
                        otherTrigger.classList.remove('open');
                    }
                }
            });
            
            // Toggle current dropdown
            if (isOpen) {
                console.log('🔽 Closing dropdown');
                menu.classList.remove('open');
                trigger.classList.remove('open');
                console.log('📊 Classes after close:', {
                    menuClasses: menu.className,
                    triggerClasses: trigger.className,
                    menuVisible: menu.style.visibility,
                    menuOpacity: menu.style.opacity
                });
            } else {
                console.log('🔼 Opening dropdown');
                menu.classList.add('open');
                trigger.classList.add('open');
                updateDropdownPosition(trigger, menu);
                console.log('📊 Classes after open:', {
                    menuClasses: menu.className,
                    triggerClasses: trigger.className,
                    menuVisible: menu.style.visibility,
                    menuOpacity: menu.style.opacity
                });
            }
        });
        
        console.log('✅ Event listener attached to dropdown', index + 1);
    });
    
    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown-container')) {
            const openMenus = document.querySelectorAll('.dropdown-menu.open');
            if (openMenus.length > 0) {
                console.log('🔄 Closing dropdowns (outside click)');
                openMenus.forEach(menu => {
                    menu.classList.remove('open');
                    const trigger = menu.parentElement.querySelector('.dropdown-trigger');
                    if (trigger) {
                        trigger.classList.remove('open');
                    }
                });
            }
        }
    });
    
    // Close dropdowns on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openMenus = document.querySelectorAll('.dropdown-menu.open');
            if (openMenus.length > 0) {
                console.log('🔽 Closing dropdowns (escape key)');
                openMenus.forEach(menu => {
                    menu.classList.remove('open');
                    const trigger = menu.parentElement.querySelector('.dropdown-trigger');
                    if (trigger) {
                        trigger.classList.remove('open');
                    }
                });
            }
        }
    });
    
    // Update dropdown positions on window resize
    window.addEventListener('resize', () => {
        document.querySelectorAll('.dropdown-menu.open').forEach(menu => {
            const trigger = menu.parentElement.querySelector('.dropdown-trigger');
            if (trigger) {
                updateDropdownPosition(trigger, menu);
            }
        });
    });
    
    console.log('✅ Navigation initialization complete');
}

// Update dropdown position (improved positioning)
function updateDropdownPosition(trigger, menu) {
    console.log('📍 Updating dropdown position');
    
    // Get the trigger's position relative to its parent
    const triggerRect = trigger.getBoundingClientRect();
    const parentRect = trigger.parentElement.getBoundingClientRect();
    
    // Position the dropdown below the trigger
    menu.style.left = '0';
    menu.style.top = '100%';
    
    console.log('📍 Position set:', {
        left: menu.style.left,
        top: menu.style.top,
        triggerWidth: triggerRect.width,
        menuWidth: menu.offsetWidth
    });
}

// Initialize controls
function initializeControls() {
    // Accordion functionality
    initializeAccordion();
    
    // Light controls
    document.getElementById('lightX').addEventListener('input', updateLight);
    document.getElementById('lightY').addEventListener('input', updateLight);
    document.getElementById('lightZ').addEventListener('input', updateLight);
    
    // Material controls
    document.getElementById('diffuseness').addEventListener('input', updateMaterial);
    document.getElementById('shininess').addEventListener('input', updateMaterial);
    document.getElementById('fresnelPower').addEventListener('input', updateMaterial);
    
    // IOR controls
    document.getElementById('iorR').addEventListener('input', updateIOR);
    document.getElementById('iorY').addEventListener('input', updateIOR);
    document.getElementById('iorG').addEventListener('input', updateIOR);
    document.getElementById('iorC').addEventListener('input', updateIOR);
    document.getElementById('iorB').addEventListener('input', updateIOR);
    document.getElementById('iorP').addEventListener('input', updateIOR);
    
    // Effect controls
    document.getElementById('saturation').addEventListener('input', updateEffects);
    document.getElementById('chromaticAberration').addEventListener('input', updateEffects);
    document.getElementById('refraction').addEventListener('input', updateEffects);
    
    // Plane controls
    document.getElementById('planeX').addEventListener('input', updatePlane);
    document.getElementById('planeY').addEventListener('input', updatePlane);
    document.getElementById('planeZ').addEventListener('input', updatePlane);
    document.getElementById('planeScale').addEventListener('input', updatePlane);
    
    // Camera controls
    document.getElementById('cameraX').addEventListener('input', updateCamera);
    document.getElementById('cameraY').addEventListener('input', updateCamera);
    document.getElementById('cameraZ').addEventListener('input', updateCamera);
    document.getElementById('cameraFOV').addEventListener('input', updateCamera);
    
    // Sync UI with actual camera position
    if (camera) {
        // Set slider values to match camera position
        document.getElementById('cameraX').value = camera.position.x;
        document.getElementById('cameraY').value = camera.position.y;
        document.getElementById('cameraZ').value = camera.position.z;
        document.getElementById('cameraFOV').value = camera.fov; // Direct FOV value
        
        // Update display values
        updateCamera();
    }
}

// Initialize accordion functionality
function initializeAccordion() {
    const headers = document.querySelectorAll('.accordion-header');
    
    headers.forEach(header => {
        header.addEventListener('click', toggleAccordionSection);
    });
}

// Toggle accordion section
function toggleAccordionSection(event) {
    const header = event.currentTarget;
    const content = header.nextElementSibling;
    const isExpanded = header.classList.contains('expanded');
    
    if (isExpanded) {
        // Collapse
        header.classList.remove('expanded');
        content.classList.remove('expanded');
    } else {
        // Expand
        header.classList.add('expanded');
        content.classList.add('expanded');
    }
}

function updateLight() {
    const x = parseFloat(document.getElementById('lightX').value);
    const y = parseFloat(document.getElementById('lightY').value);
    const z = parseFloat(document.getElementById('lightZ').value);
    
    document.getElementById('lightXValue').textContent = x.toFixed(1);
    document.getElementById('lightYValue').textContent = y.toFixed(1);
    document.getElementById('lightZValue').textContent = z.toFixed(1);
    
    if (uniforms && uniforms.uLight) {
        uniforms.uLight.value.set(x, y, z);
    }
}

function updateMaterial() {
    const diffuseness = parseFloat(document.getElementById('diffuseness').value);
    const shininess = parseFloat(document.getElementById('shininess').value);
    const fresnelPower = parseFloat(document.getElementById('fresnelPower').value);
    
    document.getElementById('diffusenessValue').textContent = diffuseness.toFixed(2);
    document.getElementById('shininessValue').textContent = shininess.toFixed(1);
    document.getElementById('fresnelPowerValue').textContent = fresnelPower.toFixed(1);
    
    if (uniforms) {
        if (uniforms.uDiffuseness) uniforms.uDiffuseness.value = diffuseness;
        if (uniforms.uShininess) uniforms.uShininess.value = shininess;
        if (uniforms.uFresnelPower) uniforms.uFresnelPower.value = fresnelPower;
    }
}

function updateIOR() {
    const iorR = parseFloat(document.getElementById('iorR').value);
    const iorY = parseFloat(document.getElementById('iorY').value);
    const iorG = parseFloat(document.getElementById('iorG').value);
    const iorC = parseFloat(document.getElementById('iorC').value);
    const iorB = parseFloat(document.getElementById('iorB').value);
    const iorP = parseFloat(document.getElementById('iorP').value);
    
    document.getElementById('iorRValue').textContent = iorR.toFixed(3);
    document.getElementById('iorYValue').textContent = iorY.toFixed(3);
    document.getElementById('iorGValue').textContent = iorG.toFixed(3);
    document.getElementById('iorCValue').textContent = iorC.toFixed(3);
    document.getElementById('iorBValue').textContent = iorB.toFixed(3);
    document.getElementById('iorPValue').textContent = iorP.toFixed(3);
    
    if (uniforms) {
        if (uniforms.uIorR) uniforms.uIorR.value = iorR;
        if (uniforms.uIorY) uniforms.uIorY.value = iorY;
        if (uniforms.uIorG) uniforms.uIorG.value = iorG;
        if (uniforms.uIorC) uniforms.uIorC.value = iorC;
        if (uniforms.uIorB) uniforms.uIorB.value = iorB;
        if (uniforms.uIorP) uniforms.uIorP.value = iorP;
    }
}

function updateEffects() {
    const saturation = parseFloat(document.getElementById('saturation').value);
    const chromaticAberration = parseFloat(document.getElementById('chromaticAberration').value);
    const refraction = parseFloat(document.getElementById('refraction').value);
    
    document.getElementById('saturationValue').textContent = saturation.toFixed(2);
    document.getElementById('chromaticAberrationValue').textContent = chromaticAberration.toFixed(2);
    document.getElementById('refractionValue').textContent = refraction.toFixed(2);
    
    if (uniforms) {
        if (uniforms.uSaturation) uniforms.uSaturation.value = saturation;
        if (uniforms.uChromaticAberration) uniforms.uChromaticAberration.value = chromaticAberration;
        if (uniforms.uRefractPower) uniforms.uRefractPower.value = refraction;
    }
}

function updatePlane() {
    const x = parseFloat(document.getElementById('planeX').value);
    const y = parseFloat(document.getElementById('planeY').value);
    const z = parseFloat(document.getElementById('planeZ').value);
    const scale = parseFloat(document.getElementById('planeScale').value);
    
    document.getElementById('planeXValue').textContent = x.toFixed(1);
    document.getElementById('planeYValue').textContent = y.toFixed(1);
    document.getElementById('planeZValue').textContent = z.toFixed(1);
    document.getElementById('planeScaleValue').textContent = scale.toFixed(1);
    
    // Update plane position and scale
    if (scene) {
        scene.traverse((object) => {
            if (object.isMesh && object.material && object.material.map) {
                // This is our plane with texture
                object.position.set(x, y, z);
                object.scale.setScalar(scale);
                
                // Update plane geometry dimensions
                const width = 20 * scale;
                const height = width * (591 / 1325);
                object.geometry.dispose();
                object.geometry = new THREE.PlaneGeometry(width, height);
            }
        });
    }
}

function updateCamera() {
    const x = parseFloat(document.getElementById('cameraX').value);
    const y = parseFloat(document.getElementById('cameraY').value);
    const z = parseFloat(document.getElementById('cameraZ').value);
    const fovSlider = parseFloat(document.getElementById('cameraFOV').value);
    
    document.getElementById('cameraXValue').textContent = x.toFixed(1);
    document.getElementById('cameraYValue').textContent = y.toFixed(1);
    document.getElementById('cameraZValue').textContent = z.toFixed(1);
    document.getElementById('cameraFOVValue').textContent = fovSlider.toFixed(0);
    
    // Update camera position and FOV
    if (camera) {
        // Update position
        camera.position.set(x, y, z);
        
        // FOV logic: slider value directly sets the FOV
        camera.fov = fovSlider;
        
        // Force projection matrix update
        camera.updateProjectionMatrix();
        
        console.log('Camera updated:', {
            position: camera.position,
            fov: camera.fov,
            sliderValue: fovSlider,
            aspect: camera.aspect
        });
    }
}

// Initialize controls when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for Three.js to initialize
    setTimeout(initializeControls, 1000);
});

// Scene variables
let scene, camera, renderer, canvas;
let mesh, wrapper;
let isModelReady = false;
let mainRenderTarget, backRenderTarget;
let uniforms;
let mouseInfluence = { x: 0, y: 0 };
let lastMousePos = { x: 0, y: 0 };

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
    
    // Calculate square size like GitHub version
    const size = Math.min(window.innerWidth, window.innerHeight, 800);
    
    // Create scene
    scene = new THREE.Scene();
    // Set transparent background instead of black
    scene.background = null;
    
    // Create camera
    camera = new THREE.PerspectiveCamera(18, size / size, 0.1, 1000); // FOV 18, square aspect
    camera.position.set(0, 0, 33.6); // Match UI defaults
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        alpha: true, // Enable transparency
        antialias: true 
    });
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0); // Transparent clear color
    
    // Set square aspect ratio like GitHub version
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Set clear color to transparent
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
    
    // Load GLTF model
    loadModel();
    
    // Add event listeners
    addEventListeners();
}

// Create background geometry for refraction effects
function createBackgroundGeometry() {
    const backgroundGroup = new THREE.Group();
    backgroundGroup.visible = true; // Make visible to see all objects
    
    // Background group is now empty - removed the four white icosahedrons
    scene.add(backgroundGroup);
    
    // Add plane with PNG material - separate from background group so it's visible
    const textureLoader = new THREE.TextureLoader();
    const headerTexture = textureLoader.load('/images/header.png');
    
    // Create plane geometry - exact GitHub dimensions
    const planeScale = 1; // GitHub default
    const width = 20 * planeScale; // 20 units
    const height = width * (591 / 1325); // 8.92 units based on 1325:591 ratio
    const planeGeometry = new THREE.PlaneGeometry(width, height);
    const planeMaterial = new THREE.MeshBasicMaterial({ 
        map: headerTexture,
        transparent: true,
        opacity: 0.8, // GitHub opacity
        side: THREE.DoubleSide
    });
    
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(-5.1, 0, -5.0); // Match UI defaults
    scene.add(plane); // Add directly to scene, not to background group
}

// Load GLTF model
function loadModel() {
    console.log('Loading NFTfi logo model...');
    
    const loader = new GLTFLoader();
    
    loader.load('/models/nftfi_logo.glb', (gltf) => {
        console.log('Model loaded:', gltf);
        
        // Calculate bounding box
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = new THREE.Vector3();
        const size = new THREE.Vector3();
        box.getCenter(center);
        box.getSize(size);
        
        // Apply material to all meshes
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                mesh = child;
                
                // Apply smoothing
                if (child.geometry) {
                    child.geometry.computeVertexNormals();
                }
                
                // Create glass shader material
                child.material = new THREE.ShaderMaterial({
                    vertexShader: vertexShader,
                    fragmentShader: fragmentShader,
                    uniforms: uniforms,
                    side: THREE.DoubleSide
                });
                
                // Check for shader compilation errors
                if (child.material.program && child.material.program.error) {
                    console.error('Shader compilation error:', child.material.program.error);
                } else {
                    console.log('Shader compiled successfully');
                }
            }
        });
        
        // Create wrapper group
        wrapper = new THREE.Group();
        
        // Center the original mesh
        gltf.scene.position.set(-center.x, -center.y, -center.z);
        
        // Add centered mesh to wrapper
        wrapper.add(gltf.scene);
        
        // Scale the wrapper
        wrapper.scale.set(3, 3, 3);
        
        // Add to scene
        scene.add(wrapper);
        
        isModelReady = true;
        console.log('NFTfi logo ready for animation');
        
        // Debug: Log all objects in scene
        console.log('All objects in scene:');
        scene.traverse((object) => {
            console.log('-', object.type, object.name || 'unnamed', 'visible:', object.visible);
        });
        
    }, (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
    }, (error) => {
        console.error('Error loading model:', error);
        // Fallback to icosahedron if model fails to load
        createFallbackGeometry();
    });
}

// Fallback geometry if model loading fails
function createFallbackGeometry() {
    console.log('Creating fallback geometry...');
    
    const geometry = new THREE.IcosahedronGeometry(2, 4);
    const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: uniforms,
        side: THREE.DoubleSide
    });
    
    // Check for shader compilation errors
    if (material.program && material.program.error) {
        console.error('Fallback shader compilation error:', material.program.error);
    } else {
        console.log('Fallback shader compiled successfully');
    }
    
    mesh = new THREE.Mesh(geometry, material);
    wrapper = new THREE.Group();
    wrapper.add(mesh);
    wrapper.scale.set(3, 3, 3);
    scene.add(wrapper);
    
    isModelReady = true;
    console.log('Fallback geometry ready for animation');
    
    // Debug: Log all objects in scene
    console.log('All objects in scene (fallback):');
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
    const size = Math.min(window.innerWidth, window.innerHeight, 800);
    
    camera.aspect = size / size; // Square aspect ratio
    camera.updateProjectionMatrix();
    renderer.setSize(size, size);
    
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
        console.log('Rendering glass refraction...');
        
        mesh.visible = false;
        
        // Back side render
        renderer.setRenderTarget(backRenderTarget);
        renderer.render(scene, camera);
        
        mesh.material.uniforms.uTexture.value = backRenderTarget.texture;
        mesh.material.side = THREE.BackSide;
        console.log('Back render target texture:', backRenderTarget.texture);
        
        mesh.visible = true;
        
        // Front side render
        renderer.setRenderTarget(mainRenderTarget);
        renderer.render(scene, camera);
        
        mesh.material.uniforms.uTexture.value = mainRenderTarget.texture;
        mesh.material.side = THREE.FrontSide;
        console.log('Main render target texture:', mainRenderTarget.texture);
        
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

// Initialize navigation immediately when script loads
console.log('🚀 Script loaded, initializing navigation...');

// Check if DOM is ready, if not wait for it
if (document.readyState === 'loading') {
    console.log('⏳ DOM still loading, waiting...');
    document.addEventListener('DOMContentLoaded', () => {
        console.log('📄 DOM ready, initializing navigation...');
        initializeNavigation();
    });
} else {
    console.log('✅ DOM already ready, initializing navigation...');
    initializeNavigation();
} 