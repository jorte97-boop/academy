document.addEventListener("DOMContentLoaded", function() {
    
    // --- LÓGICA 1: CAMBIO DE COLOR EN EL TOPBAR (A NARANJA AL HACER CLIC) ---
    const menuLinks = document.querySelectorAll('.topbar-link');

    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Eliminar clase 'active' de todos los enlaces
            menuLinks.forEach(item => item.classList.remove('active'));
            // Agregarla al enlace clicado
            this.classList.add('active');
        });
    });

    // --- LÓGICA 2: INICIALIZAR CARRUSEL DE CURSOS (Glide.js) ---
    if (document.querySelector('.glide-courses')) {
        new Glide(".glide-courses", {
            type: "carousel", 
            startAt: 0, 
            perView: 3, 
            gap: 30, 
            autoplay: 4000, 
            hoverpause: true,
            breakpoints: {
                992: { perView: 2 },
                768: { perView: 1, gap: 15 }
            }
        }).mount();
    }

    // --- LÓGICA 3: INICIALIZAR CARRUSEL INFINITO DE LOGOS (SOCIOS) ---
    if (document.querySelector('.glide-logos')) {
        new Glide(".glide-logos", {
            type: "carousel", 
            autoplay: 2000,   
            perView: 5,       
            gap: 20,          
            hoverpause: true, 
            bound: true,      
            breakpoints: {
                992: { perView: 4, gap: 15 }, 
                768: { perView: 3, gap: 10 }  
            }
        }).mount();
    }
});

document.addEventListener("DOMContentLoaded", function() {
    
    // === LÓGICAS ANTERIORES DEL INDEX (CARRUSELES Y MENÚ) ===
    // (Asegúrate de mantener tu código de Glide.js y el menú del topbar aquí si usas el mismo script.js para ambas páginas)

    // === LÓGICA DE VERIFICACIÓN DE CERTIFICADOS ===
    const resultadoContenedor = document.getElementById("resultado-validacion");
    
    // Solo ejecutamos esto si estamos en la página de verificación (si existe el contenedor)
    if (resultadoContenedor) {
        
        // 1. Obtenemos el parámetro 'codigo' de la URL (ej: intap.pe/verificar.html?codigo=XYZ123)
        const urlParams = new URLSearchParams(window.location.search);
        const codigoId = urlParams.get('codigo');

        if (!codigoId) {
            mostrarError("No se ha detectado ningún código de verificación válido en el enlace escaneado.");
            return;
        }

        // === PON AQUÍ LA URL DE TU WEB APP DE GOOGLE APPS SCRIPT ===
        const API_URL = "https://script.google.com/macros/s/AKfycbxX9-qB7hfpTp194v20yRjiFzlCio3khJM_vb-udQqtRByFcMs5uaI9qp9AKjq5LLj5/exec";

        // 2. Hacemos la consulta a la Hoja de Cálculo
        fetch(API_URL + "?codigo=" + encodeURIComponent(codigoId))
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    mostrarCertificado(data);
                } else {
                    mostrarError("El certificado no existe o ha sido anulado.");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                mostrarError("Hubo un problema de conexión al verificar el código.");
            });

        // 3. Función para imprimir los datos si existe
        function mostrarCertificado(data) {
            let fechaVencimiento = data.vencimiento ? formatearFecha(data.vencimiento) : "";
            let estadoUpper = data.estado.toString().toUpperCase();
            
            let esCaducado = (estadoUpper === "CADUCADO");
            let estadoHtml = "";
            let alertaHtml = "";

            if (esCaducado) {
                // Si la columna estado dice "Caducado"
                alertaHtml = `
                    <div class="alert-box warning">
                        <i class="fas fa-exclamation-triangle"></i> El certificado es válido, pero ya ha caducado.
                    </div>
                `;
                // Muestra la fecha si hay, si no muestra el estado
                estadoHtml = `<span class="data-value text-orange">${fechaVencimiento || data.estado}</span>`;
            } else {
                // Si la columna dice "Vigente" u otra cosa que no sea Anulado/Caducado
                if (fechaVencimiento) {
                    estadoHtml = `<span class="data-value status-vigente"><span class="dot"></span> ${data.estado} (Hasta ${fechaVencimiento})</span>`;
                } else {
                    estadoHtml = `<span class="data-value status-vigente"><span class="dot"></span> ${data.estado}</span>`;
                }
            }

            resultadoContenedor.innerHTML = `
                <div class="status-box valid">
                    <i class="fas fa-check-circle"></i> CERTIFICADO VÁLIDO
                </div>
                ${alertaHtml}
                <div class="data-group">
                    <span class="data-label">TITULAR DEL CERTIFICADO</span>
                    <span class="data-value">${data.titular}</span>
                </div>
                <div class="data-group">
                    <span class="data-label">PROGRAMA / TEMA</span>
                    <span class="data-value">${data.tema}</span>
                </div>
                <div class="data-group">
                    <span class="data-label">ESTADO / FECHA DE VENCIMIENTO</span>
                    ${estadoHtml}
                </div>
                <div class="verificacion-footer">
                    <p>¿Necesitas validar más detalles?</p>
                    <div class="footer-buttons">
                        <a href="https://wa.me/51987260390" class="btn btn-whatsapp-small" target="_blank"><i class="fab fa-whatsapp"></i> Soporte WhatsApp</a>
                        <a href="mailto:academy@intapperueirl.com" class="btn btn-email-small"><i class="fas fa-envelope"></i> Enviar Correo</a>
                    </div>
                </div>
            `;
        }

        // 4. Función para mostrar error o "Anulado"
        function mostrarError(mensaje) {
            resultadoContenedor.innerHTML = `
                <div class="status-box invalid">
                    <i class="fas fa-times-circle"></i> CERTIFICADO INVÁLIDO
                </div>
                <div class="data-group" style="text-align: center; border: none;">
                    <span class="data-value" style="color: var(--active-orange);">${mensaje}</span>
                    <p style="color: #8892b0; font-size: 0.9rem; margin-top: 15px;">Asegúrate de haber escaneado correctamente el código QR oficial de INTAP PERÚ.</p>
                </div>
                <div class="verificacion-footer">
                    <div class="footer-buttons">
                        <a href="https://wa.me/51987260390" class="btn btn-whatsapp-small" target="_blank"><i class="fab fa-whatsapp"></i> Contactar Soporte</a>
                    </div>
                </div>
            `;
        }

        // 5. Función para asegurar que la fecha se lea correctamente y no muestre horas raras
        function formatearFecha(cadenaFecha) {
            if (!cadenaFecha) return "";
            try {
                let f = new Date(cadenaFecha);
                if (!isNaN(f.getTime())) {
                    return f.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
                }
            } catch(e) {}
            return cadenaFecha; 
        }
    }
});