// ========================================
// MPB - Main Application
// Entry point y orquestación
// ========================================

import WizardManager from './wizard.js';
import { generateMasterPrompt } from './generator.js';
import exportFunctions from './export.js';
import storage from './storage.js';

class MPBApp {
    constructor() {
        this.app = document.getElementById('app');
        this.currentView = 'landing'; // landing, onboarding, wizard, export
        this.init();
    }

    init() {
        // Verificar si hay datos guardados
        const savedData = storage.load();

        if (savedData && savedData.name) {
            // Usuario que regresa - preguntar si continuar
            this.showWelcomeBack(savedData);
        } else {
            this.showLanding();
        }
    }

    showLanding() {
        this.currentView = 'landing';
        this.app.innerHTML = `
            <div class="landing-page">
                <header class="landing-header">
                    <nav class="container flex justify-between items-center" style="padding: 24px;">
                        <div class="logo logo-animated" style="font-size: 1.8rem; font-weight: 800; letter-spacing: -1px;">
                            ⚡ MPB
                        </div>
                        <div class="flex gap-4">
                            <a href="#features" class="btn btn-secondary btn-sm">Cómo funciona</a>
                            <button class="btn btn-primary btn-sm" id="login-btn">Acceso VIP</button>
                        </div>
                    </nav>
                </header>
                
                <main class="landing-hero container text-center" style="padding: 100px 20px 60px;">
                    <div class="animate-fade-in-up stagger-1">
                        <span class="badge mb-4" style="padding: 8px 16px;">🔥 El secreto de los Prompt Engineers</span>
                    </div>
                    
                    <h1 class="animate-fade-in-up stagger-2 mb-6" style="max-width: 900px; margin-left: auto; margin-right: auto; line-height: 1.1;">
                        Deja de explicarle al AI <span class="text-gradient">quién eres</span> en cada chat.
                    </h1>
                    
                    <p class="animate-fade-in-up stagger-3 mb-10" style="font-size: 1.4rem; max-width: 700px; margin-left: auto; margin-right: auto; color: var(--color-text-secondary);">
                        Crea tu <strong>Master Prompt</strong>: Tu manual de identidad digital que hace que ChatGPT, Claude y Gemini te den respuestas perfectas desde el primer segundo.
                    </p>
                    
                    <div class="animate-fade-in-up stagger-4 flex justify-center gap-6 flex-wrap">
                        <button class="btn btn-cta btn-lg" id="start-btn" style="padding: 20px 40px; font-size: 1.3rem; box-shadow: 0 0 50px rgba(255, 217, 61, 0.3);">
                            ⚡ Crear mi Master Prompt Gratis
                        </button>
                    </div>
                    
                    <div class="animate-fade-in-up stagger-5 mt-16" style="opacity: 0.6;">
                        <p class="text-secondary mb-6">Optimizado para tus herramientas favoritas:</p>
                        <div class="flex justify-center gap-8 flex-wrap">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" height="30" alt="ChatGPT" style="filter: grayscale(1) invert(1);">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c2/Claude_AI_logo.svg" height="30" alt="Claude" style="filter: grayscale(1) invert(1);">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Git-logo.svg" height="30" alt="GitHub" style="filter: grayscale(1) invert(1);">
                        </div>
                    </div>
                </main>

                <!-- El Dolor Section -->
                <section class="container" style="padding: 80px 20px; border-top: 1px solid var(--glass-border);">
                    <div class="flex split-layout items-center">
                        <div class="animate-slide-in-left">
                            <h2 class="mb-6">El problema de la <span style="color: var(--color-error);">amnesia</span> de la IA</h2>
                            <p class="text-lg mb-4">Cada vez que abres un chat nuevo, estás hablando con un <strong>extraño</strong>. Pierdes 5-10 minutos explicando:</p>
                            <ul style="line-height: 2; color: var(--color-text-secondary); margin-bottom: 30px;">
                                <li>❌ Cuál es tu stack tecnológico</li>
                                <li>❌ Qué tono de voz prefieres</li>
                                <li>❌ En qué proyectos estás trabajando</li>
                                <li>❌ Cómo quieres que te entregue el código</li>
                            </ul>
                            <p class="text-lg"><strong>Multiplica eso por 10 veces al día. Estás perdiendo una hora diaria.</strong></p>
                        </div>
                        <div class="card animate-slide-in-right" style="padding: 40px; background: rgba(239, 68, 68, 0.05); border-color: rgba(239, 68, 68, 0.2);">
                            <div style="font-family: monospace; color: var(--color-text-tertiary);">
                                <div class="mb-2">> AI: Hola, ¿en qué te ayudo?</div>
                                <div class="mb-2" style="color: var(--color-text-secondary);">>> Tú: Soy dev senior en React, uso Supabase, prefiero respuestas directas y... (escribiendo lo mismo de ayer)</div>
                                <div class="mb-2">> AI: Entendido. ¿Qué proyecto...?</div>
                                <div style="color: var(--color-text-secondary);">>> Tú: El de la e-commerce... (suspiro)</div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- La Solución Section -->
                <section id="features" class="container" style="padding: 80px 20px;">
                    <h2 class="text-center mb-12">¿Cómo MPB cambia tu vida?</h2>
                    
                    <div class="features-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px;">
                        <div class="card animate-fade-in-up">
                            <div class="emoji-icon">🧠</div>
                            <h4 class="mb-3">DNA Digital One-Click</h4>
                            <p class="text-secondary">Un solo documento que contiene tu identidad profesional completa. Pégalo una vez y obtén respuestas de nivel experto.</p>
                        </div>
                        
                        <div class="card animate-fade-in-up">
                            <div class="emoji-icon">🚀</div>
                            <h4 class="mb-3">Contexto Instantáneo</h4>
                            <p class="text-secondary">El AI sabrá tus proyectos actuales, tus deadlines y tus preferencias sin que digas una sola palabra extra.</p>
                        </div>
                        
                        <div class="card animate-fade-in-up">
                            <div class="emoji-icon">🔄</div>
                            <h4 class="mb-3">Evolución Dinámica</h4>
                            <p class="text-secondary">¿Cambiaste de stack? ¿Nuevo proyecto? Actualiza tu MPB en segundos y sincronízalo con tu GitHub automáticamente.</p>
                        </div>
                    </div>
                </section>

                <!-- ¿Para quién? Section -->
                <section class="container text-center" style="padding: 80px 20px; background: rgba(102, 126, 234, 0.03); border-radius: 40px;">
                    <h2 class="mb-12">Esencial para...</h2>
                    <div class="flex justify-center gap-4 flex-wrap">
                        <div class="chip active" style="padding: 12px 24px;">👨‍💻 Desarrolladores</div>
                        <div class="chip active" style="padding: 12px 24px;">👨‍💼 Emprendedores</div>
                        <div class="chip active" style="padding: 12px 24px;">🎨 Diseñadores UX</div>
                        <div class="chip active" style="padding: 12px 24px;">✍️ Creadores de Contenido</div>
                        <div class="chip active" style="padding: 12px 24px;">📊 Project Managers</div>
                    </div>
                </section>
                
                <!-- CTA Final Section -->
                <section class="landing-cta container text-center" style="padding: 100px 20px;">
                    <div class="card" style="padding: 60px; background: var(--color-accent-gradient); border: none; position: relative; overflow: hidden;">
                        <div style="position: absolute; top: -20px; right: -20px; font-size: 10rem; opacity: 0.1;">⚡</div>
                        <h2 class="mb-6" style="color: white; font-size: 3rem;">Toma el control de tu productividad</h2>
                        <p style="color: rgba(255,255,255,0.9); font-size: 1.3rem; margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto;">
                            Únete a cientos de profesionales que ya no pierden el tiempo explicando lo obvio al AI.
                        </p>
                        <button class="btn btn-lg" id="start-btn-2" style="background: white; color: #667EEA; padding: 20px 50px; font-size: 1.2rem; font-weight: 700;">
                            🚀 Comenzar mi Master Prompt GRATIS
                        </button>
                    </div>
                </section>

                <footer class="container text-center" style="padding: 40px 20px; opacity: 0.5; font-size: 0.9rem;">
                    <p>© 2024 MPB - Master Prompt Builder. Construye mejores IAs.</p>
                </footer>
            </div>
        `; `;

        // Event listeners
        document.getElementById('start-btn').addEventListener('click', () => this.showOnboarding());
        document.getElementById('start-btn-2').addEventListener('click', () => this.showOnboarding());
        document.getElementById('learn-btn').addEventListener('click', () => this.showLearnMore());
    }

    showWelcomeBack(data) {
        this.app.innerHTML = `
            < div class="welcome-back container text-center" style = "min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 40px 20px;" >
                <div class="animate-fade-in-up">
                    <div class="emoji-icon" style="font-size: 4rem;">👋</div>
                    <h1 class="mb-4">¡Hola de nuevo, ${data.name}!</h1>
                    <p class="text-secondary mb-8">Encontré tu Master Prompt guardado. ¿Qué quieres hacer?</p>

                    <div class="flex justify-center gap-4 flex-wrap">
                        <button class="btn btn-primary btn-lg" id="continue-btn">
                            ✏️ Continuar editando
                        </button>
                        <button class="btn btn-secondary btn-lg" id="new-btn">
                            🆕 Empezar de nuevo
                        </button>
                    </div>

                    <div class="card mt-8" style="max-width: 600px; margin: 32px auto 0; text-align: left;">
                        <h5 class="mb-4">📄 Tu último prompt guardado:</h5>
                        <div class="preview-content" style="max-height: 200px; overflow-y: auto;">
                            ${generateMasterPrompt(data).substring(0, 500)}...
                        </div>
                    </div>
                </div>
            </div >
            `;

        document.getElementById('continue-btn').addEventListener('click', () => this.showWizard());
        document.getElementById('new-btn').addEventListener('click', () => {
            storage.clear();
            this.showOnboarding();
        });
    }

    showOnboarding() {
        this.currentView = 'onboarding';
        this.app.innerHTML = `
            < div class="onboarding container" style = "min-height: 100vh; padding: 60px 20px;" >
                <div class="text-center mb-12 animate-fade-in-up">
                    <h1 class="mb-4">¿Cómo quieres empezar?</h1>
                    <p class="text-secondary">Elige la opción que mejor se adapte a ti</p>
                </div>
                
                <div class="onboarding-options" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; max-width: 1000px; margin: 0 auto;">
                    
                    <div class="card card-clickable animate-fade-in-up stagger-1" id="opt-scratch">
                        <div class="emoji-icon">🆕</div>
                        <h4 class="mb-2">Empezar de cero</h4>
                        <p class="text-secondary">Wizard guiado paso a paso con ejemplos para elegir. Ideal si nunca has creado un Master Prompt.</p>
                        <span class="badge mt-4">Recomendado para nuevos</span>
                    </div>
                    
                    <div class="card card-clickable animate-fade-in-up stagger-2" id="opt-import">
                        <div class="emoji-icon">📄</div>
                        <h4 class="mb-2">Importar mi Master Prompt</h4>
                        <p class="text-secondary">¿Ya tienes un prompt? Pégalo aquí y lo parseamos para que puedas editarlo y mejorarlo.</p>
                        <span class="badge mt-4">Para usuarios existentes</span>
                    </div>
                    
                    <div class="card card-clickable animate-fade-in-up stagger-3" id="opt-memories">
                        <div class="emoji-icon">🧠</div>
                        <h4 class="mb-2">Importar de ChatGPT</h4>
                        <p class="text-secondary">Pega tus memorias de ChatGPT y extraemos automáticamente tu información.</p>
                        <span class="badge mt-4">¡ChatGPT ya te conoce!</span>
                    </div>
                    
                    <div class="card card-clickable animate-fade-in-up stagger-4" id="opt-linkedin">
                        <div class="emoji-icon">🔗</div>
                        <h4 class="mb-2">Importar de LinkedIn</h4>
                        <p class="text-secondary">Conecta tu perfil de LinkedIn para pre-llenar tu información profesional.</p>
                        <span class="badge mt-4">Próximamente</span>
                    </div>
                    
                </div>
                
                <div class="text-center mt-8">
                    <button class="btn btn-secondary" id="back-landing">← Volver al inicio</button>
                </div>
            </div >
            `;

        document.getElementById('opt-scratch').addEventListener('click', () => this.showWizard());
        document.getElementById('opt-import').addEventListener('click', () => this.showImportPrompt());
        document.getElementById('opt-memories').addEventListener('click', () => this.showImportMemories());
        document.getElementById('opt-linkedin').addEventListener('click', () => this.showComingSoon('LinkedIn'));
        document.getElementById('back-landing').addEventListener('click', () => this.showLanding());
    }

    showImportPrompt() {
        this.app.innerHTML = `
            < div class="import-prompt container" style = "max-width: 800px; min-height: 100vh; padding: 60px 20px;" >
                <div class="text-center mb-8 animate-fade-in-up">
                    <h1 class="mb-4">📄 Importar tu Master Prompt</h1>
                    <p class="text-secondary">Pega tu Master Prompt existente y lo analizaremos para pre-llenar el wizard.</p>
                </div>
                
                <div class="card animate-fade-in-up">
                    <textarea class="input textarea" id="import-text" placeholder="Pega aquí tu Master Prompt existente..." style="min-height: 300px;"></textarea>
                    
                    <div class="flex gap-4 justify-center mt-6">
                        <button class="btn btn-secondary" id="back-onboarding">← Volver</button>
                        <button class="btn btn-primary" id="analyze-prompt">🔍 Analizar y continuar</button>
                    </div>
                </div>
            </div >
            `;

        document.getElementById('back-onboarding').addEventListener('click', () => this.showOnboarding());
        document.getElementById('analyze-prompt').addEventListener('click', () => {
            const text = document.getElementById('import-text').value;
            if (text.trim()) {
                this.parseExistingPrompt(text);
            }
        });
    }

    showImportMemories() {
        this.app.innerHTML = `
            < div class="import-memories container" style = "max-width: 800px; min-height: 100vh; padding: 60px 20px;" >
                <div class="text-center mb-8 animate-fade-in-up">
                    <h1 class="mb-4">🧠 Importar Memorias de ChatGPT</h1>
                    <p class="text-secondary">ChatGPT ha aprendido sobre ti en cientos de conversaciones. ¡Usemos esa información!</p>
                </div>
                
                <div class="card animate-fade-in-up mb-6">
                    <h4 class="mb-4">📋 Cómo obtener tus memorias:</h4>
                    <ol style="line-height: 2; color: var(--color-text-secondary);">
                        <li>Abre ChatGPT → Settings → Personalization</li>
                        <li>Click en "Manage Memory"</li>
                        <li>Copia todas las memorias (o exporta si está disponible)</li>
                        <li>Pégalas abajo</li>
                    </ol>
                </div>
                
                <div class="card animate-fade-in-up">
                    <textarea class="input textarea" id="memories-text" placeholder="Pega aquí tus memorias de ChatGPT..." style="min-height: 250px;"></textarea>
                    
                    <div class="flex gap-4 justify-center mt-6">
                        <button class="btn btn-secondary" id="back-onboarding">← Volver</button>
                        <button class="btn btn-primary" id="analyze-memories">🔍 Analizar memorias</button>
                    </div>
                </div>
            </div >
            `;

        document.getElementById('back-onboarding').addEventListener('click', () => this.showOnboarding());
        document.getElementById('analyze-memories').addEventListener('click', () => {
            const text = document.getElementById('memories-text').value;
            if (text.trim()) {
                this.parseMemories(text);
            }
        });
    }

    parseExistingPrompt(text) {
        // Parsing básico del prompt existente
        const data = {
            name: '',
            role: '',
            company: '',
            bio: '',
            industry: '',
            responsibilities: '',
            expertise: [],
            stack: [],
            communicationStyle: '',
            formality: 50,
            detailLevel: 50,
            language: 'Español',
            alwaysRules: [],
            neverRules: [],
            projects: [],
            customNotes: text
        };

        // Extraer nombre
        const nameMatch = text.match(/(?:nombre|name|soy|me llamo)[:\s]+([^\n,]+)/i);
        if (nameMatch) data.name = nameMatch[1].trim();

        // Extraer rol
        const roleMatch = text.match(/(?:rol|role|trabajo como|soy)[:\s]+([^\n,]+)/i);
        if (roleMatch) data.role = roleMatch[1].trim();

        // Guardar y continuar al wizard
        storage.save(data);
        this.showWizard();
    }

    parseMemories(text) {
        // Parsing de memorias de ChatGPT
        const data = {
            name: '',
            role: '',
            company: '',
            bio: '',
            industry: '',
            responsibilities: '',
            expertise: [],
            stack: [],
            communicationStyle: '',
            formality: 50,
            detailLevel: 50,
            language: 'Español',
            alwaysRules: [],
            neverRules: [],
            projects: [],
            customNotes: ''
        };

        // Las memorias de ChatGPT suelen tener formato "User prefers X" o "User's name is X"
        const lines = text.split('\n').filter(l => l.trim());

        lines.forEach(line => {
            const lower = line.toLowerCase();

            if (lower.includes('name is') || lower.includes('nombre es')) {
                const match = line.match(/(?:name is|nombre es)[:\s]+([^\n.]+)/i);
                if (match) data.name = match[1].trim();
            }

            if (lower.includes('works as') || lower.includes('trabaja como')) {
                const match = line.match(/(?:works as|trabaja como)[:\s]+([^\n.]+)/i);
                if (match) data.role = match[1].trim();
            }

            if (lower.includes('prefers') || lower.includes('prefiere')) {
                // Agregar a reglas
                data.alwaysRules.push(line.replace(/user\s+/i, '').trim());
            }
        });

        // Guardar y continuar
        storage.save(data);
        this.showWizard();
    }

    showComingSoon(feature) {
        this.app.innerHTML = `
            < div class="coming-soon container text-center" style = "min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 40px 20px;" >
                <div class="animate-scale-in">
                    <div class="emoji-icon" style="font-size: 4rem;">🚧</div>
                    <h1 class="mb-4">Importar desde ${feature}</h1>
                    <p class="text-secondary mb-8">Esta función estará disponible próximamente.</p>
                    <button class="btn btn-primary" id="back-onboarding">← Elegir otra opción</button>
                </div>
            </div >
            `;

        document.getElementById('back-onboarding').addEventListener('click', () => this.showOnboarding());
    }

    showLearnMore() {
        this.app.innerHTML = `
            < div class="learn-more container" style = "max-width: 800px; min-height: 100vh; padding: 60px 20px;" >
                <button class="btn btn-secondary mb-8" id="back-landing">← Volver</button>
                
                <article class="animate-fade-in-up">
                    <h1 class="mb-6">¿Qué es un Master Prompt?</h1>
                    
                    <p class="text-lg mb-6">
                        Un <strong>Master Prompt</strong> es un documento que contiene toda la información que un AI necesita saber sobre ti para darte las mejores respuestas posibles.
                    </p>
                    
                    <h3 class="mb-4">🤔 El problema</h3>
                    <p class="mb-6">
                        Cada vez que abres un chat nuevo con ChatGPT, Claude u otro AI, tienes que explicar desde cero quién eres, qué haces, cómo te gusta recibir respuestas, etc. Es tedioso y pierdes tiempo valioso.
                    </p>
                    
                    <h3 class="mb-4">💡 La solución</h3>
                    <p class="mb-6">
                        Un Master Prompt es como tu "manual de usuario personal". Lo pegas al inicio de cada conversación (o lo configuras en Custom Instructions) y el AI ya sabe exactamente cómo ayudarte.
                    </p>
                    
                    <h3 class="mb-4">✨ ¿Qué incluye?</h3>
                    <ul class="mb-6" style="line-height: 2;">
                        <li>👤 Quién eres (nombre, rol, empresa)</li>
                        <li>🎯 Tu contexto profesional</li>
                        <li>🛠️ Las herramientas que usas</li>
                        <li>💬 Cómo te gusta recibir respuestas</li>
                        <li>⚡ Reglas específicas (lo que siempre/nunca quieres)</li>
                        <li>📁 Tus proyectos activos</li>
                    </ul>
                    
                    <div class="card" style="background: var(--color-accent-gradient); border: none; padding: 30px;">
                        <h3 class="mb-4" style="color: white;">¿Listo para crear el tuyo?</h3>
                        <button class="btn btn-lg" id="start-wizard" style="background: white; color: #667EEA;">
                            ⚡ Crear mi Master Prompt
                        </button>
                    </div>
                </article>
            </div >
            `;

        document.getElementById('back-landing').addEventListener('click', () => this.showLanding());
        document.getElementById('start-wizard').addEventListener('click', () => this.showOnboarding());
    }

    showWizard() {
        this.currentView = 'wizard';
        this.app.innerHTML = `
            < div class="wizard-page" style = "min-height: 100vh; padding: 40px 20px;" >
                <div class="split-layout container-lg">
                    <div id="wizard-container"></div>
                    <div id="preview-container" class="preview-panel"></div>
                </div>
            </div >
            `;

        const wizardContainer = document.getElementById('wizard-container');
        const previewContainer = document.getElementById('preview-container');

        this.wizard = new WizardManager(
            wizardContainer,
            previewContainer,
            (data) => this.showExportOptions(data)
        );
    }

    showExportOptions(data) {
        this.currentView = 'export';
        const prompt = generateMasterPrompt(data);

        this.app.innerHTML = `
            < div class="export-page container" style = "max-width: 800px; min-height: 100vh; padding: 60px 20px;" >
                <div class="text-center mb-12 animate-fade-in-up">
                    <div class="emoji-icon" style="font-size: 4rem;">🎉</div>
                    <h1 class="mb-4">¡Tu Master Prompt está listo!</h1>
                    <p class="text-secondary">Elige cómo quieres exportarlo</p>
                </div>
                
                <div class="export-options" style="display: grid; gap: 16px; margin-bottom: 40px;">
                    <div class="card card-clickable animate-fade-in-up stagger-1" id="export-copy">
                        <div class="flex items-center gap-4">
                            <span style="font-size: 2rem;">📋</span>
                            <div>
                                <h4>Copiar al clipboard</h4>
                                <p class="text-secondary mb-0">Listo para pegar en cualquier AI</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card card-clickable animate-fade-in-up stagger-2" id="export-md">
                        <div class="flex items-center gap-4">
                            <span style="font-size: 2rem;">📝</span>
                            <div>
                                <h4>Descargar Markdown</h4>
                                <p class="text-secondary mb-0">Archivo .md para GitHub, Notion, Obsidian</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card card-clickable animate-fade-in-up stagger-3" id="export-pdf">
                        <div class="flex items-center gap-4">
                            <span style="font-size: 2rem;">📄</span>
                            <div>
                                <h4>Exportar a PDF</h4>
                                <p class="text-secondary mb-0">Con instrucciones de uso incluidas</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card card-clickable animate-fade-in-up stagger-4" id="export-chatgpt">
                        <div class="flex items-center gap-4">
                            <span style="font-size: 2rem;">🤖</span>
                            <div>
                                <h4>Versión ChatGPT</h4>
                                <p class="text-secondary mb-0">Optimizado para Custom Instructions</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card card-clickable animate-fade-in-up stagger-5" id="export-github" style="border: 1px dashed var(--glass-border);">
                        <div class="flex items-center gap-4">
                            <span style="font-size: 2rem;">🐙</span>
                            <div>
                                <h4>Sincronizar con GitHub</h4>
                                <p class="text-secondary mb-0">Versionado automático (próximamente)</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="flex justify-center gap-4">
                    <button class="btn btn-secondary" id="back-wizard">← Editar más</button>
                    <button class="btn btn-primary" id="new-prompt">🆕 Crear otro</button>
                </div>
                
                <!--Toast -->
            <div id="toast" class="toast" style="display: none; position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); background: var(--color-success); color: white; padding: 16px 24px; border-radius: 12px; font-weight: 600;">
                ✓ Copiado al clipboard
            </div>
            </div >
            `;

        // Event listeners
        document.getElementById('export-copy').addEventListener('click', async () => {
            await exportFunctions.copyToClipboard(prompt);
            this.showToast('✓ Copiado al clipboard');
        });

        document.getElementById('export-md').addEventListener('click', () => {
            exportFunctions.exportMarkdown(data);
            this.showToast('✓ Descargando archivo...');
        });

        document.getElementById('export-pdf').addEventListener('click', () => {
            exportFunctions.exportPDF(data);
        });

        document.getElementById('export-chatgpt').addEventListener('click', async () => {
            const chatgptVersion = generateMasterPrompt(data); // Usar versión completa
            await exportFunctions.copyToClipboard(chatgptVersion);
            this.showToast('✓ Versión ChatGPT copiada');
        });

        document.getElementById('export-github').addEventListener('click', () => {
            this.showComingSoon('GitHub');
        });

        document.getElementById('back-wizard').addEventListener('click', () => this.showWizard());
        document.getElementById('new-prompt').addEventListener('click', () => {
            storage.clear();
            this.showOnboarding();
        });
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = message;
            toast.style.display = 'block';
            setTimeout(() => {
                toast.classList.add('exit');
                setTimeout(() => {
                    toast.style.display = 'none';
                    toast.classList.remove('exit');
                }, 300);
            }, 2000);
        }
    }
}

// Iniciar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    window.mpbApp = new MPBApp();
});
