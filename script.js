// Elementos del DOM
const emoji = document.getElementById("emoji");
const texto = document.getElementById("texto");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const card = document.querySelector(".card");
const heartsContainer = document.getElementById("heartsContainer");
const confettiCanvas = document.getElementById("confetti");
const ctx = confettiCanvas.getContext("2d");

// Configurar canvas
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
});

// Contador de rechazos
let noCount = 0;

// Estados progresivos cuando dice "No"
const estados = [
    {
        imagen: "images/triste.gif",
        btnText: "¿eso que mi amoi?"
    },
    {
        imagen: "images/triste.gif",
        btnText: "¿De verdad mi vidita?"
    },
    {
        imagen: "images/triste.gif",
        btnText: "¿En serio >:c?"
    },
    {
        imagen: "images/triste.gif",
        btnText: "ok mañana"
    }
];

// Crear corazones flotantes de fondo
function createFloatingHeart() {
    const heart = document.createElement("div");
    heart.className = "floating-heart";
    heart.textContent = Math.random() > 0.5 ? "💖" : "💕";
    heart.style.left = Math.random() * 100 + "%";
    heart.style.fontSize = (Math.random() * 20 + 15) + "px";
    heart.style.animationDuration = (Math.random() * 3 + 5) + "s";
    heart.style.animationDelay = Math.random() * 2 + "s";
    
    heartsContainer.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 8000);
}

// Generar corazones constantemente
setInterval(createFloatingHeart, 800);

// Inicializar algunos corazones
for (let i = 0; i < 5; i++) {
    setTimeout(createFloatingHeart, i * 300);
}

// Clase para partículas de confeti
class ConfettiPiece {
    constructor() {
        this.x = Math.random() * confettiCanvas.width;
        this.y = -20;
        this.size = Math.random() * 8 + 5;
        this.speedY = Math.random() * 3 + 2;
        this.speedX = Math.random() * 2 - 1;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
        this.color = this.randomColor();
        this.shape = Math.random() > 0.5 ? 'circle' : 'square';
    }
    
    randomColor() {
        const colors = [
            '#ff0844',
            '#ff4d7a',
            '#ff758f',
            '#ffb3c1',
            '#ffc2d1',
            '#ff6b9d',
            '#c9184a'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        
        if (this.y > confettiCanvas.height) {
            return false;
        }
        return true;
    }
    
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = this.color;
        
        if (this.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        }
        
        ctx.restore();
    }
}

// Array de confeti
let confettiPieces = [];

// Animar confeti
function animateConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    
    confettiPieces = confettiPieces.filter(piece => {
        piece.draw();
        return piece.update();
    });
    
    if (confettiPieces.length > 0) {
        requestAnimationFrame(animateConfetti);
    }
}

// Lanzar confeti
function launchConfetti() {
    for (let i = 0; i < 150; i++) {
        setTimeout(() => {
            confettiPieces.push(new ConfettiPiece());
        }, i * 10);
    }
    animateConfetti();
}

// Animación de rebote del emoji
function bounceEmoji() {
    emoji.classList.remove("bounce");
    void emoji.offsetWidth; // Forzar reflow
    emoji.classList.add("bounce");
    setTimeout(() => emoji.classList.remove("bounce"), 600);
}

// Animación de texto emocionado
function exciteText() {
    texto.classList.add("excited");
    setTimeout(() => texto.classList.remove("excited"), 500);
}

// Evento del botón NO
noBtn.addEventListener("click", () => {
    if (noCount < estados.length) {
        // Cambiar imagen (a triste)
        emoji.src = estados[noCount].imagen;
        
        // Cambiar texto del botón NO dinámicamente
        noBtn.innerHTML = `<span class="btn-text">${estados[noCount].btnText}</span><span class="btn-icon">😢</span>`;
        
        // Animar cambios
        bounceEmoji();
        
        // Hacer el botón SÍ más grande y atractivo
        let yesScale = 1 + (noCount * 0.15);
        let yesPadding = 16 + (noCount * 4);
        let yesHPadding = 32 + (noCount * 8);
        
        yesBtn.style.transform = `scale(${yesScale})`;
        yesBtn.style.padding = `${yesPadding}px ${yesHPadding}px`;
        
        // Hacer el botón NO más pequeño
        let noScale = 1 - (noCount * 0.1);
        noBtn.style.transform = `scale(${noScale})`;
        noBtn.classList.add("shrinking");
        
        setTimeout(() => noBtn.classList.remove("shrinking"), 300);
        
        noCount++;
    } else {
        // Si sigue diciendo no, eventualmente desaparece el botón
        noBtn.style.opacity = "0";
        noBtn.style.transform = "scale(0)";
        setTimeout(() => {
            noBtn.style.display = "none";
            emoji.src = "images/feliz.gif";
            texto.textContent = "si no le das en si, me odias";
            bounceEmoji();
            card.classList.add("celebrating");
            setTimeout(() => card.classList.remove("celebrating"), 800);
        }, 300);
    }
});

// Evento del botón SÍ
yesBtn.addEventListener("click", () => {
    // Cambiar a estado de celebración
    emoji.src = "images/imagen1.jpg";
    texto.textContent = "¡Mas te vale mi amoi te amo! 💕";
    
    // Resetear el tamaño del botón Sí a su estado original
    yesBtn.style.transform = "scale(1)";
    yesBtn.style.padding = "16px 32px";
    
    // Ocultar botón NO
    noBtn.style.opacity = "0";
    noBtn.style.transform = "scale(0)";
    setTimeout(() => noBtn.style.display = "none", 300);
    
    // Animar todo
    bounceEmoji();
    exciteText();
    card.classList.add("celebrating");
    
    // Lanzar confeti
    setTimeout(() => {
        launchConfetti();
    }, 300);
    
    // Cambiar el botón SÍ
    setTimeout(() => {
        yesBtn.innerHTML = '<span class="btn-text">¡dale click amoi!</span><span class="btn-icon">💖</span>';
        yesBtn.style.background = "linear-gradient(135deg, #ff0844 0%, #ff758f 100%)";
    }, 500);
});

// Efectos de hover en los botones
yesBtn.addEventListener("mouseenter", () => {
    if (noCount === 0) {
        emoji.src = "images/imagen1.jpg";
        bounceEmoji();
    }
});

noBtn.addEventListener("mouseenter", () => {
    if (noCount === 0) {
        emoji.src = "images/imagen2.jpg";
        bounceEmoji();
    }
});

// Restaurar imagen cuando se quita el hover
document.querySelector(".buttons").addEventListener("mouseleave", () => {
    if (noCount === 0 && texto.textContent === "¿Quieres ser mi San Valentín mi amoi?") {
        emoji.src = "images/imagen1.jpg";
    }
});