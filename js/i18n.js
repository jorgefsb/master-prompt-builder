const LANG_KEY = 'mpb-lang';

export function getLang() {
    return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'es';
}

export function applyLang(lang) {
    const next = lang === 'en' ? 'en' : 'es';
    localStorage.setItem(LANG_KEY, next);
    document.documentElement.lang = next === 'en' ? 'en' : 'es';
    document.querySelectorAll('[data-lang]').forEach((node) => {
        node.hidden = node.getAttribute('data-lang') !== next;
    });
    document.querySelectorAll('[data-lang-btn]').forEach((button) => {
        button.setAttribute('aria-pressed', button.getAttribute('data-lang-btn') === next ? 'true' : 'false');
    });
    document.querySelectorAll('[data-alt-en]').forEach((img) => {
        if (!img.getAttribute('data-alt-es')) {
            img.setAttribute('data-alt-es', img.getAttribute('alt') || '');
        }
        img.setAttribute('alt', next === 'en' ? img.getAttribute('data-alt-en') : img.getAttribute('data-alt-es'));
    });
    document.querySelectorAll('[data-placeholder-en]').forEach((input) => {
        if (!input.getAttribute('data-placeholder-es')) {
            input.setAttribute('data-placeholder-es', input.getAttribute('placeholder') || '');
        }
        input.setAttribute(
            'placeholder',
            next === 'en' ? input.getAttribute('data-placeholder-en') : input.getAttribute('data-placeholder-es')
        );
    });
}

export function bindLangSwitch() {
    document.querySelectorAll('[data-lang-btn]').forEach((button) => {
        button.addEventListener('click', () => applyLang(button.getAttribute('data-lang-btn')));
    });
}
