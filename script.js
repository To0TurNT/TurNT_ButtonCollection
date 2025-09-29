const CONFIG = {
    glitch: {
        chars: '!@#$%^&*()_+-=[]{}|;:,.<>?',
        probability: 0.1,
        duration: 200
    },
    matrix: {
        chars: '01▓▒░█▄▀■▌▪▫',
        scrambleInterval: 50,
        scrambleCount: 10
    },
    quantum: {
        chars: '◊◈◇◆♦▲▼◀▶⬢⬡⬟⬠⬢⬡◯◮◭◬⟁⟑⟒⟓',
        particleCount: 20,
        explosionDuration: 3000,
        textScrambleCycles: 15,
        textScrambleInterval: 100,
        textScrambleProbability: 0.7,
        cooldownDuration: 800
    },
    animations: {
        rippleDuration: 600,
        clickFeedbackDuration: 150,
        cyberpunk: {
            duration: 600,
            brightnessMultiplier: 1.5,
            saturationMultiplier: 1.5
        },
        holographic: {
            duration: 800,
            scale: 1.1,
            rotateY: 15,
            rotateX: 10
        },
        liquidMetal: {
            duration: 700,
            rippleBlur: 20
        },
        plasma: {
            duration: 1000,
            shadowBlur: 60,
            shadowColor1: '#ff006e',
            shadowColor2: '#3a86ff'
        },
        crystalline: {
            duration: 900,
            brightnessPhase1: 2,
            saturationPhase1: 0,
            brightnessPhase2: 2,
            saturationPhase2: 2,
            phaseTransition: 450
        }
    },
    particles: {
        minSize: 4,
        maxSize: 12,
        animationDuration: {
            min: 1,
            max: 3
        },
        movement: {
            min: 150,
            max: 500
        }
    },
    colors: {
        quantum: {
            primary: 'rgba(138, 43, 226, 0.8)',
            secondary: 'rgba(0, 255, 255, 0.6)',
            tertiary: 'rgba(255, 0, 128, 0.4)'
        }
    }
};


const Utils = {
    randomBetween: (min, max) => Math.random() * (max - min) + min,
    randomChoice: (array) => array[Math.floor(Math.random() * array.length)],
    randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    scrambleText: (originalText, chars, probability = 1) => {
        let scrambled = '';
        for (let i = 0; i < originalText.length; i++) {
            if (Math.random() < probability) {
                scrambled += Utils.randomChoice(chars);
            } else {
                scrambled += originalText[i];
            }
        }
        return scrambled;
    },
    cleanup: (parent, selectors) => {
        selectors.forEach(selector => {
            parent.querySelectorAll(selector).forEach(el => el.remove());
        });
    },
    applyTempStyles: (element, styles, duration) => {
        const originalStyles = {};
        Object.keys(styles).forEach(prop => {
            originalStyles[prop] = element.style[prop];
            element.style[prop] = styles[prop];
        });
        setTimeout(() => {
            Object.keys(originalStyles).forEach(prop => {
                element.style[prop] = originalStyles[prop];
            });
        }, duration);
    }
};

document.querySelectorAll('.glass-button').forEach(button => {
    button.addEventListener('mouseenter', function() {
        if (this.classList.contains('glitch-matrix')) {
            const textElement = this.querySelector('.text');
            const originalText = textElement.textContent;
            const glitchedText = Utils.scrambleText(
                originalText, 
                CONFIG.glitch.chars, 
                CONFIG.glitch.probability
            );  
            textElement.textContent = glitchedText;
            setTimeout(() => {
                textElement.textContent = originalText;
            }, CONFIG.glitch.duration);
        }
    });
    
    button.addEventListener('click', function() {
        const buttonType = this.classList[1];
        const clickHandlers = {
            'cyberpunk': () => cyberpunkClick(this),
            'holographic': () => holographicClick(this),
            'liquid-metal': () => liquidMetalClick(this),
            'glitch-matrix': () => glitchMatrixClick(this),
            'plasma-orbs': () => plasmaOrbsClick(this),
            'crystalline': () => crystallineClick(this),
            'quantum-nexus': () => quantumNexusClick(this)
        };
        const handler = clickHandlers[buttonType];
        if (handler) {
            handler();
        }
    });
});

document.querySelectorAll('.enhanced-glass-button').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.filter = 'brightness(1.1) saturate(1.2)';
    });
    button.addEventListener('mouseleave', function() {
        this.style.filter = '';
    });
    button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        this.style.setProperty('--click-x', `${x}%`);
        this.style.setProperty('--click-y', `${y}%`);
        this.style.setProperty('--crack-x', `${x}%`);
        this.style.setProperty('--crack-y', `${y}%`);
        this.style.setProperty('--fragment-x', `${x}%`);
        this.style.setProperty('--fragment-y', `${y}%`);
        const cracks = this.querySelector('.glass-cracks');
        const fragments = this.querySelector('.glass-fragments');
        const impact = this.querySelector('.impact-point');
        if (cracks) {
            cracks.style.animation = 'none';
            cracks.offsetHeight;
            cracks.style.animation = '';
        }
        if (fragments) {
            fragments.style.animation = 'none';
            fragments.offsetHeight;
            fragments.style.animation = '';
        }
        
        if (impact) {
            impact.style.animation = 'none';
            impact.offsetHeight;
            impact.style.animation = '';
        }
    });
});

function createRipple(event, button) {
    Utils.cleanup(button, ['.ripple']);
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    Object.assign(ripple.style, {
        width: `${size}px`,
        height: `${size}px`,
        left: `${x}px`,
        top: `${y}px`
    });
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), CONFIG.animations.rippleDuration);
    Utils.applyTempStyles(button, {
        transform: 'translateY(-1px) scale(0.98)'
    }, CONFIG.animations.clickFeedbackDuration);
}

function cyberpunkClick(button) {
    const config = CONFIG.animations.cyberpunk;
    Utils.applyTempStyles(button, {
        animation: `cyberpunk-pulse ${config.duration}ms ease-out`,
        filter: `brightness(${config.brightnessMultiplier}) saturate(${config.saturationMultiplier})`
    }, config.duration);
}

function holographicClick(button) {
    const config = CONFIG.animations.holographic;
    Utils.applyTempStyles(button, {
        animation: `holographic-burst ${config.duration}ms ease-out`,
        transform: `scale(${config.scale}) rotateY(${config.rotateY}deg) rotateX(${config.rotateX}deg)`
    }, config.duration);
}

function liquidMetalClick(button) {
    const config = CONFIG.animations.liquidMetal;
    button.style.animation = `liquid-ripple ${config.duration}ms ease-out`;
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        inset: -${config.rippleBlur}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
        animation: ripple-expand ${config.duration}ms ease-out;
        pointer-events: none;
        z-index: 10;
    `;
    button.appendChild(ripple);
    setTimeout(() => {
        button.style.animation = '';
        ripple.remove();
    }, config.duration);
}

function glitchMatrixClick(button) {
    const text = button.querySelector('.text');
    const originalText = text.textContent;
    const config = CONFIG.matrix;
    button.style.animation = 'glitch-breach 1s ease-out';
    let scrambleCount = 0;
    const scrambleInterval = setInterval(() => {
        const scrambled = Utils.scrambleText(originalText, config.chars);
        text.textContent = scrambled;
        scrambleCount++;
        if (scrambleCount > config.scrambleCount) {
            clearInterval(scrambleInterval);
            text.textContent = originalText;
            button.style.animation = '';
        }
    }, config.scrambleInterval);
}

function plasmaOrbsClick(button) {
    const config = CONFIG.animations.plasma;
    Utils.applyTempStyles(button, {
        animation: `plasma-explosion ${config.duration}ms ease-out`,
        boxShadow: `0 0 ${config.shadowBlur}px ${config.shadowColor1}, 0 0 ${config.shadowBlur + 20}px ${config.shadowColor2}`
    }, config.duration);
}

function crystallineClick(button) {
    const config = CONFIG.animations.crystalline;
    button.style.animation = `crystalline-shatter ${config.duration}ms ease-in-out`;
    button.style.filter = `brightness(${config.brightnessPhase1}) saturate(${config.saturationPhase1})`;
    setTimeout(() => {
        button.style.filter = `brightness(${config.brightnessPhase2}) saturate(${config.saturationPhase2})`;
    }, config.phaseTransition);
    setTimeout(() => {
        button.style.animation = '';
        button.style.filter = '';
    }, config.duration);
}

function quantumNexusClick(button) {
    const config = CONFIG.quantum;
    if (button.classList.contains('quantum-exploding') || button.classList.contains('quantum-cooling')) {
        return;
    }    
    button.classList.add('quantum-exploding');
    for (let i = 0; i < config.particleCount; i++) {
        createQuantumParticle(button, i);
    }
    createDimensionalRift(button);
    quantumTextScramble(button);
    setTimeout(() => {
        button.classList.remove('quantum-exploding');
        button.classList.add('quantum-cooling');
        Utils.cleanup(button, ['.temp-particle', '.dimensional-rift']);
        setTimeout(() => {
            button.classList.remove('quantum-cooling');
        }, config.cooldownDuration);
        
    }, config.explosionDuration);
}

function createQuantumParticle(button, index) {
    const particle = document.createElement('div');
    particle.className = 'temp-particle';
    const config = CONFIG.particles;
    const size = Utils.randomBetween(config.minSize, config.maxSize);
    const duration = Utils.randomBetween(config.animationDuration.min, config.animationDuration.max);
    const hue1 = Utils.randomInt(0, 360);
    const hue2 = Utils.randomInt(0, 360);
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, 
            hsl(${hue1}, 100%, 50%), 
            hsl(${hue2}, 100%, 70%));
        border-radius: 50%;
        z-index: 1000;
        pointer-events: none;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        animation: quantum-particle-${index % 4} ${duration}s ease-out forwards;
        box-shadow: 0 0 10px currentColor;
    `;
    button.appendChild(particle);
}

function createDimensionalRift(button) {
    const rift = document.createElement('div');
    rift.className = 'dimensional-rift';
    const colors = CONFIG.colors.quantum;
    rift.style.cssText = `
        position: absolute;
        inset: -100px;
        background: radial-gradient(ellipse 200% 50% at center, 
            ${colors.primary} 0%,
            ${colors.secondary} 25%,
            ${colors.tertiary} 50%,
            transparent 75%);
        border-radius: 50%;
        z-index: -1;
        animation: dimensional-rift ${CONFIG.quantum.explosionDuration}ms ease-out forwards;
        pointer-events: none;
        filter: blur(20px);
        transform: scale(0) rotate(0deg);
    `;
    button.appendChild(rift);
}

function quantumTextScramble(button) {
    const text = button.querySelector('.quantum-text');
    const originalText = text.textContent;
    const config = CONFIG.quantum;
    let cycles = 0;
    const scrambleInterval = setInterval(() => {
        if (cycles < config.textScrambleCycles) {
            const scrambled = Utils.scrambleText(
                originalText, 
                config.chars, 
                config.textScrambleProbability
            );
            text.textContent = scrambled;
            cycles++;
        } else {
            text.textContent = originalText;
            clearInterval(scrambleInterval);
        }
    }, config.textScrambleInterval);
}

function generateQuantumParticleKeyframes() {
    const style = document.createElement('style');
    let keyframes = '';
    for (let i = 0; i < 4; i++) {
        const config = CONFIG.particles;
        const moveX = Utils.randomBetween(-config.movement.max, config.movement.max);
        const moveY = Utils.randomBetween(-config.movement.max, config.movement.max);
        const rotation = i % 2 === 0 ? 0 : 720;
        keyframes += `
            @keyframes quantum-particle-${i} {
                0% { 
                    transform: translate(-50%, -50%) scale(0) rotate(0deg); 
                    opacity: 0; 
                }
                20% { opacity: 1; }
                100% { 
                    transform: translate(${moveX}px, ${moveY}px) scale(0) rotate(${rotation}deg);
                    opacity: 0;
                }
            }
        `;
    }
    
    keyframes += `
        @keyframes dimensional-rift {
            0% { 
                transform: scale(0) rotate(0deg);
                opacity: 0;
                filter: blur(30px);
            }
            20% { 
                transform: scale(1) rotate(90deg);
                opacity: 0.8;
                filter: blur(20px);
            }
            50% { 
                transform: scale(2) rotate(180deg);
                opacity: 1;
                filter: blur(10px);
            }
            100% { 
                transform: scale(4) rotate(360deg);
                opacity: 0;
                filter: blur(50px);
            }
        }
    `;
    
    style.textContent = keyframes;
    document.head.appendChild(style);
}

generateQuantumParticleKeyframes();
document.getElementById('quantumButton')?.addEventListener('click', function() {
    quantumNexusClick(this);
});