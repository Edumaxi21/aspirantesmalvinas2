document.addEventListener('DOMContentLoaded', () => {

    const displayModules = [
        { id: 1, name: "Clase 1", subtitle: "Marco Histórico", url: "clase_1.html", icon: "fas fa-landmark", color: 1 },
        { id: 2, name: "Clase 2", subtitle: "Organización Bomberil", url: "clase_2.html", icon: "fas fa-sitemap", color: 2 },
        { id: 3, name: "Clase 3", subtitle: "Leyes y Decretos", url: "clase_3.html", icon: "fas fa-gavel", color: 3 },
        { id: 5, name: "Clase 5", subtitle: "Guardia y Servicios", url: "clase_5.html", icon: "fas fa-concierge-bell", color: 4 },
        { id: 6, name: "Clase 6", subtitle: "Aptitud, Ética y Órdenes", url: "clase_6.html", icon: "fas fa-shield-alt", color: 5 },
        { id: 7, name: "Clase 7", subtitle: "Parte de Servicios", url: "clase_7.html", icon: "fas fa-file-alt", color: 6 },
        { id: 9, name: "Clase 9", subtitle: "Comunicaciones", url: "clase_9.html", icon: "fas fa-broadcast-tower", color: 1 },
        { id: 10, name: "Clase 10", subtitle: "Seguridad del Bombero", url: "clase_10.html", icon: "fas fa-hard-hat", color: 2 },
        { id: 11, name: "Clase 11", subtitle: "Psicología de Emergencia", url: "clase_11.html", icon: "fas fa-brain", color: 3 },
        { id: 12, name: "Clase 12", subtitle: "Protocolo y Ceremonial", url: "clase_12.html", icon: "fas fa-flag", color: 4 },
        { id: 13, name: "Clase 13", subtitle: "Materiales y Equipos", url: "clase_13.html", icon: "fas fa-tools", color: 5 },
        { id: 14, name: "Clase 14", subtitle: "Riesgo Eléctrico", url: "clase_14.html", icon: "fas fa-bolt", color: 6 },
        { id: 15, name: "Juegos", subtitle: "Juegos Interactivos", url: "juegos.html", icon: "fas fa-gamepad", color: 1 },
        { id: 15, name: "Clase 15", subtitle: "Fisica y quimica del fuego", url: "clase_15.html", icon: "fas fa-fire", color: 2 },
    ];
    
    const allQuestions = [
        // ... (Todas las preguntas de las clases 1 a 14)
        { classId: 1, question: "¿Cuál es el año fundacional que marca el inicio de la trayectoria de los Cuerpos de Bomberos Voluntarios en Argentina?", answer: { keywords: ["1884"], match: "all" }, displayAnswer: "1884", type: "input" },
        { classId: 1, question: "Identifique al principal promotor y figura clave en la creación del primer Cuerpo de Bomberos Voluntarios de Argentina.", answer: { keywords: ["tomas", "liberti"], match: "all" }, displayAnswer: "Tomás Liberti", type: "input" },
        { classId: 2, question: "Indique el número de Identificación Numérica de Organismos de BV (INOBV) correspondiente a BV Malvinas Argentinas.", answer: { keywords: ["166"], match: "all" }, displayAnswer: "166", type: "input" },
        { classId: 3, question: "¿Qué número identifica a la Ley Nacional que establece el marco de organización y la misión de los bomberos voluntarios en la República Argentina?", answer: { keywords: ["ley", "25054"], match: "all" }, displayAnswer: "Ley 25.054", type: "input" },
        { classId: 5, question: "El código '11' corresponde a qué tipo específico de incendio?", answer: { keywords: ["incendios", "forestales"], match: "all" }, displayAnswer: "Incendios Forestales", type: "input" },
        { classId: 6, question: "El incumplimiento de una orden implica una falta de...", answer: { keywords: ["disciplina"], match: "all" }, displayAnswer: "Disciplina", type: "input" },
        { classId: 7, type: 'multiple-choice', question: "¿Cuál es uno de los fines principales del Parte de Servicio?", options: ["Determinar ascensos", "Fines legales y administrativos", "Calcular vacaciones", "Establecer sanciones internas únicamente"], answer: "Fines legales y administrativos" },
        { classId: 99, type: 'multiple-choice', question: "Alfabeto Fonético Internacional: ¿Cómo se vocaliza la letra 'M'?", options: ["Metro", "Moon", "Mike", "Mamá"], answer: "Mike" },
        { classId: 10, type: 'multiple-choice', question: "¿Cuál es la función principal del EPP (Equipo de Protección Personal)?", options: ["Evitar todos los accidentes", "Reducir y proteger de las consecuencias de accidentes", "Aumentar la velocidad en el siniestro", "Reemplazar la capacitación"], answer: "Reducir y proteger de las consecuencias de accidentes" },
        { classId: 11, question: "El 'Defusing' o descarga emocional debe realizarse idealmente dentro de las primeras ... horas post-incidente.", answer: { keywords: ["24"], match: "all" }, displayAnswer: "24 horas", type: "input" },
        { classId: 12, question: "¿Cuáles son las dos partes de una voz de mando en orden cerrado?", answer: { keywords: ["preventiva", "ejecutiva"], match: "all" }, displayAnswer: "Preventiva y Ejecutiva", type: "input" },
        { classId: 13, type: 'multiple-choice', question: "¿Qué tipo de unión es hermafrodita y se conecta con 1/4 de giro?", options: ["Whitworth", "A rosca", "Storz", "Inglesa"], answer: "Storz" },
        { classId: 13, question: "¿Cuál es el ángulo de inclinación de seguridad recomendado para emplazar una escalera?", answer: { keywords: ["75"], match: "all" }, displayAnswer: "75 grados", type: "input" },
        { classId: 14, question: "¿Cuál es la variable eléctrica más peligrosa para el cuerpo humano?", answer: { keywords: ["corriente", "amperaje"], match: "any" }, displayAnswer: "La Corriente (Amperaje)", type: "input" },
        { classId: 14, type: 'multiple-choice', question: "¿Cuál es la principal causa de muerte por electrocución?", options: ["Quemaduras", "Tetanización", "Asfixia", "Fibrilación Ventricular"], answer: "Fibrilación Ventricular" },
        { classId: 14, question: "Para cortar el suministro eléctrico en un vehículo, ¿qué cable se debe cortar primero?", answer: { keywords: ["negativo"], match: "all" }, displayAnswer: "El negativo (-)", type: "input" },
        { classId: 14, question: "¿Qué contracción muscular involuntaria impide soltar un objeto energizado?", answer: { keywords: ["tetanizacion"], match: "all" }, displayAnswer: "Tetanización", type: "input" },
        { classId: 14, type: 'multiple-choice', question: "Los bomberos tienen terminantemente prohibido trabajar en...", options: ["Baja Tensión", "Instalaciones domiciliarias", "Media y Alta Tensión", "Vehículos eléctricos"], answer: "Media y Alta Tensión" },
        { classId: 14, question: "En Argentina, la tensión que llega a un domicilio (monofásica) es de...", answer: { keywords: ["220v", "220"], match: "any" }, displayAnswer: "220 Volts", type: "input" },
        { classId: 14, question: "¿Qué EPP se utiliza sobre los guantes dieléctricos para protegerlos de daños mecánicos?", answer: { keywords: ["vaqueta", "cuero"], match: "any" }, displayAnswer: "Guantes de vaqueta o cuero", type: "input" },
        { classId: 14, question: "¿Cuál es la distancia mínima de seguridad para trabajar cerca de líneas de hasta 1.000 Voltios?", answer: { keywords: ["0.80", "0,80", "80"], match: "any" }, displayAnswer: "0.80 metros", type: "input" }
    ];

    // --- El resto del código JS (sin cambios) ---
    let currentPlayQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    const MAX_QUESTIONS_PER_GAME = 5;
    let currentSelectedClassId = null;
    
    const mainMenuEl = document.getElementById('main-menu');
    const evaluationContainerEl = document.getElementById('evaluation-container');
    const classGridEl = document.querySelector('.class-grid');
    const gameAreaEl = document.getElementById('game-area');
    const scoreAreaEl = document.getElementById('score-area');
    const questionNumberEl = document.getElementById('question-number');
    const questionTextEl = document.getElementById('question-text');
    const answerInputEl = document.getElementById('answer-input');
    const multipleChoiceOptionsEl = document.getElementById('multiple-choice-options');
    const submitButtonEl = document.getElementById('submit-button');
    const feedbackAreaEl = document.getElementById('feedback-area');
    const feedbackTextEl = document.getElementById('feedback-text');
    const correctAnswerTextEl = document.getElementById('correct-answer-text');
    const nextButtonEl = document.getElementById('next-button');
    const resultsAreaEl = document.getElementById('results-area');
    const finalScoreEl = document.getElementById('final-score');
    const scoreDisplayEl = document.getElementById('score');

    function initializePage() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                "particles": {
                    "number": { "value": 60, "density": { "enable": true, "value_area": 800 } },
                    "color": { "value": ["#ffffff", "#ff4d4d", "#ff6666"] },
                    "shape": { "type": "circle" },
                    "opacity": { "value": 0.5, "random": true, "anim": { "enable": true, "speed": 0.8, "opacity_min": 0.1, "sync": false } },
                    "size": { "value": 2, "random": true },
                    "line_linked": { "enable": false },
                    "move": { "enable": true, "speed": 1, "direction": "none", "random": true, "straight": false, "out_mode": "out" }
                },
                "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": false }, "onclick": { "enable": false }, "resize": true } },
                "retina_detect": true
            });
        }

        const urlParams = new URLSearchParams(window.location.search);
        const classIdToEvaluate = urlParams.get('evaluar');

        if (classIdToEvaluate) {
            mainMenuEl.style.display = 'none';
            evaluationContainerEl.style.display = 'block';
            currentSelectedClassId = parseInt(classIdToEvaluate, 10);
            prepareAndStartGame();
        } else {
            evaluationContainerEl.style.display = 'none';
            mainMenuEl.style.display = 'block';
            populateClassMenu();
        }
    }
    
    function populateClassMenu() {
        if (!classGridEl) return;
        classGridEl.innerHTML = '';
        displayModules.forEach(module => {
            const card = document.createElement('a');
            card.href = module.url;
            card.className = 'class-card';
            card.innerHTML = `
                <div class="card-header">
                    <span class="card-tag">MÓDULO</span>
                    <div class="card-icon color-${module.color}">
                        <i class="${module.icon}"></i>
                    </div>
                </div>
                <div class="card-content">
                    <h3>${module.name}</h3>
                    <p>${module.subtitle}</p>
                </div>
            `;
            classGridEl.appendChild(card);
        });
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function prepareAndStartGame() {
        if (currentSelectedClassId === null) {
            alert("Error: No se ha seleccionado ninguna clase para evaluar.");
            window.location.href = "index.html";
            return;
        }

        let questionsForSelectedClass;
        if (currentSelectedClassId === 9) { // Unificar clase 9 y 99
            questionsForSelectedClass = allQuestions.filter(q => q.classId === 9 || q.classId === 99);
        } else {
            questionsForSelectedClass = allQuestions.filter(q => q.classId === currentSelectedClassId);
        }

        shuffleArray(questionsForSelectedClass);
        currentPlayQuestions = questionsForSelectedClass.slice(0, MAX_QUESTIONS_PER_GAME);
        
        if (currentPlayQuestions.length === 0) {
            alert("No hay preguntas disponibles para este módulo.");
            window.location.href = "index.html";
            return;
        }

        currentQuestionIndex = 0;
        score = 0;
        scoreDisplayEl.textContent = score;
        
        gameAreaEl.style.display = 'block';
        scoreAreaEl.style.display = 'block';
        resultsAreaEl.style.display = 'none';
        loadQuestion();
    }
    
    function loadQuestion() {
        if (currentQuestionIndex >= currentPlayQuestions.length) {
            showResults();
            return;
        }

        const currentQuestion = currentPlayQuestions[currentQuestionIndex];
        questionNumberEl.textContent = `Pregunta ${currentQuestionIndex + 1} de ${currentPlayQuestions.length}`;
        questionTextEl.textContent = currentQuestion.question;
        feedbackAreaEl.className = '';
        feedbackTextEl.textContent = '';
        correctAnswerTextEl.textContent = '';
        nextButtonEl.style.display = 'none';
        multipleChoiceOptionsEl.innerHTML = '';
        
        if (currentQuestion.type === 'multiple-choice') {
            answerInputEl.style.display = 'none';
            submitButtonEl.style.display = 'none';
            multipleChoiceOptionsEl.style.display = 'flex';
            currentQuestion.options.forEach(optionText => {
                const optionButton = document.createElement('button');
                optionButton.className = 'option-button';
                optionButton.textContent = optionText;
                optionButton.onclick = () => handleMultipleChoiceAnswer(optionButton, optionText, currentQuestion.answer);
                multipleChoiceOptionsEl.appendChild(optionButton);
            });
        } else { // Input
            answerInputEl.style.display = 'block';
            submitButtonEl.style.display = 'inline-block';
            multipleChoiceOptionsEl.style.display = 'none';
            answerInputEl.value = '';
            answerInputEl.disabled = false;
            answerInputEl.focus();
        }
    }
    
    function handleSubmit() {
        const userAnswer = answerInputEl.value;
        const currentQuestion = currentPlayQuestions[currentQuestionIndex];
        let isCorrect = false;
        
        if (typeof currentQuestion.answer === 'object' && currentQuestion.answer.keywords) {
            const userKeywords = userAnswer.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(/\s+/).filter(Boolean);
            const requiredKeywords = currentQuestion.answer.keywords.map(k => k.toLowerCase());
            
            if (currentQuestion.answer.match === 'any') {
                isCorrect = requiredKeywords.some(k => userKeywords.includes(k));
            } else { // 'all'
                isCorrect = requiredKeywords.every(k => userKeywords.includes(k));
            }
        } else {
             isCorrect = userAnswer.trim().toLowerCase() === currentQuestion.answer.toLowerCase();
        }

        answerInputEl.disabled = true;
        submitButtonEl.style.display = 'none';
        nextButtonEl.style.display = 'inline-block';
        showFeedback(isCorrect, currentQuestion.displayAnswer);
    }
    
    function handleMultipleChoiceAnswer(selectedButton, selectedOption, correctAnswer) {
        document.querySelectorAll('.option-button').forEach(btn => btn.disabled = true);
        const isCorrect = selectedOption === correctAnswer;
        if (isCorrect) {
            selectedButton.classList.add('correct-option');
        } else {
            selectedButton.classList.add('incorrect-option-selected');
            document.querySelectorAll('.option-button').forEach(btn => {
                if (btn.textContent === correctAnswer) {
                    btn.classList.add('correct-option');
                }
            });
        }
        nextButtonEl.style.display = 'inline-block';
        showFeedback(isCorrect, correctAnswer);
    }
    
    function showFeedback(isCorrect, correctAnswer) {
        if (isCorrect) {
            score++;
            scoreDisplayEl.textContent = score;
            feedbackAreaEl.className = 'correct';
            feedbackTextEl.textContent = '¡Correcto!';
        } else {
            feedbackAreaEl.className = 'incorrect';
            feedbackTextEl.textContent = 'Incorrecto.';
            correctAnswerTextEl.textContent = `Respuesta correcta: ${correctAnswer}`;
        }
    }

    function showResults() {
        gameAreaEl.style.display = 'none';
        scoreAreaEl.style.display = 'none';
        resultsAreaEl.style.display = 'block';
        finalScoreEl.textContent = score;
        document.getElementById('total-questions-played').textContent = currentPlayQuestions.length;
    }

    submitButtonEl.addEventListener('click', handleSubmit);
    answerInputEl.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSubmit(); });
    nextButtonEl.addEventListener('click', () => { currentQuestionIndex++; loadQuestion(); });

    initializePage();
});
