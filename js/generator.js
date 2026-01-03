// ========================================
// MPB - Prompt Generator
// Genera el Master Prompt a partir de los datos
// ========================================

export function generateMasterPrompt(data) {
    const sections = [];

    // Header
    sections.push(`# Master Prompt - ${data.name || 'Usuario'}`);
    sections.push('');

    // Identidad
    if (data.name || data.role || data.company) {
        sections.push('## 👤 Identidad');
        if (data.name) sections.push(`- **Nombre**: ${data.name}`);
        if (data.role) sections.push(`- **Rol**: ${data.role}`);
        if (data.company) sections.push(`- **Empresa/Organización**: ${data.company}`);
        if (data.bio) sections.push(`- **Bio**: ${data.bio}`);
        sections.push('');
    }

    // Contexto
    if (data.industry || data.responsibilities) {
        sections.push('## 🎯 Contexto Profesional');
        if (data.industry) sections.push(`- **Industria**: ${data.industry}`);
        if (data.responsibilities) sections.push(`- **Responsabilidades**: ${data.responsibilities}`);
        if (data.expertise && data.expertise.length > 0) {
            sections.push(`- **Áreas de expertise**: ${data.expertise.join(', ')}`);
        }
        sections.push('');
    }

    // Stack
    if (data.stack && data.stack.length > 0) {
        sections.push('## 🛠️ Stack & Herramientas');
        const grouped = groupByCategory(data.stack);
        for (const [category, items] of Object.entries(grouped)) {
            sections.push(`- **${capitalize(category)}**: ${items.join(', ')}`);
        }
        if (data.experienceLevel) {
            sections.push(`- **Nivel técnico**: ${data.experienceLevel}`);
        }
        sections.push('');
    }

    // Comunicación
    if (data.communicationStyle || data.formality !== undefined) {
        sections.push('## 💬 Estilo de Comunicación');
        if (data.communicationStyle) sections.push(`- **Estilo preferido**: ${data.communicationStyle}`);
        if (data.formality !== undefined) {
            const formalityLabel = data.formality < 30 ? 'Casual' : data.formality > 70 ? 'Formal' : 'Balanceado';
            sections.push(`- **Formalidad**: ${formalityLabel}`);
        }
        if (data.detailLevel !== undefined) {
            const detailLabel = data.detailLevel < 30 ? 'Conciso' : data.detailLevel > 70 ? 'Detallado' : 'Balanceado';
            sections.push(`- **Nivel de detalle**: ${detailLabel}`);
        }
        if (data.language) sections.push(`- **Idioma preferido**: ${data.language}`);
        sections.push('');
    }

    // Reglas
    const hasAlways = data.alwaysRules && data.alwaysRules.length > 0;
    const hasNever = data.neverRules && data.neverRules.length > 0;

    if (hasAlways || hasNever) {
        sections.push('## ⚡ Reglas y Preferencias');

        if (hasAlways) {
            sections.push('');
            sections.push('### ✅ SIEMPRE:');
            data.alwaysRules.forEach(rule => sections.push(`- ${rule}`));
        }

        if (hasNever) {
            sections.push('');
            sections.push('### ❌ NUNCA:');
            data.neverRules.forEach(rule => sections.push(`- ${rule}`));
        }
        sections.push('');
    }

    // Proyectos
    if (data.projects && data.projects.length > 0) {
        sections.push('## 📁 Proyectos Activos');
        data.projects.forEach(project => {
            sections.push(`### ${project.emoji || '📌'} ${project.name}`);
            if (project.description) sections.push(project.description);
            if (project.stack) sections.push(`- **Stack**: ${project.stack}`);
            if (project.priority) sections.push(`- **Prioridad**: ${project.priority}`);
            sections.push('');
        });
    }

    // Custom notes
    if (data.customNotes) {
        sections.push('## 📝 Notas Adicionales');
        sections.push(data.customNotes);
        sections.push('');
    }

    // Footer
    sections.push('---');
    sections.push(`*Generado con [MPB - Master Prompt Builder](https://mpb.app) el ${new Date().toLocaleDateString('es-ES')}*`);

    return sections.join('\n');
}

// Utilidades
function groupByCategory(items) {
    return items.reduce((acc, item) => {
        const cat = item.category || 'otros';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item.label);
        return acc;
    }, {});
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Generar versión optimizada para ChatGPT Custom Instructions
export function generateChatGPTVersion(data) {
    const lines = [];

    lines.push(`Soy ${data.name || 'el usuario'}, ${data.role || 'profesional'}.`);

    if (data.industry) lines.push(`Trabajo en ${data.industry}.`);

    if (data.stack && data.stack.length > 0) {
        lines.push(`Mi stack incluye: ${data.stack.map(s => s.label).join(', ')}.`);
    }

    if (data.alwaysRules && data.alwaysRules.length > 0) {
        lines.push(`Siempre quiero que: ${data.alwaysRules.join('; ')}.`);
    }

    if (data.neverRules && data.neverRules.length > 0) {
        lines.push(`Nunca quiero que: ${data.neverRules.join('; ')}.`);
    }

    if (data.communicationStyle) {
        lines.push(`Prefiero respuestas ${data.communicationStyle.toLowerCase()}.`);
    }

    return lines.join(' ');
}

export default { generateMasterPrompt, generateChatGPTVersion };
