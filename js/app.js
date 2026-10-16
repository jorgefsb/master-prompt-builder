// ========================================
// MPB - Main Application
// Entry point y orquestación
// ========================================

import WizardManager from './wizard.js';
import { generateMasterPrompt } from './generator.js';
import exportFunctions from './export.js';
import storage from './storage.js';
import { supabase, saveLead } from './supabase.js';

class MPBApp {
    constructor() {
        this.app = document.getElementById('app');
        this.currentView = 'landing'; // landing, onboarding, wizard, export
        this.init();
    }

    async init() {
        // Verificar sesión de Supabase
        const { data: { session } } = await supabase.auth.getSession();
        this.user = session?.user || null;

        // Verificar si hay datos guardados localmente
        const savedData = storage.load();

        if (this.user) {
            this.handleUserLoggedIn(this.user);
        } else if (savedData && savedData.name) {
            this.showWelcomeBack(savedData);
        } else {
            this.showLanding();
        }

        // Suscribirse a cambios de autenticación
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                this.user = session.user;
                this.handleUserLoggedIn(this.user);
            } else if (event === 'SIGNED_OUT') {
                this.user = null;
                this.showLanding();
            }
        });
    }

    async handleUserLoggedIn(user) {
        // Intentar obtener perfil de Supabase
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profile && profile.dna_content) {
            // Usuario con DNA guardado
            this.showLanding(); // O dashboard
        } else {
            this.showLanding();
        }
    }

    async handleLogin() {
        this.app.innerHTML = `
            <div class="onboarding container text-center" style="min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 40px 20px;">
                <div class="animate-fade-in-up">
                    <div style="font-size: 4rem; margin-bottom: 24px;">⚡</div>
                    <h1 class="mb-4">Acceso VIP</h1>
                    <p class="text-secondary mb-12">Ingresa tu email para guardar tu DNA Digital y recibir actualizaciones exclusivas.</p>
                    
                    <div class="flex flex-col gap-4" style="max-width: 400px; margin: 0 auto;">
                        <input type="email" class="input" id="vip-email" placeholder="tu@email.com" style="padding: 16px 20px; font-size: 1.1rem; text-align: center; border-radius: 12px;">
                        <div id="vip-error" style="color: #ff5f56; font-size: 0.9rem; display: none;"></div>
                        <button class="btn btn-cta btn-lg w-full" id="vip-submit" style="padding: 16px; font-size: 1.1rem;">
                            🚀 Crear mi DNA Digital
                        </button>
                        <button class="btn btn-sm mt-4" id="back-from-login" style="background: transparent; opacity: 0.6;">← Volver al inicio</button>
                    </div>
                </div>
            </div>
        `;

        const emailInput = document.getElementById('vip-email');
        const errorDiv = document.getElementById('vip-error');

        document.getElementById('vip-submit').addEventListener('click', async () => {
            const email = emailInput.value.trim();
            if (!email || !email.includes('@')) {
                errorDiv.textContent = 'Por favor ingresa un email válido';
                errorDiv.style.display = 'block';
                return;
            }
            errorDiv.style.display = 'none';
            
            // Save lead to Supabase
            const result = await saveLead(email, 'vip-access');
            
            // Store email locally for the session
            storage.save({ vipEmail: email });
            
            // Proceed to onboarding
            this.showOnboarding();
        });

        emailInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') document.getElementById('vip-submit').click();
        });

        document.getElementById('back-from-login').addEventListener('click', () => this.showLanding());
    }

    async signInWithProvider(provider) {
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) console.error('Error loggin in:', error);
    }

    showLanding() {
        this.currentView = 'landing';
        this.app.innerHTML = `
            <div class="landing-page">
                <!-- Background Effects -->
                <div class="bg-grid"></div>
                <div class="data-node node-1"></div>
                <div class="data-node node-2"></div>
                <div class="data-node node-3"></div>

                <header class="landing-header">
                    <div class="site-home-bar">
                        <a class="site-home-link" href="https://jorgesuarez.com.mx/">← JorgeSuarez.com.mx</a>
                    </div>
                    <nav class="container flex justify-between items-center" style="padding: 16px 24px; position: relative; z-index: 10;">
                        <div class="logo logo-animated" style="font-size: 1.6rem; font-weight: 800; letter-spacing: -1px;">
                            ⚡ <span style="letter-spacing: 2px;">MPB</span>
                        </div>
                        <div class="flex gap-4">
                            <a href="#how-it-works" class="btn btn-secondary btn-sm" style="background: transparent;">¿Cómo funciona?</a>
                            <button class="btn btn-primary btn-sm" id="login-btn">Acceso VIP</button>
                        </div>
                    </nav>
                </header>
                
                <!-- Hero: WHAT & WHO -->
                <main class="landing-hero container" style="padding: 60px 20px; display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; z-index: 5;">
                    <div class="animate-fade-in-up stagger-1">
                        <span class="badge mb-4" style="padding: 6px 14px; font-size: 0.8rem; background: rgba(255, 217, 61, 0.1); color: var(--color-cta); border: 1px solid rgba(255, 217, 61, 0.2); letter-spacing: 1px;">
                            PARA PROFESIONALES QUE DOMINAN LA IA
                        </span>
                    </div>
                    
                    <h1 class="animate-fade-in-up stagger-2 mb-4" style="max-width: 950px; line-height: 1.1; font-size: clamp(2.5rem, 6vw, 4.2rem); font-weight: 900;">
                        No más chats vacíos. <br>
                        Tu IA por fin <span class="text-gradient">te conoce.</span>
                    </h1>
                    
                    <p class="animate-fade-in-up stagger-3 mb-10" style="font-size: 1.4rem; max-width: 750px; color: var(--color-text-secondary); line-height: 1.6; font-weight: 400;">
                        Diseña tu <strong>Master Prompt</strong> en minutos. Un motor de identidad digital que inyecta tu DNA profesional en cada sesión de ChatGPT, Claude o Gemini.
                    </p>
                    
                    <div class="animate-fade-in-up stagger-4 flex justify-center gap-6 mb-12">
                        <button class="btn btn-cta btn-lg" id="start-btn" style="padding: 20px 48px; font-size: 1.3rem;">
                            ⚡ Crear mi DNA Digital Gratis
                        </button>
                    </div>

                    <!-- Mock Preview: WHAT -->
                    <div class="animate-fade-in-up stagger-5" style="width: 100%; max-width: 800px; position: relative;">
                        <div class="card" style="padding: 24px; background: rgba(10, 10, 15, 0.8); border: 1px solid var(--glass-border); border-radius: 20px; box-shadow: 0 30px 60px rgba(0,0,0,0.5); text-align: left; overflow: hidden;">
                            <div style="display: flex; gap: 8px; margin-bottom: 20px; border-bottom: 1px solid var(--glass-border); padding-bottom: 12px;">
                                <div style="width: 12px; height: 12px; border-radius: 50%; background: #ff5f56;"></div>
                                <div style="width: 12px; height: 12px; border-radius: 50%; background: #ffbd2e;"></div>
                                <div style="width: 12px; height: 12px; border-radius: 50%; background: #27c93f;"></div>
                                <span style="margin-left: 10px; font-size: 0.75rem; color: var(--color-text-tertiary); font-family: monospace;">mi_identidad_profesional.md</span>
                            </div>
                            <div style="font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; line-height: 1.8;">
                                <span style="color: #667EEA;"># MI ARCHITECTURA MENTAL</span><br>
                                <span style="color: var(--color-text-secondary);">Actúa como un CTO orientado a escalabilidad y seguridad.</span><br>
                                <span style="color: #667EEA;"># PREFERENCIAS DE COMUNICACIÓN</span><br>
                                <span style="color: var(--color-text-secondary);">Tono directo, técnico, sin introducciones ni despedidas.</span><br>
                                <span style="color: #667EEA;"># REGLAS DE EJECUCIÓN</span><br>
                                <span style="color: var(--color-text-secondary);">1. Si el código no tiene tests unitarios, no lo entregues.</span><br>
                                <span style="color: var(--color-text-secondary);">2. Optimiza para legibilidad por encima de complejidad.</span>
                            </div>
                            <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 60px; background: linear-gradient(transparent, #0a0a0f); border-radius: 0 0 20px 20px;"></div>
                        </div>
                    </div>
                </main>

                <!-- Why/When: THE PAIN -->
                <section id="how-it-works" class="container" style="padding: 80px 20px; position: relative; z-index: 5;">
                    <div class="text-center mb-16">
                        <h2 style="font-size: 2.5rem; margin-bottom: 20px;">¿Por qué sigues presentándote?</h2>
                        <p style="color: var(--color-text-secondary); font-size: 1.2rem; max-width: 600px; margin: 0 auto;">La IA tiene amnesia selectiva. Y eso te está drenando la energía.</p>
                    </div>

                    <div class="flex split-layout items-center gap-12" style="background: rgba(255, 68, 68, 0.02); border: 1px solid rgba(255, 68, 68, 0.1); border-radius: 32px; padding: 40px;">
                        <div class="animate-slide-in-left" style="flex: 1;">
                            <h3 class="mb-4" style="font-size: 2rem; font-weight: 800; color: #ff5f56;">La Frustración del Eterno Extraño</h3>
                            <p class="mb-6" style="font-size: 1.15rem; line-height: 1.7;">Cada nuevo chat es una página en blanco. Un desconocido que no sabe qué herramientas usas, cómo hablas ni cuáles son tus estándares de calidad.</p>
                            
                            <div class="flex flex-col gap-4">
                                <div style="display: flex; gap: 16px; align-items: flex-start; background: rgba(255, 255, 255, 0.03); padding: 16px; border-radius: 12px;">
                                    <span style="color: var(--color-error); font-size: 1.2rem; font-weight: bold;">✗</span>
                                    <div>
                                        <h5 style="color: var(--color-text-primary);">Pérdida de Tiempo (When)</h5>
                                        <p style="font-size: 0.95rem; opacity: 0.7;">15 minutos explicando tu contexto en cada sesión diaria.</p>
                                    </div>
                                </div>
                                <div style="display: flex; gap: 16px; align-items: flex-start; background: rgba(255, 255, 255, 0.03); padding: 16px; border-radius: 12px;">
                                    <span style="color: var(--color-error); font-size: 1.2rem; font-weight: bold;">✗</span>
                                    <div>
                                        <h5 style="color: var(--color-text-primary);">Resultados Genéricos (Why)</h5>
                                        <p style="font-size: 0.95rem; opacity: 0.7;">Recibes respuestas de "manual" que no sirven para tu realidad.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card animate-slide-in-right" style="flex: 1; border-color: rgba(239, 68, 68, 0.2); background: #0c0c14; padding: 32px;">
                            <div style="font-family: 'JetBrains Mono', monospace; font-size: 0.9rem;">
                                <div class="mb-4" style="color: var(--color-text-tertiary); border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">CASO REAL: SIN MASTER PROMPT</div>
                                <div class="mb-2" style="color: #667EEA;">> Tú: Necesito el esquema de...</div>
                                <div class="mb-4" style="opacity: 0.6;">AI: Claro, aquí tienes un ejemplo genérico usando bibliotecas que no usas...</div>
                                <div class="mb-2" style="color: #667EEA;">>> Tú: No, recuerda que uso SQL y preferimos...</div>
                                <div style="color: var(--color-error); font-weight: bold;">[TIEMPO PERDIDO: 8 MINUTOS]</div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- How: PROCESS -->
                <section class="container" style="padding: 80px 20px;">
                    <div class="text-center mb-16">
                        <h2 style="font-size: 2.5rem; margin-bottom: 20px;">Diseña tu DNA en 3 pasos</h2>
                        <p style="color: var(--color-text-secondary); font-size: 1.2rem;">Un proceso quirúrgico para extraer tu valor profesional.</p>
                    </div>

                    <div class="features-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px;">
                        <div class="card animate-fade-in-up stagger-1" style="padding: 40px; border-radius: 24px;">
                            <div style="font-size: 0.8rem; color: var(--color-accent-primary); font-weight: 800; margin-bottom: 16px;">PASO 01</div>
                            <h4 style="font-size: 1.5rem; margin-bottom: 12px;">Extracción de Contexto</h4>
                            <p style="color: var(--color-text-secondary); line-height: 1.6;">Define quién eres: roles, stack, industria y manías. Lo que te hace único en tu trabajo.</p>
                        </div>
                        <div class="card animate-fade-in-up stagger-2" style="padding: 40px; border-radius: 24px;">
                            <div style="font-size: 0.8rem; color: var(--color-accent-primary); font-weight: 800; margin-bottom: 16px;">PASO 02</div>
                            <h4 style="font-size: 1.5rem; margin-bottom: 12px;">Reglas de Ejecución</h4>
                            <p style="color: var(--color-text-secondary); line-height: 1.6;">Establece tus "Siempre" y "Nunca". Dicta cómo debe comportarse tu IA en cada respuesta.</p>
                        </div>
                        <div class="card animate-fade-in-up stagger-3" style="padding: 40px; border-radius: 24px;">
                            <div style="font-size: 0.8rem; color: var(--color-accent-primary); font-weight: 800; margin-bottom: 16px;">PASO 03</div>
                            <h4 style="font-size: 1.5rem; margin-bottom: 12px;">Exportación Vital</h4>
                            <p style="color: var(--color-text-secondary); line-height: 1.6;">Copia tu DNA Digital y pégalo en tus Custom Instructions o System Prompts. Listo para siempre.</p>
                        </div>
                    </div>
                </section>

                <!-- Who: SEGMENTS -->
                <section class="container" style="padding: 60px 20px; text-center">
                    <div style="background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 40px; padding: 60px 20px; text-align: center;">
                        <h2 style="font-size: 2rem; margin-bottom: 40px;">¿Para quién es este estándar?</h2>
                        <div class="flex justify-center gap-10 flex-wrap">
                            <div style="width: 200px;">
                                <div style="font-size: 2.5rem; margin-bottom: 16px;">💼</div>
                                <h5 style="margin-bottom: 8px;">Founders</h5>
                                <p style="font-size: 0.85rem; opacity: 0.6;">Estrategias alineadas a su visión de negocio.</p>
                            </div>
                            <div style="width: 200px;">
                                <div style="font-size: 2.5rem; margin-bottom: 16px;">💻</div>
                                <h5 style="margin-bottom: 8px;">Developers</h5>
                                <p style="font-size: 0.85rem; opacity: 0.6;">Código que sigue su arquitectura exacta.</p>
                            </div>
                            <div style="width: 200px;">
                                <div style="font-size: 2.5rem; margin-bottom: 16px;">🖋️</div>
                                <h5 style="margin-bottom: 8px;">Content Leads</h5>
                                <p style="font-size: 0.85rem; opacity: 0.6;">Tono de voz consistente en cada frase.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Where: INTEGRATION -->
                <section class="container text-center" style="padding: 80px 20px;">
                    <p style="font-size: 0.9rem; letter-spacing: 2px; opacity: 0.5; margin-bottom: 40px; text-transform: uppercase; font-weight: 700;">Funciona con todas las AIs</p>
                    <div class="flex justify-center gap-6 flex-wrap">
                        <div class="glass-chip animate-fade-in-up stagger-1">
                            <span class="chip-icon">✨</span> GPT-4o
                        </div>
                        <div class="glass-chip animate-fade-in-up stagger-2">
                            <span class="chip-icon">🧠</span> Claude 3.5
                        </div>
                        <div class="glass-chip animate-fade-in-up stagger-3">
                            <span class="chip-icon">⚡</span> Gemini 1.5
                        </div>
                        <div class="glass-chip animate-fade-in-up stagger-4">
                            <span class="chip-icon">🚀</span> Cursor AI
                        </div>
                        <div class="glass-chip animate-fade-in-up stagger-5">
                            <span class="chip-icon">🔍</span> Perplexity
                        </div>
                    </div>
                </section>

                <!-- CTA Final -->
                <section class="container text-center" style="padding: 100px 20px;">
                    <div class="animate-pulse" style="display: inline-block; margin-bottom: 24px;">🚀</div>
                    <h2 style="font-size: 2.8rem; margin-bottom: 24px; font-weight: 900;">Toma el control de tu <br> relación con la IA.</h2>
                    <p style="color: var(--color-text-secondary); font-size: 1.25rem; max-width: 600px; margin: 0 auto 40px;">No permitas que la IA olvide quién eres hoy. Construye tu DNA Digital ahora.</p>
                    <button class="btn btn-cta btn-lg" id="start-btn-2" style="padding: 24px 60px; font-size: 1.4rem; border-radius: 20px; box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);">
                        Comenzar Gratis
                    </button>
                    <p style="margin-top: 24px; font-size: 0.85rem; opacity: 0.5;">No requiere tarjeta de crédito • 100% Privado</p>
                </section>

                <footer class="container landing-footer">
                    <a class="site-home-link" href="https://jorgesuarez.com.mx/">← JorgeSuarez.com.mx</a>
                    <div class="landing-footer-meta">
                        <p>© 2024 MPB - The Professional Standard for AI Collaboration.</p>
                        <div class="flex gap-6">
                            <a href="#">Privacidad</a>
                            <a href="https://github.com" target="_blank">Github</a>
                        </div>
                    </div>
                </footer>
            </div>
        `;

        // Event listeners
        document.getElementById('start-btn').addEventListener('click', () => this.showOnboarding());
        document.getElementById('start-btn-2').addEventListener('click', () => this.showOnboarding());
        document.getElementById('login-btn').addEventListener('click', () => this.handleLogin());

        // "Cómo funciona" → go to onboarding
        const howBtn = document.querySelector('a[href="#how-it-works"]');
        if (howBtn) {
            howBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showOnboarding();
            });
        }
    }

    showWelcomeBack(data) {
        this.app.innerHTML = `
            <div class="welcome-back container text-center" style="min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 40px 20px;">
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
