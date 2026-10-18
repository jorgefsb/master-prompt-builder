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
import { getLang } from './i18n.js';

function wizardChrome() {
    if (getLang() === 'en') {
        return {
            stepOf: (n, total) => `Step ${n} of ${total}`,
            steps: [
                { title: 'Identity', description: 'Who you are and your main role' },
                { title: 'Context', description: 'Your industry and responsibilities' },
                { title: 'Stack', description: 'Tools you use' },
                { title: 'Communication', description: 'How you like answers' },
                { title: 'Rules', description: 'What you always or never want' },
                { title: 'Projects', description: 'What you are working on' },
                { title: 'Review', description: 'Review and adjust your prompt' }
            ],
            nameLabel: 'What should I call you? *',
            namePh: 'E.g. Jorge, @jorgedev, Dr. García...',
            roleLabel: 'What is your main role?',
            companyLabel: 'Company or organization (optional)',
            companyPh: 'E.g. My Startup, Google, Freelancer...',
            bioLabel: 'One-line bio (optional)',
            bioPh: 'E.g. CEO building the future of remote work...',
            industryLabel: 'What industry or context do you work in?',
            respLabel: 'What are your main responsibilities?',
            respPh: 'E.g. I lead product development, manage a team of 5, set the technical strategy...',
            expertiseLabel: 'Areas of expertise (comma-separated)',
            expertisePh: 'E.g. Machine Learning, UX Design, Growth Marketing...',
            stackLabel: 'Select the tools you use often:',
            expLabel: 'Technical experience level',
            levels: [
                { id: 'principiante', label: 'Beginner' },
                { id: 'intermedio', label: 'Intermediate' },
                { id: 'avanzado', label: 'Advanced' },
                { id: 'experto', label: 'Expert' }
            ],
            cats: {
                frontend: '🌐 Frontend',
                backend: '⚙️ Backend',
                mobile: '📱 Mobile',
                design: '🎨 Design',
                productivity: '📋 Productivity',
                communication: '💬 Communication',
                development: '💻 Development',
                ai: '🤖 AI Tools',
                database: '🗄️ Database',
                cloud: '☁️ Cloud'
            },
            styleLabel: 'What answer style do you prefer?',
            formality: 'Formality',
            casual: '😎 Casual',
            formal: '👔 Formal',
            detail: 'Level of detail',
            concise: '⚡ Concise',
            detailed: '📚 Detailed',
            promptLangLabel: 'Preferred language for answers',
            alwaysLabel: '✅ ALWAYS I want you to:',
            neverLabel: '❌ NEVER I want you to:',
            customLabel: 'Custom rules (optional)',
            customPh: 'Add any other specific instruction...',
            projectsLabel: 'What kind of projects are you working on?',
            projectsHint: '👆 Tap a project type to add it, or skip this step.',
            remove: '✕ Remove',
            projectNamePh: 'Project name',
            projectDescPh: 'Short description...',
            yourPrompt: '📄 Your Master Prompt',
            copy: '📋 Copy',
            copied: '✓ Copied!',
            finalLabel: 'Final tweaks (edit freely)',
            save: '💾 Save version',
            saved: '✓ Saved!',
            export: '📤 Export',
            prev: '← Back',
            next: 'Next →',
            finish: '✨ Finish',
            live: 'Live'
        };
    }
    return {
        stepOf: (n, total) => `Paso ${n} de ${total}`,
        steps: WIZARD_STEPS,
        nameLabel: '¿Cómo te gustaría que te llame? *',
        namePh: 'Ej: Jorge, @jorgedev, Dr. García...',
        roleLabel: '¿Cuál es tu rol principal?',
        companyLabel: 'Empresa u organización (opcional)',
        companyPh: 'Ej: Mi Startup, Google, Freelancer...',
        bioLabel: 'Bio de una línea (opcional)',
        bioPh: 'Ej: CEO construyendo el futuro del trabajo remoto...',
        industryLabel: '¿En qué industria o contexto trabajas?',
        respLabel: '¿Cuáles son tus responsabilidades principales?',
        respPh: 'Ej: Lidero el desarrollo de producto, gestiono un equipo de 5 personas, defino la estrategia técnica...',
        expertiseLabel: 'Áreas de expertise (separadas por coma)',
        expertisePh: 'Ej: Machine Learning, UX Design, Growth Marketing...',
        stackLabel: 'Selecciona las herramientas que usas frecuentemente:',
        expLabel: 'Nivel de experiencia técnica',
        levels: [
            { id: 'principiante', label: 'Principiante' },
            { id: 'intermedio', label: 'Intermedio' },
            { id: 'avanzado', label: 'Avanzado' },
            { id: 'experto', label: 'Experto' }
        ],
        cats: {
            frontend: '🌐 Frontend',
            backend: '⚙️ Backend',
            mobile: '📱 Mobile',
            design: '🎨 Design',
            productivity: '📋 Productividad',
            communication: '💬 Comunicación',
            development: '💻 Development',
            ai: '🤖 AI Tools',
            database: '🗄️ Base de Datos',
            cloud: '☁️ Cloud'
        },
        styleLabel: '¿Qué estilo de respuestas prefieres?',
        formality: 'Formalidad',
        casual: '😎 Casual',
        formal: '👔 Formal',
        detail: 'Nivel de detalle',
        concise: '⚡ Conciso',
        detailed: '📚 Detallado',
        promptLangLabel: 'Idioma preferido para las respuestas',
        alwaysLabel: '✅ SIEMPRE quiero que hagas:',
        neverLabel: '❌ NUNCA quiero que hagas:',
        customLabel: 'Reglas personalizadas (opcional)',
        customPh: 'Agrega cualquier otra instrucción específica...',
        projectsLabel: '¿En qué tipo de proyectos estás trabajando?',
        projectsHint: '👆 Haz click en un tipo de proyecto para agregarlo, o sáltate este paso.',
        remove: '✕ Quitar',
        projectNamePh: 'Nombre del proyecto',
        projectDescPh: 'Descripción breve...',
        yourPrompt: '📄 Tu Master Prompt',
        copy: '📋 Copiar',
        copied: '✓ Copiado!',
        finalLabel: 'Ajustes finales (edita libremente)',
        save: '💾 Guardar versión',
        saved: '✓ Guardado!',
        export: '📤 Exportar',
        prev: '← Anterior',
        next: 'Siguiente →',
        finish: '✨ Finalizar',
        live: 'En vivo'
    };
}

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
        const c = wizardChrome();
        const stepMeta = WIZARD_STEPS[this.currentStep - 1];
        const stepCopy = c.steps[this.currentStep - 1];
        return `
            <div class="wizard-header">
                <div class="steps-indicator">
                    ${WIZARD_STEPS.map((step, i) => `
                        <div class="step-dot ${i + 1 < this.currentStep ? 'completed' : ''} ${i + 1 === this.currentStep ? 'active' : ''}" 
                             title="${step.emoji} ${c.steps[i].title}">
                        </div>
                    `).join('')}
                </div>
                <div class="step-info text-center mb-6">
                    <span class="badge mb-2">${c.stepOf(this.currentStep, this.totalSteps)}</span>
                    <h2 class="mb-2">${stepMeta.emoji} ${stepCopy.title}</h2>
                    <p class="text-secondary">${stepCopy.description}</p>
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
        const c = wizardChrome();
        return `
            <div class="step-content">
                <div class="input-group">
                    <label class="input-label">${c.nameLabel}</label>
                    <input type="text" class="input" id="name" placeholder="${c.namePh}" value="${this.data.name}">
                </div>
                
                <div class="input-group">
                    <label class="input-label">${c.roleLabel}</label>
                    <div class="chip-group" id="roles-chips">
                        ${ROLES.map(role => `
                            <button type="button" class="chip ${this.data.role === role.label ? 'active' : ''}" data-role="${role.id}" data-label="${role.label}" data-emoji="${role.emoji}" aria-pressed="${this.data.role === role.label ? 'true' : 'false'}">
                                ${role.emoji} ${role.label}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">${c.companyLabel}</label>
                    <input type="text" class="input" id="company" placeholder="${c.companyPh}" value="${this.data.company}">
                </div>
                
                <div class="input-group">
                    <label class="input-label">${c.bioLabel}</label>
                    <input type="text" class="input" id="bio" placeholder="${c.bioPh}" value="${this.data.bio}">
                </div>
            </div>
        `;
    }

    // Paso 2: Contexto
    renderStep2() {
        const c = wizardChrome();
        return `
            <div class="step-content">
                <div class="input-group">
                    <label class="input-label">${c.industryLabel}</label>
                    <div class="chip-group" id="industry-chips">
                        ${INDUSTRIES.map(ind => `
                            <button type="button" class="chip ${this.data.industry === ind.label ? 'active' : ''}" data-industry="${ind.id}" data-label="${ind.label}" data-emoji="${ind.emoji}" aria-pressed="${this.data.industry === ind.label ? 'true' : 'false'}">
                                ${ind.emoji} ${ind.label}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <div class="input-group">
                    <label class="input-label">${c.respLabel}</label>
                    <textarea class="input textarea" id="responsibilities" placeholder="${c.respPh}">${this.data.responsibilities}</textarea>
                </div>
                
                <div class="input-group">
                    <label class="input-label">${c.expertiseLabel}</label>
                    <input type="text" class="input" id="expertise" placeholder="${c.expertisePh}" value="${this.data.expertise.join(', ')}">
                </div>
            </div>
        `;
    }

    // Paso 3: Stack
    renderStep3() {
        const c = wizardChrome();
        const categories = [...new Set(TECH_STACK.map(t => t.category))];

        return `
            <div class="step-content">
                <div class="input-group">
                    <label class="input-label">${c.stackLabel}</label>
                    ${categories.map(cat => `
                        <div class="stack-category mb-4">
                            <h6 class="mb-2 text-secondary">${c.cats[cat] || cat}</h6>
                            <div class="chip-group">
                                ${TECH_STACK.filter(t => t.category === cat).map(tool => `
                                    <button type="button" class="chip ${this.data.stack.some(s => s.id === tool.id) ? 'active' : ''}" 
                                         data-stack="${tool.id}" data-label="${tool.label}" data-category="${tool.category}" aria-pressed="${this.data.stack.some(s => s.id === tool.id) ? 'true' : 'false'}">
                                        ${tool.label}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="input-group">
                    <label class="input-label">${c.expLabel}</label>
                    <div class="chip-group">
                        ${c.levels.map(level => `
                            <button type="button" class="chip ${this.data.experienceLevel === level.id ? 'active' : ''}" data-level="${level.id}" aria-pressed="${this.data.experienceLevel === level.id ? 'true' : 'false'}">
                                ${level.label}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // Paso 4: Comunicación
    renderStep4() {
        const c = wizardChrome();
        return `
            <div class="step-content">
                <div class="input-group">
                    <label class="input-label">${c.styleLabel}</label>
                    <div class="chip-group" id="style-chips">
                        ${COMMUNICATION_STYLES.map(style => `
                            <button type="button" class="chip ${this.data.communicationStyle === style.label ? 'active' : ''}" 
                                 data-style="${style.id}" data-label="${style.label}" aria-pressed="${this.data.communicationStyle === style.label ? 'true' : 'false'}">
                                ${style.emoji} ${style.label}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <div class="slider-container">
                    <label class="input-label">${c.formality}</label>
                    <div class="slider-labels">
                        <span>${c.casual}</span>
                        <span>${c.formal}</span>
                    </div>
                    <input type="range" class="slider" id="formality" min="0" max="100" value="${this.data.formality}">
                </div>
                
                <div class="slider-container">
                    <label class="input-label">${c.detail}</label>
                    <div class="slider-labels">
                        <span>${c.concise}</span>
                        <span>${c.detailed}</span>
                    </div>
                    <input type="range" class="slider" id="detailLevel" min="0" max="100" value="${this.data.detailLevel}">
                </div>
                
                <div class="input-group">
                    <label class="input-label">${c.promptLangLabel}</label>
                    <div class="chip-group" data-prompt-lang-group>
                        ${['Español', 'English', 'Ambos'].map(lang => `
                            <button type="button" class="chip ${this.data.language === lang ? 'active' : ''}" data-prompt-lang="${lang}" aria-pressed="${this.data.language === lang ? 'true' : 'false'}">
                                ${lang === 'Español' ? '🇪🇸' : lang === 'English' ? '🇺🇸' : '🌎'} ${lang}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // Paso 5: Reglas
    renderStep5() {
        const c = wizardChrome();
        return `
            <div class="step-content">
                <div class="input-group">
                    <label class="input-label">${c.alwaysLabel}</label>
                    <div class="chip-group" id="always-chips">
                        ${ALWAYS_RULES.map(rule => `
                            <button type="button" class="chip ${this.data.alwaysRules.includes(rule.label) ? 'active' : ''}" data-always="${rule.id}" data-label="${rule.label}" aria-pressed="${this.data.alwaysRules.includes(rule.label) ? 'true' : 'false'}">
                                ${rule.label}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <div class="input-group mt-8">
                    <label class="input-label">${c.neverLabel}</label>
                    <div class="chip-group" id="never-chips">
                        ${NEVER_RULES.map(rule => `
                            <button type="button" class="chip ${this.data.neverRules.includes(rule.label) ? 'active' : ''}" data-never="${rule.id}" data-label="${rule.label}" aria-pressed="${this.data.neverRules.includes(rule.label) ? 'true' : 'false'}">
                                ${rule.label}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <div class="input-group mt-8">
                    <label class="input-label">${c.customLabel}</label>
                    <textarea class="input textarea" id="customRules" placeholder="${c.customPh}">${this.data.customNotes}</textarea>
                </div>
            </div>
        `;
    }

    // Paso 6: Proyectos
    renderStep6() {
        const c = wizardChrome();
        return `
            <div class="step-content">
                <div class="input-group">
                    <label class="input-label">${c.projectsLabel}</label>
                    <div class="chip-group" id="project-chips">
                        ${PROJECT_TEMPLATES.map(proj => `
                            <button type="button" class="chip" data-project="${proj.id}" data-label="${proj.label}" data-emoji="${proj.emoji}" aria-pressed="false">
                                ${proj.emoji} ${proj.label}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <div id="projects-list" class="mt-6">
                    ${this.data.projects.map((proj, i) => this.renderProjectCard(proj, i)).join('')}
                </div>
                
                <p class="text-secondary text-center mt-4">
                    ${c.projectsHint}
                </p>
            </div>
        `;
    }

    renderProjectCard(project, index) {
        const c = wizardChrome();
        return `
            <div class="card mb-4 project-card" data-index="${index}">
                <div class="flex justify-between items-center mb-4">
                    <h5>${project.emoji} ${project.name}</h5>
                    <button class="btn btn-sm btn-secondary remove-project" data-index="${index}">${c.remove}</button>
                </div>
                <div class="input-group mb-2">
                    <input type="text" class="input project-name" placeholder="${c.projectNamePh}" value="${project.name}" data-index="${index}">
                </div>
                <div class="input-group">
                    <textarea class="input textarea project-desc" placeholder="${c.projectDescPh}" data-index="${index}">${project.description || ''}</textarea>
                </div>
            </div>
        `;
    }

    // Paso 7: Revisión
    renderStep7() {
        const c = wizardChrome();
        const prompt = generateMasterPrompt(this.data);

        return `
            <div class="step-content">
                <div class="card">
                    <div class="flex justify-between items-center mb-4">
                        <h5>${c.yourPrompt}</h5>
                        <button class="btn btn-sm btn-secondary" id="copy-prompt" type="button">${c.copy}</button>
                    </div>
                    <div class="preview-content" id="final-preview">${this.escapeHtml(prompt)}</div>
                </div>
                
                <div class="input-group mt-6">
                    <label class="input-label">${c.finalLabel}</label>
                    <textarea class="input textarea" id="final-edit" style="min-height: 200px;">${prompt}</textarea>
                </div>
                
                <div class="flex gap-4 justify-center mt-8">
                    <button class="btn btn-secondary btn-lg" id="save-prompt" type="button">${c.save}</button>
                    <button class="btn btn-cta btn-lg jz-antic" id="export-prompt" type="button" data-jz="jz-tap">${c.export}</button>
                </div>
            </div>
        `;
    }

    renderNavigation() {
        const c = wizardChrome();
        return `
            <div class="wizard-nav flex justify-between mt-8">
                <button class="btn btn-secondary" id="prev-btn" type="button" ${this.currentStep === 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                    ${c.prev}
                </button>
                <button class="btn btn-primary jz-antic" id="next-btn" type="button" data-jz="jz-tap">
                    ${this.currentStep === this.totalSteps ? c.finish : c.next}
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

    setChipPressed(chip, on) {
        chip.classList.toggle('active', on);
        chip.setAttribute('aria-pressed', on ? 'true' : 'false');
    }

    pressExclusive(chips, selected) {
        chips.forEach((chip) => this.setChipPressed(chip, chip === selected));
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
                this.pressExclusive(document.querySelectorAll('[data-role]'), chip);
                this.data.role = chip.dataset.label;
                this.data.roleEmoji = chip.dataset.emoji;
                this.saveAndUpdate();
            });
        });

        // Industry chips
        document.querySelectorAll('[data-industry]').forEach(chip => {
            chip.addEventListener('click', () => {
                this.pressExclusive(document.querySelectorAll('[data-industry]'), chip);
                this.data.industry = chip.dataset.label;
                this.data.industryEmoji = chip.dataset.emoji;
                this.saveAndUpdate();
            });
        });

        // Stack chips (multi-select)
        document.querySelectorAll('[data-stack]').forEach(chip => {
            chip.addEventListener('click', () => {
                this.setChipPressed(chip, !chip.classList.contains('active'));
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
                this.pressExclusive(document.querySelectorAll('[data-level]'), chip);
                this.data.experienceLevel = chip.dataset.level;
                this.saveAndUpdate();
            });
        });

        // Communication style
        document.querySelectorAll('[data-style]').forEach(chip => {
            chip.addEventListener('click', () => {
                this.pressExclusive(document.querySelectorAll('[data-style]'), chip);
                this.data.communicationStyle = chip.dataset.label;
                this.saveAndUpdate();
            });
        });

        // Language of the prompt (never [data-lang]: that is site i18n in header/footer)
        this.container.querySelectorAll('[data-prompt-lang]').forEach(chip => {
            chip.addEventListener('click', () => {
                this.pressExclusive(this.container.querySelectorAll('[data-prompt-lang]'), chip);
                this.data.language = chip.getAttribute('data-prompt-lang');
                this.saveAndUpdate();
            });
        });

        // Always rules (multi-select)
        document.querySelectorAll('[data-always]').forEach(chip => {
            chip.addEventListener('click', () => {
                this.setChipPressed(chip, !chip.classList.contains('active'));
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
                this.setChipPressed(chip, !chip.classList.contains('active'));
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
                document.dispatchEvent(new CustomEvent('mpb:copy', { detail: { el: copyBtn } }));
                copyBtn.textContent = wizardChrome().copied;
                setTimeout(() => copyBtn.textContent = wizardChrome().copy, 2000);
            });
        }

        const saveBtn = document.getElementById('save-prompt');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const prompt = document.getElementById('final-edit')?.value || generateMasterPrompt(this.data);
                storage.saveVersion(prompt);
                saveBtn.textContent = wizardChrome().saved;
                setTimeout(() => saveBtn.textContent = wizardChrome().save, 2000);
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
                <span class="badge">${wizardChrome().live}</span>
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
