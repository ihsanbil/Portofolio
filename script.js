/* ====================================================== */
/* NAVBAR LOGIC */
/* ====================================================== */
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.querySelector('.navbar');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});


/* ====================================================== */
/* PRELOADER LOGIC */
/* ====================================================== */
const preloader = document.getElementById('preloader');
window.addEventListener('load', () => {
    preloader.classList.add('hidden');
});


/* ====================================================== */
/* UPGRADE: Deteksi Perangkat Mobile */
/* ====================================================== */
const isMobile = window.innerWidth <= 768;


/* ====================================================== */
/* Latar Belakang Partikel Interaktif (Dengan Optimasi) */
/* ====================================================== */
const canvas = document.getElementById('interactive-background');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

let mouse = {
    x: null,
    y: null,
    radius: (canvas.height/120) * (canvas.width/120)
}

window.addEventListener('mousemove', 
    function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    }
);

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = 'rgba(0, 170, 255, 0.3)';
        ctx.fill();
    }
    update() {
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }
        if (!isMobile) { // Interaksi mouse hanya aktif di desktop
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            if (distance < mouse.radius + this.size){
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 3;
                if (mouse.x > this.x && this.x > this.size * 10) this.x -= 3;
                if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 3;
                if (mouse.y > this.y && this.y > this.size * 10) this.y -= 3;
            }
        }
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function init() {
    particlesArray = [];
    // OPTIMASI: Kurangi jumlah partikel di mobile
    let numberOfParticles = isMobile ? 40 : (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 3) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;
        let color = 'rgba(0, 170, 255, 0.3)';
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0,0,innerWidth, innerHeight);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
}
init();
animateParticles();

window.addEventListener('resize',
    function(){
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = ((canvas.height/120) * (canvas.height/120));
        init();
    }
);

/* ====================================================== */
/* BAGIAN 1: HERO - ANIMASI 3D INTERAKTIF (Dengan Optimasi) */
/* ====================================================== */
const heroCanvasContainer = document.getElementById('hero-canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile }); // OPTIMASI: Nonaktifkan antialias di mobile
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
heroCanvasContainer.appendChild(renderer.domElement);

// OPTIMASI: Kurangi kompleksitas geometri di mobile
const geometry = isMobile 
    ? new THREE.TorusKnotGeometry(1.5, 0.4, 64, 8) 
    : new THREE.TorusKnotGeometry(1.5, 0.4, 100, 16);

const material = new THREE.MeshStandardMaterial({
    color: 0x00aaff,
    metalness: 0.7,
    roughness: 0.4,
});
const shape = new THREE.Mesh(geometry, material);
scene.add(shape);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 0.8);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

let heroMouseX = 0;
let heroMouseY = 0;
if (!isMobile) { // Interaksi mouse hanya aktif di desktop
    document.addEventListener('mousemove', (event) => {
        heroMouseX = (event.clientX / window.innerWidth) * 2 - 1;
        heroMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });
}

const clock = new THREE.Clock(); 

function animateHero() {
    requestAnimationFrame(animateHero);
    const elapsedTime = clock.getElapsedTime();
    shape.rotation.y = .5 * elapsedTime;
    shape.rotation.x = .5 * elapsedTime;
    
    if (!isMobile) { // Interaksi mouse hanya aktif di desktop
        shape.position.x += (heroMouseX * 1.5 - shape.position.x) * .05;
        shape.position.y += (heroMouseY * 1.5 - shape.position.y) * .05;
    }
    
    renderer.render(scene, camera);
}
animateHero();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/* ====================================================== */
/* Animasi Scroll Universal dengan GSAP */
/* ====================================================== */
gsap.registerPlugin(ScrollTrigger);

gsap.from(".animate-hero", {
    duration: 1,
    y: 50,
    opacity: 0,
    stagger: 0.2,
    delay: 0.5,
    ease: "power3.out"
});

const animatedElements = document.querySelectorAll(".section-title, .timeline-item, .award-item, .project-card, .about-me-text, .contact-links");

animatedElements.forEach(el => {
    gsap.from(el, {
        scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power2.out"
    });
});

/* ====================================================== */
/* BAGIAN 3: PROJECTS - Fungsionalitas Modal */
/* ====================================================== */
const projectCards = document.querySelectorAll('.project-card');
const modal = document.getElementById('project-modal');
const closeButton = document.querySelector('.close-button');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalTech = document.getElementById('modal-tech');
const modalLink = document.getElementById('modal-link'); 

function openModal(card) {
    const title = card.dataset.title;
    const desc = card.dataset.desc;
    const tech = card.dataset.tech;
    const link = card.dataset.link; 
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modalTech.innerHTML = tech.split(', ').map(t => `<span>${t}</span>`).join('');
    if (link && link !== '#') {
        modalLink.href = link;
        modalLink.style.display = 'inline-flex';
    } else {
        modalLink.style.display = 'none';
    }
    modal.style.display = 'flex';
}

projectCards.forEach(card => {
    card.addEventListener('click', () => openModal(card));
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            openModal(card);
        }
    });
});

function closeModal() {
    modal.style.display = 'none';
}
closeButton.addEventListener('click', closeModal);
closeButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        closeModal();
    }
});
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
        closeModal();
    }
});

/* ====================================================== */
/* BAGIAN 4: LAB KEAHLIAN - PARTIKEL INTERAKTIF (Dengan Optimasi) */
/* ====================================================== */
const skillsContainer = document.getElementById('skills-canvas-container');

if (skillsContainer) {
    const skills = [
        'HTML', 'CSS', 'JavaScript', 'Firebase', 'API Gemini', 'Three.js', 'GSAP',
        'Python', 'SQL', 'Git', 'GitHub', 'Figma', 'Web Development', 'Problem Solving'
    ];
    const scene_skills = new THREE.Scene();
    const camera_skills = new THREE.PerspectiveCamera(75, skillsContainer.offsetWidth / skillsContainer.offsetHeight, 0.1, 1000);
    camera_skills.position.z = 25;
    const renderer_skills = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true }); // OPTIMASI: Nonaktifkan antialias di mobile
    renderer_skills.setSize(skillsContainer.offsetWidth, skillsContainer.offsetHeight);
    renderer_skills.setPixelRatio(window.devicePixelRatio);
    skillsContainer.appendChild(renderer_skills.domElement);

    const skillSprites = skills.map(skillText => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 128;
        context.fillStyle = 'rgba(0, 170, 255, 0.8)';
        context.font = 'bold 40px Inter, sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(skillText, canvas.width / 2, canvas.height / 2);
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);
        sprite.position.set(
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 30
        );
        sprite.scale.set(4, 2, 1);
        scene_skills.add(sprite);
        return sprite;
    });
    
    let skillsMouseX = 0, skillsMouseY = 0;
    if (!isMobile) { // Interaksi mouse hanya aktif di desktop
        document.addEventListener('mousemove', (event) => {
            skillsMouseX = (event.clientX / window.innerWidth) * 2 - 1;
            skillsMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });
    }

    function animateSkills() {
        requestAnimationFrame(animateSkills);
        // OPTIMASI: Kurangi intensitas gerakan kamera di mobile
        if (!isMobile) {
            camera_skills.position.x += (skillsMouseX * 5 - camera_skills.position.x) * 0.05;
            camera_skills.position.y += (skillsMouseY * 5 - camera_skills.position.y) * 0.05;
        }
        camera_skills.lookAt(scene_skills.position);
        renderer_skills.render(scene_skills, camera_skills);
    }
    animateSkills();
    
    window.addEventListener('resize', () => {
        camera_skills.aspect = skillsContainer.offsetWidth / skillsContainer.offsetHeight;
        camera_skills.updateProjectionMatrix();
        renderer_skills.setSize(skillsContainer.offsetWidth, skillsContainer.offsetHeight);
    });
}