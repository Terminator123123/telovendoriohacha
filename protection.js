/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║                  CÓDIGO PROTEGIDO POR COPYRIGHT                  ║
 * ║══════════════════════════════════════════════════════════════════║
 * ║  © 2025 TE LO VENDO RIOHACHA - Todos los derechos reservados    ║
 * ║  Desarrollado por: Shalem Rolón                                 ║
 * ║  Email: shalemr83@gmail.com                                     ║
 * ║                                                                  ║
 * ║  AVISO LEGAL:                                                   ║
 * ║  Este código está protegido por leyes de derechos de autor.    ║
 * ║  Queda prohibida su copia, modificación, distribución o uso     ║
 * ║  sin autorización expresa por escrito del autor.                ║
 * ║                                                                  ║
 * ║  La violación de estos derechos puede resultar en acciones      ║
 * ║  legales civiles y penales según las leyes colombianas.         ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

(function() {
    'use strict';

    // Detectar DevTools abierto
    let devtoolsOpen = false;
    const threshold = 160;

    const detectDevTools = () => {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;

        if (widthThreshold || heightThreshold) {
            if (!devtoolsOpen) {
                devtoolsOpen = true;
                handleDevToolsOpen();
            }
        } else {
            devtoolsOpen = false;
        }
    };

    const handleDevToolsOpen = () => {
        // Limpiar consola
        console.clear();

        // Mensaje de advertencia
        console.log('%c⚠️ ADVERTENCIA DE SEGURIDAD', 'color: red; font-size: 24px; font-weight: bold;');
        console.log('%c\n╔══════════════════════════════════════════════════════════════════╗', 'color: #ff6b6b; font-weight: bold;');
        console.log('%c║         CÓDIGO PROTEGIDO POR DERECHOS DE AUTOR                  ║', 'color: #ff6b6b; font-weight: bold;');
        console.log('%c╚══════════════════════════════════════════════════════════════════╝\n', 'color: #ff6b6b; font-weight: bold;');
        console.log('%c© 2025 TE LO VENDO RIOHACHA - Todos los derechos reservados\n', 'color: #ffd43b; font-size: 14px;');
        console.log('%cEste código está protegido por leyes de derechos de autor.', 'color: white; font-size: 12px;');
        console.log('%cQueda PROHIBIDA su copia, modificación o distribución sin autorización.\n', 'color: white; font-size: 12px;');
        console.log('%c⚖️ La violación de estos derechos puede resultar en acciones legales.', 'color: #ff8787; font-size: 13px; font-weight: bold;');
        console.log('%c\n¿Necesitas un sitio web? Contáctanos: https://wa.me/573007148250', 'color: #51cf66; font-size: 12px;');
        console.log('%cDesarrollado por: Shalem Rolón (shalemr83@gmail.com)\n', 'color: #74c0fc; font-size: 11px;');
    };

    // Deshabilitar clic derecho
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showWarning('⚠️ Clic derecho deshabilitado por seguridad');
        return false;
    });

    // Deshabilitar teclas de desarrollador
    document.addEventListener('keydown', function(e) {
        // F12
        if (e.keyCode === 123) {
            e.preventDefault();
            showWarning('⚠️ Las herramientas de desarrollador están deshabilitadas');
            return false;
        }

        // Ctrl+Shift+I
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            showWarning('⚠️ Inspeccionar elemento está deshabilitado');
            return false;
        }

        // Ctrl+Shift+J
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
            e.preventDefault();
            showWarning('⚠️ Consola deshabilitada');
            return false;
        }

        // Ctrl+U (Ver código fuente)
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            showWarning('⚠️ Ver código fuente está deshabilitado');
            return false;
        }

        // Ctrl+Shift+C
        if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
            e.preventDefault();
            showWarning('⚠️ Selector de elementos deshabilitado');
            return false;
        }

        // Ctrl+S (Guardar página)
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            showWarning('⚠️ Guardar página está deshabilitado');
            return false;
        }
    });

    // Función para mostrar advertencia
    function showWarning(message) {
        // Crear elemento de advertencia si no existe
        let warningDiv = document.getElementById('security-warning');

        if (!warningDiv) {
            warningDiv = document.createElement('div');
            warningDiv.id = 'security-warning';
            warningDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                z-index: 999999;
                font-family: 'Rubik', sans-serif;
                font-size: 14px;
                max-width: 300px;
                opacity: 0;
                transform: translateY(-20px);
                transition: all 0.3s ease;
            `;
            document.body.appendChild(warningDiv);
        }

        warningDiv.textContent = message;

        // Animar entrada
        setTimeout(() => {
            warningDiv.style.opacity = '1';
            warningDiv.style.transform = 'translateY(0)';
        }, 10);

        // Ocultar después de 3 segundos
        setTimeout(() => {
            warningDiv.style.opacity = '0';
            warningDiv.style.transform = 'translateY(-20px)';
        }, 3000);
    }

    // Detectar DevTools periódicamente
    setInterval(detectDevTools, 1000);

    // Deshabilitar selección de texto (opcional, puede ser molesto para usuarios)
    // document.addEventListener('selectstart', function(e) {
    //     e.preventDefault();
    //     return false;
    // });

    // Protección contra debugger
    setInterval(function() {
        debugger;
    }, 100);

    // Protección contra copiar código
    document.addEventListener('copy', function(e) {
        const selection = window.getSelection().toString();
        if (selection.length > 100) { // Si intenta copiar más de 100 caracteres
            e.preventDefault();
            showWarning('⚠️ Copia de código protegido');

            // Copiar mensaje de copyright en su lugar
            e.clipboardData.setData('text/plain',
                '© 2025 TE LO VENDO RIOHACHA - Código protegido por derechos de autor.\n' +
                'Contacto: shalemr83@gmail.com\n' +
                '¿Necesitas un sitio web? WhatsApp: +57 300 714 8250'
            );
        }
    });

    // Mensaje de bienvenida en consola cuando la página carga
    console.clear();
    console.log('%c👋 ¡Hola desarrollador!', 'color: #51cf66; font-size: 20px; font-weight: bold;');
    console.log('%c\n¿Te gusta este sitio web?', 'color: white; font-size: 14px;');
    console.log('%c¡Podemos crear uno para ti!', 'color: #74c0fc; font-size: 14px;');
    console.log('%c\n📱 WhatsApp: +57 300 714 8250', 'color: #51cf66; font-size: 13px;');
    console.log('%c✉️ Email: shalemr83@gmail.com', 'color: #ffd43b; font-size: 13px;');
    console.log('%c\n⚠️ Este código está protegido por derechos de autor.\n', 'color: #ff6b6b; font-size: 12px; font-weight: bold;');

    // Anti-tamper: verificar que el script no haya sido modificado
    Object.freeze(this);

})();
