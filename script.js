// ===== SNOW ANIMATION (optimized) =====
const canvas = document.getElementById('snowCanvas');
const ctx = canvas.getContext('2d');
let snowflakes = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Snowflake {
    constructor() {
        this.reset();
        this.y = Math.random() * (canvas.height || 800);
    }

    reset() {
        this.x = Math.random() * (canvas.width || 1200);
        this.y = -10;
        this.radius = Math.random() * 2 + 0.5;
        this.speed = Math.random() * 0.5 + 0.1;
        this.wind = Math.random() * 0.15 - 0.075;
        this.opacity = Math.random() * 0.5 + 0.15;
    }

    update() {
        this.y += this.speed;
        this.x += this.wind;
        if (this.y > canvas.height + 10) this.reset();
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
        ctx.fill();
    }
}

function initSnow() {
    resizeCanvas();
    snowflakes = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 80);
    for (let i = 0; i < count; i++) {
        snowflakes.push(new Snowflake());
    }
}

function animateSnow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const f of snowflakes) {
        f.update();
        f.draw();
    }
    requestAnimationFrame(animateSnow);
}

window.addEventListener('resize', () => { resizeCanvas(); initSnow(); });
initSnow();
animateSnow();

// ===== CUSTOM CURSOR =====
const cursorDot = document.getElementById('cursorDot');
document.addEventListener('mousemove', (e) => {
    cursorDot.style.left = e.clientX - 3 + 'px';
    cursorDot.style.top = e.clientY - 3 + 'px';
});

// ===== CLICK TO ENTER =====
const splash = document.getElementById('splash');
const main = document.getElementById('main');
const bgMusic = document.getElementById('bgMusic');
let entered = false;

splash.addEventListener('click', () => {
    if (entered) return;
    entered = true;
    splash.classList.add('hidden');
    main.classList.add('visible');
    bgMusic.currentTime = 0;
    bgMusic.play().catch(e => console.log('Audio:', e));
});

// ===== CHRISTMAS GARLAND (SVG + baubles) =====
function createChristmasLights() {
    const old = document.querySelector('.christmas-lights');
    if (old) old.remove();

    const container = document.createElement('div');
    container.className = 'christmas-lights';

    const w = window.innerWidth;
    const h = window.innerHeight;
    const inset = 8;
    const arcWidth = 120;
    const sagDepth = 14;
    const colors = ['red', 'gold', 'blue', 'green', 'silver'];

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'garland-svg');
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none';

    let idx = 0;
    const positions = [];

    function drawGarland(edge) {
        let d = '';
        const pts = [];

        if (edge === 'top') {
            const y = inset + 6;
            for (let x = inset; x <= w - inset; x += arcWidth) {
                const xe = Math.min(x + arcWidth, w - inset);
                const mx = (x + xe) / 2;
                d += `M${x} ${y}Q${mx} ${y + sagDepth} ${xe} ${y}`;
                pts.push({ x: mx, y: y + sagDepth });
            }
        } else if (edge === 'bottom') {
            const y = h - inset - 6;
            for (let x = inset; x <= w - inset; x += arcWidth) {
                const xe = Math.min(x + arcWidth, w - inset);
                const mx = (x + xe) / 2;
                d += `M${x} ${y}Q${mx} ${y - sagDepth} ${xe} ${y}`;
                pts.push({ x: mx, y: y - sagDepth });
            }
        } else if (edge === 'left') {
            const x = inset + 6;
            for (let y = inset; y <= h - inset; y += arcWidth) {
                const ye = Math.min(y + arcWidth, h - inset);
                const my = (y + ye) / 2;
                d += `M${x} ${y}Q${x + sagDepth} ${my} ${x} ${ye}`;
                pts.push({ x: x + sagDepth, y: my });
            }
        } else {
            const x = w - inset - 6;
            for (let y = inset; y <= h - inset; y += arcWidth) {
                const ye = Math.min(y + arcWidth, h - inset);
                const my = (y + ye) / 2;
                d += `M${x} ${y}Q${x - sagDepth} ${my} ${x} ${ye}`;
                pts.push({ x: x - sagDepth, y: my });
            }
        }

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', '#1a6b1a');
        path.setAttribute('stroke-width', '7');
        path.setAttribute('stroke-linecap', 'round');
        svg.appendChild(path);

        const hl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        hl.setAttribute('d', d);
        hl.setAttribute('fill', 'none');
        hl.setAttribute('stroke', 'rgba(80,180,80,0.25)');
        hl.setAttribute('stroke-width', '3');
        hl.setAttribute('stroke-linecap', 'round');
        svg.appendChild(hl);

        for (const p of pts) positions.push(p);
    }

    drawGarland('top');
    drawGarland('bottom');
    drawGarland('left');
    drawGarland('right');

    container.appendChild(svg);
    document.querySelector('.main').appendChild(container);

    // Add baubles (limit total count)
    const maxBaubles = Math.min(positions.length * 2, 60);
    for (let i = 0; i < maxBaubles; i++) {
        const p = positions[i % positions.length];
        const b = document.createElement('div');
        const color = colors[i % colors.length];
        const swayClass = i % 4 === 0 ? 'pixel-sway' : 'sway';
        b.className = `bauble ${color} ${swayClass}`;
        b.style.left = (p.x - 7 + (i >= positions.length ? (Math.random() * 16 - 8) : 0)) + 'px';
        b.style.top = (p.y - 7 + (i >= positions.length ? (Math.random() * 6 - 3) : 0)) + 'px';
        const delay1 = (Math.random() * 3).toFixed(1);
        const delay2 = (Math.random() * 2).toFixed(1);
        b.style.animationDelay = `${delay1}s, ${delay2}s`;
        b.style.animationDuration = `${2.5 + Math.random() * 2}s, ${1.5 + Math.random() * 1.5}s`;
        container.appendChild(b);
    }
}

createChristmasLights();
window.addEventListener('resize', createChristmasLights);

// ===== GLITCH TEXT (staggered) =====
const glitchEl = document.getElementById('glitchText');
const originalText = 'Delay';
const glitchChars = ['#', '%', '*', '@', '?', '&', '$', '~'];

function startGlitch() {
    for (let i = 0; i < originalText.length; i++) {
        setInterval(() => {
            const chars = originalText.split('');
            chars[i] = glitchChars[Math.floor(Math.random() * glitchChars.length)];
            glitchEl.textContent = chars.join('');
            glitchEl.classList.add('glitching');
            setTimeout(() => {
                glitchEl.textContent = originalText;
                glitchEl.classList.remove('glitching');
            }, 60 + Math.random() * 60);
        }, 1500 + Math.random() * 3000);
    }
}
startGlitch();

// ===== VIEW COUNTER =====
const viewCountEl = document.getElementById('viewCount');
setInterval(() => {
    viewCountEl.textContent = Math.floor(Math.random() * 9000) + 1000;
}, 150);
