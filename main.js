// Global Variables
let scene, camera, renderer, controls;
let heroScene, heroCamera, heroRenderer;
let titanicScene, titanicCamera, titanicRenderer;
let experienceScene, experienceCamera, experienceRenderer;
let animationId;
let audioContext, audioEnabled = false;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize custom cursor
    initCustomCursor();
    
    // Initialize theme toggle
    initThemeToggle();
    
    // Initialize navigation
    initNavigation();
    
    // Initialize 3D scenes
    init3DScenes();
    
    // Initialize audio
    initAudio();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize download handlers
    initDownloadHandlers();
    
    // Start animation loop
    animate();
    
    console.log('PastPortAI initialized successfully!');
}

// Custom Cursor
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });
    
    // Smooth follow for outline
    function updateCursorOutline() {
        outlineX += (mouseX - outlineX) * 0.1;
        outlineY += (mouseY - outlineY) * 0.1;
        
        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';
        
        requestAnimationFrame(updateCursorOutline);
    }
    updateCursorOutline();
    
    // Cursor interactions
    const interactiveElements = document.querySelectorAll('button, a, .nav-link, .feature-card, .pricing-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
}

// Theme Toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.className = savedTheme;
        updateThemeIcon();
    }
    
    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.className = 'light-theme';
            localStorage.setItem('theme', 'light-theme');
        } else {
            body.className = 'dark-theme';
            localStorage.setItem('theme', 'dark-theme');
        }
        updateThemeIcon();
    });
    
    function updateThemeIcon() {
        const icon = themeToggle.querySelector('i');
        if (body.classList.contains('dark-theme')) {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
}

// Navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Mobile menu toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        }
    });
}

// 3D Scenes Initialization
function init3DScenes() {
    initHeroScene();
    initTitanicPreview();
    initExperienceCanvas();
}

function initHeroScene() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    
    // Scene setup
    heroScene = new THREE.Scene();
    heroCamera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    heroRenderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    heroRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
    heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create animated ocean background
    createOceanBackground(heroScene);
    
    // Camera position
    heroCamera.position.set(0, 5, 10);
    heroCamera.lookAt(0, 0, 0);
    
    // Handle resize
    window.addEventListener('resize', () => {
        if (heroCamera && heroRenderer) {
            heroCamera.aspect = canvas.clientWidth / canvas.clientHeight;
            heroCamera.updateProjectionMatrix();
            heroRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
        }
    });
}

function initTitanicPreview() {
    const canvas = document.getElementById('titanicCanvas');
    if (!canvas) return;
    
    // Scene setup
    titanicScene = new THREE.Scene();
    titanicCamera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    titanicRenderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    titanicRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
    titanicRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create Titanic ship model
    createTitanicModel(titanicScene);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    titanicScene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    titanicScene.add(directionalLight);
    
    // Camera position
    titanicCamera.position.set(15, 8, 15);
    titanicCamera.lookAt(0, 0, 0);
    
    // Handle resize
    window.addEventListener('resize', () => {
        if (titanicCamera && titanicRenderer) {
            titanicCamera.aspect = canvas.clientWidth / canvas.clientHeight;
            titanicCamera.updateProjectionMatrix();
            titanicRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
        }
    });
}

function initExperienceCanvas() {
    const canvas = document.getElementById('experienceCanvas');
    if (!canvas) return;
    
    // Scene setup
    experienceScene = new THREE.Scene();
    experienceCamera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    experienceRenderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    experienceRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
    experienceRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create immersive Titanic deck scene
    createTitanicDeckScene(experienceScene);
    
    // Camera position
    experienceCamera.position.set(0, 2, 5);
    experienceCamera.lookAt(0, 0, 0);
    
    // Handle resize
    window.addEventListener('resize', () => {
        if (experienceCamera && experienceRenderer) {
            experienceCamera.aspect = canvas.clientWidth / canvas.clientHeight;
            experienceCamera.updateProjectionMatrix();
            experienceRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
        }
    });
}

// 3D Scene Creation Functions
function createOceanBackground(scene) {
    // Create animated ocean waves
    const geometry = new THREE.PlaneGeometry(100, 100, 50, 50);
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color1: { value: new THREE.Color(0x001122) },
            color2: { value: new THREE.Color(0x003366) }
        },
        vertexShader: `
            uniform float time;
            varying vec2 vUv;
            varying float vElevation;
            
            void main() {
                vUv = uv;
                
                vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                float elevation = sin(modelPosition.x * 0.1 + time) * 0.5;
                elevation += sin(modelPosition.z * 0.15 + time * 0.8) * 0.3;
                
                modelPosition.y += elevation;
                vElevation = elevation;
                
                vec4 viewPosition = viewMatrix * modelPosition;
                vec4 projectedPosition = projectionMatrix * viewPosition;
                
                gl_Position = projectedPosition;
            }
        `,
        fragmentShader: `
            uniform vec3 color1;
            uniform vec3 color2;
            varying vec2 vUv;
            varying float vElevation;
            
            void main() {
                float mixStrength = (vElevation + 0.5) * 0.5;
                vec3 color = mix(color1, color2, mixStrength);
                gl_FragColor = vec4(color, 0.8);
            }
        `,
        transparent: true
    });
    
    const ocean = new THREE.Mesh(geometry, material);
    ocean.rotation.x = -Math.PI * 0.5;
    ocean.position.y = -2;
    scene.add(ocean);
    
    // Store reference for animation
    scene.userData.ocean = ocean;
}

function createTitanicModel(scene) {
    // Create simplified Titanic model
    const group = new THREE.Group();
    
    // Hull
    const hullGeometry = new THREE.BoxGeometry(20, 3, 4);
    const hullMaterial = new THREE.MeshLambertMaterial({ color: 0x2c2c2c });
    const hull = new THREE.Mesh(hullGeometry, hullMaterial);
    hull.position.y = 0;
    group.add(hull);
    
    // Superstructure
    const superGeometry = new THREE.BoxGeometry(12, 4, 3);
    const superMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const superstructure = new THREE.Mesh(superGeometry, superMaterial);
    superstructure.position.y = 3.5;
    group.add(superstructure);
    
    // Funnels
    for (let i = 0; i < 4; i++) {
        const funnelGeometry = new THREE.CylinderGeometry(0.5, 0.6, 3, 8);
        const funnelMaterial = new THREE.MeshLambertMaterial({ 
            color: i === 3 ? 0x8B4513 : 0xFFD700 
        });
        const funnel = new THREE.Mesh(funnelGeometry, funnelMaterial);
        funnel.position.set(-4 + i * 2.5, 7, 0);
        group.add(funnel);
    }
    
    // Masts
    const mastGeometry = new THREE.CylinderGeometry(0.1, 0.1, 8, 8);
    const mastMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    
    const frontMast = new THREE.Mesh(mastGeometry, mastMaterial);
    frontMast.position.set(8, 8, 0);
    group.add(frontMast);
    
    const rearMast = new THREE.Mesh(mastGeometry, mastMaterial);
    rearMast.position.set(-8, 8, 0);
    group.add(rearMast);
    
    scene.add(group);
    scene.userData.titanic = group;
}

function createTitanicDeckScene(scene) {
    // Create deck environment
    const deckGeometry = new THREE.PlaneGeometry(30, 15);
    const deckMaterial = new THREE.MeshLambertMaterial({ color: 0x8B7355 });
    const deck = new THREE.Mesh(deckGeometry, deckMaterial);
    deck.rotation.x = -Math.PI * 0.5;
    scene.add(deck);
    
    // Add railings
    for (let i = -14; i <= 14; i += 2) {
        const railingGeometry = new THREE.BoxGeometry(0.1, 1.2, 0.1);
        const railingMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 });
        
        const railing1 = new THREE.Mesh(railingGeometry, railingMaterial);
        railing1.position.set(i, 0.6, 7);
        scene.add(railing1);
        
        const railing2 = new THREE.Mesh(railingGeometry, railingMaterial);
        railing2.position.set(i, 0.6, -7);
        scene.add(railing2);
    }
    
    // Add lifeboats
    for (let i = 0; i < 4; i++) {
        const boatGeometry = new THREE.BoxGeometry(3, 0.8, 1.2);
        const boatMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const boat = new THREE.Mesh(boatGeometry, boatMaterial);
        boat.position.set(-10 + i * 7, 1, 6);
        scene.add(boat);
    }
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    const moonLight = new THREE.DirectionalLight(0x87CEEB, 0.8);
    moonLight.position.set(10, 20, 10);
    scene.add(moonLight);
    
    // Add stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 1000;
    const positions = new Float32Array(starsCount * 3);
    
    for (let i = 0; i < starsCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 200;
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}

// Audio System
function initAudio() {
    const audioToggle = document.getElementById('audioToggle');
    
    if (audioToggle) {
        audioToggle.addEventListener('click', toggleAudio);
    }
}

function toggleAudio() {
    const audioToggle = document.getElementById('audioToggle');
    const icon = audioToggle.querySelector('i');
    const text = audioToggle.querySelector('span');
    
    if (!audioEnabled) {
        // Enable audio
        audioEnabled = true;
        icon.className = 'fas fa-volume-up';
        text.textContent = 'Audio On';
        
        // Play ambient sounds
        playAmbientSounds();
    } else {
        // Disable audio
        audioEnabled = false;
        icon.className = 'fas fa-volume-mute';
        text.textContent = 'Audio Off';
        
        // Stop ambient sounds
        stopAmbientSounds();
    }
}

function playAmbientSounds() {
    // Create audio context if not exists
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Generate ocean wave sounds
    generateOceanWaves();
    
    // Generate ship creaking sounds
    generateShipCreaking();
    
    console.log('Ambient audio started');
}

function stopAmbientSounds() {
    if (audioContext) {
        audioContext.suspend();
    }
    console.log('Ambient audio stopped');
}

function generateOceanWaves() {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 2);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    
    // Add wave variation
    setInterval(() => {
        if (audioEnabled && oscillator) {
            const variation = Math.random() * 20 + 70;
            oscillator.frequency.setValueAtTime(variation, audioContext.currentTime);
        }
    }, 3000);
}

function generateShipCreaking() {
    if (!audioContext) return;
    
    // Generate periodic creaking sounds
    setInterval(() => {
        if (audioEnabled) {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(200 + Math.random() * 100, audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 0.1);
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.5);
        }
    }, 5000 + Math.random() * 10000);
}

// Scroll Animations
function initScrollAnimations() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate feature cards
    gsap.utils.toArray('.feature-card').forEach((card, index) => {
        gsap.fromTo(card, 
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                delay: index * 0.2,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });
    
    // Animate pricing cards
    gsap.utils.toArray('.pricing-card').forEach((card, index) => {
        gsap.fromTo(card,
            { scale: 0.8, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 0.6,
                delay: index * 0.1,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });
    
    // Animate coming soon items
    gsap.utils.toArray('.coming-soon-item').forEach((item, index) => {
        gsap.fromTo(item,
            { x: -30, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 0.5,
                delay: index * 0.1,
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });
    
    // Parallax effect for hero section
    gsap.to('.hero-background', {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
}

// Download Handlers
function initDownloadHandlers() {
    // PDR Download
    const pdrButtons = ['downloadPDR', 'downloadPDRMain', 'footerPDR'];
    pdrButtons.forEach(id => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', downloadPDR);
        }
    });
    
    // Presentation Download
    const presentationButton = document.getElementById('downloadPresentation');
    if (presentationButton) {
        presentationButton.addEventListener('click', downloadPresentation);
    }
    
    // Marketing Plan Download
    const marketingButton = document.getElementById('downloadMarketing');
    if (marketingButton) {
        marketingButton.addEventListener('click', downloadMarketingPlan);
    }
    
    // Start Experience Button
    const startButton = document.getElementById('startExperience');
    if (startButton) {
        startButton.addEventListener('click', startExperience);
    }
}

function downloadPDR() {
    // Create a link to download the PDR
    const link = document.createElement('a');
    link.href = 'pastportai-pdr-v2.pdf';
    link.download = 'PastPortAI-Project-Definition-Report.pdf';
    link.click();
    
    // Analytics tracking
    console.log('PDR download initiated');
}

function downloadPresentation() {
    const link = document.createElement('a');
    link.href = 'pastportai-presentation.pdf';
    link.download = 'PastPortAI-Presentation-Deck.pdf';
    link.click();
    
    console.log('Presentation download initiated');
}

function downloadMarketingPlan() {
    // For now, download the comprehensive package
    const link = document.createElement('a');
    link.href = 'pastportai-hackathon-package.zip';
    link.download = 'PastPortAI-Complete-Package.zip';
    link.click();
    
    console.log('Marketing plan download initiated');
}

function startExperience() {
    // Scroll to experiences section
    const experiencesSection = document.getElementById('experiences');
    if (experiencesSection) {
        experiencesSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Enable audio if not already enabled
    if (!audioEnabled) {
        toggleAudio();
    }
    
    console.log('Experience started');
}

// Animation Loop
function animate() {
    animationId = requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;
    
    // Animate hero ocean
    if (heroScene && heroScene.userData.ocean) {
        heroScene.userData.ocean.material.uniforms.time.value = time;
    }
    
    // Animate Titanic model
    if (titanicScene && titanicScene.userData.titanic) {
        titanicScene.userData.titanic.rotation.y = Math.sin(time * 0.5) * 0.1;
        titanicScene.userData.titanic.position.y = Math.sin(time * 0.8) * 0.2;
    }
    
    // Render scenes
    if (heroRenderer && heroScene && heroCamera) {
        heroRenderer.render(heroScene, heroCamera);
    }
    
    if (titanicRenderer && titanicScene && titanicCamera) {
        titanicRenderer.render(titanicScene, titanicCamera);
    }
    
    if (experienceRenderer && experienceScene && experienceCamera) {
        experienceRenderer.render(experienceScene, experienceCamera);
    }
}

// Utility Functions
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function getDevicePixelRatio() {
    return Math.min(window.devicePixelRatio, isMobile() ? 1.5 : 2);
}

// Error Handling
window.addEventListener('error', (e) => {
    console.error('PastPortAI Error:', e.error);
});

// Performance Monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    if (audioContext) {
        audioContext.close();
    }
});

// Export for debugging
window.PastPortAI = {
    scenes: { heroScene, titanicScene, experienceScene },
    renderers: { heroRenderer, titanicRenderer, experienceRenderer },
    audioEnabled,
    toggleAudio,
    startExperience
};