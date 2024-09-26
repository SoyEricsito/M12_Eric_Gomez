document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formularioJugadores");
    const contenedorJuego = document.getElementById("contenedorJuego");
    const tableroElemento = document.getElementById("tablero");
    const mostrarJugadorActual = document.getElementById("jugadorActual");
    var tamañoH = document.getElementById("tamañoH");
    var tamañoV = document.getElementById("tamañoV");
    var tablero = Array(6).fill(null).map(() => Array(7).fill(null));
    var jugadorActual = 'jugador1';
    var jugadores = {
        jugador1: "",
        jugador2: ""
    };

    // Crear el tablero
    function crearTablero() {
        tableroElemento.innerHTML = '';
        for (let fila = 0; fila < 6; fila++) {
            for (let col = 0; col < 7; col++) {
                const celda = document.createElement("div");
                celda.classList.add("celda");
                celda.dataset.fila = fila;
                celda.dataset.columna = col;
                celda.addEventListener('click', manejarClickCelda);
                tableroElemento.appendChild(celda);
            }
        }
    }

    // Manejar clics en las celdas
    function manejarClickCelda(evento) {
        const columna = parseInt(evento.target.dataset.columna);
        const fila = buscarFilaDisponible(columna);

        if (fila !== -1) {
            tablero[fila][columna] = jugadorActual;  // Registrar el jugador actual en la matriz
            const celda = document.querySelector(`.celda[data-fila="${fila}"][data-columna="${columna}"]`);
            celda.classList.add(jugadorActual);  // Añadir la clase visual del jugador

            console.log(`Ficha colocada por ${jugadorActual} en fila: ${fila}, columna: ${columna}`);

            // Verificar si hay un ganador
            if (verificarGanador(fila, columna)) {
                alert(`${jugadores[jugadorActual]} ha ganado!`);
                reiniciarJuego();
                return;
            }

            cambiarJugador();
        } else {
            console.log("Columna llena, elige otra.");
        }
    }

    // Buscar la primera fila disponible en una columna
    function buscarFilaDisponible(columna) {
        for (let fila = 5; fila >= 0; fila--) {
            if (tablero[fila][columna] === null) {
                return fila;
            }
        }
        return -1;  // Si no hay fila disponible
    }

    // Cambiar jugador
    function cambiarJugador() {
        jugadorActual = jugadorActual === 'jugador1' ? 'jugador2' : 'jugador1';
        actualizarMostrarJugador();
    }

    // Actualizar la pantalla para mostrar el jugador actual
    function actualizarMostrarJugador() {
        mostrarJugadorActual.textContent = `Turno de ${jugadores[jugadorActual]} (${jugadorActual === 'jugador1' ? 'Rojo' : 'Amarillo'})`;
    }

    // Verificar si hay un ganador
    function verificarGanador(fila, columna) {
        const resultado = (
            verificarDireccion(fila, columna, 1, 0) ||  // Horizontal
            verificarDireccion(fila, columna, 0, 1) ||  // Vertical
            verificarDireccion(fila, columna, 1, 1) ||  // Diagonal \
            verificarDireccion(fila, columna, 1, -1)    // Diagonal /
        );

        console.log(`Verificando si hay ganador: ${resultado ? "Sí" : "No"}`);
        return resultado;
    }

    // Verificar en una dirección
    function verificarDireccion(fila, columna, direccionFila, direccionColumna) {
        let contador = 1;

        // Contar fichas en la dirección positiva
        contador += contarEnDireccion(fila, columna, direccionFila, direccionColumna);

        // Contar fichas en la dirección negativa
        contador += contarEnDireccion(fila, columna, -direccionFila, -direccionColumna);

        console.log(`Dirección (${direccionFila}, ${direccionColumna}): ${contador} fichas conectadas`);
        return contador >= 4;
    }

    // Contar fichas en una dirección
    function contarEnDireccion(fila, columna, direccionFila, direccionColumna) {
        let contador = 0;
        let f = fila + direccionFila;
        let c = columna + direccionColumna;

        // Mientras estamos dentro del rango del tablero y la ficha es del jugador actual
        while (f >= 0 && f < 6 && c >= 0 && c < 7 && tablero[f][c] === jugadorActual) {
            contador++;
            f += direccionFila;
            c += direccionColumna;
        }

        return contador;
    }

    // Reiniciar el juego
    function reiniciarJuego() {
        tablero = Array(6).fill(null).map(() => Array(7).fill(null));
        crearTablero();
        jugadorActual = 'jugador1';
        actualizarMostrarJugador();
    }

    // Configurar el juego cuando se envía el formulario
    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        jugadores.jugador1 = document.getElementById("jugador1").value || "Jugador 1";
        jugadores.jugador2 = document.getElementById("jugador2").value || "Jugador 2";

        formulario.style.display = 'none';
        contenedorJuego.style.display = 'block';
        actualizarMostrarJugador();
        crearTablero();
    });
});
