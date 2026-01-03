// ========================================
// MPB - Wizard Manager
// Controla los pasos del wizard
// ========================================

import {
    ROLES, INDUSTRIES, TECH_STACK, COMMUNICATION_STYLES,
    ALWAYS_RULES, NEVER_RULES, PROJECT_TEMPLATES, WIZARD_STEPS
} from './data.js';
import { generateMasterPrompt } from './generator.js';
import storage from './storage.js';

class WizardManager {
    constructor(container, previewContainer, onComplete) {
        this.container = container;
        this.previewContainer = previewContainer;
        this.onComplete = onComplete;
        this.currentStep = 1;
        this.totalSteps = WIZARD_STEPS.length;

        // Datos del prompt
        this.data = storage.load() || {
            name: '',
            role: '',
            roleEmoji: '',
            company: '',
            bio: '',
            industry: '',
            industryEmoji: '',
            responsibilities: '',
            expertise: [],
            stack: [],
            experienceLevel: 'intermediate',
            communicationStyle: '',
            formality: 50,
            detailLevel: 50,
            language: 'Español',
            alwaysRules: [],
            neverRules: [],
            projects: [],
            customNotes: ''
        };

        this.render();
        this.updatePreview();
    }

    render() {
        this.container.innerHTML = `
            <div class="wizard-container">
                ${this.renderProgress()}
                <div class="wizard-content animate-fade-in-up">
                    ${this.renderCurrentStep()}
                </div>
                ${this.renderNavigation()}
            </div>
        `;
        this.attachEventListeners();
    }

    renderProgress() {
        return `
            <div class="wizard-header">
                <div class="steps-indicator">
                    ${WIZARD_STEPS.map((step, i) => `
                        <div class="step-dot ${i + 1 < this.currentStep ? 'completed' : ''} ${i + 1 === this.currentStep ? 'active' : ''}" 
                             title="${step.emoji} ${step.title}">
                        </div>
                    `).join('')}
                </div>
                <div class="step-info text-center mb-6">
                    <span class="badge mb-2">Paso ${this.currentStep} de ${this.totalSteps}</span>
                    <h2 class="mb-2">${WIZARD_STEPS[this.currentStep - 1].emoji} ${WIZARD_STEPS[this.currentStep - 1].title}</h2>
                    <p class="text-secondary">${WIZARD_STEPS[this.currentStep - 1].description}</p>
                </div>
            </div>
        `;
    }

    renderCurrentStep() {
        switch (this.currentStep) {
            case 1: return this.renderStep1();
            case 2: return this.renderStep2();
            case 3: return this.renderStep3();
            case 4: return this.renderStep4();
            case 5: return this.renderStep5();
            case 6: return this.renderStep6();
            case 7: return this.renderStep7();
            default: return '';
        }
    }

    // Paso 1: Identidad
    renderStep1() {
        return `
            <div class="step-content">
                <div class="input-group">
                    <label class="input-label">¿Cómo te gustaría que te llame? *</label>
                    <input type="text" class="input" id="name" placeholder="Ej: Jorge, @jorgedev, Dr. García..." value="${this.data.name}">
                </div>
                
                <div class="input-group">
                    <label class="input-label">¿Cuál es tu rol principal?</label>
                    <div class="chip-group" id="roles-chips">
                        ${ROLES.map(role => `
                            <div class="chip ${this.data.role === role.label ? 'active' : ''}" data-role="${role.id}" data-label="${role.label}" data-emoji="${role.emoji}">
                                ${role.emoji} ${role.label}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Empresa u organización (opcional)</label>
                    <input type="text" class="input" id="company" placeholder="Ej: Mi Startup, Google, Freelancer..." value="${this.data.company}">
                </div>
                
                <div class="input-group">
                    <label class="input-label">Bio de una línea (opcional)</label>
                    <input type="text" class="input" id="bio" placeholder="Ej: CEO construyendo el futuro del trabajo remoto..." value="${this.data.bio}">
                </div>
            </div>
        `;
    }

    // Paso 2: Contexto
    renderStep2() {
        return `
            <div class="step-content">
                <div class="input-group">
                    <label class="input-label">¿En qué industria o contexto trabajas?</label>
                    <div class="chip-group" id="industry-chips">
                        ${INDUSTRIES.map(ind => `
                            <div class="chip ${this.data.industry === ind.label ? 'active' : ''}" data-industry="${ind.id}" data-label="${ind.label}" data-emoji="${ind.emoji}">
                                ${ind.emoji} ${ind.label}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">¿Cuáles son tus responsabilidades principales?</label>
                    <textarea class="input textarea" id="responsibilities" placeholder="Ej: Lidero el desarrollo de producto, gestiono un equipo de 5 personas, defino la estrategia técnica...">${this.data.responsibilities}</textarea>
                </div>
                
                <div class="input-group">
                    <label class="input-label">Áreas de expertise (separadas por coma)</label>
                    <input type="text" class="input" id="expertise" placeholder="Ej: Machine Learning, UX Design, Growth Marketing..." value="${this.data.expertise.join(', ')}">
                </div>
            </div>
        `;
    }

    // Paso 3: Stack
    renderStep3() {
        const categories = [...new Set(TECH_STACK.map(t => t.category))];

        return `
            <div class="step-content">
                <div class="input-group">
                    <label class="input-label">Selecciona las herramientas que usas frecuentemente:</label>
                    ${categories.map(cat => `
                        <div class="stack-category mb-4">
                            <h6 class="mb-2 text-secondary">${this.categoryLabel(cat)}</h6>
                            <div class="chip-group">
                                ${TECH_STACK.filter(t => t.category === cat).map(tool => `
                                    <div class="chip ${this.data.stack.some(s => s.id === tool.id) ? 'active' : ''}" 
                                         data-stack="${tool.id}" data-label="${tool.label}" data-category="${tool.category}">
                                        ${tool.label}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="input-group">
                    <label class="input-label">Nivel de experiencia técnica</label>
                    <div class="chip-group">
                        ${['Principiante', 'Intermedio', 'Avanzado', 'Experto'].map(level => `
                            <div class="chip ${this.data.experienceLevel === level.toLowerCase() ? 'active' : ''}" data-level="${level.toLowerCase()}">
                                ${level}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    categoryLabel(cat) {
        const labels = {
            'frontend': '🌐 Frontend',
            'backend': '⚙️ Backend',
            'mobile': '📱 Mobile',
            'design': '🎨 Design',
            'productivity': '📋 Productividad',
            'communication': '💬 Comunicación',
            'development': '💻 Development',
            'ai': '🤖 AI Tools',
            'database': '🗄️ Base de Datos',
            'cloud': '☁️ Cloud'
        };
        return labels[cat] || cat;
    }

    // Paso 4: Comunicación
    renderStep4() {
        return `
            <div class="step-content">
                <div class="input-group">
                    <label class="input-label">¿Qué estilo de respuestas prefieres?</label>
                    <div class="chip-group" id="style-chips">
                        ${COMMUNICATION_STYLES.map(style => `
                            <div class="chip ${this.data.communicationStyle === style.label ? 'active' : ''}" 
                                 data-style="${style.id}" data-label="${style.label}">
                                ${style.emoji} ${style.label}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="slider-container">
                    <label class="input-label">Formalidad</label>
                    <div class="slider-labels">
                        <span>😎 Casual</span>
                        <span>👔 Formal</span>
                    </div>
                    <input type="range" class="slider" id="formality" min="0" max="100" value="${this.data.formality}">
                </div>
                
                <div class="slider-container">
                    <label class="input-label">Nivel de detalle</label>
                    <div class="slider-labels">
                        <span>⚡ Conciso</span>
                        <span>📚 Detallado</span>
                    </div>
                    <input type="range" class="slider" id="detailLevel" min="0" max="100" value="${this.data.detailLevel}">
                </div>
                
                <div class="input-group">
                    <label class="input-label">Idioma preferido para las respuestas</label>
                    <div class="chip-group">
                        ${['Español', 'English', 'Ambos'].map(lang => `
                            <div class="chip ${this.data.language === lang ? 'active' : ''}" data-lang="${lang}">
                                ${lang === 'Español' ? '🇪🇸' : lang === 'English' ? '🇺🇸' : '🌎'} ${lang}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // Paso 5: Reglas
    renderStep5() {
        return `
            <div class="step-content">
                <div class="input-group">
                    <label class="input-label">✅ SIEMPRE quiero que hagas:</label>
                    <div class="chip-group" id="always-chips">
                        ${ALWAYS_RULES.map(rule => `
                            <div class="chip ${this.data.alwaysRules.includes(rule.label) ? 'active' : ''}" data-always="${rule.id}" data-label="${rule.label}">
                                ${rule.label}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="input-group mt-8">
                    <label class="input-label">❌ NUNCA quiero que hagas:</label>
                    <div class="chip-group" id="never-chips">
                        ${NEVER_RULES.map(rule => `
                            <div class="chip ${this.data.neverRules.includes(rule.label) ? 'active' : ''}" data-never="${rule.id}" data-label="${rule.label}">
                                ${rule.label}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="input-group mt-8">
                    <label class="input-label">Reglas personalizadas (opcional)</label>
                    <textarea class="input textarea" id="customRules" placeholder="Agrega cualquier otra instrucción específica...">${this.data.customNotes}</textarea>
                </div>
            </div>
        `;
    }

    // Paso 6: Proyectos
    renderStep6() {
        return `
            <div class="step-content">
                <div class="input-group">
                    <label class="input-label">¿En qué tipo de proyectos estás trabajando?</label>
                    <div class="chip-group" id="project-chips">
                        ${PROJECT_TEMPLATES.map(proj => `
                            <div class="chip" data-project="${proj.id}" data-label="${proj.label}" data-emoji="${proj.emoji}">
                                ${proj.emoji} ${proj.label}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div id="projects-list" class="mt-6">
                    ${this.data.projects.map((proj, i) => this.renderProjectCard(proj, i)).join('')}
                </div>
                
                <p class="text-secondary text-center mt-4">
                    👆 Haz click en un tipo de proyecto para agregarlo, o sáltate este paso.
                </p>
            </div>
        `;
    }

    renderProjectCard(project, index) {
        return `
            <div class="card mb-4 project-card" data-index="${index}">
                <div class="flex justify-between items-center mb-4">
                    <h5>${project.emoji} ${project.name}</h5>
                    <button class="btn btn-sm btn-secondary remove-project" data-index="${index}">✕ Quitar</button>
                </div>
                <div class="input-group mb-2">
                    <input type="text" class="input project-name" placeholder="Nombre del proyecto" value="${project.name}" data-index="${index}">
                </div>
                <div class="input-group">
                    <textarea class="input textarea project-desc" placeholder="Descripción breve..." data-index="${index}">${project.description || ''}</textarea>
                </div>
            </div>
        `;
    }

    // Paso 7: Revisión
    renderStep7() {
        const prompt = generateMasterPrompt(this.data);

        return `
            <div class="step-content">
                <div class="card">
                    <div class="flex justify-between items-center mb-4">
                        <h5>📄 Tu Master Prompt</h5>
                        <button class="btn btn-sm btn-secondary" id="copy-prompt">📋 Copiar</button>
                    </div>
                    <div class="preview-content" id="final-preview">${this.escapeHtml(prompt)}</div>
                </div>
                
                <div class="input-group mt-6">
                    <label class="input-label">Ajustes finales (edita libremente)</label>
                    <textarea class="input textarea" id="final-edit" style="min-height: 200px;">${prompt}</textarea>
                </div>
                
                <div class="flex gap-4 justify-center mt-8">
                    <button class="btn btn-primary btn-lg" id="save-prompt">💾 Guardar versión</button>
                    <button class="btn btn-cta btn-lg" id="export-prompt">📤 Exportar</button>
                </div>
            </div>
        `;
    }

    renderNavigation() {
        return `
            <div class="wizard-nav flex justify-between mt-8">
                <button class="btn btn-secondary" id="prev-btn" ${this.currentStep === 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                    ← Anterior
                </button>
                <button class="btn btn-primary" id="next-btn">
                    ${this.currentStep === this.totalSteps ? '✨ Finalizar' : 'Siguiente →'}
                </button>
            </div>
        `;
    }

    attachEventListeners() {
        // Navigation
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        if (prevBtn) prevBtn.addEventListener('click', () => this.prevStep());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextStep());

        // Step-specific listeners
        this.attachStepListeners();
    }

    attachStepListeners() {
        // Inputs que actualizan data
        const inputs = ['name', 'company', 'bio', 'responsibilities', 'expertise', 'customRules'];
        inputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', (e) => {
                    if (id === 'expertise') {
                        this.data[id] = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    } else if (id === 'customRules') {
                        this.data.customNotes = e.target.value;
                    } else {
                        this.data[id] = e.target.value;
                    }
                    this.saveAndUpdate();
                });
            }
        });

        // Sliders
        ['formality', 'detailLevel'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', (e) => {
                    this.data[id] = parseInt(e.target.value);
                    this.saveAndUpdate();
                });
            }
        });

        // Role chips
        document.querySelectorAll('[data-role]').forEach(chip => {
            chip.addEventListener('click', () => {
                document.querySelectorAll('[data-role]').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.data.role = chip.dataset.label;
                this.data.roleEmoji = chip.dataset.emoji;
                this.saveAndUpdate();
            });
        });

        // Industry chips
        document.querySelectorAll('[data-industry]').forEach(chip => {
            chip.addEventListener('click', () => {
                document.querySelectorAll('[data-industry]').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.data.industry = chip.dataset.label;
                this.data.industryEmoji = chip.dataset.emoji;
                this.saveAndUpdate();
            });
        });

        // Stack chips (multi-select)
        document.querySelectorAll('[data-stack]').forEach(chip => {
            chip.addEventListener('click', () => {
                chip.classList.toggle('active');
                const tool = {
                    id: chip.dataset.stack,
                    label: chip.dataset.label,
                    category: chip.dataset.category
                };
                if (chip.classList.contains('active')) {
                    this.data.stack.push(tool);
                } else {
                    this.data.stack = this.data.stack.filter(s => s.id !== tool.id);
                }
                this.saveAndUpdate();
            });
        });

        // Experience level
        document.querySelectorAll('[data-level]').forEach(chip => {
            chip.addEventListener('click', () => {
                document.querySelectorAll('[data-level]').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.data.experienceLevel = chip.dataset.level;
                this.saveAndUpdate();
            });
        });

        // Communication style
        document.querySelectorAll('[data-style]').forEach(chip => {
            chip.addEventListener('click', () => {
                document.querySelectorAll('[data-style]').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.data.communicationStyle = chip.dataset.label;
                this.saveAndUpdate();
            });
        });

        // Language
        document.querySelectorAll('[data-lang]').forEach(chip => {
            chip.addEventListener('click', () => {
                document.querySelectorAll('[data-lang]').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.data.language = chip.dataset.lang;
                this.saveAndUpdate();
            });
        });

        // Always rules (multi-select)
        document.querySelectorAll('[data-always]').forEach(chip => {
            chip.addEventListener('click', () => {
                chip.classList.toggle('active');
                const rule = chip.dataset.label;
                if (chip.classList.contains('active')) {
                    this.data.alwaysRules.push(rule);
                } else {
                    this.data.alwaysRules = this.data.alwaysRules.filter(r => r !== rule);
                }
                this.saveAndUpdate();
            });
        });

        // Never rules (multi-select)
        document.querySelectorAll('[data-never]').forEach(chip => {
            chip.addEventListener('click', () => {
                chip.classList.toggle('active');
                const rule = chip.dataset.label;
                if (chip.classList.contains('active')) {
                    this.data.neverRules.push(rule);
                } else {
                    this.data.neverRules = this.data.neverRules.filter(r => r !== rule);
                }
                this.saveAndUpdate();
            });
        });

        // Project templates
        document.querySelectorAll('[data-project]').forEach(chip => {
            chip.addEventListener('click', () => {
                const project = {
                    id: Date.now(),
                    type: chip.dataset.project,
                    name: chip.dataset.label,
                    emoji: chip.dataset.emoji,
                    description: ''
                };
                this.data.projects.push(project);
                this.saveAndUpdate();
                this.render();
            });
        });

        // Remove project
        document.querySelectorAll('.remove-project').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                this.data.projects.splice(index, 1);
                this.saveAndUpdate();
                this.render();
            });
        });

        // Project inputs
        document.querySelectorAll('.project-name').forEach(input => {
            input.addEventListener('input', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.data.projects[index].name = e.target.value;
                this.saveAndUpdate();
            });
        });

        document.querySelectorAll('.project-desc').forEach(input => {
            input.addEventListener('input', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.data.projects[index].description = e.target.value;
                this.saveAndUpdate();
            });
        });

        // Step 7: Copy and Export
        const copyBtn = document.getElementById('copy-prompt');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const text = document.getElementById('final-edit')?.value || generateMasterPrompt(this.data);
                navigator.clipboard.writeText(text);
                copyBtn.textContent = '✓ Copiado!';
                setTimeout(() => copyBtn.textContent = '📋 Copiar', 2000);
            });
        }

        const saveBtn = document.getElementById('save-prompt');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const prompt = document.getElementById('final-edit')?.value || generateMasterPrompt(this.data);
                storage.saveVersion(prompt);
                saveBtn.textContent = '✓ Guardado!';
                setTimeout(() => saveBtn.textContent = '💾 Guardar versión', 2000);
            });
        }

        const exportBtn = document.getElementById('export-prompt');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                if (this.onComplete) this.onComplete(this.data);
            });
        }

        // Final edit sync
        const finalEdit = document.getElementById('final-edit');
        if (finalEdit) {
            finalEdit.addEventListener('input', () => {
                const preview = document.getElementById('final-preview');
                if (preview) preview.textContent = finalEdit.value;
            });
        }
    }

    saveAndUpdate() {
        storage.save(this.data);
        this.updatePreview();
    }

    updatePreview() {
        if (!this.previewContainer) return;

        const prompt = generateMasterPrompt(this.data);
        this.previewContainer.innerHTML = `
            <div class="preview-header flex justify-between items-center mb-4">
                <h5 class="text-gradient">📄 Preview</h5>
                <span class="badge">En vivo</span>
            </div>
            <div class="preview-content">${this.escapeHtml(prompt)}</div>
        `;
        this.previewContainer.classList.add('preview-update');
        setTimeout(() => this.previewContainer.classList.remove('preview-update'), 500);
    }

    escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\n/g, '<br>');
    }

    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.render();
        } else if (this.currentStep === this.totalSteps) {
            // Finalizar
            if (this.onComplete) this.onComplete(this.data);
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.render();
        }
    }

    goToStep(step) {
        if (step >= 1 && step <= this.totalSteps) {
            this.currentStep = step;
            this.render();
        }
    }
}

export default WizardManager;
