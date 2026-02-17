"use client";
import { useState, useRef } from "react";


export default function VoiceButton({ onResult, darkMode }) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);




  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-us";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }       
      }

      if (finalTranscript) {
        onResult(finalTranscript);
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  return (
    <button
      onClick={listening ? stopListening : startListening}
      className={`px-3 py-2 rounded-lg font-bold transition cursor-pointer
        ${
          darkMode
            ? "bg-gray-700 text-white hover:bg-gray-600"
            : "bg-gray-200 text-black hover:bg-gray-300"
        }
      `}
      title={listening ? "Stop recording" : "Speak"}
    >
      {listening ? "⏹" : "🎤"} 
    </button>
  );
}