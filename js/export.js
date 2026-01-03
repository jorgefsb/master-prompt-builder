// ========================================
// MPB - Export Functions
// Exportar a PDF, Markdown, texto
// ========================================

import { generateMasterPrompt, generateChatGPTVersion } from './generator.js';

export const exportFunctions = {
    // Copiar al clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (e) {
            console.error('Error copying to clipboard:', e);
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            return true;
        }
    },

    // Descargar como archivo
    downloadFile(content, filename, type = 'text/plain') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    // Exportar a Markdown
    exportMarkdown(data) {
        const content = generateMasterPrompt(data);
        const filename = `master-prompt-${data.name?.toLowerCase().replace(/\s+/g, '-') || 'user'}-${new Date().toISOString().split('T')[0]}.md`;
        this.downloadFile(content, filename, 'text/markdown');
    },

    // Exportar versión ChatGPT
    exportChatGPT(data) {
        const content = generateChatGPTVersion(data);
        const filename = `chatgpt-instructions-${new Date().toISOString().split('T')[0]}.txt`;
        this.downloadFile(content, filename);
    },

    // Exportar a PDF (simplificado sin jsPDF - usa print)
    exportPDF(data) {
        const content = generateMasterPrompt(data);
        const printWindow = window.open('', '_blank');

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Master Prompt - ${data.name || 'Usuario'}</title>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
                <style>
                    body {
                        font-family: 'Inter', sans-serif;
                        max-width: 800px;
                        margin: 40px auto;
                        padding: 20px;
                        line-height: 1.6;
                        color: #1a1a2e;
                    }
                    h1 { color: #667EEA; border-bottom: 2px solid #667EEA; padding-bottom: 10px; }
                    h2 { color: #764BA2; margin-top: 30px; }
                    h3 { color: #333; }
                    ul { margin: 10px 0; }
                    li { margin: 5px 0; }
                    code { background: #f0f0f0; padding: 2px 6px; border-radius: 4px; }
                    .footer { 
                        margin-top: 40px; 
                        padding-top: 20px; 
                        border-top: 1px solid #ddd; 
                        font-size: 12px; 
                        color: #666;
                    }
                    .instructions {
                        background: #f8f8fc;
                        padding: 20px;
                        border-radius: 8px;
                        margin-top: 30px;
                    }
                    @media print {
                        body { margin: 20px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="no-print" style="background: #667EEA; color: white; padding: 10px 20px; margin: -20px -20px 30px; border-radius: 8px;">
                    <button onclick="window.print()" style="background: white; color: #667EEA; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 600;">
                        🖨️ Imprimir / Guardar como PDF
                    </button>
                </div>
                
                ${this.markdownToHtml(content)}
                
                <div class="instructions">
                    <h3>📖 Cómo usar tu Master Prompt</h3>
                    <p><strong>ChatGPT:</strong> Ve a Settings → Personalization → Custom Instructions y pega tu prompt.</p>
                    <p><strong>Claude:</strong> Crea un nuevo Project y pega el prompt en las instrucciones del proyecto.</p>
                    <p><strong>Otros AI:</strong> Pega el prompt al inicio de cada conversación nueva.</p>
                </div>
                
                <div class="footer">
                    Generado con MPB - Master Prompt Builder | ${new Date().toLocaleDateString('es-ES')}
                </div>
            </body>
            </html>
        `);

        printWindow.document.close();
    },

    // Convertir Markdown básico a HTML
    markdownToHtml(md) {
        return md
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^\- \*\*(.*?)\*\*: (.*$)/gim, '<li><strong>$1:</strong> $2</li>')
            .replace(/^\- (.*$)/gim, '<li>$1</li>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/^---$/gim, '<hr>')
            .replace(/<li>/g, '<ul><li>')
            .replace(/<\/li>\n(?!<li>|<ul>)/g, '</li></ul>\n')
            .replace(/<\/ul>\n<ul>/g, '\n');
    }
};

export default exportFunctions;
