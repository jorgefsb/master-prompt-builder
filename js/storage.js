// ========================================
// MPB - Storage Manager
// Manejo de localStorage y persistencia
// ========================================

const STORAGE_KEY = 'mpb_data';
const VERSION_KEY = 'mpb_versions';

export const storage = {
    // Guardar datos del prompt actual
    save(data) {
        try {
            const toSave = {
                ...data,
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
            return true;
        } catch (e) {
            console.error('Error saving to localStorage:', e);
            return false;
        }
    },

    // Cargar datos guardados
    load() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.error('Error loading from localStorage:', e);
            return null;
        }
    },

    // Limpiar datos
    clear() {
        localStorage.removeItem(STORAGE_KEY);
    },

    // Guardar una versión en el historial
    saveVersion(promptText, versionName = null) {
        try {
            const versions = this.getVersions();
            const newVersion = {
                id: Date.now(),
                name: versionName || `v${versions.length + 1}`,
                date: new Date().toISOString(),
                prompt: promptText
            };
            versions.push(newVersion);
            localStorage.setItem(VERSION_KEY, JSON.stringify(versions));
            return newVersion;
        } catch (e) {
            console.error('Error saving version:', e);
            return null;
        }
    },

    // Obtener historial de versiones
    getVersions() {
        try {
            const versions = localStorage.getItem(VERSION_KEY);
            return versions ? JSON.parse(versions) : [];
        } catch (e) {
            console.error('Error loading versions:', e);
            return [];
        }
    },

    // Obtener última versión
    getLatestVersion() {
        const versions = this.getVersions();
        return versions.length > 0 ? versions[versions.length - 1] : null;
    },

    // Comparar con versión anterior (simple diff)
    compareWithPrevious(currentPrompt) {
        const lastVersion = this.getLatestVersion();
        if (!lastVersion) return null;

        const oldLines = lastVersion.prompt.split('\n');
        const newLines = currentPrompt.split('\n');

        const changes = {
            added: newLines.filter(line => !oldLines.includes(line)),
            removed: oldLines.filter(line => !newLines.includes(line)),
            unchanged: newLines.filter(line => oldLines.includes(line))
        };

        return {
            previousVersion: lastVersion,
            changes
        };
    }
};

export default storage;
