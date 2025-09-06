// import React, { useState } from 'react';
// import axios from 'axios';

// function App() {
//   const [url, setUrl] = useState('');
//   const [file, setFile] = useState(null);
//   const [question, setQuestion] = useState('');
//   const [answer, setAnswer] = useState('');

//   const handleDrop = (e) => {
//     e.preventDefault();
//     if (e.dataTransfer.files.length) {
//       setFile(e.dataTransfer.files[0]);
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) return;
//     const formData = new FormData();
//     formData.append("file", file);
//     const uploadRes = await axios.post("/api/v1/upload", formData);
//     alert("Uploaded to: " + uploadRes.data.path);
//   };

//   const handleSubmit = async () => {
//     const response = await axios.post('/api/v1/hackrx/run', {
//       documents: url,
//       questions: [question]
//     }, {
//       headers: {
//         'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`,
//         'Content-Type': 'application/json'
//       }
//     });
//     setAnswer(response.data.answers[0]);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
//       <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-xl">
//         <h2 className="text-2xl font-bold mb-4 text-center">LLM Query Retrieval</h2>
//         <input className="border p-2 mb-4 w-full" type="text" placeholder="Document URL" value={url} onChange={e => setUrl(e.target.value)} />

//         <div
//           className="border-dashed border-2 border-gray-400 p-4 text-center mb-4"
//           onDrop={handleDrop}
//           onDragOver={e => e.preventDefault()}
//         >
//           {file ? file.name : "Drag and drop a file here"}
//         </div>

//         <input className="border p-2 mb-4 w-full" type="file" onChange={e => setFile(e.target.files[0])} />
//         <button className="bg-yellow-500 text-white px-4 py-2 rounded mb-4 w-full hover:bg-yellow-600" onClick={handleUpload}>Upload</button>

//         <input className="border p-2 mb-4 w-full" type="text" placeholder="Your question" value={question} onChange={e => setQuestion(e.target.value)} />
//         <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={handleSubmit}>Ask</button>
//         {answer && (
//           <div className="mt-6 bg-green-100 p-4 rounded">
//             <strong>Answer:</strong>
//             <p>{answer}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;



// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import * as pdfjsLib from 'pdfjs-dist';
// import 'pdfjs-dist/build/pdf.worker.entry';

// function App() {
//   const [file, setFile] = useState(null);
//   const [question, setQuestion] = useState('');
//   const [answer, setAnswer] = useState('');
//   const canvasRef = useRef();

//   const handleDrop = (e) => {
//     e.preventDefault();
//     if (e.dataTransfer.files.length) {
//       setFile(e.dataTransfer.files[0]);
//     }
//   };

//   const renderPDF = async (pdfFile) => {
//     const reader = new FileReader();
//     reader.onload = async function () {
//       const typedarray = new Uint8Array(this.result);
//       const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
//       const page = await pdf.getPage(1);
//       const viewport = page.getViewport({ scale: 1.5 });
//       const canvas = canvasRef.current;
//       const context = canvas.getContext('2d');
//       canvas.height = viewport.height;
//       canvas.width = viewport.width;
//       await page.render({ canvasContext: context, viewport }).promise;
//     };
//     reader.readAsArrayBuffer(pdfFile);
//   };

//   useEffect(() => {
//     if (file && file.type === 'application/pdf') {
//       renderPDF(file);
//     }
//   }, [file]);

//   const handleUploadAndAsk = async () => {
//     if (!file || !question) return;
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("question", question);
//     const uploadRes = await axios.post("/api/v1/upload", formData);
//     setAnswer(uploadRes.data.answer);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
//       <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-xl">
//         <h2 className="text-2xl font-bold mb-4 text-center">LLM Query Retrieval</h2>
//         <div className="border-dashed border-2 border-gray-400 p-4 text-center mb-4"
//              onDrop={handleDrop} onDragOver={e => e.preventDefault()}>
//           {file ? file.name : "Drag and drop a file here"}
//         </div>

//         <input className="border p-2 mb-4 w-full" type="file" onChange={e => setFile(e.target.files[0])} />
//         {file?.type === 'application/pdf' && <canvas ref={canvasRef} className="mb-4 w-full" />}

//         <input className="border p-2 mb-4 w-full" type="text" placeholder="Your question" value={question} onChange={e => setQuestion(e.target.value)} />
//         <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={handleUploadAndAsk}>Ask from Upload</button>

//         {answer && (
//           <div className="mt-6 bg-green-100 p-4 rounded">
//             <strong>Answer:</strong>
//             <p>{answer}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;


// #frontend/src/App.jsx (preview multi-page PDF + multi-question input + loading state)

// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import { pdfjs } from 'react-pdf';   // add this
// import * as pdfjsLib from 'pdfjs-dist';
// import workerSrc from 'pdfjs-dist/build/pdf.worker.entry?url';
// // import 'pdfjs-dist/build/pdf.worker.entry';
// // import { GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
// pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc; // ✅ this fixes the error
// // Use official PDF.js CDN to load the worker
// GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// function App() {
//   const [file, setFile] = useState(null);
//   const [questions, setQuestions] = useState(['']);
//   const [answers, setAnswers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const canvasContainerRef = useRef();

//   const handleDrop = (e) => {
//     e.preventDefault();
//     if (e.dataTransfer.files.length) {
//       setFile(e.dataTransfer.files[0]);
//     }
//   };

//   const renderPDF = async (pdfFile) => {
//     const reader = new FileReader();
//     reader.onload = async function () {
//       const typedarray = new Uint8Array(this.result);
//       const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
//       canvasContainerRef.current.innerHTML = ''; // Clear previous
//       for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
//         const page = await pdf.getPage(pageNum);
//         const viewport = page.getViewport({ scale: 1.0 });
//         const canvas = document.createElement('canvas');
//         canvas.className = 'mb-4';
//         canvas.width = viewport.width;
//         canvas.height = viewport.height;
//         const context = canvas.getContext('2d');
//         await page.render({ canvasContext: context, viewport }).promise;
//         canvasContainerRef.current.appendChild(canvas);
//       }
//     };
//     reader.readAsArrayBuffer(pdfFile);
//   };

//   useEffect(() => {
//     if (file && file.type === 'application/pdf') {
//       renderPDF(file);
//     }
//   }, [file]);

//   const handleUploadAndAsk = async () => {
//     if (!file || questions.some(q => !q)) return;
//     setLoading(true);
//     setAnswers([]);
//     setError('');

//     try {
//       const formData = new FormData();
//       formData.append("file", file);
//       questions.forEach(q => formData.append("questions", q));

//       const uploadRes = await axios.post("/api/v1/upload", formData);
//       setAnswers(uploadRes.data.answers);
//     } catch (err) {
//       setError("Failed to get answer. Check the server.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateQuestion = (i, val) => {
//     const newQs = [...questions];
//     newQs[i] = val;
//     setQuestions(newQs);
//   };

//   const addQuestion = () => setQuestions([...questions, '']);
//   const removeQuestion = (i) => setQuestions(questions.filter((_, idx) => idx !== i));

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
//       <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-2xl">
//         <h2 className="text-2xl font-bold mb-4 text-center">LLM Query Retrieval</h2>
//         <div className="border-dashed border-2 border-gray-400 p-4 text-center mb-4"
//              onDrop={handleDrop} onDragOver={e => e.preventDefault()}>
//           {file ? file.name : "Drag and drop a file here"}
//         </div>

//         <input className="border p-2 mb-4 w-full" type="file" onChange={e => setFile(e.target.files[0])} />
//         {file?.type === 'application/pdf' && <div ref={canvasContainerRef} className="mb-4" />}

//         {questions.map((q, i) => (
//           <div key={i} className="flex mb-2">
//             <input className="border p-2 w-full" type="text" value={q} onChange={e => updateQuestion(i, e.target.value)} placeholder={`Question ${i + 1}`} />
//             {questions.length > 1 && <button className="ml-2 text-red-500" onClick={() => removeQuestion(i)}>✕</button>}
//           </div>
//         ))}

//         <button className="text-sm text-blue-500 mb-4" onClick={addQuestion}>+ Add another question</button>
//         <button className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600" onClick={handleUploadAndAsk} disabled={loading}>
//           {loading ? "Processing..." : "Ask from Upload"}
//         </button>

//         {error && <div className="mt-4 text-red-600">{error}</div>}
//         {answers.length > 0 && (
//           <div className="mt-6 bg-green-100 p-4 rounded">
//             <strong>Answers:</strong>
//             <ul className="list-disc ml-6">
//               {answers.map((a, idx) => <li key={idx}>{a}</li>)}
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;

// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import * as pdfjsLib from 'pdfjs-dist';
// import { pdfjs } from 'react-pdf';
// import workerSrc from 'pdfjs-dist/build/pdf.worker.entry?url';

// pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

// function App() {
//   const [file, setFile] = useState(null);
//   const [pdfUrl, setPdfUrl] = useState('');
//   const [useUrl, setUseUrl] = useState(false);
//   const [questions, setQuestions] = useState(['']);
//   const [answers, setAnswers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const canvasContainerRef = useRef();

//   const handleDrop = (e) => {
//     e.preventDefault();
//     if (e.dataTransfer.files.length) {
//       setFile(e.dataTransfer.files[0]);
//     }
//   };

//   const renderPDF = async (data) => {
//     const pdf = await pdfjsLib.getDocument(data).promise;
//     canvasContainerRef.current.innerHTML = '';
//     for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
//       const page = await pdf.getPage(pageNum);
//       const viewport = page.getViewport({ scale: 1.0 });
//       const canvas = document.createElement('canvas');
//       canvas.className = 'mb-4';
//       canvas.width = viewport.width;
//       canvas.height = viewport.height;
//       const context = canvas.getContext('2d');
//       await page.render({ canvasContext: context, viewport }).promise;
//       canvasContainerRef.current.appendChild(canvas);
//     }
//   };

//   useEffect(() => {
//     if (useUrl && pdfUrl) {
//       renderPDF({ url: pdfUrl });
//     } else if (file && file.type === 'application/pdf') {
//       const reader = new FileReader();
//       reader.onload = () => {
//         const typedarray = new Uint8Array(reader.result);
//         renderPDF({ data: typedarray });
//       };
//       reader.readAsArrayBuffer(file);
//     }
//   }, [file, pdfUrl, useUrl]);

//   const handleUploadAndAsk = async () => {
//     if ((useUrl && !pdfUrl) || (!useUrl && !file) || questions.some(q => !q)) return;

//     setLoading(true);
//     setAnswers([]);
//     setError('');

//     try {
//       const formData = new FormData();
//       if (useUrl) {
//         formData.append("url", pdfUrl);
//       } else {
//         formData.append("file", file);
//       }
//       questions.forEach(q => formData.append("questions", q));

//       const uploadRes = await axios.post("/api/v1/upload", formData);
//       setAnswers(uploadRes.data.answers);
//     } catch (err) {
//       setError("Failed to get answer. Check the server.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateQuestion = (i, val) => {
//     const newQs = [...questions];
//     newQs[i] = val;
//     setQuestions(newQs);
//   };

//   const addQuestion = () => setQuestions([...questions, '']);
//   const removeQuestion = (i) => setQuestions(questions.filter((_, idx) => idx !== i));

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
//       <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-2xl">
//         <h2 className="text-2xl font-bold mb-4 text-center">LLM Query Retrieval</h2>

//         <label className="mb-2 block">
//           <input type="checkbox" checked={useUrl} onChange={() => setUseUrl(!useUrl)} />
//           &nbsp;Use PDF URL instead of file
//         </label>

//         {useUrl ? (
//           <input
//             type="text"
//             className="border p-2 mb-4 w-full"
//             placeholder="Paste PDF link here"
//             value={pdfUrl}
//             onChange={e => setPdfUrl(e.target.value)}
//           />
//         ) : (
//           <>
//             <div className="border-dashed border-2 border-gray-400 p-4 text-center mb-4"
//               onDrop={handleDrop} onDragOver={e => e.preventDefault()}>
//               {file ? file.name : "Drag and drop a file here"}
//             </div>
//             <input className="border p-2 mb-4 w-full" type="file" onChange={e => setFile(e.target.files[0])} />
//           </>
//         )}

//         <div ref={canvasContainerRef} className="mb-4" />

//         {questions.map((q, i) => (
//           <div key={i} className="flex mb-2">
//             <input className="border p-2 w-full" type="text" value={q} onChange={e => updateQuestion(i, e.target.value)} placeholder={`Question ${i + 1}`} />
//             {questions.length > 1 && <button className="ml-2 text-red-500" onClick={() => removeQuestion(i)}>✕</button>}
//           </div>
//         ))}

//         <button className="text-sm text-blue-500 mb-4" onClick={addQuestion}>+ Add another question</button>
//         <button className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600" onClick={handleUploadAndAsk} disabled={loading}>
//           {loading ? "Processing..." : "Ask from Upload"}
//         </button>

//         {error && <div className="mt-4 text-red-600">{error}</div>}
//         {answers.length > 0 && (
//           <div className="mt-6 bg-green-100 p-4 rounded">
//             <strong>Answers:</strong>
//             <ul className="list-disc ml-6">
//               {answers.map((a, idx) => <li key={idx}>{a}</li>)}
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.entry.js",
  import.meta.url
).toString();



function App() {
  const [file, setFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [useUrl, setUseUrl] = useState(false);
  const [questions, setQuestions] = useState(['']);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const canvasContainerRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const renderPDF = async (pdfFile) => {
    const reader = new FileReader();
    reader.onload = async function () {
      const typedarray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
      canvasContainerRef.current.innerHTML = '';
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.0 });
        const canvas = document.createElement('canvas');
        canvas.className = 'mb-4';
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext('2d');
        await page.render({ canvasContext: context, viewport }).promise;
        canvasContainerRef.current.appendChild(canvas);
      }
    };
    reader.readAsArrayBuffer(pdfFile);
  };

  useEffect(() => {
    if (!useUrl && file?.type === 'application/pdf') {
      renderPDF(file);
    }
  }, [file, useUrl]);

  const handleUploadAndAsk = async () => {
    if ((useUrl && !pdfUrl) || (!useUrl && !file) || questions.some(q => !q)) return;
    setLoading(true);
    setAnswers([]);
    setError('');

    try {
      const formData = new FormData();
      if (useUrl) {
        formData.append("url", pdfUrl);
      } else {
        formData.append("file", file);
      }
      questions.forEach(q => formData.append("questions", q));
      const uploadRes = await axios.post("/api/v1/upload", formData);
      setAnswers(uploadRes.data.answers);
    } catch (err) {
      setError("Failed to get answer. Check the server.");
    } finally {
      setLoading(false);
    }
  };

  const updateQuestion = (i, val) => {
    const newQs = [...questions];
    newQs[i] = val;
    setQuestions(newQs);
  };

  const addQuestion = () => setQuestions([...questions, '']);
  const removeQuestion = (i) => setQuestions(questions.filter((_, idx) => idx !== i));

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4 text-center">LLM Query Retrieval</h2>

        <label className="mb-2 block">
          <input type="checkbox" checked={useUrl} onChange={() => setUseUrl(!useUrl)} />
          &nbsp;Use PDF URL instead of file
        </label>

        {useUrl ? (
          <input
            type="text"
            className="border p-2 mb-4 w-full"
            placeholder="Paste PDF link here"
            value={pdfUrl}
            onChange={e => setPdfUrl(e.target.value)}
          />
        ) : (
          <>
            <div
              className="border-dashed border-2 border-gray-400 p-4 text-center mb-4"
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
            >
              {file ? file.name : "Drag and drop a file here"}
            </div>
            <input className="border p-2 mb-4 w-full" type="file" onChange={e => setFile(e.target.files[0])} />
            {file?.type === 'application/pdf' && <div ref={canvasContainerRef} className="mb-4" />}
          </>
        )}

        {questions.map((q, i) => (
          <div key={i} className="flex mb-2">
            <input className="border p-2 w-full" type="text" value={q} onChange={e => updateQuestion(i, e.target.value)} placeholder={`Question ${i + 1}`} />
            {questions.length > 1 && <button className="ml-2 text-red-500" onClick={() => removeQuestion(i)}>✕</button>}
          </div>
        ))}

        <button className="text-sm text-blue-500 mb-4" onClick={addQuestion}>+ Add another question</button>

        {loading ? (
          <div className="flex justify-center items-center mt-4">
            <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="ml-2 text-blue-500">Processing...</span>
          </div>
        ) : (
          <button className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600" onClick={handleUploadAndAsk}>Ask from Upload</button>
        )}

        {error && <div className="mt-4 text-red-600">{error}</div>}
        {answers.length > 0 && (
          <div className="mt-6 bg-green-100 p-4 rounded">
            <strong>Answers:</strong>
            <ul className="list-disc ml-6">
              {answers.map((a, idx) => <li key={idx}>{a}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
