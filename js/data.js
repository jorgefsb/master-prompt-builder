// ========================================
// MPB - Data & Templates
// Ejemplos predefinidos y templates
// ========================================

export const ROLES = [
    { id: 'developer', emoji: '👨‍💻', label: 'Desarrollador', context: 'Escribo código, desarrollo software y soluciones técnicas.' },
    { id: 'entrepreneur', emoji: '👨‍💼', label: 'Emprendedor', context: 'Fundador/CEO construyendo productos y liderando equipos.' },
    { id: 'designer', emoji: '🎨', label: 'Diseñador', context: 'Creo experiencias visuales, UI/UX y productos digitales.' },
    { id: 'marketing', emoji: '📊', label: 'Marketing', context: 'Estrategia de crecimiento, contenido y adquisición de usuarios.' },
    { id: 'educator', emoji: '👩‍🏫', label: 'Educador', context: 'Enseño, creo contenido educativo y facilito aprendizaje.' },
    { id: 'writer', emoji: '✍️', label: 'Escritor', context: 'Creo contenido escrito, copywriting y narrativas.' },
    { id: 'consultant', emoji: '📈', label: 'Consultor', context: 'Asesoro empresas en estrategia y mejora de procesos.' },
    { id: 'creative', emoji: '🎵', label: 'Creativo', context: 'Produzco contenido artístico, música, video o multimedia.' },
    { id: 'pm', emoji: '📋', label: 'Product Manager', context: 'Defino roadmaps, priorizo features y coordino equipos.' },
    { id: 'data', emoji: '📉', label: 'Data/Analytics', context: 'Analizo datos, creo dashboards y tomo decisiones basadas en métricas.' },
];

export const INDUSTRIES = [
    { id: 'startup', emoji: '🚀', label: 'Startup Tech', description: 'Ritmo rápido, iteración constante, métricas de crecimiento.' },
    { id: 'corporate', emoji: '🏢', label: 'Corporativo', description: 'Procesos establecidos, stakeholders múltiples, escala.' },
    { id: 'freelancer', emoji: '🎨', label: 'Freelancer', description: 'Múltiples clientes, gestión de tiempo, versatilidad.' },
    { id: 'academic', emoji: '📚', label: 'Académico', description: 'Investigación, publicaciones, metodología rigurosa.' },
    { id: 'agency', emoji: '🏛️', label: 'Agencia', description: 'Proyectos para clientes, deadlines, presentaciones.' },
    { id: 'nonprofit', emoji: '💚', label: 'ONG/Nonprofit', description: 'Impacto social, recursos limitados, stakeholders diversos.' },
];

export const TECH_STACK = [
    // Frontend
    { id: 'react', label: 'React', category: 'frontend' },
    { id: 'vue', label: 'Vue.js', category: 'frontend' },
    { id: 'angular', label: 'Angular', category: 'frontend' },
    { id: 'nextjs', label: 'Next.js', category: 'frontend' },
    { id: 'svelte', label: 'Svelte', category: 'frontend' },
    // Backend
    { id: 'nodejs', label: 'Node.js', category: 'backend' },
    { id: 'python', label: 'Python', category: 'backend' },
    { id: 'go', label: 'Go', category: 'backend' },
    { id: 'java', label: 'Java', category: 'backend' },
    { id: 'rust', label: 'Rust', category: 'backend' },
    { id: 'php', label: 'PHP', category: 'backend' },
    // Mobile
    { id: 'reactnative', label: 'React Native', category: 'mobile' },
    { id: 'flutter', label: 'Flutter', category: 'mobile' },
    { id: 'swift', label: 'Swift/iOS', category: 'mobile' },
    { id: 'kotlin', label: 'Kotlin/Android', category: 'mobile' },
    // Tools
    { id: 'figma', label: 'Figma', category: 'design' },
    { id: 'notion', label: 'Notion', category: 'productivity' },
    { id: 'slack', label: 'Slack', category: 'communication' },
    { id: 'github', label: 'GitHub', category: 'development' },
    { id: 'vscode', label: 'VS Code', category: 'development' },
    { id: 'cursor', label: 'Cursor', category: 'development' },
    // AI
    { id: 'chatgpt', label: 'ChatGPT', category: 'ai' },
    { id: 'claude', label: 'Claude', category: 'ai' },
    { id: 'gemini', label: 'Gemini', category: 'ai' },
    { id: 'copilot', label: 'GitHub Copilot', category: 'ai' },
    // Data
    { id: 'postgres', label: 'PostgreSQL', category: 'database' },
    { id: 'mongodb', label: 'MongoDB', category: 'database' },
    { id: 'supabase', label: 'Supabase', category: 'database' },
    { id: 'firebase', label: 'Firebase', category: 'database' },
    // Cloud
    { id: 'aws', label: 'AWS', category: 'cloud' },
    { id: 'vercel', label: 'Vercel', category: 'cloud' },
    { id: 'gcp', label: 'Google Cloud', category: 'cloud' },
];

export const COMMUNICATION_STYLES = [
    { id: 'direct', emoji: '🎯', label: 'Directo al punto', description: 'Respuestas concisas, sin rodeos.' },
    { id: 'explanatory', emoji: '📚', label: 'Explicativo', description: 'Contexto y razonamiento incluidos.' },
    { id: 'collaborative', emoji: '🤝', label: 'Colaborativo', description: 'Preguntas de seguimiento, diálogo.' },
    { id: 'structured', emoji: '📋', label: 'Estructurado', description: 'Listas, pasos numerados, headers.' },
];

export const ALWAYS_RULES = [
    { id: 'code_examples', label: 'Dar ejemplos de código', default: false },
    { id: 'explain_why', label: 'Explicar el porqué', default: true },
    { id: 'suggest_alternatives', label: 'Sugerir alternativas', default: true },
    { id: 'use_emojis', label: 'Usar emojis', default: false },
    { id: 'use_markdown', label: 'Formatear con markdown', default: true },
    { id: 'be_proactive', label: 'Ser proactivo', default: true },
    { id: 'ask_clarification', label: 'Pedir clarificación si hay dudas', default: true },
    { id: 'spanish', label: 'Responder en español', default: false },
    { id: 'english', label: 'Responder en inglés', default: false },
];

export const NEVER_RULES = [
    { id: 'no_apologize', label: 'Disculparse excesivamente', default: true },
    { id: 'no_long_responses', label: 'Respuestas muy largas innecesarias', default: false },
    { id: 'no_assume', label: 'Asumir contexto que no tengo', default: true },
    { id: 'no_jargon', label: 'Usar jerga innecesaria', default: false },
    { id: 'no_repeat', label: 'Repetir lo que ya dije', default: true },
    { id: 'no_obvious', label: 'Explicar cosas obvias', default: false },
    { id: 'no_placeholder', label: 'Usar placeholders o código incompleto', default: false },
];

export const PROJECT_TEMPLATES = [
    { id: 'webapp', emoji: '🌐', label: 'Web App', description: 'Aplicación web con frontend y backend.' },
    { id: 'mobileapp', emoji: '📱', label: 'Mobile App', description: 'App nativa o híbrida para iOS/Android.' },
    { id: 'aiml', emoji: '🤖', label: 'AI/ML', description: 'Proyecto de inteligencia artificial o machine learning.' },
    { id: 'dashboard', emoji: '📊', label: 'Dashboard', description: 'Panel de control, analytics, visualización.' },
    { id: 'content', emoji: '✍️', label: 'Contenido', description: 'Blog, newsletter, contenido educativo.' },
    { id: 'ecommerce', emoji: '🛒', label: 'E-commerce', description: 'Tienda online, marketplace.' },
    { id: 'saas', emoji: '☁️', label: 'SaaS', description: 'Software as a Service, suscripciones.' },
    { id: 'automation', emoji: '⚡', label: 'Automatización', description: 'Scripts, workflows, integraciones.' },
];

export const WIZARD_STEPS = [
    { id: 1, title: 'Identidad', emoji: '👤', description: 'Quién eres y tu rol principal' },
    { id: 2, title: 'Contexto', emoji: '🎯', description: 'Tu industria y responsabilidades' },
    { id: 3, title: 'Stack', emoji: '🛠️', description: 'Herramientas que usas' },
    { id: 4, title: 'Comunicación', emoji: '💬', description: 'Cómo prefieres las respuestas' },
    { id: 5, title: 'Reglas', emoji: '⚡', description: 'Lo que siempre/nunca quieres' },
    { id: 6, title: 'Proyectos', emoji: '📁', description: 'En qué estás trabajando' },
    { id: 7, title: 'Revisión', emoji: '✨', description: 'Revisa y ajusta tu prompt' },
];
