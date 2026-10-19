/* Binder MPB para juice 1.0.1. El menu vive en el paquete. Sin Stripe. */
(function (d) {
    'use strict';

    function J() {
        return window.JZ;
    }

    function paintButtons() {
        d.querySelectorAll('.btn-primary, .btn-cta').forEach(function (el) {
            el.classList.add('jz-antic');
            if (!el.hasAttribute('data-jz')) {
                el.setAttribute('data-jz', 'jz-tap');
            }
        });
    }

    d.addEventListener('DOMContentLoaded', paintButtons);
    d.addEventListener('mpb:paint', paintButtons);

    d.addEventListener('click', function (e) {
        var jz = J();
        if (!jz) return;
        var t = e.target;
        if (t.closest('.juice-sfx, .jz-lvl, .jz-feel, input[name=jz-level], [data-jz]')) return;
        var live = t.closest('[data-jz-moki], .jz-moki');
        if (live) {
            jz.snd('tap');
            jz.press(live);
            jz.hop(live);
            return;
        }
        var btn = t.closest('.btn, .chip, .card-clickable, .nav-toggle');
        if (btn) jz.press(btn);
    });

    d.addEventListener('focusin', function (e) {
        var jz = J();
        if (jz && e.target.matches && e.target.matches('input:not([type=hidden]), textarea, select')) {
            jz.look(e.target);
        }
    });

    d.addEventListener('focusout', function () {
        setTimeout(function () {
            var jz = J();
            var a = d.activeElement;
            if (jz && (!a || !a.matches || !a.matches('input,textarea,select'))) jz.look();
        }, 0);
    });

    d.addEventListener('mpb:copy', function (e) {
        var jz = J();
        if (!jz) return;
        var el = (e.detail && e.detail.el) || d.body;
        jz.play('jz-success', el, { x: e.clientX, y: e.clientY });
    });

    d.addEventListener('mpb:error', function (e) {
        var jz = J();
        if (!jz) return;
        jz.play('jz-error', (e.detail && e.detail.el) || d.body);
    });

    d.addEventListener('mpb:lang', function () {
        var jz = J();
        if (jz) jz.paint();
    });
})(document);
