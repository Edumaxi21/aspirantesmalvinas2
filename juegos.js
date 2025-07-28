document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DEL DOM ---
    const gameSelectionScreen = document.getElementById('game-selection-screen');
    const gamePlayScreen = document.getElementById('game-play-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const gameGrid = document.querySelector('.game-grid');
    const gameTitle = document.getElementById('game-title');
    const scoreEl = document.getElementById('score');
    const questionCounterEl = document.getElementById('question-counter');
    const challengeArea = document.getElementById('challenge-area');
    const answerArea = document.getElementById('answer-area');
    const feedbackArea = document.getElementById('feedback-area');
    const nextChallengeBtn = document.getElementById('next-challenge-btn');
    const finalScoreEl = document.getElementById('final-score');
    const restartGameBtn = document.getElementById('restart-game-btn');
    const backToSelectionBtn = document.getElementById('back-to-selection-btn');

    // --- DATOS DEL JUEGO AMPLIADOS ---
    const gameData = {
        // Clase 1: Marco Histórico (Multiple Choice)
        1: {
            title: "Clase 1: Marco Histórico",
            type: 'mc',
            challenges: [
                { question: "¿En qué año se fundó el primer cuerpo de Bomberos Voluntarios en Argentina?", options: ["1910", "1884", "1853", "1901"], answer: "1884" },
                { question: "¿Quién fue el principal impulsor de la creación de los bomberos en La Boca?", options: ["Julio A. Roca", "Domingo F. Sarmiento", "Tomás Liberti", "José de San Martín"], answer: "Tomás Liberti" },
                { question: 'El lema "Volere è Potere" significa:', options: ["La unión hace la fuerza", "Querer es Poder", "Siempre listos", "Valor y Sacrificio"], answer: "Querer es Poder" },
                { question: "¿En qué barrio de Buenos Aires se originó el sistema de Bomberos Voluntarios?", options: ["San Telmo", "Palermo", "La Boca", "Barracas"], answer: "La Boca" },
                { question: "El número de INOBV de Malvinas Argentinas es el...", options: ["100", "222", "166", "001"], answer: "166" },
            ]
        },
        
        // Clase 7: Parte de Servicios (A Desarrollar)
        7: {
            title: "Clase 7: Parte de Servicios",
            type: 'input',
            challenges: [
                { question: "Documento legal que registra cronológicamente todo lo acontecido en un servicio.", answer: "Parte de servicio" },
                { question: "¿Quién es el máximo responsable de confeccionar el Parte de Servicio al finalizar la intervención?", answer: "Jefe de servicio" },
                { question: "Además de fines legales y de seguros, los datos de los partes se usan para generar...", answer: "Estadisticas" },
            ]
        },
        // Clase 9: Comunicaciones (Juego de Diálogo Q-Code)
        9: {
            title: "Clase 9: Comunicaciones",
            type: 'q-code',
            challenges: [
                {
                    dialogue: [
                        { speaker: "Central:", line: "Atento Móvil 15, reporte situación." },
                        { speaker: "Móvil 15:", line: "Central, afirmativo. Nos encontramos en el lugar, iniciando tareas. [___]" }
                    ],
                    options: ["QSL", "QTH", "QAP", "QRV"],
                    answer: "QAP"
                },
                {
                    dialogue: [
                        { speaker: "Móvil 10:", line: "Central, solicito [___] del incendio." },
                        { speaker: "Central:", line: "Recibido Móvil 10, el incendio es en Av. San Martín 1234." }
                    ],
                    options: ["QAP", "QTH", "QRM", "QSL"],
                    answer: "QTH"
                },
                {
                    dialogue: [
                        { speaker: "Central:", line: "Móvil 5, ¿recibió las indicaciones para el corte de suministro?" },
                        { speaker: "Móvil 5:", line: "Central, [___]. Procedemos según lo indicado." }
                    ],
                    options: ["QSY", "QRM", "QSL", "QRZ"],
                    answer: "QSL"
                },
                {
                    dialogue: [
                        { speaker: "Móvil 8:", line: "Central, tengo interferencia, repita último mensaje. [___]." },
                        { speaker: "Central:", line: "Recibido Móvil 8, repito..." }
                    ],
                    options: ["QAP", "QRM", "QTH", "QRV"],
                    answer: "QRM"
                },
                {
                    dialogue: [
                        { speaker: "Jefe de Cuerpo:", line: "Central, para todas las unidades, a partir de este momento tienen [___]." },
                        { speaker: "Central:", line: "Recibido, vía libre para Jefatura." }
                    ],
                    options: ["QSY", "QRQ", "QSL", "QTA"],
                    answer: "QRQ"
                },
            ]
        },
        // Clase 10: Seguridad del Bombero (Multiple Choice)
        10: {
            title: "Clase 10: Seguridad",
            type: 'mc',
            challenges: [
                { question: "¿Qué significa la sigla ERA?", options: ["Equipo Rápido de Ataque", "Equipo de Respiración Autónoma", "Elemento de Rescate y Auxilio", "Equipo de Reserva Acuática"], answer: "Equipo de Respiración Autónoma" },
                { question: "La capucha ignífuga que se usa con el ERA se conoce comúnmente como...", options: ["Pasamontañas", "Monjita", "Verdugo", "Capelina"], answer: "Monjita" },
                { question: "¿Cuál de estas NO es una de las tres capas del traje estructural?", options: ["Barrera de vapor", "Barrera térmica", "Capa exterior", "Capa reflectante"], answer: "Capa reflectante" },
                { question: "El dispositivo sonoro que se activa si un bombero permanece inmóvil es el...", options: ["Handy", "Manómetro", "PASS", "Casco"], answer: "PASS" },
            ]
        },
        // Clase 13: Materiales y Equipos (A Desarrollar)
        13: {
            title: "Clase 13: Materiales",
            type: 'input',
            challenges: [
                { question: "Elemento que se coloca en el extremo de la línea de ataque para dar forma y dirección al chorro de agua.", answer: "Lanza" },
                { question: "Nombre de la unión hermafrodita que se acopla con 1/4 de giro.", answer: "Storz" },
                { question: "Herramienta de zapa con un gancho, usada para demoler cielorrasos.", answer: "Bichero" },
                { question: "Manga semirrígida de bajo diámetro y alta presión para ataques rápidos.", answer: "Devanadera" },
                { question: "Accesorio que permite dividir una línea de mayor diámetro en dos de menor diámetro.", answer: "Gemelo" },
                { question: "El ángulo de inclinación ideal y seguro para emplazar una escalera es de...", answer: "75 grados" },
            ]
        },
        // Clase 14: Riesgo Eléctrico (Multiple Choice)
        14: {
            title: "Clase 14: Riesgo Eléctrico",
            type: 'mc',
            challenges: [
                { question: "¿Qué efecto eléctrico impide soltar un conductor energizado?", options: ["Fibrilación", "Asfixia", "Tetanización", "Arco eléctrico"], answer: "Tetanización" },
                { question: "Para cortar la batería de un auto, ¿qué borna se desconecta primero?", options: ["Positivo", "Negativo", "Cualquiera es igual", "Ambos a la vez"], answer: "Negativo" },
                { question: "La tensión domiciliaria monofásica en Argentina es de...", options: ["110V", "380V", "12V", "220V"], answer: "220V" },
                { question: "Los bomberos tienen terminantemente prohibido realizar trabajos en...", options: ["Baja Tensión", "Instalaciones domiciliarias", "Media y Alta Tensión", "Vehículos híbridos"], answer: "Media y Alta Tensión" },
            ]
        }
    };

    let currentClassId = null;
    let currentChallenges = [];
    let challengeIndex = 0;
    let score = 0;

    // --- FUNCIONES PRINCIPALES ---

    function init() {
        populateSelectionMenu();
        nextChallengeBtn.addEventListener('click', loadNextChallenge);
        restartGameBtn.addEventListener('click', () => startGame(currentClassId));
        backToSelectionBtn.addEventListener('click', showSelectionScreen);
    }

    function populateSelectionMenu() {
        gameGrid.innerHTML = '';
        for (const classId in gameData) {
            const data = gameData[classId];
            const card = document.createElement('div');
            card.className = 'game-card';
            card.dataset.classId = classId;
            card.innerHTML = `
                <h3>${data.title}</h3>
                <p>Modo: ${getGameModeName(data.type)}</p>
            `;
            card.addEventListener('click', () => startGame(classId));
            gameGrid.appendChild(card);
        }
    }

    function startGame(classId) {
        currentClassId = classId;
        currentChallenges = shuffleArray([...gameData[classId].challenges]);
        challengeIndex = 0;
        score = 0;

        gameTitle.textContent = gameData[classId].title;
        updateStats();
        showGameScreen();
        loadNextChallenge();
    }

    function loadNextChallenge() {
        if (challengeIndex >= currentChallenges.length) {
            showGameOverScreen();
            return;
        }

        resetUI();
        const challenge = currentChallenges[challengeIndex];

        if (gameData[currentClassId].type === 'mc') {
            renderMultipleChoice(challenge);
        } else if (gameData[currentClassId].type === 'input') {
            renderInput(challenge);
        } else if (gameData[currentClassId].type === 'q-code') {
            renderQCode(challenge);
        }

        challengeIndex++;
        updateStats();
    }

    // --- FUNCIONES DE RENDERIZADO DE JUEGOS ---

    function renderMultipleChoice(challenge) {
        challengeArea.innerHTML = `<p>${challenge.question}</p>`;
        const options = shuffleArray([...challenge.options]);
        options.forEach(opt => {
            const button = document.createElement('button');
            button.className = 'mc-option';
            button.textContent = opt;
            button.addEventListener('click', (e) => checkAnswer(e.target.textContent, challenge.answer, '.mc-option'));
            answerArea.appendChild(button);
        });
    }

    function renderInput(challenge) {
        challengeArea.innerHTML = `<p>${challenge.question}</p>`;
        answerArea.innerHTML = `<input type="text" id="input-answer" placeholder="Escribe tu respuesta..." autocomplete="off">`;
        const input = document.getElementById('input-answer');
        input.focus();
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                checkAnswer(e.target.value, challenge.answer);
                e.target.disabled = true;
            }
        });
    }

    function renderQCode(challenge) {
        let dialogueHtml = '<ul class="dialogue">';
        challenge.dialogue.forEach(line => {
            dialogueHtml += `<li><span class="speaker">${line.speaker}</span> ${line.line}</li>`;
        });
        dialogueHtml += '</ul>';
        challengeArea.innerHTML = dialogueHtml;

        const options = shuffleArray([...challenge.options]);
        options.forEach(opt => {
            const button = document.createElement('button');
            button.className = 'q-option';
            button.textContent = opt;
            button.addEventListener('click', (e) => checkAnswer(e.target.textContent, challenge.answer, '.q-option'));
            answerArea.appendChild(button);
        });
    }

    // --- LÓGICA DE RESPUESTAS Y UI ---

    function checkAnswer(userAnswer, correctAnswer, selector = null) {
        const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

        if (isCorrect) {
            score += 10;
            feedbackArea.innerHTML = `<p class="feedback-correct">¡Correcto!</p>`;
        } else {
            feedbackArea.innerHTML = `<p class="feedback-incorrect">Incorrecto. La respuesta era: <strong>${correctAnswer}</strong></p>`;
        }

        if (selector) { // Para MC y Q-Code
            const buttons = document.querySelectorAll(selector);
            buttons.forEach(btn => {
                btn.disabled = true;
                if (btn.textContent.toLowerCase() === correctAnswer.toLowerCase()) {
                    btn.classList.add('correct');
                } else if (btn.textContent.toLowerCase() === userAnswer.toLowerCase()) {
                    btn.classList.add('incorrect');
                }
            });
        }
        
        updateStats();
        nextChallengeBtn.style.display = 'block';
        nextChallengeBtn.focus();
    }

    function resetUI() {
        challengeArea.innerHTML = '';
        answerArea.innerHTML = '';
        feedbackArea.innerHTML = '';
        nextChallengeBtn.style.display = 'none';
    }

    function updateStats() {
        scoreEl.textContent = score;
        const totalChallenges = currentChallenges.length > 0 ? currentChallenges.length : 1;
        const currentChallengeNum = challengeIndex > totalChallenges ? totalChallenges : challengeIndex;
        questionCounterEl.textContent = `${currentChallengeNum} / ${totalChallenges}`;
    }

    function showSelectionScreen() {
        gamePlayScreen.style.display = 'none';
        gameOverScreen.style.display = 'none';
        gameSelectionScreen.style.display = 'block';
    }

    function showGameScreen() {
        gameSelectionScreen.style.display = 'none';
        gameOverScreen.style.display = 'none';
        gamePlayScreen.style.display = 'block';
    }

    function showGameOverScreen() {
        finalScoreEl.textContent = score;
        gamePlayScreen.style.display = 'none';
        gameOverScreen.style.display = 'block';
    }

    // --- HELPERS ---
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function getGameModeName(type) {
        if (type === 'mc') return 'Opción Múltiple';
        if (type === 'input') return 'A Desarrollar';
        if (type === 'q-code') return 'Diálogo Radial';
        return 'Práctica';
    }

    // Iniciar la aplicación
    init();
});

