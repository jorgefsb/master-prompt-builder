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
                <link rel="stylesheet" href="${window.location.origin}/brand/0.3/tokens.css">
                <style>
                    @font-face {
                        font-family: Inter;
                        font-style: normal;
                        font-weight: 400;
                        font-display: swap;
                        src: url('${window.location.origin}/fonts/inter-400.woff2') format('woff2');
                    }
                    body {
                        font-family: Inter, var(--brand-font-body, system-ui, sans-serif);
                        max-width: 800px;
                        margin: 40px auto;
                        padding: 20px;
                        line-height: 1.6;
                        background: var(--brand-paper, #F4E8D5);
                        color: var(--brand-ink, #22211F);
                    }
                    h1 { color: var(--brand-accent, #FF6B35); border-bottom: 2px solid var(--brand-accent, #FF6B35); padding-bottom: 10px; }
                    h2, h3 { color: var(--brand-ink, #22211F); margin-top: 30px; }
                    ul { margin: 10px 0; }
                    li { margin: 5px 0; }
                    code {
                        background: transparent;
                        padding: 2px 6px;
                        border-radius: 4px;
                        border: 1px solid var(--brand-border, #8A7E70);
                        color: var(--brand-ink, #22211F);
                    }
                    .footer {
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 1px solid var(--brand-border, #8A7E70);
                        font-size: 12px;
                        color: var(--brand-ink, #22211F);
                    }
                    .instructions {
                        background: var(--brand-paper, #F4E8D5);
                        padding: 20px;
                        border-radius: 8px;
                        margin-top: 30px;
                        border: 1px solid var(--brand-border, #8A7E70);
                        color: var(--brand-ink, #22211F);
                    }
                    .no-print {
                        background: var(--brand-accent, #FF6B35);
                        color: var(--brand-ink, #22211F);
                        padding: 10px 20px;
                        margin: -20px -20px 30px;
                        border-radius: 8px;
                    }
                    .no-print button {
                        background: var(--brand-paper, #F4E8D5);
                        color: var(--brand-ink, #22211F);
                        border: 1px solid var(--brand-ink, #22211F);
                        padding: 10px 20px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: 600;
                    }
                    @media print {
                        body { margin: 20px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="no-print">
                    <button type="button" onclick="window.print()">
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
