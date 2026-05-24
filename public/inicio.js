document.addEventListener('DOMContentLoaded', () => {
    const pista = document.getElementById('pista');
    const btnDer = document.getElementById('btn-der');
    const btnIzq = document.getElementById('btn-izq');

    let posicionActual = 0;

    // Calculamos cuánto mover: ancho de una tarjeta + el gap
    const calcularAnchoMovimiento = () => {
        const tarjeta = document.querySelector('.tarjeta');
        const estiloPista = window.getComputedStyle(pista);
        const gap = parseInt(estiloPista.gap) || 0;
        return tarjeta.offsetWidth + gap;
    };

    btnDer.onclick = () => {
        const ancho = calcularAnchoMovimiento();
        const maxScroll = pista.scrollWidth - pista.parentElement.offsetWidth;
        
        // Si no hemos llegado al final, movemos
        if (Math.abs(posicionActual) < maxScroll - 10) { 
            posicionActual -= ancho;
        } else {
            posicionActual = 0; // Reinicia al principio (opcional)
        }
        pista.style.transform = `translateX(${posicionActual}px)`;
    };

    btnIzq.onclick = () => {
        const ancho = calcularAnchoMovimiento();
        
        if (posicionActual < 0) {
            posicionActual += ancho;
        }
        pista.style.transform = `translateX(${posicionActual}px)`;
    };
    console.log("Catalogo listo");
    console.log("Empresas cargado");
});