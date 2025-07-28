import React, { useState, useEffect, useRef } from 'react';

// Carga pdfjs-dist desde CDN para leer PDFs en el navegador
// Se usa un script dinámico para asegurar que esté disponible globalmente
const loadPdfJs = () => {
  return new Promise((resolve, reject) => {
    if (window.pdfjsLib) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.onload = () => {
      // Configura el worker de PDF.js
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Componente para el mensaje personalizado (reemplaza alert/confirm)
const MessageBox = ({ message, type, onClose, onConfirm, showConfirm }) => {
  if (!message) return null;

  const bgColor = type === 'error' ? 'bg-red-800 border-red-600 text-red-100' : 'bg-blue-800 border-blue-600 text-blue-100';
  const borderColor = type === 'error' ? 'border-red-700' : 'border-blue-700';

  return (
    <div className={`fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50`}>
      <div className={`relative ${bgColor} border ${borderColor} px-4 py-3 rounded-lg shadow-lg max-w-sm w-full font-inter`}>
        <strong className="font-bold">Mensaje: </strong>
        <span className="block sm:inline">{message}</span>
        {showConfirm && (
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
            >
              Sí
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-gray-100 rounded-lg hover:bg-gray-700 transition duration-200"
            >
              No
            </button>
          </div>
        )}
        {!showConfirm && (
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <button onClick={onClose} className="text-current hover:text-opacity-75 focus:outline-none">
              <svg className="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Cerrar</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
              </svg>
            </button>
          </span>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  // generatedQA ahora es un array de objetos, cada uno representa un PDF con sus preguntas
  const [generatedQA, setGeneratedQA] = useState([]); // { pdfName: string, questions: [{ question: string, answer: string, showAnswer: boolean }] }
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [showConfirmMessage, setShowConfirmMessage] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadPdfJs().catch(error => {
      showMessage('Error al cargar PDF.js: ' + error.message, 'error');
    });
  }, []);

  const showMessage = (msg, type = 'info', confirm = false, action = null) => {
    setMessage(msg);
    setMessageType(type);
    setShowConfirmMessage(confirm);
    setConfirmAction(() => action); // Usar un callback para almacenar la función
  };

  const closeMessage = () => {
    setMessage('');
    setShowConfirmMessage(false);
    setConfirmAction(null);
  };

  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
    closeMessage();
  };

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
    setGeneratedQA([]); // Limpiar preguntas generadas al cambiar archivos
  };

  const extractTextFromPdf = async (file) => {
    if (!window.pdfjsLib) {
      throw new Error("PDF.js no está cargado.");
    }

    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            fullText += textContent.items.map(item => item.str).join(' ') + '\n';
          }
          resolve(fullText);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const generateQuestions = async () => {
    if (selectedFiles.length === 0) {
      showMessage('Por favor, selecciona al menos un archivo PDF.', 'info');
      return;
    }

    setIsLoading(true);
    setGeneratedQA([]);
    showMessage('Extrayendo texto de los PDFs y generando preguntas...', 'info');

    try {
      const allGeneratedQAByPdf = [];

      for (const file of selectedFiles) {
        const text = await extractTextFromPdf(file);
        const pdfName = file.name;

        // Limitar el texto para evitar sobrepasar el límite de tokens del modelo
        const textForPrompt = text.substring(0, 8000); // Ajusta este valor si es necesario

        const prompt = `Basado en el siguiente texto del documento "${pdfName}", genera varias preguntas (alrededor de 5 a 7) con sus respuestas. Formatea la salida como un objeto JSON con las propiedades "question" y "answer" para cada pregunta. Asegúrate de que las preguntas y respuestas sean directamente extraídas o inferidas del texto proporcionado.

        Ejemplo de formato JSON esperado:
        [
          {
            "question": "¿Cuál es la capital de Francia?",
            "answer": "París"
          },
          {
            "question": "¿Quién escribió 'Don Quijote'?",
            "answer": "Miguel de Cervantes"
          }
        ]

        Texto del documento "${pdfName}":
        ${textForPrompt}
        `;

        const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = {
          contents: chatHistory,
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  "question": { "type": "STRING" },
                  "answer": { "type": "STRING" }
                },
                "propertyOrdering": ["question", "answer"]
              }
            }
          }
        };

        const apiKey = ""; // Canvas proporcionará la clave API en tiempo de ejecución
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Error en la API de Gemini para ${pdfName}: ${response.status} - ${errorData.error?.message || 'Error desconocido'}`);
        }

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
          const jsonString = result.candidates[0].content.parts[0].text;
          try {
            const parsedQuestions = JSON.parse(jsonString);
            allGeneratedQAByPdf.push({
              pdfName: pdfName,
              questions: parsedQuestions.map(q => ({ ...q, showAnswer: false }))
            });
          } catch (parseError) {
            console.error(`Error al parsear JSON de la API para ${pdfName}:`, parseError);
            showMessage(`Error al procesar la respuesta de la IA para ${pdfName}. Intenta de nuevo.`, 'error');
            allGeneratedQAByPdf.push({
              pdfName: pdfName,
              questions: [{ question: "No se pudieron generar preguntas. Formato inválido.", answer: "", showAnswer: false }]
            });
          }
        } else {
          showMessage(`No se recibieron preguntas de la IA para ${pdfName}.`, 'error');
          allGeneratedQAByPdf.push({
            pdfName: pdfName,
            questions: [{ question: "No se recibieron preguntas de la IA.", answer: "", showAnswer: false }]
          });
        }
      }

      setGeneratedQA(allGeneratedQAByPdf);
      showMessage('Preguntas generadas con éxito!', 'info');

    } catch (error) {
      console.error("Error al generar preguntas:", error);
      showMessage(`Error al generar preguntas: ${error.message}. Asegúrate de que los PDFs sean legibles y el texto no sea demasiado largo.`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAnswer = (pdfIndex, qIndex) => {
    setGeneratedQA(prevQA => {
      const newQA = [...prevQA];
      newQA[pdfIndex].questions[qIndex].showAnswer = !newQA[pdfIndex].questions[qIndex].showAnswer;
      return newQA;
    });
  };

  const handleDownloadQuestions = () => {
    if (generatedQA.length === 0) {
      showMessage('No hay preguntas generadas para descargar.', 'info');
      return;
    }

    let content = "Preguntas y Respuestas Generadas de tus PDFs:\n\n";

    generatedQA.forEach(pdfQa => {
      content += `--- Documento: ${pdfQa.pdfName} ---\n\n`;
      pdfQa.questions.forEach((qa, qIndex) => {
        content += `Pregunta ${qIndex + 1}: ${qa.question}\n`;
        content += `Respuesta ${qIndex + 1}: ${qa.answer}\n\n`;
      });
      content += "\n";
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'preguntas_y_respuestas_pdf.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Liberar el objeto URL
    showMessage('Archivo descargado con éxito!', 'info');
  };

  const handleClearAll = () => {
    showMessage(
      '¿Estás seguro de que quieres borrar todos los PDFs seleccionados y las preguntas generadas?',
      'info',
      true, // showConfirm = true
      () => { // action to perform on confirm
        setSelectedFiles([]);
        setGeneratedQA([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Reset file input
        }
        showMessage('Todo borrado.', 'info');
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 text-gray-100 p-4 sm:p-6 lg:p-8 font-inter flex flex-col items-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-8 text-center leading-tight">
        Aspirantes Bomberos Voluntarios Malvinas Argentinas
      </h1>

      <div className="bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-3xl mb-8 border border-gray-700">
        <label htmlFor="file-upload" className="block text-lg font-semibold text-gray-200 mb-4">
          1. Sube tus archivos PDF
        </label>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <input
            id="file-upload"
            type="file"
            multiple
            accept=".pdf"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="w-full sm:w-auto px-6 py-3 bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:bg-blue-800 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500"
          >
            Seleccionar PDFs
          </button>
          <span className="text-gray-300 text-sm sm:text-base">
            {selectedFiles.length > 0
              ? `${selectedFiles.length} archivo(s) seleccionado(s)`
              : 'Ningún archivo seleccionado'}
          </span>
        </div>
        {selectedFiles.length > 0 && (
          <div className="mt-4 text-sm text-gray-300">
            <h3 className="font-semibold mb-2">Archivos a procesar:</h3>
            <ul className="list-disc list-inside">
              {selectedFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full">
          <button
            onClick={generateQuestions}
            disabled={selectedFiles.length === 0 || isLoading}
            className={`flex-1 px-8 py-4 bg-gradient-to-r from-green-600 to-teal-700 text-white font-extrabold text-xl rounded-2xl shadow-xl hover:from-green-700 hover:to-teal-800 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500
              ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generando...
              </div>
            ) : (
              'Generar Preguntas'
            )}
          </button>
          <button
            onClick={handleClearAll}
            className="flex-1 px-8 py-4 bg-red-600 text-white font-bold text-xl rounded-2xl shadow-xl hover:bg-red-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500"
          >
            Borrar Todo
          </button>
        </div>
      </div>

      {generatedQA.length > 0 && (
        <div className="bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-3xl mb-8 border border-purple-700">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Preguntas Generadas
          </h2>
          <button
            onClick={handleDownloadQuestions}
            className="w-full px-6 py-3 mb-6 bg-indigo-700 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-800 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500"
          >
            Descargar Preguntas y Respuestas
          </button>

          {generatedQA.map((pdfQa, pdfIndex) => (
            <div key={pdfIndex} className="mb-8 p-4 bg-gray-700 rounded-xl shadow-md border border-gray-600">
              <h3 className="text-xl font-semibold text-purple-400 mb-4 border-b pb-2 border-purple-600">
                Documento: {pdfQa.pdfName}
              </h3>
              {pdfQa.questions.length > 0 ? (
                pdfQa.questions.map((qa, qIndex) => (
                  <div key={qIndex} className="mb-6 p-4 bg-gray-600 rounded-lg shadow-sm border border-gray-500">
                    <p className="text-gray-100 font-medium text-lg mb-2">
                      <span className="text-purple-300 mr-2">Q{qIndex + 1}:</span> {qa.question}
                    </p>
                    <button
                      onClick={() => toggleAnswer(pdfIndex, qIndex)}
                      className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-purple-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {qa.showAnswer ? 'Ocultar Respuesta' : 'Mostrar Respuesta'}
                    </button>
                    {qa.showAnswer && (
                      <p className="mt-3 text-gray-200 border-t border-gray-500 pt-3">
                        <span className="font-semibold text-purple-300 mr-2">A{qIndex + 1}:</span> {qa.answer}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-400 italic">No se pudieron generar preguntas para este documento.</p>
              )}
            </div>
          ))}
        </div>
      )}

      <MessageBox
        message={message}
        type={messageType}
        onClose={closeMessage}
        onConfirm={handleConfirm}
        showConfirm={showConfirmMessage}
      />

      <footer className="mt-12 text-center text-gray-400 text-sm">
        <p>
          Creadores: Gemini y @maxiperez19
        </p>
        <p>
          Contacto: <a href="mailto:edumaxi21@gmail.com" className="text-blue-400 hover:underline">edumaxi21@gmail.com</a>
        </p>
        <p>
          Redes de Gemini: <a href="https://gemini.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">gemini.google.com</a>
        </p>
      </footer>
    </div>
  );
};

export default App;