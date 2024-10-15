// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Create a 6-sided die (cube)
const geometry = new THREE.BoxGeometry(1.75, 1.75, 1.75); // Increased size
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

camera.position.z = 5; // Adjusted for larger cube

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let momentum = { x: 0, y: 0 }; // Store momentum

// Add rotation to the die
function animate() {
    requestAnimationFrame(animate);
    die.rotation.x += momentum.y; // Apply momentum to rotation
    die.rotation.y += momentum.x; // Apply momentum to rotation
    momentum.x *= 0.95; // Dampen momentum
    momentum.y *= 0.95; // Dampen momentum
    renderer.render(scene, camera);
}
animate();

// Handle die click
die.callback = function(face) {
    document.getElementById('popup').style.display = 'flex';
    document.getElementById('popupTitle').innerText = 'Work Title ' + face;
    document.getElementById('popupDescription').innerText = 'Description of work ' + face;
};

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

function onMouseUp(event) {
    isDragging = false;
    // Only click if the mouse is up and not dragging
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(die);
    if (intersects.length > 0) {
        const faceIndex = intersects[0].faceIndex; // Get face index
        die.callback(faceIndex);
    }
}

function onMouseClick(event) {
    if (!isDragging) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(die);
        if (intersects.length > 0) {
            const faceIndex = intersects[0].faceIndex; // Get face index
            die.callback(faceIndex);
        }
    }
}

function onMouseDrag(event) {
    if (isDragging) {
        const deltaMove = {
            x: event.clientX - previousMousePosition.x,
            y: event.clientY - previousMousePosition.y
        };

        // Reduce the sensitivity of the rotation
        momentum.x += deltaMove.x * 0.002; // Apply rotation based on drag
        momentum.y += deltaMove.y * 0.002; // Apply rotation based on drag
        previousMousePosition = { x: event.clientX, y: event.clientY };
    }
}

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('mouseup', onMouseUp, false);
window.addEventListener('mousemove', onMouseDrag, false);

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
document.getElementById('closePopup').onclick = function() {
    document.getElementById('popup').style.display = 'none';
};

// Ensure the cube doesn't rotate excessively
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);


// Function to handle touch start
function onTouchStart(event) {
    event.preventDefault(); // Prevent default behavior
    isDragging = true;
    previousMousePosition = { x: event.touches[0].clientX, y: event.touches[0].clientY };
}

// Function to handle touch move
function onTouchMove(event) {
    event.preventDefault(); // Prevent default behavior
    if (isDragging) {
        const deltaMove = {
            x: event.touches[0].clientX - previousMousePosition.x,
            y: event.touches[0].clientY - previousMousePosition.y
        };
        // Reduce sensitivity of the rotation
        momentum.x += deltaMove.x * 0.002; 
        momentum.y += deltaMove.y * 0.002; 
        previousMousePosition = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }
}

// Function to handle touch end
function onTouchEnd(event) {
    isDragging = false;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(die);
    if (intersects.length > 0) {
        const faceIndex = intersects[0].faceIndex; // Get face index
        die.callback(faceIndex);
    }
}

// Existing mouse event listeners
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('mouseup', onMouseUp, false);
window.addEventListener('mousemove', onMouseDrag, false);

// Touch event listeners for mobile
window.addEventListener('touchstart', onTouchStart, false);
window.addEventListener('touchmove', onTouchMove, false);
window.addEventListener('touchend', onTouchEnd, false);

// Popup close function
document.getElementById('closePopup').onclick = function() {
    document.getElementById('popup').style.display = 'none';
};

// Add touch support for closing the popup
document.getElementById('closePopup').ontouchstart = function() {
    document.getElementById('popup').style.display = 'none';
};

