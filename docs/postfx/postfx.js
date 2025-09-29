const FXController = {
    controls: {},
    root: document.documentElement,
    
    init() {
        this.setupControls();
        this.setupToggle();
        this.setupPresets();
        this.setupReset();
    },
    
    setupControls() {
        const effects = [
            'blur', 
            'brightness', 
            'contrast', 
            'saturation', 
            'hue', 
            'grayscale', 
            'sepia', 
            'vignette', 
            'scanlines'
        ];
        
        effects.forEach(effect => {
            const slider = document.getElementById(effect);
            const valueDisplay = document.getElementById(`${effect}-value`);
            if (slider && valueDisplay) {
                this.controls[effect] = { slider, valueDisplay };
                
                slider.addEventListener('input', (e) => {
                    this.updateEffect(effect, e.target.value);
                });
            }
        });
    },
    
    updateEffect(effect, value) {
        const valueDisplay = this.controls[effect].valueDisplay;
        switch(effect) {
            case 'blur':
                this.root.style.setProperty('--fx-blur', `${value}px`);
                valueDisplay.textContent = `${value}px`;
                break;
            case 'brightness':
            case 'contrast':
            case 'saturation':
                this.root.style.setProperty(`--fx-${effect}`, value);
                valueDisplay.textContent = parseFloat(value).toFixed(2);
                break;
            case 'hue':
                this.root.style.setProperty('--fx-hue', `${value}deg`);
                valueDisplay.textContent = `${value}°`;
                break;
            case 'grayscale':
            case 'sepia':
            case 'vignette':
            case 'scanlines':
            case 'grain':
                this.root.style.setProperty(`--fx-${effect}`, value);
                valueDisplay.textContent = `${Math.round(value * 100)}%`;
                break;
        }
    },
    
    setupToggle() {
        const toggle = document.getElementById('fx-toggle');
        const panel = document.getElementById('fx-controls');
        if (toggle && panel) {
            toggle.addEventListener('click', () => {
                panel.classList.toggle('collapsed');
                const isOpen = !panel.classList.contains('collapsed');
                
                if (isOpen) {
                    toggle.classList.add('open');
                    toggle.textContent = '✕';
                } else {
                    toggle.classList.remove('open');
                    toggle.textContent = '⚙️ Post FX';
                }
            });
        }
    },
    
    setupPresets() {
        const presets = {
            cinematic: {
                blur: 0.5, 
                brightness: 0.9, 
                contrast: 1.2, 
                saturation: 0.8,
                hue: 0, 
                grayscale: 0, 
                sepia: 0, 
                vignette: 0.4, 
                scanlines: 0
            },
            cyberpunk: {
                blur: 0, 
                brightness: 1.1, 
                contrast: 1.3, 
                saturation: 1.5,
                hue: 280, 
                grayscale: 0, 
                sepia: 0, 
                vignette: 0.2, 
                scanlines: 0.3
            },
            vintage: {
                blur: 0.3, 
                brightness: 0.95, 
                contrast: 1.1, 
                saturation: 0.7,
                hue: 20, 
                grayscale: 0, 
                sepia: 0.6, 
                vignette: 0.5, 
                scanlines: 0.2
            },
            dreamy: {
                blur: 2, 
                brightness: 1.2, 
                contrast: 0.8, 
                saturation: 1.3,
                hue: 340, 
                grayscale: 0, 
                sepia: 0, 
                vignette: 0.3, 
                scanlines: 0
            },
            noir: {
                blur: 0, 
                brightness: 0.85, 
                contrast: 1.5, 
                saturation: 0,
                hue: 0, 
                grayscale: 1, 
                sepia: 0, 
                vignette: 0.6, 
                scanlines: 0.15
            },
            vaporwave: {
                blur: 0.5, 
                brightness: 1.1, 
                contrast: 1.2, 
                saturation: 2,
                hue: 300, 
                grayscale: 0, 
                sepia: 0, 
                vignette: 0.2, 
                scanlines: 0.2
            }
        };
        
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const preset = presets[btn.dataset.preset];
                if (preset) {
                    Object.keys(preset).forEach(effect => {
                        const control = this.controls[effect];
                        if (control) {
                            control.slider.value = preset[effect];
                            this.updateEffect(effect, preset[effect]);
                        }
                    });
                }
            });
        });
    },
    
    setupReset() {
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                Object.keys(this.controls).forEach(effect => {
                    const control = this.controls[effect];
                    let defaultValue;
                    
                    switch(effect) {
                        case 'brightness':
                        case 'contrast':
                        case 'saturation':
                            defaultValue = 1;
                            break;
                        default:
                            defaultValue = 0;
                    }
                    control.slider.value = defaultValue;
                    this.updateEffect(effect, defaultValue);
                });
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    FXController.init();
});