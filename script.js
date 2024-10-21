// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// Set the background color of the scene
renderer.setClearColor(0x26292b); // Example of a light gray background

document.getElementById('canvas-container').appendChild(renderer.domElement);

// Create a 6-sided die (cube)
const geometry = new THREE.BoxGeometry(2.30, 2.30, 2.30); // Increased size
const materials = [
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('images/image 1.png') }),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('images/image 2.png') }),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('images/image 3.png') }),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('images/image 4.png') }),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('images/image 5.png') }),
    new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('images/image 6.png') })
];
const die = new THREE.Mesh(geometry, materials);
scene.add(die);

// Create dots for each face
const dotGeometry = new THREE.SphereGeometry(0.055, 16, 16); // Small spheres
const dotMaterial = new THREE.MeshBasicMaterial({
    color: 0xbfbfbf // Flat grey color
});


// Positions for the dots at the center of each face
const positions = [
    new THREE.Vector3(0, 0, 1.50),   // Front
    new THREE.Vector3(0, 0, -1.50),  // Back
    new THREE.Vector3(1.50, 0, 0),   // Right
    new THREE.Vector3(-1.50, 0, 0),  // Left
    new THREE.Vector3(0, 1.50, 0),   // Top
    new THREE.Vector3(0, -1.50, 0)   // Bottom
];

const dots = [];

// Create the dots and add them to the scene
positions.forEach((position) => {
    const dot = new THREE.Mesh(dotGeometry, dotMaterial);
    dot.position.copy(position);
    scene.add(dot);
    dots.push(dot);
});

camera.position.z = 5; // Adjusted for larger cube

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let momentum = { x: 0, y: 0 }; // Store momentum

// Function to update dot positions based on cube rotation
function updateDotPositions() {
    // Create a quaternion from the cube's rotation
    const rotationQuaternion = new THREE.Quaternion().setFromEuler(die.rotation);

    dots.forEach((dot, index) => {
        // Get the initial position for the dot
        const initialPosition = positions[index].clone();

        // Apply the rotation quaternion to the initial position
        initialPosition.applyQuaternion(rotationQuaternion);

        // Update the dot's position
        dot.position.copy(initialPosition);
    });
}

// Add rotation to the die
function animate() {
    requestAnimationFrame(animate);
    die.rotation.x += momentum.y; // Apply momentum to rotation
    die.rotation.y += momentum.x; // Apply momentum to rotation
    momentum.x *= 0.95; // Dampen momentum
    momentum.y *= 0.95; // Dampen momentum

    updateDotPositions(); // Update dot positions to match the die's rotation

    renderer.render(scene, camera);
}
animate();

// Callback function for showing popups
function showPopup(faceIndex) {
    let title, description;

    switch(faceIndex) {
        case 0:
            title = 'Data Imaginaries: Collaboration with ACMI';
            description = 'This is a detailed description of the environment design for Project 1. It includes various elements such as lighting, textures, and terrain development.';
            break;
        case 1:
            title = '3D Environment';
            description = 'This is a detailed description of the character modeling process for Project 2, including design decisions, sculpting techniques, and texturing.';
            break;
        case 2:
            title = 'Blender Animation';
            description = 'This is a detailed description of the visual effects simulation work in Project 3. It focuses on particle simulations, fire, and smoke effects.';
            break;
        case 3:
            title = 'World Building and Environments';
            description = 'This is a detailed description of the animation rigging process for Project 4, highlighting the joint structures, constraints, and IK setup.';
            break;
        case 4:
            title = '3D Modelling in Maya';
            description = 'This is a detailed description of the game asset creation workflow in Project 5. It covers the modeling, UV unwrapping, and texture painting steps.';
            break;
        case 5:
            title = 'Project 6: Architectural Visualization';
            description = 'This is a detailed description of the architectural visualization work in Project 6. It includes rendering techniques, camera settings, and material creation.';
            break;
        default:
            title = 'Project Details';
            description = 'This face does not have a specific project associated with it yet.';
            break;
    }

    // Display the popup with the individualized title and description
    const popup = document.getElementById('popup');
    popup.style.display = 'flex';
    document.getElementById('popupTitle').innerText = title;
    document.getElementById('popupDescription').innerText = description;
}

// Add raycasting for mouse interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onMouseDown(event) {
    isDragging = true;
    previousMousePosition = { x: event.clientX, y: event.clientY };
}

// Click handler for the dots
function handleClick(event) {
    if (!isDragging) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(dots);
        if (intersects.length > 0) {
            // Use the index of the dot to determine which face was clicked
            const dotIndex = dots.indexOf(intersects[0].object);
            showPopup(dotIndex); // Show popup with the corresponding face index
        }
    }
}

// Updated mouse up function
function onMouseUp(event) {
    isDragging = false;
    handleClick(event);
}

// Updated mouse click function
function onMouseClick(event) {
    handleClick(event);
}

// Updated dragging function
function onMouseDrag(event) {
    if (isDragging) {
        const deltaMove = {
            x: event.clientX - previousMousePosition.x,
            y: event.clientY - previousMousePosition.y
        };

        // Reduce the sensitivity of the rotation
        momentum.x += deltaMove.x * 0.0005; // Apply rotation based on drag
        momentum.y += deltaMove.y * 0.0005; // Apply rotation based on drag
        previousMousePosition = { x: event.clientX, y: event.clientY };
    }
}

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('mouseup', onMouseUp, false);
window.addEventListener('mousemove', onMouseDrag, false);

// Initially hide the dropdown menu on startup
document.getElementById('dropdownMenu').style.display = 'none';
// Hamburger menu toggle functions
function toggleMenu() {
    const menu = document.getElementById('dropdownMenu');
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}

// About Me toggle function
function toggleAbout() {
    const aboutContent = document.getElementById('about');
    aboutContent.style.display = aboutContent.style.display === 'block' ? 'none' : 'block';
    const contactContent = document.getElementById('contact');
    contactContent.style.display = 'none'; // Hide contact content when opening about
}

// Contact toggle function
function toggleContact() {
    const contactContent = document.getElementById('contact');
    contactContent.style.display = contactContent.style.display === 'block' ? 'none' : 'block';
    const aboutContent = document.getElementById('about');
    aboutContent.style.display = 'none'; // Hide about content when opening contact
}

// Popup close function
document.getElementById('closePopup').addEventListener('click', function () {
    document.getElementById('popup').style.display = 'none'; // Hide popup on close
});

// Close popup when clicking outside of it
window.addEventListener('click', function(event) {
    const popup = document.getElementById('popup');
    if (event.target === popup) {
        popup.style.display = 'none';
    }
});

// Existing mouse functions remain unchanged...

// Touch event functions

function onTouchStart(event) {
    if (event.touches.length === 1) {  // Only consider single-touch interactions
        isDragging = true;
        previousMousePosition = {
            x: event.touches[0].clientX, 
            y: event.touches[0].clientY
        };
    }
    event.preventDefault();  // Prevent the browser from interpreting the touch as a scroll or pinch
}

function onTouchMove(event) {
    if (isDragging && event.touches.length === 1) {
        const deltaMove = {
            x: event.touches[0].clientX - previousMousePosition.x,
            y: event.touches[0].clientY - previousMousePosition.y
        };

        // Apply rotation based on touch movement
        momentum.x += deltaMove.x * 0.0005;  // Sensitivity can be adjusted
        momentum.y += deltaMove.y * 0.0005; 

        previousMousePosition = {
            x: event.touches[0].clientX, 
            y: event.touches[0].clientY
        };
    }
    event.preventDefault();  // Prevent the default touch behavior (e.g., scrolling)
}

function onTouchEnd(event) {
    isDragging = false;
    event.preventDefault();  // Prevent default behaviors
}

// Add touch event listeners to capture touch interactions
window.addEventListener('touchstart', onTouchStart, false);
window.addEventListener('touchmove', onTouchMove, false);
window.addEventListener('touchend', onTouchEnd, false);

// Existing mouse event listeners
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('mouseup', onMouseUp, false);
window.addEventListener('mousemove', onMouseDrag, false);
