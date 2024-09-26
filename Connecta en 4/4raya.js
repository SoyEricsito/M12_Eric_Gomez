document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("formularioJugadores");
    const contenedorJuego = document.getElementById("contenedorJuego");
    const tableroElemento = document.getElementById("tablero");
    const mostrarJugadorActual = document.getElementById("jugadorActual");
    const volverAtrasBtn = document.getElementById("volverAtras");
    const alternarNumerosBtn = document.getElementById("alternarNumeros");
    const contenedorNumeros = document.createElement("div");
    contenedorNumeros.id = "numerosColumnas";

    let mostrarNumeros = false;
    let tamañoH;
    let tamañoV;
    let tamañoC;
    let tablero;
    let jugadorActual = 'jugador1';
    const jugadores = {
        jugador1: "",
        jugador2: ""
    };

    // Crear el tablero
    // Crear el tablero
    function crearTablero() {
        tableroElemento.innerHTML = ''; // Limpiar el contenido anterior
        contenedorNumeros.innerHTML = ''; // Limpiar los números de las columnas

        // Ajustar el estilo del contenedor de los números de las columnas
        contenedorNumeros.style.display = mostrarNumeros ? 'grid' : 'none';
        contenedorNumeros.style.gridTemplateColumns = `repeat(${tamañoH}, 50px)`; // Ajustar columnas a tamañoH

        if (mostrarNumeros) {
            // Crear números de las columnas
            for (let col = 0; col < tamañoH; col++) {
                const numeroColumna = document.createElement("div");
                numeroColumna.classList.add("numeroColumna");
                numeroColumna.textContent = col + 1; // Mostrar números desde 1
                contenedorNumeros.appendChild(numeroColumna);
            }
        }

        for (let fila = 0; fila < tamañoV; fila++) {
            for (let col = 0; col < tamañoH; col++) {
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
        colocarFichaEnColumna(columna);
    }

    // Buscar la primera fila disponible en una columna
    function buscarFilaDisponible(columna) {
        for (let fila = tamañoC; fila >= 0; fila--) {
            if (tablero[fila][columna] === null) {
                return fila;
            }
        }
        return -1;  // Si no hay fila disponible
    }

    // Colocar ficha en una columna
    function colocarFichaEnColumna(columna) {
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
        while (f >= 0 && f < tamañoV && c >= 0 && c < tamañoH && tablero[f][c] === jugadorActual) {
            contador++;
            f += direccionFila;
            c += direccionColumna;
        }

        return contador;
    }

    // Reiniciar el juego
    function reiniciarJuego() {
        tablero = Array(tamañoV).fill(null).map(() => Array(tamañoH).fill(null));
        crearTablero();
        jugadorActual = 'jugador1';
        actualizarMostrarJugador();
    }

    // Configurar el juego cuando se envía el formulario
    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        // Convertir los valores de los inputs a enteros
        tamañoH = parseInt(document.getElementById("tamañoH").value);
        tamañoV = parseInt(document.getElementById("tamañoV").value);

        if (isNaN(tamañoH) || isNaN(tamañoV) || tamañoH <= 0 || tamañoV <= 0) {
            alert("Por favor, ingresa un tamaño válido para el tablero.");
            return;
        }

        // Ajustar el estilo del tablero usando grid-template-columns y grid-template-rows
        tableroElemento.style.gridTemplateColumns = `repeat(${tamañoH}, 50px)`;
        tableroElemento.style.gridTemplateRows = `repeat(${tamañoV}, 50px)`;

        // Ajustar tamaño del tablero en el código
        tamañoC = tamañoV - 1;
        tablero = Array(tamañoV).fill(null).map(() => Array(tamañoH).fill(null));

        jugadores.jugador1 = document.getElementById("jugador1").value || "Jugador 1";
        jugadores.jugador2 = document.getElementById("jugador2").value || "Jugador 2";

        formulario.style.display = 'none';
        contenedorJuego.style.display = 'block';

        // Añadir la fila de números encima del tablero
        tableroElemento.parentNode.insertBefore(contenedorNumeros, tableroElemento);

        actualizarMostrarJugador();
        crearTablero();
    });

    // Botón "Volver atrás" para regresar al formulario
    volverAtrasBtn.addEventListener("click", () => {
        contenedorJuego.style.display = 'none'; // Ocultar el contenedor del juego
        formulario.style.display = 'block';    // Mostrar el formulario de nuevo
        reiniciarJuego();  // Opcional: reiniciar el juego si quieres empezar de cero
    });

    // Botón "Mostrar Números" para mostrar/ocultar números encima del tablero
    alternarNumerosBtn.addEventListener("click", () => {
        mostrarNumeros = !mostrarNumeros; // Alternar estado de mostrar números
        alternarNumerosBtn.textContent = mostrarNumeros ? 'Ocultar Números' : 'Mostrar Números';
        crearTablero(); // Volver a crear el tablero para reflejar el cambio
    });

    // Vincular teclas del teclado con columnas
    document.addEventListener('keydown', (evento) => {
        const key = evento.key;
        const columnaSeleccionada = parseInt(key) - 1; // Convertir la tecla presionada a índice de columna
        if (columnaSeleccionada >= 0 && columnaSeleccionada < tamañoH) {
            colocarFichaEnColumna(columnaSeleccionada);
        }
    });

    /* // Almacena si el bot está activo
    let botActivo = false;

    // Configurar el juego cuando se envía el formulario
    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        jugadores.jugador1 = document.getElementById("jugador1").value || "Jugador 1";
        jugadores.jugador2 = document.getElementById("jugador2").value || "Jugador 2";

        formulario.style.display = 'none';
        contenedorJuego.style.display = 'block';
        actualizarMostrarJugador();
        crearTablero();

        if (botActivo) {
            jugarConBot();
        }
    });

    // Activar o desactivar el bot
    document.getElementById("activarBot").addEventListener("click", () => {
        botActivo = !botActivo; // Cambiar estado del bot
        alert(botActivo ? "Bot activado!" : "Bot desactivado!");
    });

    // Función para que el bot juegue
    function jugarConBot() {
        if (jugadorActual === 'jugador2' && botActivo) {
            setTimeout(() => {
                let columnaElegida;
                do {
                    columnaElegida = Math.floor(Math.random() * tamañoH);
                } while (tablero[0][columnaElegida] !== null); // Asegúrate de que la columna no esté llena

                colocarFichaEnColumna(columnaElegida); // El bot juega en la columna elegida
                if (verificarGanador(fila, columnaElegida)) {
                    alert(`${jugadores[jugadorActual]} ha ganado!`);
                    reiniciarJuego();
                    return;
                }
                cambiarJugador(); // Cambiar al jugador después de que el bot juega
                jugarConBot(); // Llamar nuevamente para el siguiente turno del bot
            }, 1000); // Retraso para simular el tiempo de pensar del bot
        }
    }

    // Colocar ficha en columna
    function colocarFichaEnColumna(columna) {
        const fila = buscarFilaDisponible(columna);
        if (fila !== -1) {
            tablero[fila][columna] = jugadorActual;  // Registrar el jugador actual en la matriz
            const celda = document.querySelector(`.celda[data-fila="${fila}"][data-columna="${columna}"]`);
            celda.classList.add(jugadorActual);  // Añadir la clase visual del jugador

            console.log(`Ficha colocada por ${jugadorActual} en fila: ${fila}, columna: ${columna}`);
        } else {
            console.log("Columna llena, elige otra.");
        }
    }

 */
});


