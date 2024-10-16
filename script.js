// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Create a 6-sided die (cube)
const geometry = new THREE.BoxGeometry(2.50, 2.50, 2.50); // Increased size
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
    let title, description;

    switch(face) {
        case 0:
            title = 'Project 1: Environment Design';
            description = 'This is a detailed description of the environment design for Project 1. It includes various elements such as lighting, textures, and terrain development.';
            break;
        case 1:
            title = '3D Environment';
            description = 'This is a detailed description of the character modeling process for Project 2, including design decisions, sculpting techniques, and texturing.';
            break;
        case 2:
            title = 'Project 3: VFX Simulation';
            description = 'This is a detailed description of the visual effects simulation work in Project 3. It focuses on particle simulations, fire, and smoke effects.';
            break;
        case 3:
            title = 'Project 4: Animation Rigging';
            description = 'This is a detailed description of the animation rigging process for Project 4, highlighting the joint structures, constraints, and IK setup.';
            break;
        case 4:
            title = 'Project 5: Game Asset Creation';
            description = 'This is a detailed description of the game asset creation workflow in Project 5. It covers the modeling, UV unwrapping, and texture painting steps.';
            break;
        case 5:
            title = 'Lego Animation';
            description = 'This is a detailed description of the architectural visualization work in Project 6. It includes rendering techniques, camera settings, and material creation.';
            break;
        default:
            title = 'Project Details';
            description = 'This face does not have a specific project associated with it yet.';
            break;
    }

    // Display the popup with the individualized title and description
    document.getElementById('popup').style.display = 'flex';
    document.getElementById('popupTitle').innerText = title;
    document.getElementById('popupDescription').innerText = description;
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

// Click handler for the die
function handleClick(event) {
    if (!isDragging) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(die);
        if (intersects.length > 0) {
            // Use the faceIndex to determine which face was clicked
            const faceIndex = intersects[0].faceIndex;
            die.callback(faceIndex + 1); // Call with face index + 1 since faces are 1-indexed in your callback
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

// Close popup when clicking outside of it
window.addEventListener('click', function(event) {
    const popup = document.getElementById('popup');
    if (event.target === popup) {
        popup.style.display = 'none';
    }
});

// Ensure the cube doesn't rotate excessively
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

console.log(`Face clicked: ${faceIndex + 1}`);
